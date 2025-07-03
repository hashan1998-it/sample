import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import OverviewSection from './OverviewSection'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import type { UserFormSchema } from './types'

type UserFormProps = {
    onFormSubmit: (values: UserFormSchema) => void
    defaultValues?: UserFormSchema
    newCustomer?: boolean
} & CommonProps

const validationSchema: ZodType<UserFormSchema> = z.object({
    firstName: z.string().min(1, { message: 'First name required' }),
    lastName: z.string().min(1, { message: 'Last name required' }),
    email: z
        .string()
        .min(1, { message: 'Email required' })
        .email({ message: 'Invalid email' }),
    dialCode: z.string().min(1, { message: 'Please select your country code' }),
    phoneNumber: z
        .string()
        .min(1, { message: 'Please input your mobile number' }),
})

const UserForm = (props: UserFormProps) => {
    const {
        onFormSubmit,
        defaultValues = {},
        // newCustomer = false,
        // children,
    } = props

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm<UserFormSchema>({
        defaultValues: {
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

    const onSubmit = (values: UserFormSchema) => {
        onFormSubmit?.(values)
    }

    return (
        // <Form
        //     className="flex w-full h-full "
        //     containerClassName="flex flex-col w-full justify-between"
        //     onSubmit={handleSubmit(onSubmit)}
        // >
        //     <Container>
        //         <div className="flex flex-col md:flex-row gap-4">
        //             <div className="gap-4 flex flex-col flex-auto">
        //                 <OverviewSection control={control} errors={errors} />
        //             </div>
        //         </div>
        //     </Container>
        //     <BottomStickyBar>{children}</BottomStickyBar>
        // </Form>
        <Form
            className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-white"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-xl mx-auto">
                <div className="flex justify-center mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-green-600"></div>
                        <div className="w-4 h-1 bg-green-300 rounded-full"></div>
                        <div className="w-4 h-4 rounded-full bg-green-600"></div>
                        <div className="w-4 h-1 bg-green-300 rounded-full"></div>
                        <div className="w-4 h-4 rounded-full bg-green-300"></div>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Udine</h2>
                    <p className="text-sm text-gray-500 mt-2">
                        Lets get started with your profile..
                    </p>
                </div>

                <Container>
                    <div className="flex flex-col gap-4">
                        <div className="gap-4 flex flex-col flex-auto">
                            <OverviewSection
                                control={control}
                                errors={errors}
                            />
                        </div>
                    </div>
                </Container>

                <div className="flex justify-end pt-8">
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
                    >
                        Next step
                    </button>
                </div>
            </div>
        </Form>
    )
}

export default UserForm
