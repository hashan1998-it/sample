import { gql } from 'graphql-request'

export const GET_ITEM_MENUS = gql`
    query {
        getItemMenus {
            id
            item
            menu
            price
        }
    }
`
export const GET_ITEM_MENU_BY_ITEM_AND_MENU = gql`
    query ($menuId: String!, $itemId: String!) {
        getItemMenusByItemAndMenu(menuId: $menuId, itemId: $itemId) {
            id
            price
            options {
                label
                price
            }
            addOns {
                label
                price
            }
        }
    }
`

export const GET_ITEM_MENUS_STRING = GET_ITEM_MENUS
export const GET_ITEM_MENU_BY_ITEM_AND_MENU_STRING =
    GET_ITEM_MENU_BY_ITEM_AND_MENU
