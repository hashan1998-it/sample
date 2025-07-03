import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import AddressSection from './AddressSection'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import type { OutletFormSchema } from './types'

type OutletFormProps = {
    onFormSubmit: (values: OutletFormSchema) => void
    defaultValues?: OutletFormSchema
    newCustomer?: boolean
} & CommonProps

const validationSchema: ZodType<OutletFormSchema> = z.object({
    name: z.string().min(1, { message: 'Outlet Name is required' }),
    description: z.string().optional(),
    // email: z
    //     .string()
    //     .min(1, { message: 'Email required' })
    //     .email({ message: 'Invalid email' }),
    contact: z.object({
        countryCode: z.string().min(1, { message: 'Country Code is required' }),
        mobileNumber: z
            .string()
            .min(1, { message: 'Mobile Number is required' }),
    }),
    address: z.object({
        country: z.string().min(1, { message: 'Country is required' }),
        addressLine1: z.string().min(1, { message: 'Address is required' }),
        addressLine2: z.string().optional(),
        postal: z.string().min(1, { message: 'Postal Code is required' }),
        city: z.string().min(1, { message: 'City is required' }),
        state: z.string().min(1, { message: 'State is required' }),
    }),
})

const OutletForm = (props: OutletFormProps) => {
    const {
        onFormSubmit,
        defaultValues = {},
        // newCustomer = false,
        children,
    } = props

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm<OutletFormSchema>({
        defaultValues: {
            // ...{
            //     banAccount: false,
            //     accountVerified: true,
            // },
            ...defaultValues,
        },
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultValues)])

    const onSubmit = (values: OutletFormSchema) => {
        onFormSubmit?.(values)
    }

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <div className="flex  md:flex-row gap-4">
                    <div className="gap-4 flex flex-col flex-auto">
                        <OverviewSection control={control} errors={errors} />

                        <AddressSection control={control} errors={errors} />
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default OutletForm
