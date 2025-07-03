import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import ProductForm from '../OutletForm'
import NoProductFound from '@/assets/svg/NoProductFound'
import {
    apiGetOutlet,
    deleteOutlet,
    updateOutlet,
} from '@/services/OutletService'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import { useParams, useNavigate } from 'react-router-dom'
import useSWR, { mutate } from 'swr'
import type { OutletFormSchema } from '../OutletForm/types'
import { Outlet } from '../OutletList/types'
import useMerchantStore from '@/store/useMerchantStore'

const OutletEdit = () => {
    const merchantId = useMerchantStore((state) => state.merchantId)
    const { id } = useParams()

    const navigate = useNavigate()

    const { data, isLoading } = useSWR(
        [`/api/outlet/${id}`, { id: id as string }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetOutlet<{ getOutletById: Outlet }, { id: string }>(params),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    console.log('outlet', data)
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

    const [isSubmiting, setIsSubmiting] = useState(false)

    const getDefaultValues = () => {
        if (data?.getOutletById) {
            const {
                name,
                description,
                // website,
                // restaurant,
                address: {
                    addressLine1,
                    addressLine2,
                    city,
                    state,
                    postal,
                    country,
                },
                contact: { countryCode, mobileNumber },
            } = data.getOutletById

            return {
                name,
                description,
                // website,
                // restaurant,
                address: {
                    addressLine1,
                    addressLine2,
                    city,
                    state,
                    postal,
                    country,
                },
                contact: {
                    countryCode,
                    mobileNumber,
                },
            }
        }

        return {}
    }

    // const handleFormSubmit = async (values: OutletFormSchema) => {
    //     console.log('Submitted values', values)
    //     setIsSubmiting(true)

    //     const variables = {
    //         data: {
    //             ...values,
    //             // merchantId: '67efb6b174a576558e0aae82',
    //             merchantId,
    //         },
    //         updateOutletId: id,
    //     }

    //     const data = await graphqlRequest<
    //         { updateOutlet: Outlet },
    //         typeof variables
    //     >(UPDATE_OUTLET_STRING, variables)

    //     console.log('data', data)
    //     mutate([`/api/outlet/${id}`, { id: id as string }])
    //     await sleep(800)

    //     setIsSubmiting(false)

    //     toast.push(<Notification type="success">Changes Saved!</Notification>, {
    //         placement: 'top-center',
    //     })

    //     navigate('/outlets')
    // }
    const handleFormSubmit = async (values: OutletFormSchema) => {
        console.log('Submitted values', values)
        setIsSubmiting(true)

        try {
            if (!merchantId) {
                throw new Error('Merchant ID is not available')
            }

            const data = await updateOutlet(id as string, {
                ...values,
                merchantId,
            })

            console.log('data', data)

            await mutate([`/api/outlet/${id}`, { id }])

            toast.push(
                <Notification type="success">Changes Saved!</Notification>,
                { placement: 'top-center' },
            )

            navigate('/outlets')
        } catch (error) {
            console.error('Failed to update outlet:', error)
            toast.push(
                <Notification type="danger">
                    Failed to save changes.
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
        navigate('/outlets')
    }

    // const handleConfirmDelete = () => {
    //     setDeleteConfirmationOpen(true)
    //     toast.push(
    //         <Notification type="success">Product deleted!</Notification>,
    //         { placement: 'top-center' },
    //     )
    //     navigate('/outlets')
    // }
    const handleConfirmDelete = async () => {
        try {
            setDeleteConfirmationOpen(false)

            if (!id) {
                throw new Error('Outlet ID is missing')
            }

            const deleted = await deleteOutlet(id as string)
            console.log('Deleted:', deleted)

            toast.push(
                <Notification type="success">Outlet deleted!</Notification>,
                { placement: 'top-center' },
            )

            navigate('/outlets')
        } catch (error) {
            console.error('Delete failed:', error)
            toast.push(
                <Notification type="danger">
                    Failed to delete outlet.
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
                        //check this place later
                        defaultValues={
                            getDefaultValues() as unknown as OutletFormSchema
                        }
                        newCustomer={false}
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
                        title="Remove Outlet"
                        onClose={handleCancel}
                        onRequestClose={handleCancel}
                        onCancel={handleCancel}
                        onConfirm={handleConfirmDelete}
                    >
                        <p>
                            Are you sure you want to remove this Outlet? This
                            action can&apos;t be undo.{' '}
                        </p>
                    </ConfirmDialog>
                </>
            )}
        </>
    )
}

export default OutletEdit
