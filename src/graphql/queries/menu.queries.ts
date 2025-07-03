import { gql } from '@apollo/client'

export const GET_MENUS = gql`
    query GetMenus(
        $merchantId: String!
        $query: String
        $pageIndex: Float
        $pageSize: Float
    ) {
        getMenus(
            merchantId: $merchantId
            query: $query
            pageIndex: $pageIndex
            pageSize: $pageSize
        ) {
            id
            name
            description
            outlet {
                id
                name
            }
            item {
                name
            }
            # itemIds
            outletId
        }
    }
`
export const GET_MENU_BY_ID = gql`
    query GetMenuById($getMenuByIdId: String!) {
        getMenuById(id: $getMenuByIdId) {
            id
            name
            description
            outlet {
                id
                name
            }
            item {
                name
            }
            outletId
            # itemIds
        }
    }
`
export const GET_MENUS_STRING = GET_MENUS.loc?.source.body || ''
export const GET_MENU_BY_ID_STRING = GET_MENU_BY_ID.loc?.source.body || ''
