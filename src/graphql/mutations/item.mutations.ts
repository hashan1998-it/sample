import { gql } from '@apollo/client'

export const CREATE_ITEM = gql`
    mutation CreateItem($data: ItemInput!) {
        createItem(data: $data) {
            name
        }
    }
`

export const UPDATE_ITEM = gql`
    mutation UpdateItem($data: ItemInput!, $updateItemId: String!) {
        updateItem(data: $data, id: $updateItemId) {
            name
        }
    }
`

export const DELETE_ITEMS = gql`
    mutation DeleteItems($ids: [String!]!) {
        deleteItems(ids: $ids) {
            name
        }
    }
`
export const DELETE_ITEM = gql`
    mutation DeleteItem($deleteItemId: String!) {
        deleteItem(id: $deleteItemId) {
            name
        }
    }
`
export const CREATE_ITEM_STRING = CREATE_ITEM.loc?.source.body || ''
export const UPDATE_ITEM_STRING = UPDATE_ITEM.loc?.source.body || ''
export const DELETE_ITEMS_STRING = DELETE_ITEMS.loc?.source.body || ''
export const DELETE_ITEM_STRING = DELETE_ITEM.loc?.source.body || ''
