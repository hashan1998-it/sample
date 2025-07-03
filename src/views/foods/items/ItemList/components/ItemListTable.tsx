import { useMemo, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import useItemList from '../hooks/useItemList'
import cloneDeep from 'lodash/cloneDeep'
import { useNavigate } from 'react-router-dom'
import { TbPencil, TbTrash } from 'react-icons/tb'
import { FiPackage } from 'react-icons/fi'
import { NumericFormat } from 'react-number-format'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { Item } from '../types'
import type { TableQueries } from '@/@types/common'
import Notification from '@/components/ui/Notification'

import EllipsisButton from '@/components/shared/EllipsisButton'
import { Dropdown } from '@/components/ui/Dropdown'
import { deleteItem } from '@/services/ItemService'
import { toast } from '@/components/ui'

const ItemColumn = ({ row }: { row: Item }) => {
    return (
        <div className="flex items-center gap-2">
            <Avatar
                shape="round"
                size={60}
                {...(row.imageUrl
                    ? { src: row.imageUrl }
                    : { icon: <FiPackage /> })}
            />
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
const ItemListTable = () => {
    const navigate = useNavigate()

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [toDeleteId, setToDeleteId] = useState('')

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleDelete = (product: Item) => {
        setDeleteConfirmationOpen(true)
        setToDeleteId(product.id)
    }

    const handleEdit = (product: Item) => {
        navigate(`/foods/items/edit/${product.id}`)
    }

    // const handleConfirmDelete = async () => {
    //     const variables = {
    //         deleteItemId: toDeleteId,
    //     }

    //     const data = await graphqlRequest<
    //         { deleteItem: Item },
    //         typeof variables
    //     >(DELETE_ITEM_STRING, variables)

    //     console.log('data', data)

    //     const newItemList = itemList.filter((item) => {
    //         return !(toDeleteId === item.id)
    //     })
    //     setSelectAllItem([])
    //     mutate(
    //         {
    //             list: newItemList,
    //             total: itemListTotal - selectedItem.length,
    //             getItems: newItemList,
    //         },
    //         false,
    //     )
    //     setDeleteConfirmationOpen(false)
    //     setToDeleteId('')
    // }
    const handleConfirmDelete = async () => {
        try {
            const data = await deleteItem(toDeleteId)
            console.log('Deleted item:', data)

            const newItemList = itemList.filter(
                (item) => item.id !== toDeleteId,
            )

            setSelectAllItem([])

            mutate(
                {
                    list: newItemList,
                    total: itemListTotal - 1,
                    getItems: newItemList,
                },
                false,
            )

            toast.push(
                <Notification type="success">
                    Item deleted successfully!
                </Notification>,
                { placement: 'top-center' },
            )
        } catch (error) {
            console.error('Delete failed:', error)
            toast.push(
                <Notification type="danger">
                    Failed to delete item.
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setDeleteConfirmationOpen(false)
            setToDeleteId('')
        }
    }

    const {
        itemList,
        itemListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllItem,
        setSelectedItem,
        selectedItem,
        mutate,
    } = useItemList()

    const columns: ColumnDef<Item>[] = useMemo(
        () => [
            {
                header: 'Item',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original
                    return <ItemColumn row={row} />
                },
            },
            {
                header: 'Price',
                accessorKey: 'price',
                cell: (props) => {
                    const { price } = props.row.original
                    return (
                        <span className="font-bold heading-text">
                            <NumericFormat
                                fixedDecimalScale
                                prefix="$"
                                displayType="text"
                                value={price}
                                decimalScale={2}
                                thousandSeparator={true}
                            />
                        </span>
                    )
                },
            },
            {
                header: 'Category',
                accessorKey: 'category.name',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="font-bold heading-text">
                            {row.category?.name}
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
        if (selectedItem.length > 0) {
            setSelectAllItem([])
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

    const handleRowSelect = (checked: boolean, row: Item) => {
        setSelectedItem(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Item>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllItem(originalRows)
        } else {
            setSelectAllItem([])
        }
    }

    return (
        <>
            <DataTable
                selectable
                columns={columns}
                data={itemList}
                noData={!isLoading && itemList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 28, height: 28 }}
                loading={isLoading}
                pagingData={{
                    total: itemListTotal,
                    pageIndex: tableData.pageIndex as number,
                    pageSize: tableData.pageSize as number,
                }}
                checkboxChecked={(row) =>
                    selectedItem.some((selected) => selected.id === row.id)
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
                title="Remove Items"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    {' '}
                    Are you sure you want to remove this Item? This action
                    can&apos;t be undo.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default ItemListTable
