import { GET_ITEM_BY_ID_STRING } from '@/graphql/queries/item.queries'
import { graphqlRequest } from './GraphQLService'
import {
    GET_ITEM_MENU_BY_ITEM_AND_MENU,
    GET_ITEM_MENUS_STRING,
} from '@/graphql/queries/itemMenu.queries'
import { ItemFormSchema, ItemMenu } from '@/views/menus/ItemForm/types'
import {
    CREATE_ITEM_MENU_STRING,
    DELETE_ITEM_MENU_BY_MENU_AND_ITEM_STRING,
    UPDATE_ITEM_MENU_BY_MENU_AND_ITEM,
} from '@/graphql/mutations/itemMenu.mutation'

export async function apiGetItem<T, U extends Record<string, unknown>>(
    params: U,
): Promise<T> {
    return graphqlRequest<T, U>(GET_ITEM_BY_ID_STRING, {
        ...params,
        getItemByIdId: params.id,
    })
}

export async function apiGetItemMenu<
    T,
    U extends { menuId: string; itemId: string },
>(params: U): Promise<T> {
    return graphqlRequest<T, U>(GET_ITEM_MENU_BY_ITEM_AND_MENU, params)
}

export const updateItemMenu = async (
    itemId: string,
    menuId: string,
    values: ItemFormSchema,
) => {
    const formattedAddOns = (values.addOns ?? []).map((addOn) => ({
        ...addOn,
        price: Number(addOn.price),
    }))

    const formattedOptions = (values.options ?? []).map((option) => ({
        ...option,
        price: Number(option.price),
    }))

    const variables = {
        menuId,
        itemId,
        data: {
            addOns: formattedAddOns,
            options: formattedOptions,
            menu: menuId,
            item: itemId,
            price: Number(values.price),
        },
    }

    return graphqlRequest(UPDATE_ITEM_MENU_BY_MENU_AND_ITEM, variables)
}

export const createItemMenu = async (menuId: string, itemId: string) => {
    const variables = {
        data: {
            menu: menuId,
            item: itemId,
        },
    }

    const response = await graphqlRequest(CREATE_ITEM_MENU_STRING, variables)
    return response
}

export const getItemMenus = async (): Promise<ItemMenu[]> => {
    type GetItemMenusResponse = {
        getItemMenus?: ItemMenu[]
    }

    const response = await graphqlRequest<GetItemMenusResponse>(
        GET_ITEM_MENUS_STRING,
    )
    return response?.getItemMenus || []
}

export const deleteItemMenu = async (menuId: string, itemId: string) => {
    const variables = { menuId, itemId }
    const response = await graphqlRequest(
        DELETE_ITEM_MENU_BY_MENU_AND_ITEM_STRING,
        variables,
    )
    return response
}
