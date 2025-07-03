import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ProductForm from '../CategoryForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { TbTrash } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import type { CategoryFormSchema } from '../CategoryForm/types'
import { mutate } from 'swr'
import useMerchantStore from '@/store/useMerchantStore'
import { createCategory } from '@/services/CategoryService'

const CategoryCreate = () => {
    const merchantId = useMerchantStore((state) => state.merchantId)

    const navigate = useNavigate()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)

    const [isSubmiting, setIsSubmiting] = useState(false)

    // const handleFormSubmit = async (values: CategoryFormSchema) => {
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
    //         { createCategory: Category },
    //         typeof variables
    //     >(CREATE_CATEGORY_STRING, variables)

    //     console.log('data', data)

    //     await mutate('/api/categories')
    //     // await sleep(800)
    //     setIsSubmiting(false)
    //     toast.push(
    //         <Notification type="success">Category created!</Notification>,
    //         { placement: 'top-center' },
    //     )
    //     navigate('/foods/categories')
    // }

    const handleFormSubmit = async (values: CategoryFormSchema) => {
        console.log('Submitted values', values)

        if (!merchantId) {
            toast.push(
                <Notification type="danger">
                    Merchant ID is missing. Cannot create category.
                </Notification>,
                { placement: 'top-center' },
            )
            return
        }

        setIsSubmiting(true)

        try {
            const data = await createCategory({
                ...values,
                merchantId,
            })

            console.log('data', data)

            await mutate('/api/categories')

            toast.push(
                <Notification type="success">Category created!</Notification>,
                { placement: 'top-center' },
            )

            navigate('/foods/categories')
        } catch (error) {
            console.error('Error creating category:', error)
            toast.push(
                <Notification type="danger">
                    Failed to create category
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
            <Notification type="success">Category discarded!</Notification>,
            { placement: 'top-center' },
        )
        navigate('/foods/categories')
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
                newCategory
                defaultValues={{
                    name: '',
                    description: '',
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

export default CategoryCreate
