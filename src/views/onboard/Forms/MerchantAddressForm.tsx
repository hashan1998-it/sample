// components/MerchantAddressForm.tsx
import React, { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import FormItem from '@/components/ui/Form/FormItem'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { useFormValidation } from '../../../utils/hooks/useFormValidation'
import { merchantAddressValidation } from '../../../utils/validations/onboardValidationRules'
import { OnboardingService } from '@/services/OnboardingService'
import type {
    MerchantAddressFormProps,
    MerchantAddress,
    SelectOption,
} from '../../../@types/onboarding'

export const MerchantAddressForm: React.FC<MerchantAddressFormProps> = ({
    data = {},
    onNext,
    onBack,
}) => {
    const [countries, setCountries] = useState<SelectOption[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const {
        formData,
        errors,
        handleInputChange,
        handleSelectChange,
        handleBlur,
        validate,
    } = useFormValidation<MerchantAddress & Record<string, unknown>>(
        {
            country: data.country || 'Sri Lanka',
            website: data.website || '',
            city: data.city || '',
            postalCode: data.postalCode || '',
            addressLine1: data.addressLine1 || '',
            addressLine2: data.addressLine2 || '',
        },
        merchantAddressValidation,
    )

    useEffect(() => {
        const loadCountries = async (): Promise<void> => {
            const result = await OnboardingService.apiGetCountries()
            if (result.success && result.data) {
                setCountries(result.data)
            }
        }
        loadCountries()
    }, [])

    const handleSubmit = async (): Promise<void> => {
        if (validate()) {
            setLoading(true)
            try {
                const result = await OnboardingService.apiValidateStep(
                    'merchant-address',
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

    const handleCancel = (): void => {
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
                    label="Country"
                    invalid={!!errors.country}
                    errorMessage={errors.country || ''}
                    className="mb-3"
                >
                    <Select<SelectOption>
                        value={
                            countries.find(
                                (c) => c.value === formData.country,
                            ) || null
                        }
                        placeholder="Select Country"
                        options={countries}
                        size="sm"
                        className="w-full"
                        onChange={(option) =>
                            handleSelectChange('country')(option?.value || '')
                        }
                    />
                </FormItem>

                <FormItem
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

                <div className="grid grid-cols-2 gap-3 mb-3">
                    <FormItem
                        asterisk
                        label="City"
                        invalid={!!errors.city}
                        errorMessage={errors.city || ''}
                    >
                        <Input
                            value={formData.city}
                            placeholder=""
                            invalid={!!errors.city}
                            size="sm"
                            className="w-full"
                            onChange={handleInputChange('city')}
                            onBlur={handleBlur('city')}
                        />
                    </FormItem>

                    <FormItem
                        asterisk
                        label="Postal/ZIP Code"
                        invalid={!!errors.postalCode}
                        errorMessage={errors.postalCode || ''}
                    >
                        <Input
                            value={formData.postalCode}
                            placeholder=""
                            invalid={!!errors.postalCode}
                            size="sm"
                            className="w-full"
                            onChange={handleInputChange('postalCode')}
                            onBlur={handleBlur('postalCode')}
                        />
                    </FormItem>
                </div>

                <FormItem
                    asterisk
                    label="Address Line 1"
                    invalid={!!errors.addressLine1}
                    errorMessage={errors.addressLine1 || ''}
                    className="mb-3"
                >
                    <Input
                        value={formData.addressLine1}
                        placeholder=""
                        invalid={!!errors.addressLine1}
                        size="sm"
                        className="w-full"
                        onChange={handleInputChange('addressLine1')}
                        onBlur={handleBlur('addressLine1')}
                    />
                </FormItem>

                <FormItem
                    label="Address Line 2"
                    invalid={!!errors.addressLine2}
                    errorMessage={errors.addressLine2 || ''}
                    className="mb-4"
                >
                    <Input
                        value={formData.addressLine2}
                        placeholder=""
                        invalid={!!errors.addressLine2}
                        size="sm"
                        className="w-full"
                        onChange={handleInputChange('addressLine2')}
                        onBlur={handleBlur('addressLine2')}
                    />
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
                        onClick={handleCancel}
                    >
                        Go back
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
