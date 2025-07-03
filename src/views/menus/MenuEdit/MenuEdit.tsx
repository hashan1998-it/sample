import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import ProductForm from '../MenuForm'
import NoProductFound from '@/assets/svg/NoProductFound'
import { apiGetMenu, deleteMenuById, updateMenu } from '@/services/MenuService'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import { useParams, useNavigate } from 'react-router-dom'
import useSWR, { mutate } from 'swr'
import type { Menu, MenuFormSchema } from '../MenuForm/types'
import useMerchantStore from '@/store/useMerchantStore'

const MenuEdit = () => {
    const merchantId = useMerchantStore((state) => state.merchantId)
    const { id } = useParams()

    const navigate = useNavigate()

    const { data, isLoading } = useSWR(
        [`/api/menus/${id}`, { id: id as string }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetMenu<{ getMenuById: Menu }, { id: string }>(params),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )
    console.log('menu', data)
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

    const [isSubmiting, setIsSubmiting] = useState(false)

    const getDefaultValues = () => {
        if (data) {
            const { id, name, description, outletId } = data.getMenuById

            return {
                id,
                name,
                description,
                outletId,
            }
        }

        return {}
    }

    // const handleFormSubmit = async (values: MenuFormSchema) => {
    //     console.log('Submitted values', values)
    //     setIsSubmiting(true)

    //     const variables = {
    //         data: {
    //             ...values,
    //             // merchantId: '67efb6b174a576558e0aae82',
    //             merchantId,
    //         },
    //         updateMenuId: id,
    //     }

    //     const data = await graphqlRequest<
    //         { updateMenu: Menu },
    //         typeof variables
    //     >(UPDATE_MENU_STRING, variables)

    //     console.log('data', data)
    //     mutate([`/api/menus/${id}`, { id: id as string }])
    //     await sleep(800)
    //     setIsSubmiting(false)
    //     toast.push(<Notification type="success">Changes Saved!</Notification>, {
    //         placement: 'top-center',
    //     })
    //     navigate('/menus')
    // }

    const handleFormSubmit = async (values: MenuFormSchema) => {
        try {
            console.log('Submitted values', values)
            setIsSubmiting(true)

            if (!merchantId) {
                throw new Error('Merchant ID is not available')
            }

            const updatedMenu = await updateMenu(
                id as string,
                values,
                merchantId,
            )
            console.log('Updated menu:', updatedMenu)

            mutate([`/api/menus/${id}`, { id: id as string }])

            toast.push(
                <Notification type="success">Changes Saved!</Notification>,
                {
                    placement: 'top-center',
                },
            )

            navigate('/menus')
        } catch (error) {
            console.error('Failed to update menu:', error)
            toast.push(
                <Notification type="danger">
                    Failed to save changes. Please try again.
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
        navigate('/menus')
    }

    // const handleConfirmDelete = () => {
    //     setDeleteConfirmationOpen(true)
    //     toast.push(
    //         <Notification type="success">Product deleted!</Notification>,
    //         { placement: 'top-center' },
    //     )
    //     navigate('/menus')
    // }

    const handleConfirmDelete = async () => {
        try {
            setDeleteConfirmationOpen(true)

            if (!id) {
                throw new Error('No menu selected for deletion.')
            }

            const deletedMenu = await deleteMenuById(id)
            console.log('Deleted menu:', deletedMenu)

            toast.push(
                <Notification type="success">Menu deleted!</Notification>,
                { placement: 'top-center' },
            )

            navigate('/menus')
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
                    {' '}
                    <ProductForm
                        defaultValues={getDefaultValues() as Menu}
                        newMenu={false}
                        menuId={id as string}
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
                        title="Remove product"
                        onClose={handleCancel}
                        onRequestClose={handleCancel}
                        onCancel={handleCancel}
                        onConfirm={handleConfirmDelete}
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

export default MenuEdit
