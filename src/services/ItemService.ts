import { graphqlRequest } from '@/services/GraphQLService'
import {
    GET_ITEM_BY_ID_STRING,
    GET_ITEMS_STRING,
} from '../graphql/queries/item.queries'
import {
    CREATE_ITEM_STRING,
    DELETE_ITEM_STRING,
    DELETE_ITEMS_STRING,
    UPDATE_ITEM_STRING,
} from '@/graphql/mutations/item.mutations'

import { Item } from '@/views/menus/ItemList/types'
import { ItemFormSchema } from '@/views/foods/items/ItemForm/types'

/**
 * @Service to get teh itemList
 * @param params
 * @returns items of the merchant
 */

export async function apiGetItemList<T, U extends Record<string, unknown>>(
    params: U,
): Promise<T> {
    return graphqlRequest<T, U>(GET_ITEMS_STRING, params)
}

/**
 * @Service get item by id
 * @param params
 * @returns the item by id
 */

export async function apiGetItem<T, U extends Record<string, unknown>>(
    params: U,
): Promise<T> {
    return graphqlRequest<T, U>(GET_ITEM_BY_ID_STRING, {
        ...params,
        getItemByIdId: params.id,
    })
}

export const createItem = (values: ItemFormSchema, merchantId: string) => {
    const imageUrl = values.imgList?.[0]?.img || ''

    return graphqlRequest<{ createItem: Item }>(CREATE_ITEM_STRING, {
        data: {
            ...values,
            addOns: (values.addOns ?? []).map((addOn) => ({
                label: addOn.label,
                price: Number((values.price as string).replace(/,/g, '')),
            })),
            options: (values.options ?? []).map((option) => ({
                label: option.label,
                price: Number((values.price as string).replace(/,/g, '')),
            })),
            price: Number((values.price as string).replace(/,/g, '')),
            imageUrl,
            merchantId,
        },
    })
}

export const updateItem = (
    values: ItemFormSchema,
    merchantId: string,
    updateItemId: string,
) => {
    const price = Number(String(values.price).replace(/,/g, ''))

    return graphqlRequest<{ updateItem: Item }>(UPDATE_ITEM_STRING, {
        data: {
            ...values,
            price,
            addOns: (values.addOns ?? []).map((addOn) => ({
                label: addOn.label,
                price,
            })),
            options: (values.options ?? []).map((option) => ({
                label: option.label,
                price,
            })),
            merchantId,
        },
        updateItemId,
    })
}

export const deleteItems = (ids: string[]) => {
    return graphqlRequest<{ deleteItems: Item[] }>(DELETE_ITEMS_STRING, { ids })
}

export const deleteItem = (deleteItemId: string) => {
    return graphqlRequest<{ deleteItem: Item }>(DELETE_ITEM_STRING, {
        deleteItemId,
    })
}
