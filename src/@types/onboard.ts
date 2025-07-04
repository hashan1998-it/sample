// src/@types/onboard.ts - Complete types file
export interface PersonalInfo {
    firstName: string
    lastName: string
    email: string
}

export interface Address {
    country: string
    state: string
    city: string
    postalCode: string
    addressLine1: string
    addressLine2: string
}

export interface BusinessInfo {
    businessName: string
    businessType: string
    phone: string
    website: string
    description: string
}

export interface MerchantInfo {
    name: string
    description: string
    website: string
    countryCode: string
    contactNumber: string
}

export interface MerchantAddress {
    country: string
    website: string
    city: string
    postalCode: string
    addressLine1: string
    addressLine2: string
}

export interface DaySchedule {
    isOpen: boolean
    openTime: string
    closeTime: string
}

export interface OpeningHours {
    scheduleMode: 'daily' | 'customize'
    dailyOpenTime?: string
    dailyCloseTime?: string
    daySchedules?: Record<string, DaySchedule>
}

export interface FormData {
    personalInfo: PersonalInfo
    address: Address
    businessInfo: BusinessInfo
    merchantInfo: MerchantInfo
    merchantAddress: MerchantAddress
    openingHours: OpeningHours
}

export interface ValidationRule {
    required?: boolean
    email?: boolean
    pattern?: RegExp
    minLength?: number
    maxLength?: number
    customValidator?: (value: string) => string | null
    message?: string
    patternMessage?: string
}

export interface ValidationRules {
    [key: string]: ValidationRule
}

export interface FormErrors {
    [key: string]: string
}

export interface TouchedFields {
    [key: string]: boolean
}

export interface ApiResponse<T = unknown> {
    success: boolean
    data?: T
    error?: string
    errors?: FormErrors
}

export interface SelectOption {
    value: string
    label: string
}

export interface FormHookReturn<T = unknown> {
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

export interface OnboardingFlowReturn {
    currentStep: number
    formData: FormData
    goToNextStep: () => void
    goToPreviousStep: () => void
    updateFormData: (section: keyof FormData, data: unknown) => void
    resetForm: () => void
    goToStep: (step: number) => void
}

export interface StepProgressProps {
    currentStep: number
    totalSteps?: number
    className?: string
    activeColor?: string
    inactiveColor?: string
    strokeWidth?: number
}

export interface OnboardingLayoutProps {
    children: React.ReactNode
    currentStep: number
    title?: string
    subtitle?: string
    showHeader?: boolean
    showProgress?: boolean
    className?: string
}

export interface PersonalInfoFormProps {
    data?: Partial<PersonalInfo>
    onNext: (data: PersonalInfo) => void
    onCancel?: () => void
}

export interface AddressFormProps {
    data?: Partial<Address>
    onNext: (data: Address) => void
    onBack?: () => void
}

export interface BusinessInfoFormProps {
    data?: Partial<BusinessInfo>
    onNext: (data: BusinessInfo) => void
    onBack?: () => void
}

export interface MerchantInfoFormProps {
    data?: Partial<MerchantInfo>
    onNext: (data: MerchantInfo) => void
    onBack?: () => void
}

export interface MerchantAddressFormProps {
    data?: Partial<MerchantAddress>
    onNext: (data: MerchantAddress) => void
    onBack?: () => void
}

export interface OpeningHoursFormProps {
    data?: Partial<OpeningHours>
    onSubmit: (data: OpeningHours) => void
    onBack?: () => void
}

export interface ReviewFormProps {
    data: FormData
    onSubmit: (data: FormData) => void
    onBack?: () => void
}

export interface CompletionStatus {
    personalInfo: boolean
    address: boolean
    businessInfo: boolean
    merchantInfo: boolean
    overall: boolean
}

export interface FormSummary {
    totalFields: number
    completedFields: number
    overallPercentage: number
    sections: {
        [key: string]: {
            completed: number
            total: number
            percentage: number
        }
    }
}

export interface DraftData {
    data: FormData
    timestamp: string
    version: string
}

export interface AutoSaveReturn {
    scheduleAutoSave: () => void
    cancelAutoSave: () => void
}

// Additional types for API integration
export interface UserAddress {
    addressLine1: string
    addressLine2?: string | null
    city: string
    state: string
    postal: string
    country: string
}

export interface MerchantAddressAPI {
    addressLine1: string
    addressLine2?: string | null
    city: string
    state: string
    postal: string
    country: string
}

export interface MerchantContact {
    countryCode: string
    mobileNumber: string
}

export interface UserData {
    firstName: string
    lastName: string
    email: string
    img?: string | null
    address: UserAddress
}

export interface MerchantData {
    name: string
    website: string
    email?: string
    description?: string
    address: MerchantAddressAPI
    contact: MerchantContact
}

export interface OnboardFormData {
    personalInfo: {
        firstName: string
        lastName: string
        email: string
    }
    address: {
        country: string
        state: string
        city: string
        postalCode: string
        addressLine1: string
        addressLine2: string
    }
    merchantInfo: {
        name: string
        description: string
        website: string
        countryCode: string
        contactNumber: string
    }
    merchantAddress: {
        country: string
        website: string
        city: string
        postalCode: string
        addressLine1: string
        addressLine2: string
    }
    openingHours: {
        scheduleMode: 'daily' | 'customize'
        dailyOpenTime?: string
        dailyCloseTime?: string
        daySchedules?: Record<string, DaySchedule>
    }
}

export interface OnboardingResult {
    success: boolean
    user?: UserData
    merchant?: MerchantData
    error?: string
}

export interface UserByIdentityResponse {
    getUserByIdentityId: UserData & {
        id: string
        identityId: string
        createdAt: string
        updatedAt: string
    }
}

export interface MerchantByOwnerResponse {
    getMerchantByOwnerId: MerchantData & {
        id: string
        ownerId: string
        createdAt: string
        updatedAt: string
        outlets: Array<{ name: string }>
    }
}