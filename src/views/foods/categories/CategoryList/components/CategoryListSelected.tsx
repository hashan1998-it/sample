import { useState } from 'react'
import StickyFooter from '@/components/shared/StickyFooter'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import useCategoryList from '../hooks/useCategoryList'
import { TbChecks } from 'react-icons/tb'
import { deleteCategories } from '@/services/CategoryService'
import { toast } from '@/components/ui'
import Notification from '@/components/ui/Notification'

const CategoryListSelected = () => {
    const {
        selectedCategory,
        categoryList,
        mutate,
        categoryListTotal,
        setSelectAllCategory,
    } = useCategoryList()

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

    const handleDelete = () => {
        setDeleteConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    // const handleConfirmDelete = async () => {
    //     const newProductList = categoryList.filter((category) => {
    //         return !selectedCategory.some(
    //             (selected) => selected.id === category.id,
    //         )
    //     })
    //     setSelectAllCategory([])
    //     mutate(
    //         {
    //             list: newProductList,
    //             total: categoryListTotal - selectedCategory.length,
    //             getAllCategoriesByMerchant: newProductList,
    //         },
    //         false,
    //     )
    //     const variables = {
    //         ids: selectedCategory.map((outlet) => outlet.id),
    //     }

    //     const data = await graphqlRequest<
    //         { deleteCategories: Category[] },
    //         typeof variables
    //     >(DELETE_CATEGORIES_STRING, variables)

    //     console.log('data', data)
    //     setDeleteConfirmationOpen(false)
    // }

    const handleConfirmDelete = async () => {
        try {
            // Optimistically remove from UI before calling backend
            const newProductList = categoryList.filter(
                (category) =>
                    !selectedCategory.some(
                        (selected) => selected.id === category.id,
                    ),
            )

            setSelectAllCategory([])

            mutate(
                {
                    list: newProductList,
                    total: categoryListTotal - selectedCategory.length,
                    getAllCategoriesByMerchant: newProductList,
                },
                false,
            )

            const idsToDelete = selectedCategory
                .map((category) => category.id)
                .filter((id): id is string => typeof id === 'string')

            const data = await deleteCategories(idsToDelete)

            console.log('Deleted categories:', data)

            toast.push(
                <Notification type="success">
                    {idsToDelete.length} categories deleted!
                </Notification>,
                { placement: 'top-center' },
            )

            setDeleteConfirmationOpen(false)
        } catch (error) {
            console.error('Failed to delete categories:', error)
            toast.push(
                <Notification type="danger">
                    Failed to delete selected categories.
                </Notification>,
                { placement: 'top-center' },
            )
        }
    }

    return (
        <>
            {selectedCategory.length > 0 && (
                <StickyFooter
                    className="flex items-center justify-between py-4 bg-white dark:bg-gray-800"
                    stickyClass="-mx-4 sm:-mx-8 border-t border-gray-200 dark:border-gray-700 px-8"
                    defaultClass="container mx-auto px-8 rounded-xl border border-gray-200 dark:border-gray-600 mt-4"
                >
                    <div className="container mx-auto">
                        <div className="flex items-center justify-between">
                            <span>
                                {selectedCategory.length > 0 && (
                                    <span className="flex items-center gap-2">
                                        <span className="text-lg text-primary">
                                            <TbChecks />
                                        </span>
                                        <span className="font-semibold flex items-center gap-1">
                                            <span className="heading-text">
                                                {selectedCategory.length}{' '}
                                                Categories
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
                title="Remove products"
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

export default CategoryListSelected
