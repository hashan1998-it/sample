import { graphqlRequest } from '@/services/GraphQLService'
import {
    GET_MENUS_STRING,
    GET_MENU_BY_ID_STRING,
} from '../graphql/queries/menu.queries'
import { Menu, MenuFormSchema } from '@/views/menus/MenuForm/types'
import {
    CREATE_MENU_STRING,
    DELETE_MENU_STRING,
    DELETE_MENUS_STRING,
    DUPLICATE_MENU_STRING,
    UPDATE_MENU_STRING,
} from '@/graphql/mutations/menu.mutations'

/**
 * @Service get menu list
 * @param params
 * @returns the menu list
 */

export async function apiGetMenuList<T, U extends Record<string, unknown>>(
    params: U,
): Promise<T> {
    return graphqlRequest<T, U>(GET_MENUS_STRING, params)
}

/**
 * @Service get menu by id
 * @param params
 * @returns the id by menu
 */

export async function apiGetMenu<T, U extends Record<string, unknown>>(
    params: U,
): Promise<T> {
    return graphqlRequest<T, U>(GET_MENU_BY_ID_STRING, {
        ...params,
        getMenuByIdId: params.id,
    })
}

export const createMenu = async (
    values: MenuFormSchema,
    merchantId: string,
): Promise<Menu> => {
    const variables = {
        data: {
            ...values,
            merchantId,
        },
    }

    const response = await graphqlRequest<
        { createMenu: Menu },
        typeof variables
    >(CREATE_MENU_STRING, variables)

    return response.createMenu
}

export const updateMenu = async (
    id: string,
    values: MenuFormSchema,
    merchantId: string,
): Promise<Menu> => {
    const variables = {
        updateMenuId: id,
        data: {
            ...values,
            merchantId,
        },
    }

    const response = await graphqlRequest<
        { updateMenu: Menu },
        typeof variables
    >(UPDATE_MENU_STRING, variables)

    return response.updateMenu
}

export const deleteMenus = async (ids: string[]): Promise<Menu[]> => {
    const variables = { ids }
    const response = await graphqlRequest<
        { deleteMenu: Menu[] },
        typeof variables
    >(DELETE_MENUS_STRING, variables)

    return response.deleteMenu
}

export const duplicateMenu = async (menuId: string): Promise<Menu> => {
    const variables = {
        input: {
            menuId,
        },
    }

    const response = await graphqlRequest<
        { duplicateMenu: Menu },
        typeof variables
    >(DUPLICATE_MENU_STRING, variables)

    return response.duplicateMenu
}

export const deleteMenuById = async (id: string): Promise<Menu> => {
    const variables = { deleteMenuId: id }

    const response = await graphqlRequest<
        { deleteMenu: Menu },
        typeof variables
    >(DELETE_MENU_STRING, variables)

    return response.deleteMenu
}
