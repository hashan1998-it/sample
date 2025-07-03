import { useState } from 'react'
import StickyFooter from '@/components/shared/StickyFooter'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import useItemList from '../hooks/useItemList'
import { TbChecks } from 'react-icons/tb'
import { deleteItems } from '@/services/ItemService'
import Notification from '@/components/ui/Notification'
import { toast } from '@/components/ui'
import { Item } from '../types'

const ItemListSelected = () => {
    const { selectedItem, itemList, mutate, itemListTotal, setSelectAllItem } =
        useItemList()

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

    const handleDelete = () => {
        setDeleteConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    // const handleConfirmDelete = async () => {
    //     const newProductList = itemList.filter((item) => {
    //         return !selectedItem.some((selected) => selected.id === item.id)
    //     })
    //     setSelectAllItem([])
    //     mutate(
    //         {
    //             list: newProductList,
    //             total: itemListTotal - selectedItem.length,
    //             getItems: newProductList, // or provide the correct value for getItems if different
    //         },
    //         false,
    //     )
    //     const variables = {
    //         ids: selectedItem.map((item) => item.id),
    //     }

    //     const data = await graphqlRequest<
    //         { deleteItems: Item[] },
    //         typeof variables
    //     >(DELETE_ITEMS_STRING, variables)

    //     console.log('data', data)
    //     setDeleteConfirmationOpen(false)
    // }
    const handleConfirmDelete = async () => {
        try {
            const newProductList = itemList.filter(
                (item: Item) =>
                    !selectedItem.some((selected) => selected.id === item.id),
            )

            setSelectAllItem([])

            mutate(
                {
                    list: newProductList,
                    total: itemListTotal - selectedItem.length,
                    getItems: newProductList,
                },
                false,
            )

            const idsToDelete = selectedItem
                .map((item) => item.id)
                .filter((id): id is string => typeof id === 'string')

            const data = await deleteItems(idsToDelete)

            console.log('Deleted items:', data)

            toast.push(
                <Notification type="success">
                    {idsToDelete.length} items deleted!
                </Notification>,
                { placement: 'top-center' },
            )
        } catch (error) {
            console.error('Delete failed:', error)

            toast.push(
                <Notification type="danger">
                    Failed to delete items.
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setDeleteConfirmationOpen(false)
        }
    }

    return (
        <>
            {selectedItem.length > 0 && (
                <StickyFooter
                    className="flex items-center justify-between py-4 bg-white dark:bg-gray-800"
                    stickyClass="-mx-4 sm:-mx-8 border-t border-gray-200 dark:border-gray-700 px-8"
                    defaultClass="container mx-auto px-8 rounded-xl border border-gray-200 dark:border-gray-600 mt-4"
                >
                    <div className="container mx-auto">
                        <div className="flex items-center justify-between">
                            <span>
                                {selectedItem.length > 0 && (
                                    <span className="flex items-center gap-2">
                                        <span className="text-lg text-primary">
                                            <TbChecks />
                                        </span>
                                        <span className="font-semibold flex items-center gap-1">
                                            <span className="heading-text">
                                                {selectedItem.length} Items
                                            </span>
                                            <span>selected</span>
                                        </span>
                                    </span>
                                )}
                            </span>

                            <div className="flex items-center">
                                <Button
                                    size="sm"
                                    className="ltr:mr-3 rtl:ml-3"
                                    type="button"
                                    customColorClass={() =>
                                        'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error'
                                    }
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                </StickyFooter>
            )}
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove Item"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    {' '}
                    Are you sure you want to remove these products? This action
                    can&apos;t be undo.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default ItemListSelected
