import { useMemo, useState } from 'react'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import useOutletList from '../hooks/useOutletList'
import cloneDeep from 'lodash/cloneDeep'
import { useNavigate } from 'react-router-dom'
import { TbPencil, TbTrash } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { Outlet } from '../types'
import type { TableQueries } from '@/@types/common'
import Button from '@/components/ui/Button'
import QRCodeModal from '@/components/ui/QrModal/QrCodeModal'
import { CgBorderStyleDashed } from 'react-icons/cg'
import EllipsisButton from '@/components/shared/EllipsisButton'
import { Dropdown } from '@/components/ui/Dropdown'
import { deleteOutlet } from '@/services/OutletService'
import { toast } from '@/components/ui'
import Notification from '@/components/ui/Notification'

const ProductColumn = ({ row }: { row: Outlet }) => {
    return (
        <div className="flex items-center gap-2">
            {/* <Avatar
                shape="round"
                size={60}
                {...(row.img ? { src: row.img } : { icon: <FiPackage /> })}
            /> */}
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
// import { useRef, useEffect, useState } from 'react'
// import { Dropdown } from 'your-ui-library' // adjust import as needed
// import { SlOptionsVertical } from 'react-icons/sl'
// import { TbPencil, TbTrash } from 'react-icons/tb'

// const EllipsisButton = () => (
//     <button className="p-2 hover:bg-gray-100 rounded">
//         <EllipsisButton />
//     </button>
// )

// const ActionColumn = ({
//     onEdit,
//     onDelete,
// }: {
//     onEdit: () => void
//     onDelete: () => void
// }) => {
//     const ref = useRef<HTMLDivElement>(null)
//     const [, setOpen] = useState(false)

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
//             <Dropdown renderTitle={<EllipsisButton />} className="z-50">
//                 <Dropdown.Item
//                     eventKey="edit"
//                     onClick={() => {
//                         onEdit()
//                         setOpen(false)
//                     }}
//                 >
//                     <div className="flex items-center gap-2">
//                         <TbPencil />
//                         <span>Edit</span>
//                     </div>
//                 </Dropdown.Item>
//                 <Dropdown.Item
//                     eventKey="delete"
//                     onClick={() => {
//                         onDelete()
//                         setOpen(false)
//                     }}
//                 >
//                     <div className="flex items-center gap-2 text-red-500">
//                         <TbTrash />
//                         <span>Delete</span>
//                     </div>
//                 </Dropdown.Item>
//             </Dropdown>
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

const OutletListTable = () => {
    const navigate = useNavigate()
    const [selectedMenuUrl, setSelectedMenuUrl] = useState<string | null>(null)
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [toDeleteId, setToDeleteId] = useState('')
    const BASE_MENU_URL = import.meta.env.BASE_MENU_URL
    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleDelete = async (outlet: Outlet) => {
        setDeleteConfirmationOpen(true)
        setToDeleteId(outlet.id)
    }

    const handleEdit = (outlet: Outlet) => {
        navigate(`/outlets/edit/${outlet.id}`)
    }

    // const handleConfirmDelete = async () => {
    //     const variables = {
    //         deleteOutletId: toDeleteId,
    //     }

    //     const data = await graphqlRequest<
    //         { deleteOutlet: Outlet },
    //         typeof variables
    //     >(DELETE_OUTLET_STRING, variables)

    //     console.log('data', data)
    //     const newOutletList = outletList.filter((outlet) => {
    //         return !(toDeleteId === outlet.id)
    //     })
    //     setSelectAllOutlet([])
    //     mutate(
    //         {
    //             list: newOutletList,
    //             total: outletListTotal - selectedOutlet.length,
    //             getOutlets: newOutletList,
    //         },
    //         false,
    //     )

    //     setDeleteConfirmationOpen(false)
    //     setToDeleteId('')
    // }
    const handleConfirmDelete = async () => {
        try {
            if (!toDeleteId) {
                throw new Error('No outlet ID provided for deletion')
            }
            const data = await deleteOutlet(toDeleteId)
            console.log('Deleted outlet:', data)

            const newOutletList = outletList.filter(
                (outlet) => outlet.id !== toDeleteId,
            )
            setSelectAllOutlet([])

            mutate(
                {
                    list: newOutletList,
                    total: outletListTotal - 1,
                    getOutlets: newOutletList,
                },
                false,
            )

            toast.push(
                <Notification type="success">
                    Outlet deleted successfully!
                </Notification>,
                { placement: 'top-center' },
            )

            setDeleteConfirmationOpen(false)
            setToDeleteId('')
        } catch (error) {
            console.error('Failed to delete outlet:', error)
            toast.push(
                <Notification type="danger">
                    Failed to delete outlet.
                </Notification>,
                { placement: 'top-center' },
            )
        }
    }
    const handleGetQr = (outletId: string) => {
        const url = `${BASE_MENU_URL}/menu/${outletId}`
        setSelectedMenuUrl(url)
    }

    const {
        outletList,
        outletListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllOutlet,
        setSelectedOutlet,
        selectedOutlet,
        mutate,
    } = useOutletList()

    const columns: ColumnDef<Outlet>[] = useMemo(
        () => [
            {
                header: 'Outlet',
                accessorKey: 'outlet',
                cell: (props) => {
                    const row = props.row.original
                    return <ProductColumn row={row} />
                },
            },
            {
                header: 'Menu',
                accessorKey: 'menu',
                cell: (props) => {
                    const menu = props.row.original.menu

                    return (
                        <div className="flex flex-col gap-1 justify-center">
                            {menu && menu.name ? (
                                <span className="font-bold heading-text">
                                    {menu.name}
                                </span>
                            ) : (
                                <span className="text-start">
                                    <CgBorderStyleDashed />
                                </span>
                            )}
                        </div>
                    )
                },
            },

            {
                header: 'Get QR Code',
                accessorKey: 'QrCode',
                cell: (props) => {
                    const row = props.row.original
                    // If menu is an array, use the first menu's id, or adjust as needed
                    const outletId = row.id
                    const menuId = row.menu?.id
                    return (
                        <span className="font-bold heading-text">
                            <Button
                                disabled={!menuId}
                                onClick={() =>
                                    outletId && handleGetQr(outletId)
                                }
                            >
                                Get QR
                            </Button>
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
        if (selectedOutlet.length > 0) {
            setSelectAllOutlet([])
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

    const handleRowSelect = (checked: boolean, row: Outlet) => {
        setSelectedOutlet(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Outlet>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllOutlet(originalRows)
        } else {
            setSelectAllOutlet([])
        }
    }

    return (
        <>
            <DataTable
                // className="min-h-[400px]"
                selectable
                columns={columns}
                data={outletList}
                noData={!isLoading && outletList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 28, height: 28 }}
                loading={isLoading}
                pagingData={{
                    total: outletListTotal,
                    pageIndex: tableData.pageIndex as number,
                    pageSize: tableData.pageSize as number,
                }}
                checkboxChecked={(row) =>
                    selectedOutlet.some((selected) => selected.id === row.id)
                }
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
                onCheckBoxChange={handleRowSelect}
                onIndeterminateCheckBoxChange={handleAllRowSelect}
            />
            {selectedMenuUrl && (
                <QRCodeModal
                    isOpen={!!selectedMenuUrl}
                    menuUrl={selectedMenuUrl}
                    onClose={() => setSelectedMenuUrl(null)}
                />
            )}
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove Outlets"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    {' '}
                    Are you sure you want to remove this Outlet? This action
                    can&apos;t be undo.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default OutletListTable
