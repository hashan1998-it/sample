import { useMemo, useState } from 'react'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import useCategoryList from '../hooks/useCategoryList'
import cloneDeep from 'lodash/cloneDeep'
import { useNavigate } from 'react-router-dom'
import { TbPencil, TbTrash } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { Category } from '../types'
import type { TableQueries } from '@/@types/common'
import Notification from '@/components/ui/Notification'
import EllipsisButton from '@/components/shared/EllipsisButton'
import { Dropdown } from '@/components/ui/Dropdown'
import { deleteCategory } from '@/services/CategoryService'
import toast from '@/components/ui/toast'

const CategoryColumn = ({ row }: { row: Category }) => {
    return (
        <div className="flex items-center gap-2">
            <div>
                <div className="font-bold heading-text mb-1">{row.name}</div>
                <span>ID: {row.id}</span>
            </div>
        </div>
    )
}

// const ActionColumn = ({
//     onEdit,
//     onDelete,
// }: {
//     onEdit: () => void
//     onDelete: () => void
// }) => {
//     return (
//         <div className="flex items-center justify-end gap-3">
//             <Tooltip title="Edit">
//                 <div
//                     className={`text-xl cursor-pointer select-none font-semibold`}
//                     role="button"
//                     onClick={onEdit}
//                 >
//                     <TbPencil />
//                 </div>
//             </Tooltip>
//             <Tooltip title="Delete">
//                 <div
//                     className={`text-xl cursor-pointer select-none font-semibold`}
//                     role="button"
//                     onClick={onDelete}
//                 >
//                     <TbTrash />
//                 </div>
//             </Tooltip>
//         </div>
//     )
// }

type ActionColumnProps = {
    onEdit: () => void
    onDelete: () => void
}

const ActionColumn = ({ onEdit, onDelete }: ActionColumnProps) => {
    const handleSelect = (value: string) => {
        if (value === 'edit') onEdit()
        if (value === 'delete') onDelete()
    }

    const dropdownList = [
        {
            label: 'Edit',
            value: 'edit',
            icon: <TbPencil className="mr-2 text-lg" />,
        },
        {
            label: 'Delete',
            value: 'delete',
            icon: <TbTrash className="mr-2 text-lg text-red-500" />,
        },
    ]

    return (
        <Dropdown renderTitle={<EllipsisButton />} onSelect={handleSelect}>
            {dropdownList.map((item) => (
                <Dropdown.Item
                    key={item.value}
                    eventKey={item.value}
                    onClick={() => handleSelect(item.value)}
                >
                    <div className="flex items-center">
                        {item.icon}
                        <span
                            className={
                                item.value === 'delete' ? 'text-red-500' : ''
                            }
                        >
                            {item.label}
                        </span>
                    </div>
                </Dropdown.Item>
            ))}
        </Dropdown>
    )
}

const CategoryListTable = () => {
    const navigate = useNavigate()

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [toDeleteId, setToDeleteId] = useState('')

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleDelete = (category: Category) => {
        setDeleteConfirmationOpen(true)
        setToDeleteId(category.id)
    }

    const handleEdit = (category: Category) => {
        navigate(`/foods/categories/edit/${category.id}`)
    }

    // const handleConfirmDelete = async () => {
    //     const newCategoryList = categoryList.filter((category) => {
    //         return !(toDeleteId === category.id)
    //     })
    //     setSelectAllCategory([])
    //     mutate(
    //         {
    //             list: newCategoryList,
    //             total: categoryListTotal - selectedCategory.length,
    //             getAllCategoriesByMerchant: newCategoryList,
    //         },
    //         false,
    //     )
    //     const variables = {
    //         deleteCategoryId: toDeleteId,
    //     }

    //     const data = await graphqlRequest<
    //         { deleteOutlet: Category },
    //         typeof variables
    //     >(DELETE_CATEGORY_STRING, variables)

    //     console.log('data', data)
    //     setDeleteConfirmationOpen(false)
    //     setToDeleteId('')
    // }
    const handleConfirmDelete = async () => {
        try {
            const newCategoryList = categoryList.filter(
                (category) => category.id !== toDeleteId,
            )

            setSelectAllCategory([])

            mutate(
                {
                    list: newCategoryList,
                    total: categoryListTotal - selectedCategory.length,
                    getAllCategoriesByMerchant: newCategoryList,
                },
                false,
            )

            const data = await deleteCategory(toDeleteId)

            console.log('Deleted category:', data)

            toast.push(
                <Notification type="success">Category deleted!</Notification>,
                { placement: 'top-center' },
            )
        } catch (error) {
            console.error('Delete failed:', error)
            toast.push(
                <Notification type="danger">
                    Failed to delete category
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setDeleteConfirmationOpen(false)
            setToDeleteId('')
        }
    }

    const {
        categoryList,
        categoryListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllCategory,
        setSelectedCategory,
        selectedCategory,
        mutate,
    } = useCategoryList()

    const columns: ColumnDef<Category>[] = useMemo(
        () => [
            {
                header: 'Category',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original
                    return <CategoryColumn row={row} />
                },
            },
            {
                header: 'Description',
                accessorKey: 'description',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="font-bold heading-text">
                            {row.description}
                        </span>
                    )
                },
            },
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onEdit={() => handleEdit(props.row.original)}
                        onDelete={() => handleDelete(props.row.original)}
                    />
                ),
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    )

    const handleSetTableData = (data: TableQueries) => {
        setTableData(data)
        if (selectedCategory.length > 0) {
            setSelectAllCategory([])
        }
    }

    const handlePaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        handleSetTableData(newTableData)
    }

    const handleSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = Number(value)
        newTableData.pageIndex = 1
        handleSetTableData(newTableData)
    }

    const handleSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        handleSetTableData(newTableData)
    }

    const handleRowSelect = (checked: boolean, row: Category) => {
        setSelectedCategory(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Category>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllCategory(originalRows)
        } else {
            setSelectAllCategory([])
        }
    }

    return (
        <>
            <DataTable
                selectable
                columns={columns}
                data={categoryList}
                noData={!isLoading && categoryList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 28, height: 28 }}
                loading={isLoading}
                pagingData={{
                    total: categoryListTotal,
                    pageIndex: tableData.pageIndex as number,
                    pageSize: tableData.pageSize as number,
                }}
                checkboxChecked={(row) =>
                    selectedCategory.some((selected) => selected.id === row.id)
                }
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
                onCheckBoxChange={handleRowSelect}
                onIndeterminateCheckBoxChange={handleAllRowSelect}
            />
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove Category"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    {' '}
                    Are you sure you want to remove this Category? This action
                    can&apos;t be undo.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default CategoryListTable
