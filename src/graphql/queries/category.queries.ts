import { gql } from '@apollo/client'

const GET_CATEGORY_BY_ID = gql`
    query GetCategoryById($getCategoryByIdId: String!) {
        getCategoryById(id: $getCategoryByIdId) {
            id
            name
            description
        }
    }
`
const GET_ALL_CATEGORIES = gql`
    query GetAllCategories {
        getAllCategories {
            id
            name
            description
        }
    }
`

const GET_ALL_CATEGORIES_BY_MERCHANT = gql`
    query GetAllCategoriesByMerchant(
        $merchantId: String!
        $query: String
        $pageIndex: Float
        $pageSize: Float
    ) {
        getAllCategoriesByMerchant(
            merchantId: $merchantId
            query: $query
            pageIndex: $pageIndex
            pageSize: $pageSize
        ) {
            id
            name
            description
        }
    }
`

export const GET_CATEGORY_BY_ID_STRING =
    GET_CATEGORY_BY_ID.loc?.source.body || ''
export const GET_ALL_CATEGORIES_STRING =
    GET_ALL_CATEGORIES.loc?.source.body || ''
export const GET_ALL_CATEGORIES_BY_MERCHANT_STRING =
    GET_ALL_CATEGORIES_BY_MERCHANT.loc?.source.body || ''
