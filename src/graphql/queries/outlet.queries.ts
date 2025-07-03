import { gql } from '@apollo/client'

// src/graphql/queries/getProductList.ts
const GET_OUTLETS = gql`
    query GetOutlets(
        $merchantId: String!
        $query: String
        $pageIndex: Float
        $pageSize: Float
    ) {
        getOutlets(
            merchantId: $merchantId
            query: $query
            pageIndex: $pageIndex
            pageSize: $pageSize
        ) {
            id
            name
            contact {
                countryCode
                mobileNumber
            }
            description
            address {
                addressLine1
                addressLine2
                city
                state
                postal
                country
            }
            menu {
                id
                name
            }
        }
    }
`

const GET_OUTLET_BY_ID = gql`
    query GetOutletById($getOutletByIdId: String!) {
        getOutletById(id: $getOutletByIdId) {
            id
            name
            description
            contact {
                countryCode
                mobileNumber
            }
            address {
                addressLine1
                addressLine2
                city
                state
                postal
                country
            }
            menu {
                id
                name
            }
        }
    }
`
export const GET_OUTLETS_STRING = GET_OUTLETS.loc?.source.body || ''
export const GET_OUTLET_BY_ID_STRING = GET_OUTLET_BY_ID.loc?.source.body || ''
