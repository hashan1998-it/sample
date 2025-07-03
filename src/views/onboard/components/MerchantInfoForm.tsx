// components/MerchantInfoForm.tsx
import React, { useState } from 'react'
import Button from '@/components/ui/Button'
import FormItem from '@/components/ui/Form/FormItem'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { useFormValidation } from '../../../utils/hooks/useFormValidation'
import { merchantInfoValidation } from '../../../utils/validationRules'
import { OnboardingService } from '@/services/OnboardingService'
import type {
    MerchantInfoFormProps,
    MerchantInfo,
    SelectOption,
} from '../../../@types/onboarding'

// Country codes for phone number prefix
const countryCodes: SelectOption[] = [
    { value: '+94', label: '🇱🇰 +94' },
    { value: '+65', label: '🇸🇬 +65' },
    { value: '+91', label: '🇮🇳 +91' },
    { value: '+60', label: '🇲🇾 +60' },
    { value: '+66', label: '🇹🇭 +66' },
    { value: '+63', label: '🇵🇭 +63' },
    { value: '+62', label: '🇮🇩 +62' },
    { value: '+84', label: '🇻🇳 +84' },
]

export const MerchantInfoForm: React.FC<MerchantInfoFormProps> = ({
    data = {},
    onNext,
    onBack,
}) => {
    const [loading, setLoading] = useState<boolean>(false)

    const {
        formData,
        errors,
        handleInputChange,
        handleSelectChange,
        handleBlur,
        validate,
    } = useFormValidation<MerchantInfo & Record<string, unknown>>(
        {
            name: data.name || '',
            description: data.description || '',
            website: data.website || '',
            countryCode: data.countryCode || '+94',
            contactNumber: data.contactNumber || '',
        },
        merchantInfoValidation,
    )

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '') // Remove non-digits
        
        // Limit to 10 digits
        if (value.length <= 10) {
            // Create new event with cleaned value
            const newEvent = {
                ...e,
                target: {
                    ...e.target,
                    value: value
                }
            }
            handleInputChange('contactNumber')(newEvent as React.ChangeEvent<HTMLInputElement>)
        }
    }

    const handleSubmit = async (): Promise<void> => {
        if (validate()) {
            setLoading(true)
            try {
                const result = await OnboardingService.apiValidateStep(
                    'merchant',
                    formData,
                )
                if (result.success) {
                    onNext(formData)
                } else {
                    console.error('Validation failed:', result.error)
                }
            } catch (error) {
                console.error('Validation error:', error)
                onNext(formData)
            } finally {
                setLoading(false)
            }
        }
    }

    const handleGoBack = (): void => {
        if (onBack) {
            onBack()
        }
    }

    return (
        <div className="flex flex-col h-full">
            {/* Form Content - Scrollable */}
            <div className="flex-1 space-y-3">
                <div className="mb-3">
                    <h2 className="text-base font-medium text-gray-800 mb-3">
                        Merchant Information
                    </h2>
                </div>

                <FormItem
                    asterisk
                    label="Name"
                    invalid={!!errors.name}
                    errorMessage={errors.name || ''}
                    className="mb-3"
                >
                    <Input
                        value={formData.name}
                        placeholder=""
                        invalid={!!errors.name}
                        size="sm"
                        className="w-full"
                        onChange={handleInputChange('name')}
                        onBlur={handleBlur('name')}
                    />
                </FormItem>

                <FormItem
                    label="Description"
                    invalid={!!errors.description}
                    errorMessage={errors.description || ''}
                    className="mb-3"
                >
                    <Input
                        textArea
                        rows={3}
                        value={formData.description}
                        placeholder=""
                        invalid={!!errors.description}
                        size="sm"
                        className="w-full resize-none"
                        onChange={handleInputChange('description')}
                        onBlur={handleBlur('description')}
                    />
                </FormItem>

                <FormItem
                    asterisk
                    label="Website"
                    invalid={!!errors.website}
                    errorMessage={errors.website || ''}
                    className="mb-3"
                >
                    <Input
                        type="url"
                        value={formData.website}
                        placeholder=""
                        invalid={!!errors.website}
                        size="sm"
                        className="w-full"
                        onChange={handleInputChange('website')}
                        onBlur={handleBlur('website')}
                    />
                </FormItem>

                <FormItem
                    asterisk
                    label="Contact number"
                    invalid={!!errors.contactNumber}
                    errorMessage={errors.contactNumber || ''}
                    extra={
                        <span className="text-xs text-red-500">
                            Maximum of 10 digits required
                        </span>
                    }
                    className="mb-4"
                >
                    <div className="flex gap-1">
                        <Select<SelectOption>
                            value={
                                countryCodes.find(
                                    (c) => c.value === formData.countryCode,
                                ) || countryCodes[0]
                            }
                            options={countryCodes}
                            size="sm"
                            className="w-20 flex-shrink-0"
                            onChange={(option) =>
                                handleSelectChange('countryCode')(option?.value || '+94')
                            }
                        />
                        <Input
                            type="tel"
                            value={formData.contactNumber}
                            placeholder=""
                            invalid={!!errors.contactNumber}
                            size="sm"
                            className="flex-1"
                            maxLength={10}
                            onChange={handlePhoneChange}
                            onBlur={handleBlur('contactNumber')}
                        />
                    </div>
                </FormItem>
            </div>

            {/* Fixed Action Buttons */}
            <div className="flex-shrink-0 pt-4 border-t border-gray-100">
                <div className="flex gap-3">
                    <Button
                        variant="default"
                        className="flex-1"
                        size="sm"
                        disabled={loading}
                        onClick={handleGoBack}
                    >
                        Go Back
                    </Button>
                    <Button
                        variant="solid"
                        className="flex-1 bg-black text-white hover:bg-gray-800"
                        size="sm"
                        loading={loading}
                        onClick={handleSubmit}
                    >
                        Next →
                    </Button>
                </div>
            </div>
        </div>
    )
}