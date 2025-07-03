import { gql } from '@apollo/client'

const GET_ITEMS = gql`
    query GetItems(
        $merchantId: String!
        $query: String
        $pageIndex: Float
        $pageSize: Float
    ) {
        getItems(
            merchantId: $merchantId
            query: $query
            pageIndex: $pageIndex
            pageSize: $pageSize
        ) {
            createdAt
            updatedAt
            id
            name
            price
            description
            isAvailable
            isFeatured
            categoryId
            merchantId
            menuId
            imgList {
                name
                id
                img
            }
            options {
                label
                price
            }
            addOns {
                label
                price
            }
            imageUrl
            menu {
                name
            }
            merchant {
                name
            }
            category {
                name
            }
        }
    }
`

export const GET_ITEM_BY_ID = gql`
    query GetItemById($getItemByIdId: String!) {
        getItemById(id: $getItemByIdId) {
            createdAt
            updatedAt
            id
            name
            price
            description
            isAvailable
            isFeatured
            isVegetarian
            categoryId
            merchantId
            menuId
            imgList {
                name
                id
                img
            }
            options {
                label
                price
            }
            addOns {
                label
                price
            }
            imageUrl
            menu {
                name
            }
            merchant {
                name
            }
            category {
                name
            }
        }
    }
`

export const GET_ITEMS_STRING = GET_ITEMS.loc?.source.body || ''
export const GET_ITEM_BY_ID_STRING = GET_ITEM_BY_ID.loc?.source.body || ''
