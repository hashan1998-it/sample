import { useEffect, useState } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import OverviewSection from './OverviewSection'
import AddressSection from './AddressSection'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import type { MerchantFormSchema } from './types'

type CustomerFormProps = {
    onFormSubmit: (values: MerchantFormSchema) => void
    defaultValues?: MerchantFormSchema
    newCustomer?: boolean
} & CommonProps

const validationSchema: ZodType<MerchantFormSchema> = z.object({
    // OverviewFields
    name: z.string().min(1, { message: 'Name is required' }),
    description: z.string().min(1, { message: 'Description is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    dialCode: z.string().min(1, { message: 'Dial code is required' }),
    phoneNumber: z.string().min(1, { message: 'Phone number is required' }),

    // AddressFields
    country: z.string().min(1, { message: 'Country is required' }),
    postcode: z.string().min(1, { message: 'Postcode is required' }),
    city: z.string().min(1, { message: 'City is required' }),
    state: z.string().min(1, { message: 'State is required' }),
    addressLine1: z.string().min(1, { message: 'Address Line 1 is required' }),
    addressLine2: z.string().optional(),
})

const MerchantForm = (props: CustomerFormProps) => {
    const { onFormSubmit, defaultValues = {} } = props

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm<MerchantFormSchema>({
        defaultValues: {
            ...defaultValues,
        },
        resolver: zodResolver(validationSchema),
    })

    const [step, setStep] = useState(1)

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
    }, [defaultValues, reset])

    const onSubmit = (values: MerchantFormSchema) => {
        onFormSubmit?.(values)
    }

    const handleNext = () => {
        if (step < 3) setStep((prev) => prev + 1)
    }

    const handlePrevious = () => {
        if (step > 1) setStep((prev) => prev - 1)
    }

    return (
        <Form
            className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-white"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-xl mx-auto">
                <div className="flex justify-center mb-6">
                    {[1, 2].map((s) => (
                        <div
                            key={s}
                            className={`w-4 h-4 rounded-full mx-1 ${
                                step === s ? 'bg-green-600' : 'bg-green-300'
                            }`}
                        />
                    ))}
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Complete Merchant Profile
                    </h2>
                    <p className="text-sm text-gray-500 mt-2">
                        Step {step} of 2
                    </p>
                </div>

                <Container>
                    <div className="flex flex-col gap-4">
                        {step === 1 && (
                            <OverviewSection
                                control={control}
                                errors={errors}
                            />
                        )}
                        {step === 2 && (
                            <AddressSection control={control} errors={errors} />
                        )}
                    </div>
                </Container>

                <div className="flex justify-between mt-8">
                    <button
                        type="button"
                        disabled={step === 1}
                        className={`px-4 py-2 rounded-full border ${
                            step === 1
                                ? 'text-gray-300 border-gray-300'
                                : 'text-green-600 border-green-600 hover:bg-green-50'
                        }`}
                        onClick={handlePrevious}
                    >
                        Previous
                    </button>

                    {step < 3 ? (
                        <button
                            type="button"
                            className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700"
                            onClick={handleNext}
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700"
                        >
                            Submit
                        </button>
                    )}
                </div>
            </div>
        </Form>
    )
}

export default MerchantForm
