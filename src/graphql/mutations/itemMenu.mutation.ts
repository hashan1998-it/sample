import { gql } from 'graphql-request'

const CREATE_ITEM_MENU = gql`
    mutation CreateItemMenu($data: ItemMenuInput!) {
        createItemMenu(data: $data) {
            id
        }
    }
`

export const DELETE_ITEM_MENU_BY_MENU_AND_ITEM = gql`
    mutation ($itemId: String!, $menuId: String!) {
        deleteItemMenuByMenuAndItem(itemId: $itemId, menuId: $menuId) {
            id
        }
    }
`
export const UPDATE_ITEM_MENU = gql`
    mutation ($data: ItemMenuInput!, $updateItemMenuId: String!) {
        updateItemMenu(data: $data, id: $updateItemMenuId) {
            id
        }
    }
`

export const UPDATE_ITEM_MENU_BY_MENU_AND_ITEM = gql`
    mutation ($data: ItemMenuInput!, $itemId: String!, $menuId: String!) {
        updateItemMenuByMenuAndItem(
            data: $data
            itemId: $itemId
            menuId: $menuId
        ) {
            id
        }
    }
`

export const CREATE_ITEM_MENU_STRING = CREATE_ITEM_MENU
export const DELETE_ITEM_MENU_BY_MENU_AND_ITEM_STRING =
    DELETE_ITEM_MENU_BY_MENU_AND_ITEM
export const UPDATE_ITEM_MENU_STRING = UPDATE_ITEM_MENU
export const UPDATE_ITEM_MENU_BY_MENU_AND_ITEM_STRING =
    UPDATE_ITEM_MENU_BY_MENU_AND_ITEM
