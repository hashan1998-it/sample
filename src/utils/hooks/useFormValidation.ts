// utils/hooks/useFormValidation.ts - Fixed version with capitalized field names
import { useState, useCallback } from 'react'
import type {
    ValidationRules,
    FormErrors,
    TouchedFields,
} from '../../@types/onboarding'

// Fixed FormHookReturn interface
export interface FormHookReturn<T = Record<string, unknown>> {
    formData: T
    errors: FormErrors
    touched: TouchedFields
    handleInputChange: (
        field: string,
    ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    handleSelectChange: (field: string) => (value: string) => void
    handleBlur: (field: string) => () => void
    validate: () => boolean
    resetForm: () => void
    updateFormData: (newData: Partial<T>) => void
    setFormData: React.Dispatch<React.SetStateAction<T>>
    setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
}

// Helper function to capitalize first letter of field name
const capitalizeFieldName = (fieldName: string): string => {
    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
}

export const useFormValidation = <T extends Record<string, unknown>>(
    initialData: T,
    validationRules: ValidationRules,
): FormHookReturn<T> => {
    const [formData, setFormData] = useState<T>(initialData)
    const [errors, setErrors] = useState<FormErrors>({})
    const [touched, setTouched] = useState<TouchedFields>({})

    const handleInputChange = useCallback(
        (field: string) =>
            (
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ): void => {
                const value = e.target.value
                setFormData((prev) => ({
                    ...prev,
                    [field]: value,
                }))

                // Clear error when user starts typing
                if (errors[field]) {
                    setErrors((prev) => ({
                        ...prev,
                        [field]: '',
                    }))
                }
            },
        [errors],
    )

    const handleSelectChange = useCallback(
        (field: string) =>
            (value: string): void => {
                setFormData((prev) => ({
                    ...prev,
                    [field]: value,
                }))

                // Clear error when user selects
                if (errors[field]) {
                    setErrors((prev) => ({
                        ...prev,
                        [field]: '',
                    }))
                }
            },
        [errors],
    )

    const handleBlur = useCallback(
        (field: string) => (): void => {
            setTouched((prev) => ({
                ...prev,
                [field]: true,
            }))

            // Validate field on blur if it has been touched
            if (validationRules[field]) {
                const rule = validationRules[field]
                const value = formData[field] as string
                const capitalizedField = capitalizeFieldName(field)

                if (rule.required && (!value || !value.toString().trim())) {
                    setErrors((prev) => ({
                        ...prev,
                        [field]: rule.message || `${capitalizedField} is required`,
                    }))
                } else if (
                    rule.email &&
                    value &&
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                ) {
                    setErrors((prev) => ({
                        ...prev,
                        [field]: 'Please enter a valid email address',
                    }))
                } else if (
                    rule.minLength &&
                    value &&
                    value.length < rule.minLength
                ) {
                    setErrors((prev) => ({
                        ...prev,
                        [field]: `${capitalizedField} must be at least ${rule.minLength} characters`,
                    }))
                } else if (rule.pattern && value && !rule.pattern.test(value)) {
                    setErrors((prev) => ({
                        ...prev,
                        [field]:
                            rule.patternMessage || `${capitalizedField} format is invalid`,
                    }))
                } else if (rule.customValidator && value) {
                    const customError = rule.customValidator(value)
                    if (customError) {
                        setErrors((prev) => ({
                            ...prev,
                            [field]: customError,
                        }))
                    } else {
                        setErrors((prev) => ({
                            ...prev,
                            [field]: '',
                        }))
                    }
                } else {
                    setErrors((prev) => ({
                        ...prev,
                        [field]: '',
                    }))
                }
            }
        },
        [formData, validationRules],
    )

    const validate = useCallback((): boolean => {
        const newErrors: FormErrors = {}

        Object.keys(validationRules).forEach((field) => {
            const rule = validationRules[field]
            if (!rule) return
            const value = formData[field] as string
            const capitalizedField = capitalizeFieldName(field)

            if (rule.required && (!value || !value.toString().trim())) {
                newErrors[field] = rule.message || `${capitalizedField} is required`
            } else if (
                rule.email &&
                value &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ) {
                newErrors[field] = 'Please enter a valid email address'
            } else if (
                rule.minLength &&
                value &&
                value.length < rule.minLength
            ) {
                newErrors[field] =
                    `${capitalizedField} must be at least ${rule.minLength} characters`
            } else if (rule.pattern && value && !rule.pattern.test(value)) {
                newErrors[field] =
                    rule.patternMessage || `${capitalizedField} format is invalid`
            } else if (rule.customValidator && value) {
                const customError = rule.customValidator(value)
                if (customError) {
                    newErrors[field] = customError
                }
            }
        })

        setErrors(newErrors)

        // Mark all fields as touched
        const allTouched: TouchedFields = {}
        Object.keys(validationRules).forEach((field) => {
            allTouched[field] = true
        })
        setTouched(allTouched)

        return Object.keys(newErrors).length === 0
    }, [formData, validationRules])

    const resetForm = useCallback((): void => {
        setFormData(initialData)
        setErrors({})
        setTouched({})
    }, [initialData])

    const updateFormData = useCallback((newData: Partial<T>): void => {
        setFormData((prev) => ({
            ...prev,
            ...newData,
        }))
    }, [])

    return {
        formData,
        errors,
        touched,
        handleInputChange,
        handleSelectChange,
        handleBlur,
        validate,
        resetForm,
        updateFormData,
        setFormData,
        setErrors,
    }
}