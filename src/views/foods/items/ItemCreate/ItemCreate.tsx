import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ItemForm from '../ItemForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { TbTrash } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import type { ItemFormSchema } from '../ItemForm/types'
import { createItem } from '@/services/ItemService'
import useMerchantStore from '@/store/useMerchantStore'
import { mutate } from 'swr'

const ItemCreate = () => {
    const navigate = useNavigate()

    const merchantId = useMerchantStore((state) => state.merchantId)

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)

    const [isSubmiting, setIsSubmiting] = useState(false)

    // const handleFormSubmit = async (values: ItemFormSchema) => {
    //     console.log('Submitted values', values)
    //     const imageUrl = values.imgList?.[0]?.img || ''
    //     setIsSubmiting(true)
    //     const variables = {
    //         data: {
    //             ...values,
    //             addOns: (values.addOns ?? []).map((addOn) => ({
    //                 label: addOn.label,
    //                 price: Number((values.price as string).replace(/,/g, '')),
    //             })),
    //             options: (values.options ?? []).map((option) => ({
    //                 label: option.label,
    //                 price: Number((values.price as string).replace(/,/g, '')),
    //             })),
    //             price: Number((values.price as string).replace(/,/g, '')),

    //             imageUrl: imageUrl,

    //             merchantId: '67efb6b174a576558e0aae82',
    //             // categoryId: values.categoryId,
    //         },
    //     }

    //     const data = await graphqlRequest<
    //         { createItem: Item },
    //         typeof variables
    //     >(CREATE_ITEM_STRING, variables)

    //     console.log('data', data)
    //     await sleep(800)
    //     setIsSubmiting(false)
    //     toast.push(<Notification type="success">Item created!</Notification>, {
    //         placement: 'top-center',
    //     })
    //     navigate('/foods/items')
    // }
    const handleFormSubmit = async (values: ItemFormSchema) => {
        console.log('Submitted values', values)
        setIsSubmiting(true)

        try {
            if (!merchantId) {
                throw new Error('Merchant ID is not available')
            }

            const data = await createItem(values, merchantId)

            console.log('Created item:', data)

            toast.push(
                <Notification type="success">Item created!</Notification>,
                { placement: 'top-center' },
            )

            await mutate(['/api/items', { merchantId }])

            navigate('/foods/items')
        } catch (error) {
            console.error('Failed to create item:', error)
            toast.push(
                <Notification type="danger">
                    Failed to create item
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
            <Notification type="success">Item discarded!</Notification>,
            { placement: 'top-center' },
        )
        navigate('/foods/items')
    }

    const handleDiscard = () => {
        setDiscardConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDiscardConfirmationOpen(false)
    }

    return (
        <>
            <ItemForm
                newProduct
                defaultValues={{
                    name: '',
                    description: '',
                    price: 0,
                    imgList: [],
                    categoryId: '',
                    addOns: [],
                    options: [],
                    isAvailable: false,
                    isFeatured: false,
                    isVegetarian: false,
                }}
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
            </ItemForm>
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

export default ItemCreate
