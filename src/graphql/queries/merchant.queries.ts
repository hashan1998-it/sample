import { gql } from '@apollo/client'

export const GET_MERCHANT_BY_ID = gql`
    query GetMerchantById($getMerchantByIdId: String!) {
        getMerchantById(id: $getMerchantByIdId) {
            id
            name
            website
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
            # openingHours {
            #     from {
            #         hours
            #         minutes
            #     }
            #     to {
            #         hours
            #         minutes
            #     }
            #     day
            # }
        }
    }
`
export const GET_MERCHANT_BY_ID_STRING =
    GET_MERCHANT_BY_ID.loc?.source.body || ''
