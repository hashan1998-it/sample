import type {
    ApiResponse,
    SelectOption,
    FormData,
    PersonalInfo,
    Address,
    BusinessInfo,
    MerchantInfo,
    MerchantAddress,
    OpeningHours,
} from '@/@types/onboarding'

/**
 * Mock delay function to simulate API calls
 */
const mockDelay = (ms: number = 800): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Mock error simulation (10% chance of error)
 */
const shouldSimulateError = (): boolean => Math.random() < 0.1

/**
 * Mock API response wrapper
 */
const mockApiResponse = async <T>(
    data: T,
    errorMessage?: string,
): Promise<ApiResponse<T>> => {
    await mockDelay()

    if (shouldSimulateError() && errorMessage) {
        return {
            success: false,
            error: errorMessage,
        }
    }

    return {
        success: true,
        data,
    }
}

/**
 * Service to submit personal information
 */
export async function apiSubmitPersonalInfo(
    data: PersonalInfo,
): Promise<ApiResponse> {
    console.log('🧑‍💼 Submitting personal info:', data)

    return mockApiResponse(
        {
            id: `user_${Date.now()}`,
            ...data,
            createdAt: new Date().toISOString(),
        },
        'Failed to submit personal information',
    )
}

/**
 * Service to submit address information
 */
export async function apiSubmitAddress(data: Address): Promise<ApiResponse> {
    console.log('🏠 Submitting address info:', data)

    return mockApiResponse(
        {
            id: `address_${Date.now()}`,
            ...data,
            validated: true,
            coordinates: {
                lat: 6.9271 + (Math.random() - 0.5) * 0.1, // Mock Sri Lanka coords
                lng: 79.9612 + (Math.random() - 0.5) * 0.1,
            },
        },
        'Failed to submit address information',
    )
}

/**
 * Service to submit business information
 */
export async function apiSubmitBusinessInfo(
    data: BusinessInfo,
): Promise<ApiResponse> {
    console.log('🏢 Submitting business info:', data)

    return mockApiResponse(
        {
            id: `business_${Date.now()}`,
            ...data,
            status: 'pending_verification',
            registrationNumber: `REG${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        },
        'Failed to submit business information',
    )
}

/**
 * Service to submit merchant information
 */
export async function apiSubmitMerchantInfo(
    data: MerchantInfo,
): Promise<ApiResponse> {
    console.log('🏪 Submitting merchant info:', data)

    return mockApiResponse(
        {
            id: `merchant_${Date.now()}`,
            ...data,
            status: 'active',
            createdAt: new Date().toISOString(),
        },
        'Failed to submit merchant information',
    )
}

/**
 * Service to submit merchant address
 */
export async function apiSubmitMerchantAddress(
    data: MerchantAddress,
): Promise<ApiResponse> {
    console.log('📍 Submitting merchant address:', data)

    return mockApiResponse(
        {
            id: `merchant_address_${Date.now()}`,
            ...data,
            validated: true,
        },
        'Failed to submit merchant address',
    )
}

/**
 * Service to submit opening hours
 */
export async function apiSubmitOpeningHours(
    data: OpeningHours,
): Promise<ApiResponse> {
    console.log('🕒 Submitting opening hours:', data)

    return mockApiResponse(
        {
            id: `opening_hours_${Date.now()}`,
            ...data,
            timezone: 'Asia/Colombo',
        },
        'Failed to submit opening hours',
    )
}

/**
 * Service to complete onboarding
 */
export async function apiCompleteOnboarding(
    data: FormData,
): Promise<ApiResponse> {
    console.log('🎉 Completing onboarding:', data)

    await mockDelay(1500) // Longer delay for final submission

    if (shouldSimulateError()) {
        return {
            success: false,
            error: 'Failed to complete onboarding. Please try again.',
        }
    }

    return {
        success: true,
        data: {
            onboardingId: `onboarding_${Date.now()}`,
            userId: `user_${Date.now()}`,
            status: 'completed',
            completedAt: new Date().toISOString(),
            nextSteps: [
                'Verify your email address',
                'Complete KYC verification',
                'Set up payment methods',
                'Create your first menu',
            ],
        },
    }
}

/**
 * Service to get countries list
 */
export async function apiGetCountries(): Promise<ApiResponse<SelectOption[]>> {
    console.log('🌍 Fetching countries list')

    const countries: SelectOption[] = [
        { value: 'Sri Lanka', label: '🇱🇰 Sri Lanka' },
        { value: 'Singapore', label: '🇸🇬 Singapore' },
        { value: 'India', label: '🇮🇳 India' },
        { value: 'Malaysia', label: '🇲🇾 Malaysia' },
        { value: 'Thailand', label: '🇹🇭 Thailand' },
        { value: 'Philippines', label: '🇵🇭 Philippines' },
        { value: 'Indonesia', label: '🇮🇩 Indonesia' },
        { value: 'Vietnam', label: '🇻🇳 Vietnam' },
        { value: 'Bangladesh', label: '🇧🇩 Bangladesh' },
        { value: 'Myanmar', label: '🇲🇲 Myanmar' },
    ]

    return mockApiResponse(countries, 'Failed to fetch countries')
}

/**
 * Service to get business types
 */
export async function apiGetBusinessTypes(): Promise<
    ApiResponse<SelectOption[]>
> {
    console.log('🏪 Fetching business types')

    const businessTypes: SelectOption[] = [
        { value: 'restaurant', label: 'Restaurant' },
        { value: 'cafe', label: 'Cafe' },
        { value: 'food_truck', label: 'Food Truck' },
        { value: 'bakery', label: 'Bakery' },
        { value: 'catering', label: 'Catering Service' },
        { value: 'fast_food', label: 'Fast Food' },
        { value: 'fine_dining', label: 'Fine Dining' },
        { value: 'bar_pub', label: 'Bar/Pub' },
        { value: 'food_delivery', label: 'Food Delivery' },
        { value: 'ice_cream', label: 'Ice Cream Shop' },
        { value: 'juice_bar', label: 'Juice Bar' },
        { value: 'coffee_shop', label: 'Coffee Shop' },
        { value: 'other', label: 'Other' },
    ]

    return mockApiResponse(businessTypes, 'Failed to fetch business types')
}

/**
 * Service to validate step data
 */
export async function apiValidateStep(
    step: string,
    data: unknown,
): Promise<ApiResponse> {
    console.log(`✅ Validating step: ${step}`, data)

    await mockDelay(300) // Quick validation

    // Mock validation logic
    const validationErrors: Record<string, string> = {}

    if (
        step === 'personal' &&
        typeof data === 'object' &&
        data !== null &&
        'email' in data &&
        (data as { email?: string }).email === 'test@error.com'
    ) {
        validationErrors.email = 'This email is already registered'
    }

    // Type guard to ensure data is an object
    const isObject = (val: unknown): val is Record<string, unknown> =>
        typeof val === 'object' && val !== null

    if (step === 'address' && isObject(data) && data.postalCode === '00000') {
        validationErrors.postalCode = 'Invalid postal code'
    }

    if (
        (step === 'business' || step === 'merchant') &&
        isObject(data) &&
        typeof data.businessName === 'string' &&
        data.businessName.toLowerCase().includes('test')
    ) {
        validationErrors.businessName = 'Business name cannot contain "test"'
    }

    if (Object.keys(validationErrors).length > 0) {
        return {
            success: false,
            error: 'Validation failed',
            errors: validationErrors,
        }
    }

    return mockApiResponse({ valid: true, step }, 'Validation failed')
}

/**
 * Service to save draft
 */
export async function apiSaveDraft(data: FormData): Promise<ApiResponse> {
    console.log('💾 Saving draft:', data)

    // Simulate saving to backend
    const draftId = `draft_${Date.now()}`
    localStorage.setItem('onboarding_draft_id', draftId)

    return mockApiResponse(
        {
            draftId,
            savedAt: new Date().toISOString(),
        },
        'Failed to save draft',
    )
}

/**
 * Service to load draft
 */
export async function apiLoadDraft(): Promise<ApiResponse<FormData | null>> {
    console.log('📂 Loading draft')

    const draftId = localStorage.getItem('onboarding_draft_id')

    if (!draftId) {
        return mockApiResponse(null)
    }

    // Mock draft data (in real app, this would come from backend)
    const mockDraft: FormData = {
        personalInfo: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
        },
        address: {
            country: 'Sri Lanka',
            state: 'Western Province',
            city: 'Colombo',
            postalCode: '10100',
            addressLine1: '123 Main Street',
            addressLine2: 'Apartment 4B',
        },
        businessInfo: {
            businessName: 'Taste of Lanka',
            businessType: 'restaurant',
            phone: '+94771234567',
            website: 'https://tasteoflanka.com',
            description: 'Authentic Sri Lankan cuisine',
        },
        merchantInfo: {
            name: 'Taste of Lanka Restaurant',
            description: 'Authentic Sri Lankan dining experience',
            website: 'https://tasteoflanka.com',
            countryCode: '+94',
            contactNumber: '771234567',
        },
        merchantAddress: {
            country: 'Sri Lanka',
            website: 'https://tasteoflanka.com',
            city: 'Colombo',
            postalCode: '10100',
            addressLine1: '123 Main Street',
            addressLine2: 'Apartment 4B',
        },
        openingHours: {
            scheduleMode: 'daily',
            dailyOpenTime: '09:00',
            dailyCloseTime: '21:00',
        },
    }

    return mockApiResponse(mockDraft)
}

/**
 * Service to check email availability
 */
export async function apiCheckEmailAvailability(
    email: string,
): Promise<ApiResponse<{ available: boolean }>> {
    console.log('📧 Checking email availability:', email)

    await mockDelay(500)

    // Mock some taken emails
    const takenEmails = ['admin@udine.com', 'test@test.com', 'user@example.com']

    const available = !takenEmails.includes(email.toLowerCase())

    return mockApiResponse({ available })
}

/**
 * Service to get states/provinces by country
 */
export async function apiGetStatesByCountry(
    country: string,
): Promise<ApiResponse<SelectOption[]>> {
    console.log('🗺️ Fetching states for country:', country)

    const statesByCountry: Record<string, SelectOption[]> = {
        'Sri Lanka': [
            { value: 'Western Province', label: 'Western Province' },
            { value: 'Central Province', label: 'Central Province' },
            { value: 'Southern Province', label: 'Southern Province' },
            { value: 'Northern Province', label: 'Northern Province' },
            { value: 'Eastern Province', label: 'Eastern Province' },
            {
                value: 'North Western Province',
                label: 'North Western Province',
            },
            {
                value: 'North Central Province',
                label: 'North Central Province',
            },
            { value: 'Uva Province', label: 'Uva Province' },
            { value: 'Sabaragamuwa Province', label: 'Sabaragamuwa Province' },
        ],
        India: [
            { value: 'Maharashtra', label: 'Maharashtra' },
            { value: 'Tamil Nadu', label: 'Tamil Nadu' },
            { value: 'Karnataka', label: 'Karnataka' },
            { value: 'Gujarat', label: 'Gujarat' },
            { value: 'Rajasthan', label: 'Rajasthan' },
        ],
        Singapore: [{ value: 'Singapore', label: 'Singapore' }],
    }

    const states = statesByCountry[country] || []

    return mockApiResponse(states)
}

// Export all functions following your service pattern
export const OnboardingService = {
    apiSubmitPersonalInfo,
    apiSubmitAddress,
    apiSubmitBusinessInfo,
    apiSubmitMerchantInfo,
    apiSubmitMerchantAddress,
    apiSubmitOpeningHours,
    apiCompleteOnboarding,
    apiGetCountries,
    apiGetBusinessTypes,
    apiValidateStep,
    apiSaveDraft,
    apiLoadDraft,
    apiCheckEmailAvailability,
    apiGetStatesByCountry,
}