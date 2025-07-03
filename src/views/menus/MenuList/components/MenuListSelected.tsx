import { useState } from 'react'
import StickyFooter from '@/components/shared/StickyFooter'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import useMenuList from '../hooks/useMenuList'
import { TbChecks } from 'react-icons/tb'
import { deleteMenus } from '@/services/MenuService'
import { toast } from '@/components/ui'
import Notification from '@/components/ui/Notification'

const MenuListSelected = () => {
    const { selectedMenu, menuList, mutate, menuListTotal, setSelectAllMenu } =
        useMenuList()

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

    const handleDelete = () => {
        setDeleteConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    // const handleConfirmDelete = async () => {
    //     const newMenuList = menuList.filter((menu) => {
    //         return !selectedMenu.some((selected) => selected.id === menu.id)
    //     })
    //     setSelectAllMenu([])
    //     mutate(
    //         {
    //             getMenus: newMenuList, // Assuming getMenus should have the same value as newMenuList
    //             list: newMenuList,
    //             total: menuListTotal - selectedMenu.length,
    //         },
    //         false,
    //     )
    //     const variables = {
    //         ids: selectedMenu.map((outlet) => outlet.id),
    //     }

    //     const data = await graphqlRequest<
    //         { deleteMenu: Menu[] },
    //         typeof variables
    //     >(DELETE_MENUS_STRING, variables)

    //     console.log('data', data)
    //     setDeleteConfirmationOpen(false)
    // }

    const handleConfirmDelete = async () => {
        try {
            // Cache selectedMenu safely at the very start
            const newMenuList = menuList.filter((menu) => {
                return !selectedMenu.some((selected) => selected.id === menu.id)
            })

            setSelectAllMenu([])

            mutate(
                {
                    list: newMenuList,
                    total: menuListTotal - selectedMenu.length,
                    getMenus: newMenuList,
                },
                false,
            )

            const idsToDelete = selectedMenu
                .map((category) => category.id)
                .filter((id): id is string => typeof id === 'string')

            const deletedMenus = await deleteMenus(idsToDelete)

            console.log('Deleted menus:', deletedMenus)

            toast.push(
                <Notification type="success">
                    {idsToDelete.length} Menus deleted!
                </Notification>,
                { placement: 'top-center' },
            )

            setDeleteConfirmationOpen(false)
        } catch (error) {
            console.error('Failed to delete menus:', error)
            toast.push(
                <Notification type="danger">
                    Failed to delete menus. Please try again.
                </Notification>,
                { placement: 'top-center' },
            )
        }
    }

    return (
        <>
            {selectedMenu.length > 0 && (
                <StickyFooter
                    className="flex items-center justify-between py-4 bg-white dark:bg-gray-800"
                    stickyClass="-mx-4 sm:-mx-8 border-t border-gray-200 dark:border-gray-700 px-8"
                    defaultClass="container mx-auto px-8 rounded-xl border border-gray-200 dark:border-gray-600 mt-4"
                >
                    <div className="container mx-auto">
                        <div className="flex items-center justify-between">
                            <span>
                                {selectedMenu.length > 0 && (
                                    <span className="flex items-center gap-2">
                                        <span className="text-lg text-primary">
                                            <TbChecks />
                                        </span>
                                        <span className="font-semibold flex items-center gap-1">
                                            <span className="heading-text">
                                                {selectedMenu.length} Menus
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
                title="Remove Menus"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    {' '}
                    Are you sure you want to remove these Menus? This action
                    can&apos;t be undo.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default MenuListSelected
