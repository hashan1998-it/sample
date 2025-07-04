// utils/constants.ts - Fixed version
import type { SelectOption } from '../@types/onboard'

export const ONBOARDING_STEPS = {
    STEP_ONE: 1,
    STEP_TWO: 2,
    STEP_THREE: 3,
    STEP_FOUR: 4,
    STEP_FIVE: 5,
} as const

export const STEP_NAMES: Record<number, string> = {
    [ONBOARDING_STEPS.STEP_ONE]: 'Personal Information',
    [ONBOARDING_STEPS.STEP_TWO]: 'Address Information',
    [ONBOARDING_STEPS.STEP_THREE]: 'Merchant Information',
    [ONBOARDING_STEPS.STEP_FOUR]: 'Merchant Address',
    [ONBOARDING_STEPS.STEP_FIVE]: 'Opening Hours',
}

export const FORM_FIELD_TYPES = {
    TEXT: 'text',
    EMAIL: 'email',
    TEL: 'tel',
    URL: 'url',
    TEXTAREA: 'textarea',
    SELECT: 'select',
    TIME: 'time',
    SWITCH: 'switch',
} as const

export const VALIDATION_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^[+]?[1-9][\d]{0,15}$/,
    URL: /^https?:\/\/.+/,
    POSTAL_CODE: /^[A-Z0-9\s-]{3,10}$/i,
    TIME: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
} as const

export const ERROR_MESSAGES = {
    REQUIRED: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PHONE: 'Please enter a valid phone number',
    INVALID_URL: 'Please enter a valid URL (e.g., https://example.com)',
    INVALID_TIME: 'Please enter a valid time format (HH:MM)',
    MIN_LENGTH: (min: number): string => `Must be at least ${min} characters`,
    MAX_LENGTH: (max: number): string =>
        `Must be no more than ${max} characters`,
    TIME_RANGE_ERROR: 'Closing time must be after opening time',
    PHONE_DIGITS_ERROR: 'Contact number must be between 7-10 digits',
} as const

export const API_ENDPOINTS = {
    ONBOARDING: {
        PERSONAL_INFO: '/onboarding/personal-info',
        ADDRESS: '/onboarding/address',
        BUSINESS_INFO: '/onboarding/business-info',
        MERCHANT_INFO: '/onboarding/merchant-info',
        MERCHANT_ADDRESS: '/onboarding/merchant-address',
        OPENING_HOURS: '/onboarding/opening-hours',
        COMPLETE: '/onboarding/complete',
        VALIDATE: '/onboarding/validate',
        DRAFT: '/onboarding/draft',
    },
    LOOKUP: {
        COUNTRIES: '/countries',
        BUSINESS_TYPES: '/business-types',
        STATES_BY_COUNTRY: '/states',
    },
} as const

export const LOCAL_STORAGE_KEYS = {
    ONBOARDING_DRAFT: 'udine_onboarding_draft',
    AUTH_TOKEN: 'udine_auth_token',
    USER_PREFERENCES: 'udine_user_preferences',
} as const

export const DEFAULT_OPTIONS = {
    COUNTRIES: [
        { value: 'Sri Lanka', label: '🇱🇰 Sri Lanka' },
        { value: 'Singapore', label: '🇸🇬 Singapore' },
        { value: 'India', label: '🇮🇳 India' },
        { value: 'Malaysia', label: '🇲🇾 Malaysia' },
        { value: 'Thailand', label: '🇹🇭 Thailand' },
        { value: 'Philippines', label: '🇵🇭 Philippines' },
        { value: 'Indonesia', label: '🇮🇩 Indonesia' },
        { value: 'Vietnam', label: '🇻🇳 Vietnam' },
    ] as SelectOption[],
    BUSINESS_TYPES: [
        { value: 'restaurant', label: 'Restaurant' },
        { value: 'cafe', label: 'Cafe' },
        { value: 'food_truck', label: 'Food Truck' },
        { value: 'bakery', label: 'Bakery' },
        { value: 'catering', label: 'Catering Service' },
        { value: 'fast_food', label: 'Fast Food' },
        { value: 'fine_dining', label: 'Fine Dining' },
        { value: 'bar_pub', label: 'Bar/Pub' },
        { value: 'food_delivery', label: 'Food Delivery' },
        { value: 'other', label: 'Other' },
    ] as SelectOption[],
    COUNTRY_CODES: [
        { value: '+94', label: '🇱🇰 +94' },
        { value: '+65', label: '🇸🇬 +65' },
        { value: '+91', label: '🇮🇳 +91' },
        { value: '+60', label: '🇲🇾 +60' },
        { value: '+66', label: '🇹🇭 +66' },
        { value: '+63', label: '🇵🇭 +63' },
        { value: '+62', label: '🇮🇩 +62' },
        { value: '+84', label: '🇻🇳 +84' },
    ] as SelectOption[],
    DAYS_OF_WEEK: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ] as const,
    DEFAULT_BUSINESS_HOURS: {
        OPEN_TIME: '09:00',
        CLOSE_TIME: '16:00',
    } as const,
} as const

export const UI_CONFIG = {
    FORM: {
        INPUT_SIZE: 'sm',
        BUTTON_SIZE: 'sm',
        SPACING: {
            FORM_ITEM: 'mb-3 sm:mb-4',
            SECTION: 'mb-4 sm:mb-6',
            BUTTON_GROUP: 'gap-2 sm:gap-3',
        },
    },
    PROGRESS: {
        STROKE_WIDTH: 8,
        ACTIVE_COLOR: 'bg-green-500',
        INACTIVE_COLOR: 'bg-gray-200',
    },
    LAYOUT: {
        CONTAINER_WIDTH: 'max-w-xs sm:max-w-sm md:max-w-md',
        CARD_PADDING: 'p-4 sm:p-6 lg:p-8',
        SCREEN_PADDING: 'px-3 py-4 sm:px-6 lg:px-8',
    },
    SCHEDULE_MODE: {
        DAILY: 'daily',
        CUSTOMIZE: 'customize',
    } as const,
} as const

export const FORM_SECTIONS = {
    PERSONAL_INFO: 'personalInfo',
    ADDRESS: 'address',
    BUSINESS_INFO: 'businessInfo',
    MERCHANT_INFO: 'merchantInfo',
    MERCHANT_ADDRESS: 'merchantAddress',
    OPENING_HOURS: 'openingHours',
} as const

export const BUTTON_LABELS = {
    CANCEL: 'Cancel',
    GO_BACK: 'Go Back',
    NEXT: 'Next →',
    SUBMIT: 'Submit',
    COMPLETE_SETUP: 'Complete Setup',
    DAILY: 'Daily',
    CUSTOMIZE: 'Customize',
} as const

export const FORM_TITLES = {
    [ONBOARDING_STEPS.STEP_ONE]: 'User Information',
    [ONBOARDING_STEPS.STEP_TWO]: 'Address Information',
    [ONBOARDING_STEPS.STEP_THREE]: 'Merchant Information',
    [ONBOARDING_STEPS.STEP_FOUR]: 'Merchant Address',
    [ONBOARDING_STEPS.STEP_FIVE]: 'Opening Hours',
} as const

export const VALIDATION_LIMITS = {
    NAME: {
        MIN_LENGTH: 2,
        MAX_LENGTH: 50,
    },
    BUSINESS_NAME: {
        MIN_LENGTH: 2,
        MAX_LENGTH: 100,
    },
    ADDRESS: {
        MIN_LENGTH: 5,
        MAX_LENGTH: 200,
    },
    DESCRIPTION: {
        MAX_LENGTH: 500,
    },
    PHONE: {
        MIN_DIGITS: 7,
        MAX_DIGITS: 10,
    },
    POSTAL_CODE: {
        MIN_LENGTH: 3,
        MAX_LENGTH: 10,
    },
} as const
