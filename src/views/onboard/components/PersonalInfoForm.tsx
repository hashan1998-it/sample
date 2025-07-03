// components/PersonalInfoForm.tsx
import React from 'react'
import Button from '@/components/ui/Button'
import FormItem from '@/components/ui/Form/FormItem'
import Input from '@/components/ui/Input'
import { useFormValidation } from '../../../utils/hooks/useFormValidation'
import { personalInfoValidation } from '../../../utils/validationRules'
import type {
    PersonalInfoFormProps,
    PersonalInfo,
} from '../../../@types/onboarding'

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
    data = {},
    onNext,
    onCancel,
}) => {
    const { formData, errors, handleInputChange, handleBlur, validate } =
        useFormValidation<PersonalInfo & Record<string, unknown>>(
            {
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                email: data.email || '',
            },
            personalInfoValidation,
        )

    const handleSubmit = (): void => {
        if (validate()) {
            onNext(formData)
        }
    }

    const handleCancel = (): void => {
        if (onCancel) {
            onCancel()
        }
    }

    return (
        <div>
            <div className="mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-medium text-gray-800 mb-3 sm:mb-4">
                    User Information
                </h2>

                <FormItem
                    asterisk
                    label="First Name"
                    invalid={!!errors.firstName}
                    errorMessage={errors.firstName || ''}
                    className="mb-3 sm:mb-4"
                >
                    <Input
                        value={formData.firstName}
                        placeholder=""
                        invalid={!!errors.firstName}
                        size="sm"
                        className="w-full"
                        onChange={handleInputChange('firstName')}
                        onBlur={handleBlur('firstName')}
                    />
                </FormItem>

                <FormItem
                    asterisk
                    label="Last Name"
                    invalid={!!errors.lastName}
                    errorMessage={errors.lastName || ''}
                    className="mb-3 sm:mb-4"
                >
                    <Input
                        value={formData.lastName}
                        placeholder=""
                        invalid={!!errors.lastName}
                        size="sm"
                        className="w-full"
                        onChange={handleInputChange('lastName')}
                        onBlur={handleBlur('lastName')}
                    />
                </FormItem>

                <FormItem
                    asterisk
                    label="Email Address"
                    invalid={!!errors.email}
                    errorMessage={errors.email || ''}
                    className="mb-4 sm:mb-6"
                >
                    <Input
                        type="email"
                        value={formData.email}
                        placeholder=""
                        invalid={!!errors.email}
                        size="sm"
                        className="w-full"
                        onChange={handleInputChange('email')}
                        onBlur={handleBlur('email')}
                    />
                </FormItem>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                    variant="default"
                    className="w-full flex-1 order-2 sm:order-1"
                    size="sm"
                    onClick={handleCancel}
                >
                    Cancel
                </Button>
                <Button
                    variant="solid"
                    className="w-full flex-1 bg-black text-white hover:bg-gray-800 order-1 sm:order-2"
                    size="sm"
                    onClick={handleSubmit}
                >
                    Next →
                </Button>
            </div>
        </div>
    )
}
