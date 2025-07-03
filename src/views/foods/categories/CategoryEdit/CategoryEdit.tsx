import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import NoProductFound from '@/assets/svg/NoProductFound'
import {
    apiGetCategory,
    deleteCategory,
    updateCategory,
} from '@/services/CategoryService'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import { useParams, useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import type { Category, CategoryFormSchema } from '../CategoryForm/types'
import CategoryForm from '../CategoryForm'
import useMerchantStore from '@/store/useMerchantStore'

const CategoryEdit = () => {
    const merchantId = useMerchantStore((state) => state.merchantId)
    const { id } = useParams()

    const navigate = useNavigate()

    const { data, isLoading, mutate } = useSWR(
        [`/api/categories/${id}`, { id: id as string }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetCategory<{ getCategoryById: Category }, { id: string }>(
                params,
            ),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

    const [isSubmiting, setIsSubmiting] = useState(false)

    const getDefaultValues = () => {
        if (data) {
            const { name, description, menus } = data.getCategoryById

            return {
                name,
                description,
                menus,
            }
        }

        return {}
    }

    // const handleFormSubmit = async (values: CategoryFormSchema) => {
    //     console.log('Submitted values', values)
    //     setIsSubmiting(true)
    //     const variables = {
    //         data: {
    //             ...values,
    //             // merchantId: '67efb6b174a576558e0aae82',
    //             merchantId,
    //         },
    //         updateCategoryId: id,
    //     }

    //     const data = await graphqlRequest<
    //         { updateOutlet: Category },
    //         typeof variables
    //     >(UPDATE_CATEGORY_STRING, variables)

    //     console.log('data', data)

    //     await mutate()

    //     // await sleep(800)
    //     setIsSubmiting(false)
    //     toast.push(<Notification type="success">Changes Saved!</Notification>, {
    //         placement: 'top-center',
    //     })
    //     navigate('/foods/categories')
    // }
    const handleFormSubmit = async (values: CategoryFormSchema) => {
        console.log('Submitted values', values)
        setIsSubmiting(true)

        try {
            //check if id and merchantId are available
            if (!id) {
                throw new Error('Category ID is missing')
            }

            if (!merchantId) {
                throw new Error('Merchant ID is missing')
            }

            const data = await updateCategory(id as string, {
                ...values,
                merchantId,
            })

            console.log('data', data)

            await mutate()

            toast.push(
                <Notification type="success">Changes Saved!</Notification>,
                { placement: 'top-center' },
            )

            navigate('/foods/categories')
        } catch (error) {
            console.error('Update failed:', error)

            toast.push(
                <Notification type="danger">
                    Failed to save changes
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmiting(false)
        }
    }

    const handleDelete = () => {
        setDeleteConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleBack = () => {
        navigate('/foods/categories')
    }

    // const handleConfirmDelete = () => {
    //     setDeleteConfirmationOpen(true)
    //     toast.push(
    //         <Notification type="success">Category deleted!</Notification>,
    //         { placement: 'top-center' },
    //     )
    //     navigate('/foods/categories')
    // }
    const handleConfirmDelete = async () => {
        try {
            setDeleteConfirmationOpen(false)

            if (!id) {
                throw new Error('Category ID is missing')
            }

            const deleted = await deleteCategory(id as string)
            console.log('Deleted:', deleted)

            toast.push(
                <Notification type="success">Category deleted!</Notification>,
                { placement: 'top-center' },
            )

            navigate('/foods/categories')
        } catch (error) {
            console.error('Delete failed:', error)
            toast.push(
                <Notification type="danger">
                    Failed to delete category
                </Notification>,
                { placement: 'top-center' },
            )
        }
    }

    return (
        <>
            {!isLoading && !data && (
                <div className="h-full flex flex-col items-center justify-center">
                    <NoProductFound height={280} width={280} />
                    <h3 className="mt-8">No product found!</h3>
                </div>
            )}
            {!isLoading && data && (
                <>
                    <CategoryForm
                        defaultValues={getDefaultValues() as CategoryFormSchema}
                        newCategory={false}
                        onFormSubmit={handleFormSubmit}
                    >
                        <Container>
                            <div className="flex items-center justify-between px-8">
                                <Button
                                    className="ltr:mr-3 rtl:ml-3"
                                    type="button"
                                    variant="plain"
                                    icon={<TbArrowNarrowLeft />}
                                    onClick={handleBack}
                                >
                                    Back
                                </Button>
                                <div className="flex items-center">
                                    <Button
                                        className="ltr:mr-3 rtl:ml-3"
                                        type="button"
                                        customColorClass={() =>
                                            'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                        }
                                        icon={<TbTrash />}
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="solid"
                                        type="submit"
                                        loading={isSubmiting}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </Container>
                    </CategoryForm>
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
                            Are you sure you want to remove this Category? This
                            action can&apos;t be undo.{' '}
                        </p>
                    </ConfirmDialog>
                </>
            )}
        </>
    )
}

export default CategoryEdit
