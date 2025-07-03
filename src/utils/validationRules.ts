import { VALIDATION_PATTERNS, ERROR_MESSAGES } from './constants'
import type {
    ValidationRules,
    ValidationRule,
    FormErrors,
} from '../@types/onboarding'

export const personalInfoValidation: ValidationRules = {
    firstName: {
        required: true,
        message: 'First name is required',
        minLength: 2,
        maxLength: 50,
    },
    lastName: {
        required: true,
        message: 'Last name is required',
        minLength: 2,
        maxLength: 50,
    },
    email: {
        required: true,
        email: true,
        message: 'Email address is required',
    },
}

export const addressValidation: ValidationRules = {
    country: {
        required: true,
        message: 'Country is required',
    },
    state: {
        required: true,
        message: 'State or Province is required',
        minLength: 2,
        maxLength: 100,
    },
    city: {
        required: true,
        message: 'City is required',
        minLength: 2,
        maxLength: 100,
    },
    postalCode: {
        required: true,
        message: 'Postal/ZIP Code is required',
        pattern: VALIDATION_PATTERNS.POSTAL_CODE,
        patternMessage: 'Please enter a valid postal/ZIP code',
    },
    addressLine1: {
        required: true,
        message: 'Address Line 1 is required',
        minLength: 5,
        maxLength: 200,
    },
    addressLine2: {
        required: false,
        maxLength: 200,
    },
}

export const businessInfoValidation: ValidationRules = {
    businessName: {
        required: true,
        message: 'Business name is required',
        minLength: 2,
        maxLength: 100,
    },
    businessType: {
        required: true,
        message: 'Business type is required',
    },
    phone: {
        required: true,
        message: 'Phone number is required',
        pattern: VALIDATION_PATTERNS.PHONE,
        patternMessage: 'Please enter a valid phone number',
    },
    website: {
        required: false,
        pattern: VALIDATION_PATTERNS.URL,
        patternMessage: 'Please enter a valid URL (e.g., https://example.com)',
    },
    description: {
        required: false,
        maxLength: 500,
    },
}

// Helper function to create custom validation rules
export const createValidationRule = ({
    required = false,
    email = false,
    pattern,
    minLength,
    maxLength,
    customValidator,
    message,
    patternMessage,
}: Partial<ValidationRule>): ValidationRule => {
    return {
        required,
        email,
        ...(pattern !== undefined && { pattern }),
        ...(minLength !== undefined && { minLength }),
        ...(maxLength !== undefined && { maxLength }),
        ...(customValidator !== undefined && { customValidator }),
        message: message || (required ? ERROR_MESSAGES.REQUIRED : ''),
        ...(patternMessage !== undefined && { patternMessage }),
    }
}

// Field-specific validators
export const validators = {
    required: (
        value: string,
        message: string = ERROR_MESSAGES.REQUIRED,
    ): string | null => {
        if (!value || !value.toString().trim()) {
            return message
        }
        return null
    },

    minLength: (
        value: string,
        min: number,
        message?: string,
    ): string | null => {
        const errorMessage = message || ERROR_MESSAGES.MIN_LENGTH(min)
        if (value && value.length < min) {
            return errorMessage
        }
        return null
    },

    maxLength: (
        value: string,
        max: number,
        message?: string,
    ): string | null => {
        const errorMessage = message || ERROR_MESSAGES.MAX_LENGTH(max)
        if (value && value.length > max) {
            return errorMessage
        }
        return null
    },

    pattern: (
        value: string,
        pattern: RegExp,
        message: string = 'Invalid format',
    ): string | null => {
        if (value && !pattern.test(value)) {
            return message
        }
        return null
    },

    email: (
        value: string,
        message: string = ERROR_MESSAGES.INVALID_EMAIL,
    ): string | null => {
        if (value && !VALIDATION_PATTERNS.EMAIL.test(value)) {
            return message
        }
        return null
    },

    phone: (
        value: string,
        message: string = ERROR_MESSAGES.INVALID_PHONE,
    ): string | null => {
        if (value && !VALIDATION_PATTERNS.PHONE.test(value)) {
            return message
        }
        return null
    },

    url: (
        value: string,
        message: string = ERROR_MESSAGES.INVALID_URL,
    ): string | null => {
        if (value && !VALIDATION_PATTERNS.URL.test(value)) {
            return message
        }
        return null
    },
}

// Validate a single field
export const validateField = (
    value: string,
    rules: ValidationRule,
): string | null => {
    const errors: (string | null)[] = []

    if (rules.required) {
        const error = validators.required(value, rules.message)
        if (error) errors.push(error)
    }

    if (rules.email && value) {
        const error = validators.email(value)
        if (error) errors.push(error)
    }

    if (rules.pattern && value) {
        const error = validators.pattern(
            value,
            rules.pattern,
            rules.patternMessage,
        )
        if (error) errors.push(error)
    }

    if (typeof rules.minLength === 'number' && value) {
        const error = validators.minLength(value, rules.minLength)
        if (error) errors.push(error)
    }

    if (typeof rules.maxLength === 'number' && value) {
        const error = validators.maxLength(value, rules.maxLength)
        if (error) errors.push(error)
    }

    if (rules.customValidator && value) {
        const error = rules.customValidator(value)
        if (error) errors.push(error)
    }

    return errors.length > 0 ? (errors[0] ?? null) : null
}

// Validate an entire form
export const validateForm = (
    formData: Record<string, string | undefined>,
    validationRules: ValidationRules,
): { isValid: boolean; errors: FormErrors } => {
    const errors: FormErrors = {}
    Object.keys(validationRules).forEach((field) => {
        const rule = validationRules[field]
        if (!rule) return
        const fieldError = validateField(formData[field] ?? '', rule)
        if (fieldError) {
            errors[field] = fieldError
        }
    })
    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    }
}

// Add custom validators for businessName and websiteUrl
export const customFieldValidators = {
    businessName: (value: string): string | null => {
        if (!value) return null
        // Only allow letters, numbers, spaces, and basic punctuation
        if (!/^[\w\s.,'\-()&]+$/.test(value)) {
            return 'Business name contains invalid characters'
        }
        return null
    },
    websiteUrl: (value: string): string | null => {
        if (!value) return null
        if (!VALIDATION_PATTERNS.URL.test(value)) {
            return ERROR_MESSAGES.INVALID_URL
        }
        return null
    },
}

export const merchantInfoValidation: ValidationRules = {
    name: {
        required: true,
        message: 'Merchant name is required',
        minLength: 2,
        maxLength: 100,
        customValidator: customFieldValidators.businessName,
    },
    description: {
        required: false,
        maxLength: 500,
    },
    website: {
        required: true,
        message: 'Website is required',
        pattern: VALIDATION_PATTERNS.URL,
        patternMessage: 'Please enter a valid URL (e.g., https://example.com)',
        customValidator: customFieldValidators.websiteUrl,
    },
    countryCode: {
        required: true,
        message: 'Country code is required',
    },
    contactNumber: {
        required: true,
        message: 'Contact number is required',
        customValidator: (value: string): string | null => {
            if (!value) return null
            // Remove all non-digit characters for validation
            const cleaned = value.replace(/\D/g, '')
            if (cleaned.length < 7) {
                return 'Contact number must be at least 7 digits'
            }
            if (cleaned.length > 10) {
                return 'Contact number cannot exceed 10 digits'
            }
            // Check for invalid patterns
            if (/^0+$/.test(cleaned)) {
                return 'Contact number cannot be all zeros'
            }
            if (/^1+$/.test(cleaned)) {
                return 'Contact number cannot be all ones'
            }
            return null
        },
    },
}

// Add to your commonValidationSets
export const merchantValidationSets = {
    merchantName: createValidationRule({
        required: true,
        customValidator: customFieldValidators.businessName,
        minLength: 2,
        maxLength: 100,
    }),
    website: createValidationRule({
        required: true,
        customValidator: customFieldValidators.websiteUrl,
    }),
    contactNumber: createValidationRule({
        required: true,
        customValidator:
            merchantInfoValidation.contactNumber?.customValidator ||
            (() => null),
    }),
    description: createValidationRule({
        required: false,
        maxLength: 500,
    }),
}

export const merchantAddressValidation: ValidationRules = {
    country: {
        required: true,
        message: 'Country is required'
    },
    website: {
        required: false,
        pattern: VALIDATION_PATTERNS.URL,
        patternMessage: 'Please enter a valid URL (e.g., https://example.com)'
    },
    city: {
        required: true,
        message: 'City is required',
        minLength: 2,
        maxLength: 100
    },
    postalCode: {
        required: true,
        message: 'Postal/ZIP Code is required',
        pattern: VALIDATION_PATTERNS.POSTAL_CODE,
        patternMessage: 'Please enter a valid postal/ZIP code'
    },
    addressLine1: {
        required: true,
        message: 'Address Line 1 is required',
        minLength: 5,
        maxLength: 200
    },
    addressLine2: {
        required: false,
        maxLength: 200
    }
}

export const openingHoursValidation: ValidationRules = {
    dailyOpenTime: {
        required: true,
        message: 'Opening time is required',
        customValidator: (value: string): string | null => {
            if (!value) return null
            
            // Validate time format (HH:MM)
            const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
            if (!timeRegex.test(value)) {
                return 'Please enter a valid time format (HH:MM)'
            }
            
            return null
        }
    },
    dailyCloseTime: {
        required: true,
        message: 'Closing time is required',
        customValidator: (value: string): string | null => {
            if (!value) return null
            
            // Validate time format (HH:MM)
            const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
            if (!timeRegex.test(value)) {
                return 'Please enter a valid time format (HH:MM)'
            }
            
            return null
        }
    }
}
