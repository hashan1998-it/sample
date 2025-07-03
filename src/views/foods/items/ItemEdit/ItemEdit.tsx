import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import NoProductFound from '@/assets/svg/NoProductFound'
import { apiGetItem, deleteItem, updateItem } from '@/services/ItemService'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import { useParams, useNavigate } from 'react-router-dom'
import useSWR, { mutate } from 'swr'
import ProductForm from '../ItemForm'
import { ItemFormSchema, Item } from '../ItemForm/types'
import useMerchantStore from '@/store/useMerchantStore'

const ItemEdit = () => {
    const { id } = useParams()

    const navigate = useNavigate()

    const { data, isLoading } = useSWR(
        [`/api/item/${id}`, { id: id as string }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetItem<{ getItemById: Item }, { id: string }>(params),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

    const [isSubmiting, setIsSubmiting] = useState(false)

    const merchantId = useMerchantStore((state) => state.merchantId)
    const getDefaultValues = () => {
        if (data) {
            const {
                name,
                imgList,
                imageUrl,
                price,
                description,
                categoryId,
                // menu,
                addOns,
                options,
                isAvailable,
                isFeatured,
                isVegetarian,
            } = data.getItemById

            return {
                name,
                imgList,
                imageUrl,
                price,
                description,
                categoryId,
                // menu,
                addOns,
                options,
                isAvailable,
                isFeatured,
                isVegetarian,
            }
        }
    }

    // const handleFormSubmit = async (values: ItemFormSchema) => {
    //     console.log('Submitted values', values)
    //     setIsSubmiting(true)
    //     const variables = {
    //         data: {
    //             ...values,
    //             price: Number(String(values.price)),

    //             addOns: (values.addOns ?? []).map((addOn) => ({
    //                 label: addOn.label,
    //                 price: Number(values.price as string),
    //             })),
    //             options: (values.options ?? []).map((option) => ({
    //                 label: option.label,
    //                 price: Number(values.price as string),
    //             })),
    //             merchantId: '67efb6b174a576558e0aae82',
    //         },
    //         updateItemId: id,
    //     }

    //     const data = await graphqlRequest<
    //         { updateItem: Item },
    //         typeof variables
    //     >(UPDATE_ITEM_STRING, variables)

    //     console.log('data', data)
    //     await sleep(800)
    //     mutate([`/api/item/${id}`, { id: id as string }])
    //     setIsSubmiting(false)
    //     toast.push(<Notification type="success">Changes Saved!</Notification>, {
    //         placement: 'top-center',
    //     })
    //     navigate('/foods/items')
    // }

    const handleFormSubmit = async (values: ItemFormSchema) => {
        setIsSubmiting(true)
        try {
            const data = await updateItem(
                values,
                merchantId as string,
                id as string,
            )

            console.log('Updated item:', data)

            await mutate([`/api/item/${id}`, { id }])

            toast.push(
                <Notification type="success">Changes Saved!</Notification>,
                { placement: 'top-center' },
            )

            navigate('/foods/items')
        } catch (error) {
            console.error('Failed to update item:', error)
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
        navigate('/foods/items')
    }

    // const handleConfirmDelete = () => {
    //     setDeleteConfirmationOpen(true)
    //     toast.push(<Notification type="success"> Item deleted!</Notification>, {
    //         placement: 'top-center',
    //     })
    //     navigate('/foods/items')
    // }

    const handleConfirmDelete = async () => {
        try {
            await deleteItem(id as string)

            setDeleteConfirmationOpen(false)

            toast.push(
                <Notification type="success">Item deleted!</Notification>,
                { placement: 'top-center' },
            )
            await mutate([`/api/item/${id}`, { id }])

            navigate('/foods/items')
        } catch (error) {
            console.error('Delete failed:', error)

            toast.push(
                <Notification type="danger">
                    Failed to delete item.
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
                    <ProductForm
                        defaultValues={getDefaultValues()}
                        newProduct={false}
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
                    </ProductForm>
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
                            Are you sure you want to remove this Item? This
                            action can&apos;t be undo.{' '}
                        </p>
                    </ConfirmDialog>
                </>
            )}
        </>
    )
}

export default ItemEdit
