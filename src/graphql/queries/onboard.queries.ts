import { gql } from '@apollo/client'

export const GET_USER_BY_IDENTITY_ID = gql`
    query GetUserByIdentityId {
        getUserByIdentityId {
            createdAt
            updatedAt
            id
            identityId
            firstName
            lastName
            email
            img
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

export const GET_MERCHANT_BY_OWNER_ID = gql`
    query GetMerchantByOwnerId {
        getMerchantByOwnerId {
            createdAt
            updatedAt
            id
            ownerId
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
            outlets {
                name
            }
        }
    }
`

export const GET_USER_BY_IDENTITY_ID_STRING = GET_USER_BY_IDENTITY_ID.loc?.source.body || ''
export const GET_MERCHANT_BY_OWNER_ID_STRING = GET_MERCHANT_BY_OWNER_ID.loc?.source.body || ''