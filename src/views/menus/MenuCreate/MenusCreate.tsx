import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ProductForm from '../MenuForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { TbTrash } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import type { MenuFormSchema } from '../MenuForm/types'
import useMerchantStore from '@/store/useMerchantStore'
import { createMenu } from '@/services/MenuService'
import { mutate } from 'swr'

const MenuCreate = () => {
    const merchantId = useMerchantStore((state) => state.merchantId)
    const navigate = useNavigate()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    // const handleFormSubmit = async (values: MenuFormSchema) => {
    //     console.log('Submitted values', values)
    //     setIsSubmiting(true)

    //     const variables = {
    //         data: {
    //             ...values,
    //             // merchantId: '67efb6b174a576558e0aae82',
    //             merchantId,
    //         },
    //     }

    //     const data = await graphqlRequest<
    //         { createMenu: Menu },
    //         typeof variables
    //     >(CREATE_MENU_STRING, variables)

    //     console.log('data', data)

    //     await sleep(800)
    //     setIsSubmiting(false)
    //     toast.push(<Notification type="success">Menu created!</Notification>, {
    //         placement: 'top-center',
    //     })
    //     navigate('/menus')
    // }

    const handleFormSubmit = async (values: MenuFormSchema) => {
        try {
            console.log('Submitted values', values)
            setIsSubmiting(true)

            if (!merchantId) {
                throw new Error('Merchant ID is missing')
            }

            const newMenu = await createMenu(values, merchantId)
            console.log('Created menu', newMenu)

            toast.push(
                <Notification type="success">Menu created!</Notification>,
                {
                    placement: 'top-center',
                },
            )

            await mutate('/api/menus')

            navigate('/menus')
        } catch (error) {
            console.error('Menu creation failed:', error)
            toast.push(
                <Notification type="danger">
                    Failed to create menu. Please try again.
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmiting(false)
        }
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(true)
        toast.push(
            <Notification type="success">Menu discarded!</Notification>,
            {
                placement: 'top-center',
            },
        )
        navigate('/menus')
    }

    const handleDiscard = () => {
        setDiscardConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDiscardConfirmationOpen(false)
    }

    return (
        <>
            <ProductForm
                newMenu
                defaultValues={{
                    name: '',
                    description: '',
                    // categories: [],
                    // items: [],
                    outletId: '',
                }}
                menuId={''}
                onFormSubmit={handleFormSubmit}
            >
                <Container>
                    <div className="flex items-center justify-between px-8">
                        <span></span>
                        <div className="flex items-center">
                            <Button
                                className="ltr:mr-3 rtl:ml-3"
                                type="button"
                                customColorClass={() =>
                                    'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                }
                                icon={<TbTrash />}
                                onClick={handleDiscard}
                            >
                                Discard
                            </Button>
                            <Button
                                variant="solid"
                                type="submit"
                                loading={isSubmiting}
                            >
                                Create
                            </Button>
                        </div>
                    </div>
                </Container>
            </ProductForm>
            <ConfirmDialog
                isOpen={discardConfirmationOpen}
                type="danger"
                title="Discard changes"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDiscard}
            >
                <p>
                    Are you sure you want discard this? This action can&apos;t
                    be undo.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default MenuCreate
