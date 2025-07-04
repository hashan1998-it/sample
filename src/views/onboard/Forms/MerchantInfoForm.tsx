import React, { useState, useMemo } from 'react'
import Button from '@/components/ui/Button'
import FormItem from '@/components/ui/Form/FormItem'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { useFormValidation } from '../../../utils/hooks/useFormValidation'
import { merchantInfoValidation } from '../../../utils/validations/onboardValidationRules'
import { countryList } from '@/constants/countries.constant'
import type { MerchantInfoFormProps, SelectOption } from '@/@types/onboard'
import type { SingleValue } from 'react-select'

export const MerchantInfoForm: React.FC<MerchantInfoFormProps> = ({
    data = {},
    onNext,
    onBack,
}) => {
    const [loading, setLoading] = useState<boolean>(false)

    // Memoize country codes to prevent unnecessary re-renders
    const countryCodes: SelectOption[] = useMemo(
        () =>
            countryList.map((country) => ({
                value: country.dialCode,
                label: `${country.dialCode} ${country.value}`,
            })),
        [],
    )

    const {
        formData,
        errors,
        handleInputChange,
        handleSelectChange,
        handleBlur,
        validate,
    } = useFormValidation(
        {
            name: data.name || '',
            description: data.description || '',
            website: data.website || '',
            countryCode: data.countryCode || '+94',
            contactNumber: data.contactNumber || '',
        },
        merchantInfoValidation,
    )

    // Memoize selected country code to prevent unnecessary lookups
    const selectedCountryCode = useMemo(
        () =>
            countryCodes.find((c) => c.value === formData.countryCode) || null,
        [countryCodes, formData.countryCode],
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
                    value: value,
                },
            } as React.ChangeEvent<HTMLInputElement>

            handleInputChange('contactNumber')(newEvent)
        }
    }

    const handleCountryCodeChange = (option: SingleValue<SelectOption>) => {
        if (option?.value) {
            handleSelectChange('countryCode')(option.value)
        }
    }

    const handleSubmit = async (): Promise<void> => {
        if (!validate()) {
            return
        }

        setLoading(true)
        try {
            // Simple validation - just proceed for now
            await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
            onNext(formData)
        } catch (error) {
            console.error('Validation error:', error)
            onNext(formData)
        } finally {
            setLoading(false)
        }
    }

    const handleGoBack = (): void => {
        onBack?.()
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
                        placeholder="Enter merchant name"
                        invalid={!!errors.name}
                        size="sm"
                        className="w-full"
                        autoComplete="organization"
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
                        placeholder="Brief description of your business"
                        invalid={!!errors.description}
                        size="sm"
                        className="w-full resize-none"
                        maxLength={500}
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
                        placeholder="https://example.com"
                        invalid={!!errors.website}
                        size="sm"
                        className="w-full"
                        autoComplete="url"
                        onChange={handleInputChange('website')}
                        onBlur={handleBlur('website')}
                    />
                </FormItem>

                <FormItem
                    asterisk
                    label="Contact number"
                    invalid={!!errors.contactNumber}
                    errorMessage={errors.contactNumber || ''}
                    className="mb-4"
                >
                    <div className="flex gap-1">
                        <Select<SelectOption>
                            value={selectedCountryCode}
                            options={countryCodes}
                            size="sm"
                            className="w-32 flex-shrink-0"
                            isSearchable={true}
                            placeholder="Code"
                            onChange={handleCountryCodeChange}
                        />
                        <Input
                            type="tel"
                            value={formData.contactNumber}
                            placeholder="Phone number"
                            invalid={!!errors.contactNumber}
                            size="sm"
                            className="flex-1"
                            maxLength={10}
                            autoComplete="tel"
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
                        type="button"
                        onClick={handleGoBack}
                    >
                        Go Back
                    </Button>
                    <Button
                        variant="solid"
                        className="flex-1 bg-black text-white hover:bg-gray-800"
                        size="sm"
                        loading={loading}
                        type="submit"
                        onClick={handleSubmit}
                    >
                        Next →
                    </Button>
                </div>
            </div>
        </div>
    )
}
