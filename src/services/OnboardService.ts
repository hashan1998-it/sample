import { graphqlRequest } from '@/services/GraphQLService'
import {
    GET_USER_BY_IDENTITY_ID_STRING,
    GET_MERCHANT_BY_OWNER_ID_STRING,
} from '@/graphql/queries/onboard.queries'
import {
    ONBOARD_USER_STRING,
    ONBOARD_MERCHANT_STRING,
} from '@/graphql/mutations/onboard.mutations'
import type {
    OnboardFormData,
    UserData,
    MerchantData,
    OnboardingResult,
    UserByIdentityResponse,
    MerchantByOwnerResponse,
} from '@/@types/onboard'

/**
 * Get user data by identity ID (Auth0 sub)
 * Note: This should use the Auth0 user.sub as the identity ID
 */
export async function apiGetUserByIdentityId(token?: string | null): Promise<UserByIdentityResponse | null> {
    try {
        const response = await graphqlRequest<UserByIdentityResponse>(
            GET_USER_BY_IDENTITY_ID_STRING,
            {},
            { token }
        )
        return response
    } catch (error) {
        console.error('Error fetching user by identity ID:', error)
        return null
    }
}

/**
 * Get merchant data by owner ID
 */
export async function apiGetMerchantByOwnerId(token?: string | null): Promise<MerchantByOwnerResponse | null> {
    try {
        const response = await graphqlRequest<MerchantByOwnerResponse>(
            GET_MERCHANT_BY_OWNER_ID_STRING,
            {},
            { token }
        )
        return response
    } catch (error) {
        console.error('Error fetching merchant by owner ID:', error)
        return null
    }
}

/**
 * Transform onboard form data to user data format
 */
function transformToUserData(formData: OnboardFormData): UserData {
    return {
        firstName: formData.personalInfo.firstName,
        lastName: formData.personalInfo.lastName,
        email: formData.personalInfo.email,
        img: null,
        address: {
            addressLine1: formData.address.addressLine1,
            addressLine2: formData.address.addressLine2 || null,
            city: formData.address.city,
            state: formData.address.state,
            postal: formData.address.postalCode,
            country: formData.address.country,
        },
    }
}

/**
 * Transform onboard form data to merchant data format
 */
function transformToMerchantData(formData: OnboardFormData): MerchantData {
    return {
        name: formData.merchantInfo.name,
        website: formData.merchantInfo.website,
        email: formData.personalInfo.email, // Use personal email for merchant
        description: formData.merchantInfo.description || '',
        address: {
            addressLine1: formData.merchantAddress.addressLine1,
            addressLine2: formData.merchantAddress.addressLine2 || null,
            city: formData.merchantAddress.city,
            state: formData.merchantAddress.addressLine2 || '', // You might want to add state to merchant address form
            postal: formData.merchantAddress.postalCode,
            country: formData.merchantAddress.country,
        },
        contact: {
            countryCode: formData.merchantInfo.countryCode,
            mobileNumber: formData.merchantInfo.contactNumber,
        },
    }
}

/**
 * Onboard user with the collected data
 */
export async function apiOnboardUser(
    formData: OnboardFormData,
    token?: string | null,
): Promise<OnboardingResult> {
    try {
        const userData = transformToUserData(formData)

        const response = await graphqlRequest<{ onboardUser: UserData }>(
            ONBOARD_USER_STRING,
            { data: userData },
            { token }
        )

        if (response.onboardUser) {
            return {
                success: true,
                user: response.onboardUser,
            }
        }

        return {
            success: false,
            error: 'Failed to onboard user',
        }
    } catch (error) {
        console.error('Error onboarding user:', error)
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred',
        }
    }
}

/**
 * Onboard merchant with the collected data
 */
export async function apiOnboardMerchant(
    formData: OnboardFormData,
    token?: string | null,
): Promise<OnboardingResult> {
    try {
        const merchantData = transformToMerchantData(formData)

        const response = await graphqlRequest<{
            onboardMerchant: MerchantData
        }>(ONBOARD_MERCHANT_STRING, { data: merchantData }, { token })

        if (response.onboardMerchant) {
            return {
                success: true,
                merchant: response.onboardMerchant,
            }
        }

        return {
            success: false,
            error: 'Failed to onboard merchant',
        }
    } catch (error) {
        console.error('Error onboarding merchant:', error)
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred',
        }
    }
}

/**
 * Complete onboarding process (both user and merchant)
 */
export async function apiCompleteOnboarding(
    formData: OnboardFormData,
    token?: string | null,
): Promise<OnboardingResult> {
    try {
        // First, onboard the user
        const userResult = await apiOnboardUser(formData, token)
        if (!userResult.success) {
            return userResult
        }

        // Then, onboard the merchant
        const merchantResult = await apiOnboardMerchant(formData, token)
        if (!merchantResult.success) {
            return {
                success: false,
                error: `User onboarded successfully, but merchant onboarding failed: ${merchantResult.error}`,
            }
        }

        const result: OnboardingResult = { success: true }
        if (userResult.user) result.user = userResult.user
        if (merchantResult.merchant) result.merchant = merchantResult.merchant
        return result
    } catch (error) {
        console.error('Error during complete onboarding:', error)
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred',
        }
    }
}

/**
 * Check onboarding status for current user (Auth0 compatible)
 */
export async function apiCheckOnboardingStatus(token?: string | null): Promise<{
    hasUser: boolean
    hasMerchant: boolean
    shouldRedirectToOnboard: boolean
    redirectPath: string
}> {
    try {
        const [userResponse, merchantResponse] = await Promise.allSettled([
            apiGetUserByIdentityId(token),
            apiGetMerchantByOwnerId(token),
        ])

        // Handle user data
        const hasUser =
            userResponse.status === 'fulfilled' &&
            !!userResponse.value?.getUserByIdentityId

        // Handle merchant data
        const hasMerchant =
            merchantResponse.status === 'fulfilled' &&
            !!merchantResponse.value?.getMerchantByOwnerId

        let shouldRedirectToOnboard = false
        let redirectPath = '/outlets'

        if (!hasUser || !hasMerchant) {
            shouldRedirectToOnboard = true
            redirectPath = '/onboard'
        }

        return {
            hasUser,
            hasMerchant,
            shouldRedirectToOnboard,
            redirectPath,
        }
    } catch (error) {
        console.error('Error checking onboarding status:', error)
        // If there's an error, assume onboarding is needed
        return {
            hasUser: false,
            hasMerchant: false,
            shouldRedirectToOnboard: true,
            redirectPath: '/onboard',
        }
    }
}