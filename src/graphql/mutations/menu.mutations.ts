import { gql } from '@apollo/client'

const CREATE_MENU = gql`
    mutation CreateMenu($data: MenuInput!) {
        createMenu(data: $data) {
            name
        }
    }
`

export const UPDATE_MENU = gql`
    mutation UpdateMenu($data: MenuInput!, $updateMenuId: String!) {
        updateMenu(data: $data, id: $updateMenuId) {
            name
        }
    }
`

export const DELETE_MENU = gql`
    mutation DeleteMenu($deleteMenuId: String!) {
        deleteMenu(id: $deleteMenuId) {
            name
        }
    }
`

export const DELETE_MENUS = gql`
    mutation DeleteMenus($ids: [String!]!) {
        deleteMenus(ids: $ids) {
            name
        }
    }
`
export const DUPLICATE_MENU = gql`
    mutation DuplicateMenu($input: DuplicateMenuInput!) {
        duplicateMenu(input: $input) {
            id
            name
        }
    }
`

export const CREATE_MENU_STRING = CREATE_MENU.loc?.source.body || ''
export const UPDATE_MENU_STRING = UPDATE_MENU.loc?.source.body || ''
export const DELETE_MENU_STRING = DELETE_MENU.loc?.source.body || ''
export const DELETE_MENUS_STRING = DELETE_MENUS.loc?.source.body || ''
export const DUPLICATE_MENU_STRING = DUPLICATE_MENU.loc?.source.body || ''
