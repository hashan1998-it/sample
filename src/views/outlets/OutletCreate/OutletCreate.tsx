import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { TbTrash } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import type { OutletFormSchema } from '../OutletForm'
import OutletForm from '../OutletForm'
import { mutate } from 'swr'
import useMerchantStore from '@/store/useMerchantStore'
import { createOutlet } from '@/services/OutletService'

const OutletCreate = () => {
    const merchantId = useMerchantStore((state) => state.merchantId)
    const navigate = useNavigate()
    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    // const handleFormSubmit = async (values: OutletFormSchema) => {
    //     console.log('Submitted values', values)

    //     setIsSubmiting(true)

    //     const variables = {
    //         outlet: {
    //             ...values,
    //             // merchantId: '67efb6b174a576558e0aae82',
    //             merchantId,
    //         },
    //     }

    //     const data = await graphqlRequest<
    //         { createOutlet: Outlet },
    //         typeof variables
    //     >(CREATE_OUTLET_STRING, variables)

    //     console.log('data', data)

    //     await sleep(800)
    //     setIsSubmiting(false)
    //     toast.push(
    //         <Notification type="success">Outlet created!</Notification>,
    //         { placement: 'top-center' },
    //     )
    //     mutate('/api/outlets')
    //     navigate('/outlets')
    // }
    const handleFormSubmit = async (values: OutletFormSchema) => {
        console.log('Submitted values', values)

        setIsSubmiting(true)

        try {
            if (!merchantId) {
                throw new Error('Merchant ID is not available')
            }

            const data = await createOutlet({ ...values, merchantId })

            console.log('Created outlet:', data)

            toast.push(
                <Notification type="success">Outlet created!</Notification>,
                { placement: 'top-center' },
            )

            await mutate('/api/outlets')

            navigate('/outlets')
        } catch (error) {
            console.error('Create outlet failed:', error)
            toast.push(
                <Notification type="danger">
                    Failed to create outlet.
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
            <Notification type="success">Outlet discarded!</Notification>,
            { placement: 'top-center' },
        )
        navigate('/outlets')
    }

    const handleDiscard = () => {
        setDiscardConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDiscardConfirmationOpen(false)
    }

    return (
        <>
            <OutletForm
                newCustomer
                defaultValues={{
                    name: '',
                    description: '',
                    // email: '',
                    contact: {
                        mobileNumber: '0763127299',
                        countryCode: '+94',
                    },
                    address: {
                        country: 'LK',
                        addressLine1: '',
                        addressLine2: '',
                        state: '',
                        city: '',
                        postal: '',
                    },
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
            </OutletForm>
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

export default OutletCreate
