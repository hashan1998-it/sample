import { useMemo, useState } from 'react'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import useMenuList from '../hooks/useMenuList'
import cloneDeep from 'lodash/cloneDeep'
import { useNavigate } from 'react-router-dom'
import { TbPencil, TbTrash } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { Menu } from '../types'
import type { TableQueries } from '@/@types/common'
import { Dropdown } from '@/components/ui/Dropdown'
import EllipsisButton from '@/components/shared/EllipsisButton'
import { IoDuplicate } from 'react-icons/io5'
import { deleteMenuById, duplicateMenu } from '@/services/MenuService'
import { toast } from '@/components/ui'
import Notification from '@/components/ui/Notification'

// const MenuColumn = ({ row }: { row: Menu }) => {
//     return (
//         <div className="flex items-center gap-2">
//             <div>
//                 {/* <div className="font-bold heading-text mb-1">{row.name}</div> */}
//                 <span>ID: {row.id}</span>
//             </div>
//         </div>
//     )
// }

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
// const ActionColumn = ({
//     onEdit,
//     onDelete,
// }: {
//     onEdit: () => void
//     onDelete: () => void
// }) => {
//     const [open, setOpen] = useState(false)
//     const ref = useRef<HTMLDivElement>(null)

//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (ref.current && !ref.current.contains(event.target as Node)) {
//                 setOpen(false)
//             }
//         }
//         document.addEventListener('mousedown', handleClickOutside)
//         return () =>
//             document.removeEventListener('mousedown', handleClickOutside)
//     }, [])

//     return (
//         <div ref={ref} className="relative inline-block text-left">
//             <Button
//                 size="sm"
//                 variant="plain"
//                 className="inline-flex items-center gap-2 py-1.5  "
//                 onClick={() => setOpen((prev) => !prev)}
//             >
//                 {/* Actions
//                 <ChevronDownIcon className="w-4 h-4 text-gray-300" /> */}
//                 <SlOptionsVertical />
//             </Button>

//             {open && (
//                 <div className="absolute left-0 mt-2 w-40 origin-top-right rounded-md  shadow-lg  z-100 bg-white">
//                     <div className="py-1">
//                         <Button
//                             size="sm"
//                             variant="plain"
//                             className="flex items-center w-full   "
//                             onClick={() => {
//                                 onEdit()
//                                 setOpen(false)
//                             }}
//                         >
//                             <TbPencil className="mr-2 text-lg" />
//                             Edit
//                         </Button>
//                         <Button
//                             size="sm"
//                             variant="plain"
//                             className="flex items-center w-full hover:text-error"
//                             onClick={() => {
//                                 onDelete()
//                                 setOpen(false)
//                             }}
//                         >
//                             <TbTrash className="mr-2 text-lg" />
//                             Delete
//                         </Button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }

type ActionColumnProps = {
    onEdit: () => void
    onDelete: () => void
    onDuplicate: () => void
}

const ActionColumn = ({ onEdit, onDelete, onDuplicate }: ActionColumnProps) => {
    const handleSelect = (value: string) => {
        if (value === 'edit') onEdit()
        if (value === 'delete') onDelete()
        if (value === 'duplicate') onDuplicate()
    }

    const dropdownList = [
        {
            label: 'Edit',
            value: 'edit',
            icon: <TbPencil className="mr-2 text-lg" />,
        },
        {
            label: 'Duplicate',
            value: 'duplicate',
            icon: <IoDuplicate className="mr-2 text-lg" />,
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
const MenuListTable = () => {
    const navigate = useNavigate()

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [toDeleteId, setToDeleteId] = useState('')

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleDelete = (menu: Menu) => {
        setDeleteConfirmationOpen(true)
        setToDeleteId(menu.id)
    }

    // const handleDuplicate = async (menu: Menu) => {
    //     const variables = {
    //         input: {
    //             menuId: menu.id,
    //         },
    //     }

    //     const data = await graphqlRequest<
    //         { duplicateMenu: Menu },
    //         typeof variables
    //     >(DUPLICATE_MENU_STRING, variables)

    //     console.log('data', data)

    //     await mutate()
    // }

    const handleDuplicate = async (menu: Menu) => {
        try {
            const duplicatedMenu = await duplicateMenu(menu.id)
            console.log('Duplicated menu:', duplicatedMenu)

            toast.push(
                <Notification type="success">
                    Menu duplicated successfully!
                </Notification>,
                { placement: 'top-center' },
            )

            await mutate()
        } catch (error) {
            console.error('Failed to duplicate menu:', error)
            toast.push(
                <Notification type="danger">
                    Failed to duplicate menu.
                </Notification>,
                { placement: 'top-center' },
            )
        }
    }

    const handleEdit = (menu: Menu) => {
        navigate(`/menus/edit/${menu.id}`)
    }

    // const handleConfirmDelete = async () => {
    //     const variables = {
    //         deleteMenuId: toDeleteId,
    //     }

    //     const data = await graphqlRequest<
    //         { deleteMenu: Menu },
    //         typeof variables
    //     >(DELETE_MENU_STRING, variables)

    //     console.log('data', data)
    //     const newMenuList = menuList.filter((menu: { id: string }) => {
    //         return !(toDeleteId === menu.id)
    //     })
    //     setSelectAllMenu([])
    //     mutate(
    //         {
    //             getMenus: newMenuList,
    //             list: newMenuList,
    //             total: menuListTotal - selectedMenu.length,
    //         },
    //         false,
    //     )

    //     setDeleteConfirmationOpen(false)
    //     setToDeleteId('')
    // }

    const handleConfirmDelete = async () => {
        try {
            if (!toDeleteId) return

            const deletedMenu = await deleteMenuById(toDeleteId)
            console.log('Deleted menu:', deletedMenu)

            const newMenuList = menuList.filter(
                (menu) => menu.id !== toDeleteId,
            )

            setSelectAllMenu([])

            mutate(
                {
                    getMenus: newMenuList,
                    list: newMenuList,
                    total: menuListTotal - 1,
                },
                false,
            )

            toast.push(
                <Notification type="success">
                    Menu deleted successfully!
                </Notification>,
                { placement: 'top-center' },
            )
        } catch (error) {
            console.error('Failed to delete menu:', error)
            toast.push(
                <Notification type="danger">
                    Failed to delete menu. Please try again.
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setDeleteConfirmationOpen(false)
            setToDeleteId('')
        }
    }

    const {
        menuList,
        menuListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllMenu,
        setSelectedMenu,
        selectedMenu,
        mutate,
    } = useMenuList()

    const columns: ColumnDef<Menu>[] = useMemo(
        () => [
            {
                header: 'Menu',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div>
                            <div className="font-bold heading-text mb-1">
                                {row.name}
                            </div>
                            <span>ID: {row.id}</span>
                        </div>
                    )
                },
            },

            {
                header: 'Outlets',
                accessorKey: 'outlet',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="font-bold heading-text flex flex-wrap gap-2">
                            {Array.isArray(row.outlet)
                                ? row.outlet.map((item, index) => (
                                      <span
                                          key={index}
                                          className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm"
                                      >
                                          {item.name}
                                      </span>
                                  ))
                                : row.outlet && (
                                      <span className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm">
                                          {row.outlet.name}
                                      </span>
                                  )}
                        </span>
                    )
                },
            },

            {
                header: 'Item',
                accessorKey: 'item',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="font-bold heading-text">
                            {Array.isArray(row.item)
                                ? row.item.length
                                : row.item
                                  ? 1
                                  : 0}{' '}
                            items
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
                        onDuplicate={() => handleDuplicate(props.row.original)}
                    />
                ),
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    )

    const handleSetTableData = (data: TableQueries) => {
        setTableData(data)
        if (selectedMenu.length > 0) {
            setSelectAllMenu([])
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

    const handleRowSelect = (checked: boolean, row: Menu) => {
        setSelectedMenu(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Menu>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllMenu(originalRows)
        } else {
            setSelectAllMenu([])
        }
    }

    return (
        <>
            <DataTable
                selectable
                columns={columns}
                data={menuList}
                noData={!isLoading && menuList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 28, height: 28 }}
                loading={isLoading}
                pagingData={{
                    total: menuListTotal,
                    pageIndex: tableData.pageIndex as number,
                    pageSize: tableData.pageSize as number,
                }}
                checkboxChecked={(row) =>
                    selectedMenu.some((selected) => selected.id === row.id)
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
                title="Remove Menu"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    {' '}
                    Are you sure you want to remove this Menu? This action
                    can&apos;t be undo.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default MenuListTable
