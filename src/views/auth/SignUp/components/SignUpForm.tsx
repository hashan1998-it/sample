import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import { useAuth } from '@/auth'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import PasswordStrengthIndicator from '@/components/shared/PasswordStrengthIndicator'
import { StepProgress } from '@/components/ui/Progress/StepProgress'
import PasswordInput from '@/components/shared/PasswordInput'

interface SignUpFormProps extends CommonProps {
    disableSubmit?: boolean
    setMessage?: (message: string) => void
}

type SignUpFormSchema = {
    firstName: string
    lastName: string
    phone: string
    password: string
    email: string
    confirmPassword: string
}

// Full validation schema
const validationSchema: ZodType<SignUpFormSchema> = z
    .object({
        email: z
            .string()
            .email({ message: 'Please enter a valid email address' }),
        firstName: z
            .string()
            .min(1, { message: 'Please enter your first name' }),
        lastName: z.string().min(1, { message: 'Please enter your last name' }),
        phone: z
            .string()
            .min(10, { message: 'Phone number must be at least 10 digits' })
            .max(15, { message: 'Phone number must be at most 15 digits' })
            .regex(/^\+?[0-9]{10,15}$/, {
                message: 'Invalid phone number format',
            }),
        password: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters long' })
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
                {
                    message:
                        'Password must contain uppercase, lowercase, number, and special character',
                },
            ),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })

const SignUpForm = (props: SignUpFormProps) => {
    const { disableSubmit = false, className, setMessage } = props

    const [currentStep, setCurrentStep] = useState<number>(1)
    const [isSubmitting, setSubmitting] = useState<boolean>(false)

    const { signUp } = useAuth()
    const totalSteps = 2

    const {
        handleSubmit,
        formState: { errors },
        control,
        trigger,
        watch,
    } = useForm<SignUpFormSchema>({
        resolver: zodResolver(validationSchema),
        mode: 'onChange',
    })

    // Watch password field for strength indicator
    const watchedPassword = watch('password', '')

    const onNextStep = async () => {
        let fieldsToValidate: (keyof SignUpFormSchema)[] = []

        if (currentStep === 1) {
            fieldsToValidate = ['firstName', 'lastName', 'email', 'phone']
        }

        const isStepValid = await trigger(fieldsToValidate)

        if (isStepValid) {
            setCurrentStep(currentStep + 1)
        }
    }

    const onPrevStep = () => {
        setCurrentStep(currentStep - 1)
    }

    const onSignUp = async (values: SignUpFormSchema) => {
        const { firstName, lastName, phone, password, email } = values

        if (!disableSubmit) {
            setSubmitting(true)
            const result = await signUp({
                firstName,
                lastName,
                phone,
                password,
                email,
            })

            if (result?.status === 'failed') {
                setMessage?.(result.message)
            }

            setSubmitting(false)
        }
        console.log('SignUp', values)
    }

    const renderStep1 = () => (
        <>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Personal Information
                </h2>
                <p className="text-gray-600">Tell us about yourself</p>
            </div>

            {/* First Row - Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <FormItem
                    label="First name"
                    invalid={Boolean(errors.firstName)}
                    errorMessage={errors.firstName?.message || ''}
                    className="mb-0"
                >
                    <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder="First Name"
                                autoComplete="given-name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Last name"
                    invalid={Boolean(errors.lastName)}
                    errorMessage={errors.lastName?.message || ''}
                    className="mb-0"
                >
                    <Controller
                        name="lastName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder="Last Name"
                                autoComplete="family-name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>

            {/* Second Row - Contact Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <FormItem
                    label="Email"
                    invalid={Boolean(errors.email)}
                    errorMessage={errors.email?.message || ''}
                    className="mb-0"
                >
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="email"
                                placeholder="Email"
                                autoComplete="email"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Phone"
                    invalid={Boolean(errors.phone)}
                    errorMessage={errors.phone?.message || ''}
                    className="mb-0"
                >
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="tel"
                                placeholder="Phone"
                                autoComplete="tel"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>

            <Button
                block
                variant="solid"
                type="button"
                className="mb-4"
                onClick={onNextStep}
            >
                Continue
            </Button>
        </>
    )

    const renderStep2 = () => (
        <>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Create Your Password
                </h2>
                <p className="text-gray-600">
                    Choose a strong password to secure your account
                </p>
            </div>

            {/* Password Fields */}
            <div className="space-y-4 mb-6">
                <FormItem
                    label="Password"
                    invalid={Boolean(errors.password)}
                    errorMessage={errors.password?.message || ''}
                    className="mb-0"
                >
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <>
                                <PasswordInput
                                    autoComplete="new-password"
                                    placeholder="Password"
                                    {...field}
                                />
                                <PasswordStrengthIndicator
                                    password={watchedPassword}
                                />
                            </>
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Confirm Password"
                    invalid={Boolean(errors.confirmPassword)}
                    errorMessage={errors.confirmPassword?.message || ''}
                    className="mb-0"
                >
                    <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field }) => (
                            <PasswordInput
                                autoComplete="new-password"
                                placeholder="Confirm Password"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>

            <div className="flex gap-3">
                <Button
                    variant="default"
                    type="button"
                    className="flex-1"
                    onClick={onPrevStep}
                >
                    Back
                </Button>

                <Button
                    block
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                    disabled={disableSubmit || isSubmitting}
                    className="flex-1"
                >
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </Button>
            </div>
        </>
    )

    return (
        <div className={className}>
            <StepProgress
                currentStep={currentStep}
                totalSteps={totalSteps}
                className="mb-8"
                activeColor="bg-blue-500"
                inactiveColor="bg-gray-200"
                strokeWidth={8}
            />

            <Form onSubmit={handleSubmit(onSignUp)}>
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
            </Form>
        </div>
    )
}

export default SignUpForm
