// graphql/mutations.ts
import { gql } from '@apollo/client'

const UPDATE_MERCHANT = gql`
    mutation UpdateMerchant(
        $merchant: MerchantInput!
        $updateMerchantId: String!
    ) {
        updateMerchant(merchant: $merchant, id: $updateMerchantId) {
            name
        }
    }
`
export const UPDATE_MERCHANT_STRING = UPDATE_MERCHANT.loc?.source.body || ''
