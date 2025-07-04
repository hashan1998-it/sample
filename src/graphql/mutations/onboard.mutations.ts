import { gql } from '@apollo/client'

export const ONBOARD_USER = gql`
    mutation OnboardUser($data: UserInput!) {
        onboardUser(data: $data) {
            id
            firstName
            lastName
            email
            address {
                addressLine1
                addressLine2
                city
                state
                postal
                country
            }
        }
    }
`

export const ONBOARD_MERCHANT = gql`
    mutation OnboardMerchant($data: MerchantInput!) {
        onboardMerchant(data: $data) {
            id
            name
            website
            email
            description
            address {
                addressLine1
                addressLine2
                city
                state
                postal
                country
            }
            contact {
                countryCode
                mobileNumber
            }
        }
    }
`

export const ONBOARD_USER_STRING = ONBOARD_USER.loc?.source.body || ''
export const ONBOARD_MERCHANT_STRING = ONBOARD_MERCHANT.loc?.source.body || ''