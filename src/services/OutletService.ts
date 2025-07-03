import { graphqlRequest } from './GraphQLService'
import {
    GET_OUTLET_BY_ID_STRING,
    GET_OUTLETS_STRING,
} from '../graphql/queries/outlet.queries'
import { OutletFormSchema } from '@/views/outlets/OutletForm'
import { Outlet } from '@/views/outlets/OutletList/types'
import {
    CREATE_OUTLET_STRING,
    DELETE_OUTLET_STRING,
    DELETE_OUTLETS_STRING,
    UPDATE_OUTLET_STRING,
} from '@/graphql/mutations/outlet.mutations'

export async function apiGetOutletList<T, U extends Record<string, unknown>>(
    params: U,
): Promise<T> {
    return graphqlRequest<T, U>(GET_OUTLETS_STRING, params, {
        timeout: 15000, // 15 seconds for list queries
        retries: 2,
    })
}

export async function apiGetOutlet<T, U extends Record<string, unknown>>(
    params: U,
): Promise<T> {
    return graphqlRequest<T, U>(GET_OUTLET_BY_ID_STRING, {
        ...params,
        getOutletByIdId: params.id,
    }, {
        timeout: 10000, // 10 seconds for single item queries
        retries: 3,
    })
}

export const createOutlet = (
    data: OutletFormSchema & { merchantId: string },
) => {
    return graphqlRequest<{ createOutlet: Outlet }>(CREATE_OUTLET_STRING, {
        outlet: data,
    }, {
        timeout: 20000, // 20 seconds for mutations
        retries: 1, // Don't retry mutations to avoid duplicates
    })
}

export const updateOutlet = (
    id: string,
    data: OutletFormSchema & { merchantId: string },
) => {
    return graphqlRequest<{ updateOutlet: Outlet }>(UPDATE_OUTLET_STRING, {
        data,
        updateOutletId: id,
    }, {
        timeout: 20000,
        retries: 1,
    })
}

export const deleteOutlets = (ids: string[]) => {
    return graphqlRequest<{ deleteOutlets: Outlet[] }>(DELETE_OUTLETS_STRING, {
        ids,
    }, {
        timeout: 30000, // Longer timeout for bulk operations
        retries: 1,
    })
}

export const deleteOutlet = (id: string) => {
    return graphqlRequest<{ deleteOutlet: Outlet }>(DELETE_OUTLET_STRING, {
        deleteOutletId: id,
    }, {
        timeout: 15000,
        retries: 1,
    })
}