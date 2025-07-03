import { useEffect, useMemo, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import useItemList from '../hooks/useItemList'
import cloneDeep from 'lodash/cloneDeep'
import { useNavigate } from 'react-router-dom'
import { TbPencil } from 'react-icons/tb'
import { FiPackage } from 'react-icons/fi'
import { NumericFormat } from 'react-number-format'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { Item } from '../types'
import type { TableQueries } from '@/@types/common'
import Button from '@/components/ui/Button'
import { useFormContext, useWatch } from 'react-hook-form'
import Tooltip from '@/components/ui/Tooltip'
import {
    createItemMenu,
    deleteItemMenu,
    getItemMenus,
} from '@/services/ItemMenuService'
import { toast } from '@/components/ui'
import Notification from '@/components/ui/Notification'

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

const ActionColumn = ({ onEdit }: { onEdit: () => void }) => {
    return (
        <div className="flex items-center justify-end gap-3">
            <Tooltip title="Edit">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    // role="button"
                >
                    <Button
                        type="button"
                        size="sm"
                        variant="solid"
                        className="flex items-center gap-2"
                        onClick={onEdit}
                    >
                        <TbPencil /> Update
                    </Button>
                </div>
            </Tooltip>
        </div>
    )
}

type Props = {
    menuId: string
}

const ItemListTable = ({ menuId }: Props) => {
    const navigate = useNavigate()
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [itemMenus, setItemMenus] = useState<
        { item: string; menu: string; price: string }[]
    >([])

    const { getValues, setValue, control } = useFormContext()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const selectedItems = useWatch({ control, name: 'items' }) || []

    useEffect(() => {
        console.log('Selected Items Changed:', selectedItems)
    }, [selectedItems])

    // useEffect(() => {
    //     const fetchItemMenus = async () => {
    //         type GetItemMenusResponse = {
    //             getItemMenus?: { item: string; menu: string; price: string }[]
    //         }
    //         const res = await graphqlRequest<GetItemMenusResponse>(
    //             GET_ITEM_MENUS_STRING,
    //         )
    //         setItemMenus(res?.getItemMenus || [])
    //     }
    //     fetchItemMenus()
    // }, [])
    useEffect(() => {
        const fetchItemMenus = async () => {
            try {
                const menus = await getItemMenus()
                setItemMenus(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    menus.map((m: any) => ({
                        item: m.item,
                        menu: m.menu,
                        price: m.price,
                    })),
                )
            } catch (error) {
                console.error('Failed to fetch item menus:', error)
                toast.push(
                    <Notification type="danger">
                        Failed to load item menus. Please try again.
                    </Notification>,
                    { placement: 'top-center' },
                )
            }
        }

        fetchItemMenus()
    }, [])

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    // const handleAddItem = async (itemId: string) => {
    //     const current = getValues('items') || []

    //     if (!current.includes(itemId)) {
    //         setValue('items', [...current, itemId])
    //     }

    //     const variables = {
    //         data: {
    //             menu: menuId,
    //             item: itemId,
    //         },
    //     }

    //     const response = await graphqlRequest(
    //         CREATE_ITEM_MENU_STRING,
    //         variables,
    //     )

    //     console.log('Response from create item menu:', response)

    //     // refetch itemMenus
    //     type GetItemMenusResponse = {
    //         getItemMenus?: { item: string; menu: string; price: string }[]
    //     }
    //     const updatedMenus = await graphqlRequest<GetItemMenusResponse>(
    //         GET_ITEM_MENUS_STRING,
    //     )
    //     setItemMenus(updatedMenus?.getItemMenus || [])
    // }

    const handleAddItem = async (itemId: string) => {
        try {
            const current = getValues('items') || []

            if (!current.includes(itemId)) {
                setValue('items', [...current, itemId])
            }

            const response = await createItemMenu(menuId, itemId)
            console.log('Response from create item menu:', response)

            toast.push(
                <Notification type="success">Item added to menu</Notification>,
                { placement: 'top-center' },
            )

            const updatedMenus = await getItemMenus()

            setItemMenus(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                updatedMenus.map((m: any) => ({
                    item: m.item,
                    menu: m.menu,
                    price: m.price,
                })),
            )

            await mutate()
        } catch (error) {
            console.error('Failed to add item to menu:', error)
            toast.push(
                <Notification type="danger">
                    Failed to add item. Please try again.
                </Notification>,
                { placement: 'top-center' },
            )
        }
    }

    // const handleRemoveItem = async (itemId: string) => {
    //     const current = getValues('items') || []
    //     setValue(
    //         'items',
    //         current.filter((id: string) => id !== itemId),
    //     )

    //     const variables = {
    //         menuId: menuId,
    //         itemId: itemId,
    //     }

    //     const response = await graphqlRequest(
    //         DELETE_ITEM_MENU_BY_MENU_AND_ITEM_STRING,
    //         variables,
    //     )
    //     console.log('Response from delete item menu:', response)

    //     // refetch itemMenus
    //     type GetItemMenusResponse = {
    //         getItemMenus?: { item: string; menu: string; price: string }[]
    //     }

    //     const updatedMenus = await graphqlRequest<GetItemMenusResponse>(
    //         GET_ITEM_MENUS_STRING,
    //     )
    //     setItemMenus(updatedMenus?.getItemMenus || [])
    //     mutate()
    // }

    const handleRemoveItem = async (itemId: string) => {
        try {
            const current = getValues('items') || []
            setValue(
                'items',
                current.filter((id: string) => id !== itemId),
            )

            const response = await deleteItemMenu(menuId, itemId)
            console.log('Response from delete item menu:', response)

            const updatedMenus = await getItemMenus()
            setItemMenus(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                updatedMenus.map((m: any) => ({
                    item: m.item,
                    menu: m.menu,
                    price: m.price,
                })),
            )

            mutate()
            toast.push(
                <Notification type="success">
                    Item removed from menu
                </Notification>,
                { placement: 'top-center' },
            )
        } catch (error) {
            console.error('Failed to remove item:', error)
            toast.push(
                <Notification type="danger">
                    Failed to remove item. Please try again.
                </Notification>,
                { placement: 'top-center' },
            )
        }
    }

    const handleEdit = (product: Item) => {
        mutate()
        navigate(`/menus/${menuId}/item/edit/${product.id}`)
    }

    // const handleConfirmDelete = async () => {
    //     const variables = { deleteItemId: toDeleteId }

    //     const data = await graphqlRequest(DELETE_ITEM_STRING, variables)
    //     console.log('data', data)

    //     const newItemList = itemList.filter((item) => item.id !== toDeleteId)
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
            // {
            //     header: 'Price',
            //     accessorKey: 'price',
            //     cell: (props) => {
            //         const { price } = props.row.original
            //         return (
            //             <span className="font-bold heading-text">
            //                 <NumericFormat
            //                     fixedDecimalScale
            //                     prefix="$"
            //                     displayType="text"
            //                     value={price}
            //                     decimalScale={2}
            //                     thousandSeparator={true}
            //                 />
            //             </span>
            //         )
            //     },
            // },
            {
                header: 'Price',
                accessorKey: 'price',
                cell: (props) => {
                    const { id } = props.row.original // row.id is itemId

                    const linkedItem = itemMenus.find(
                        (m) => m.menu === menuId && m.item === id,
                    )

                    const price = linkedItem?.price

                    return (
                        <span className="font-bold heading-text">
                            {price !== undefined ? (
                                <NumericFormat
                                    fixedDecimalScale
                                    prefix="$"
                                    displayType="text"
                                    value={price}
                                    decimalScale={2}
                                    thousandSeparator={true}
                                />
                            ) : (
                                <NumericFormat
                                    fixedDecimalScale
                                    prefix="$"
                                    displayType="text"
                                    value={props.row.original.price}
                                    decimalScale={2}
                                    thousandSeparator={true}
                                />
                            )}
                        </span>
                    )
                },
            },

            {
                header: 'Action',
                accessorKey: 'category.name',
                cell: (props) => {
                    const row = props.row.original
                    const isLinked = itemMenus.some(
                        (m) => m.menu === menuId && m.item === row.id,
                    )
                    return (
                        <div className="flex items-center gap-2">
                            <Tooltip
                                title={isLinked ? 'Remove Item' : 'Add Item'}
                            >
                                <Button
                                    size="sm"
                                    type="button"
                                    customColorClass={() =>
                                        isLinked
                                            ? 'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error'
                                            : 'border-success ring-1 ring-success text-success hover:border-success hover:ring-success hover:text-success'
                                    }
                                    onClick={() =>
                                        isLinked
                                            ? handleRemoveItem(row.id)
                                            : handleAddItem(row.id)
                                    }
                                >
                                    {isLinked ? 'Remove Item' : 'Add Item'}
                                </Button>
                            </Tooltip>
                        </div>
                    )
                },
            },
            // {
            //     header: '',
            //     id: 'action',
            //     cell: (props) => (
            //         <ActionColumn
            //             onEdit={() => handleEdit(props.row.original)}
            //         />
            //     ),
            // },
            {
                header: '',
                id: 'action',
                cell: (props) => {
                    const row = props.row.original
                    const isLinked = itemMenus.some(
                        (m) => m.menu === menuId && m.item === row.id,
                    )

                    return isLinked ? (
                        <ActionColumn onEdit={() => handleEdit(row)} />
                    ) : null
                },
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [itemMenus, getValues, setValue],
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
                title="Remove products"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                // onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this product? This action
                    can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default ItemListTable
