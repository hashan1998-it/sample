import { graphqlRequest } from '@/services/GraphQLService'
import {
    GET_ALL_CATEGORIES_BY_MERCHANT_STRING,
    GET_CATEGORY_BY_ID_STRING,
} from '@/graphql/queries/category.queries'
import {
    Category,
    CategoryFormSchema,
} from '@/views/foods/categories/CategoryForm/types'
import {
    CREATE_CATEGORY_STRING,
    DELETE_CATEGORIES_STRING,
    DELETE_CATEGORY_STRING,
    UPDATE_CATEGORY_STRING,
} from '@/graphql/mutations/category.mutations'

/**
 * @Service to fetch all categories by merchant
 * @param variables
 * @returns merchant categories
 */

export async function apiGetCategoryList<T>(
    variables?: Record<string, unknown>,
): Promise<T> {
    return graphqlRequest<T, typeof variables>(
        GET_ALL_CATEGORIES_BY_MERCHANT_STRING,
        variables,
    )
}

/**
 * @Service to fetch a single category by ID
 * @param params
 * @returns category by id
 */

export async function apiGetCategory<T, U extends Record<string, unknown>>(
    params: U,
): Promise<T> {
    return graphqlRequest<T, U>(GET_CATEGORY_BY_ID_STRING, {
        ...params,
        getCategoryByIdId: params.id,
    })
}

/**
 * @Service to create a new category
 * @param data
 * @returns created category
 */

export const createCategory = (
    data: CategoryFormSchema & { merchantId: string },
) => {
    return graphqlRequest<{ createCategory: Category }>(
        CREATE_CATEGORY_STRING,
        { data },
    )
}

/**
 * @Service to update an existing category
 * @param updateCategoryId
 * @param data
 * @returns the updated category
 */

export const updateCategory = (
    updateCategoryId: string,
    data: CategoryFormSchema & { merchantId: string },
) => {
    return graphqlRequest<{ updateOutlet: Category }>(UPDATE_CATEGORY_STRING, {
        updateCategoryId,
        data,
    })
}

/**
 * @Service to delete categories by their Ids
 * @param ids
 * @returns
 */

export const deleteCategories = (ids: string[]) => {
    return graphqlRequest<{ deleteCategories: Category[] }>(
        DELETE_CATEGORIES_STRING,
        { ids },
    )
}

/**
 * @Service to delete a single category by its Id
 * @param deleteCategoryId
 * @returns
 */

export const deleteCategory = (deleteCategoryId: string) => {
    return graphqlRequest<{ deleteOutlet: Category }>(DELETE_CATEGORY_STRING, {
        deleteCategoryId,
    })
}

// import { fetchGraphQL } from '../apollo/GraphQLService'
// import {
//     GET_ALL_CATEGORIES,
//     GET_CATEGORY_BY_ID,
// } from '../graphql/queries/category.queries'

// export async function apiGetCategoryList<T>(
//     variables?: Record<string, unknown>,
// ) {
//     return fetchGraphQL<T>({
//         query: GET_ALL_CATEGORIES,
//         variables,
//     })
// }

// export async function apiGetCategory<T, U extends Record<string, unknown>>({
//     id,
//     ...params
// }: U) {
//     return fetchGraphQL<T>({
//         query: GET_CATEGORY_BY_ID,
//         variables: { getCategoryByIdId: id, ...params },
//     })
// }

// // import ApiService from './ApiService'

// // export async function apiGetCategoryList<T, U extends Record<string, unknown>>(
// //     params: U,
// // ) {
// //     return ApiService.fetchDataWithAxios<T>({
// //         url: '/categories',
// //         method: 'get',
// //         params,
// //     })
// // }

// // export async function apiGetCategory<T, U extends Record<string, unknown>>({
// //     id,
// //     ...params
// // }: U) {
// //     return ApiService.fetchDataWithAxios<T>({
// //         url: `/categories/${id}`,
// //         method: 'get',
// //         params,
// //     })
// // }

// // export async function apiGetCategory<T>(variables: { id: string }) {
// //     return fetchGraphQL<T>({
// //         query: GET_CATEGORY,
// //         variables,
// //     })
// // }
