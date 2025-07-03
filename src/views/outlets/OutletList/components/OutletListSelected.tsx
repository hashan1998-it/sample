import { useState } from 'react'
import StickyFooter from '@/components/shared/StickyFooter'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import useOutletList from '../hooks/useOutletList'
import { TbChecks } from 'react-icons/tb'
import { deleteOutlets } from '@/services/OutletService'
import { toast } from '@/components/ui'
import Notification from '@/components/ui/Notification'

const OutletListSelected = () => {
    const {
        selectedOutlet,
        outletList,
        mutate,
        outletListTotal,
        setSelectAllOutlet,
    } = useOutletList()

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

    const handleDelete = async () => {
        setDeleteConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    // const handleConfirmDelete = async () => {
    //     const newOutletList = outletList.filter((outlet) => {
    //         return !selectedOutlet.some((selected) => selected.id === outlet.id)
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

    //     const variables = {
    //         ids: selectedOutlet.map((outlet) => outlet.id),
    //     }

    //     const data = await graphqlRequest<
    //         { deleteOutlets: Outlet[] },
    //         typeof variables
    //     >(DELETE_OUTLETS_STRING, variables)

    //     console.log('data', data)

    //     setDeleteConfirmationOpen(false)
    // }
    const handleConfirmDelete = async () => {
        try {
            const newOutletList = outletList.filter(
                (outlet) =>
                    !selectedOutlet.some(
                        (selected) => selected.id === outlet.id,
                    ),
            )

            setSelectAllOutlet([])

            mutate(
                {
                    list: newOutletList,
                    total: outletListTotal - selectedOutlet.length,
                    getOutlets: newOutletList,
                },
                false,
            )

            const ids = selectedOutlet
                .map((outlet) => outlet.id)
                .filter((id): id is string => typeof id === 'string')
            const data = await deleteOutlets(ids)

            console.log('Deleted outlets:', data)

            toast.push(
                <Notification type="success">
                    {' '}
                    {ids.length} outlets deleted!
                </Notification>,
                { placement: 'top-center' },
            )
            setDeleteConfirmationOpen(false)
        } catch (error) {
            console.error('Failed to delete outlets:', error)
            toast.push(
                <Notification type="danger">
                    Failed to delete selected outlets.
                </Notification>,
                { placement: 'top-center' },
            )
        }
    }
    return (
        <>
            {selectedOutlet.length > 0 && (
                <StickyFooter
                    className="flex items-center justify-between py-4 bg-white dark:bg-gray-800"
                    stickyClass="-mx-4 sm:-mx-8 border-t border-gray-200 dark:border-gray-700 px-8"
                    defaultClass="container mx-auto px-8 rounded-xl border border-gray-200 dark:border-gray-600 mt-4"
                >
                    <div className="container mx-auto">
                        <div className="flex items-center justify-between">
                            <span>
                                {selectedOutlet.length > 0 && (
                                    <span className="flex items-center gap-2">
                                        <span className="text-lg text-primary">
                                            <TbChecks />
                                        </span>
                                        <span className="font-semibold flex items-center gap-1">
                                            <span className="heading-text">
                                                {selectedOutlet.length} Outlets
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
                title="Remove Outlets"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    {' '}
                    Are you sure you want to remove these Outlets? This action
                    can&apos;t be undo.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}
export default OutletListSelected
