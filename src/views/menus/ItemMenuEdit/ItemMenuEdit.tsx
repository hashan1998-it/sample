import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import NoProductFound from '@/assets/svg/NoProductFound'
import { apiGetItemMenu, updateItemMenu } from '@/services/ItemMenuService'
import sleep from '@/utils/sleep'
import { TbArrowNarrowLeft } from 'react-icons/tb'
import { useParams, useNavigate } from 'react-router-dom'
import useSWR, { mutate } from 'swr'
import ProductForm from '../ItemForm'
import { ItemFormSchema, ItemMenu } from '../ItemForm/types'

const ItemMenuEdit = () => {
    const { id, menuid } = useParams()

    const navigate = useNavigate()

    const { data, isLoading } = useSWR(
        [`/api/itemMenu/${id}`, { id: id as string }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetItemMenu<
                { getItemMenusByItemAndMenu: ItemMenu },
                { menuId: string; itemId: string }
            >({
                menuId: menuid as string,
                itemId: id as string,
            }),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

    const [isSubmiting, setIsSubmiting] = useState(false)

    const getDefaultValues = () => {
        if (data) {
            const { id, price, addOns, options } =
                data.getItemMenusByItemAndMenu

            return {
                id,
                price,
                addOns,
                options,
            }
        }
    }
    // const getDefaultValues = () => {
    //     const itemMenu = data?.getItemMenusByItemAndMenu

    //     if (itemMenu) {
    //         const { id, price, addOns, options } = itemMenu

    //         return {
    //             itemMenuId: id,
    //             price: price ?? '',
    //             addOns: addOns ?? [],
    //             options: options ?? [],
    //         }
    //     }

    //     // Fallback defaults if itemMenu is not found
    //     return {
    //         itemMenuId: id,
    //         price: '',
    //         addOns: [
    //             {
    //                 label: '',
    //                 price: 0,
    //             },
    //         ],
    //         options: [
    //             {
    //                 label: '',
    //                 price: 0,
    //             },
    //         ],
    //     }
    // }

    // const handleFormSubmit = async (values: ItemFormSchema) => {
    //     console.log('Submitted values', values)
    //     setIsSubmiting(true)
    //     const variables = {
    //         data: {
    //             addOn.,
    //             menu: menuid,
    //             item: id,
    //         },
    //     }

    //     const response = await graphqlRequest(
    //         UPDATE_ITEM_MENU_STRING,
    //         variables,
    //     )
    //     console.log('Response from create item menu:', response)

    //     await sleep(800)
    //     setIsSubmiting(false)
    //     toast.push(<Notification type="success">Changes Saved!</Notification>, {
    //         placement: 'top-center',
    //     })
    //     navigate(`/menus/edit/${menuid}`)
    // }

    // const handleDelete = () => {
    //     setDeleteConfirmationOpen(true)
    // }

    // const handleFormSubmit = async (values: ItemFormSchema) => {
    //     console.log('Submitted values', values)
    //     setIsSubmiting(true)

    //     const formattedAddOns = (values.addOns ?? []).map((addOn) => ({
    //         ...addOn,
    //         price: Number(addOn.price),
    //     }))

    //     const formattedOptions = (values.options ?? []).map((option) => ({
    //         ...option,
    //         price: Number(option.price),
    //     }))

    //     const variables = {
    //         menuId: menuid,
    //         itemId: id,

    //         data: {
    //             addOns: formattedAddOns,
    //             options: formattedOptions,
    //             menu: menuid,
    //             item: id,
    //             price: Number(values.price), // if you're updating price too
    //         },
    //     }

    //     const response = await graphqlRequest(
    //         UPDATE_ITEM_MENU_BY_MENU_AND_ITEM,
    //         variables,
    //     )

    //     console.log('Response from update item menu:', response)

    //     mutate([`/api/itemMenu/${id}`, { id: id as string }])

    //     await sleep(800)
    //     setIsSubmiting(false)

    //     toast.push(<Notification type="success">Changes Saved!</Notification>, {
    //         placement: 'top-center',
    //     })

    //     navigate(`/menus/edit/${menuid}`)
    // }

    const handleFormSubmit = async (values: ItemFormSchema) => {
        if (!id || !menuid) {
            toast.push(
                <Notification type="danger">
                    Missing menu or item ID. Cannot save changes.
                </Notification>,
                { placement: 'top-center' },
            )
            return
        }
        try {
            console.log('Submitted values', values)
            setIsSubmiting(true)

            const response = await updateItemMenu(id, menuid, values)

            console.log('Response from update item menu:', response)

            mutate([`/api/itemMenu/${id}`, { id }])

            toast.push(
                <Notification type="success">Changes Saved!</Notification>,
                {
                    placement: 'top-center',
                },
            )

            await sleep(800)
            navigate(`/menus/edit/${menuid}`)
        } catch (error) {
            console.error('Error updating item menu:', error)
            toast.push(
                <Notification type="danger">
                    Failed to save changes. Try again.
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmiting(false)
        }
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleBack = () => {
        navigate(`/menus/edit/${menuid}`)
    }

    // const handleConfirmDelete = () => {
    //     setDeleteConfirmationOpen(true)
    //     toast.push(
    //         <Notification type="success">Product deleted!</Notification>,
    //         { placement: 'top-center' },
    //     )
    //     navigate(`/menus/edit/${menuid}`)
    // }

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
                                    {/* <Button
                                        className="ltr:mr-3 rtl:ml-3"
                                        type="button"
                                        customColorClass={() =>
                                            'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                        }
                                        icon={<TbTrash />}
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </Button> */}
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
                        title="Remove product"
                        onClose={handleCancel}
                        onRequestClose={handleCancel}
                        onCancel={handleCancel}
                        // onConfirm={handleConfirmDelete}
                    >
                        <p>
                            Are you sure you want to remove this product? This
                            action can&apos;t be undo.{' '}
                        </p>
                    </ConfirmDialog>
                </>
            )}
        </>
    )
}

export default ItemMenuEdit
