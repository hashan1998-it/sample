// import { fetchGraphQL } from '@/apollo/GraphQLService'
import { graphqlRequest } from '@/services/GraphQLService'
import ApiService from './ApiService'
import { GET_USERS_BY_ID_STRING } from '@/graphql/queries/user.queries'
import { GET_MERCHANT_BY_ID_STRING } from '@/graphql/queries/merchant.queries'
// import { GET_MERCHANT_BY_ID } from '@/graphql/queries/merchant.queries'
// import { GET_USERS_BY_ID } from '@/graphql/queries/user.queries'

// export async function apiGetSettingsProfile<T>() {
//     return ApiService.fetchDataWithAxios<T>({
//         url: '/setting/profile',
//         method: 'get',
//     })
// }
// export async function apiGetSettingsProfile<
//     T,
//     U extends Record<string, unknown>,
// >({ id, ...params }: U) {
//     return fetchGraphQL<T>({
//         query: GET_USERS_BY_ID,
//         variables: { getUserId: id, ...params },
//     })
// }
// export async function apiGetSettingsMerchant<T>() {
//     return ApiService.fetchDataWithAxios<T>({
//         url: '/setting/merchant',
//         method: 'get',
//     })
// }
// export async function apiGetSettingsMerchant<
//     T,
//     U extends Record<string, unknown>,
// >({ id, ...params }: U) {
//     return fetchGraphQL<T>({
//         query: GET_MERCHANT_BY_ID,
//         variables: { getMerchantByIdId: id, ...params },
//     })
// }
export async function apiGetSettingsNotification<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/setting/notification',
        method: 'get',
    })
}

export async function apiGetSettingsBilling<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/setting/billing',
        method: 'get',
    })
}

export async function apiGetSettingsIntergration<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/setting/intergration',
        method: 'get',
    })
}

export async function apiGetRolesPermissionsUsers<
    T,
    U extends Record<string, unknown>,
>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/rbac/users',
        method: 'get',
        params,
    })
}

export async function apiGetRolesPermissionsRoles<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/rbac/roles',
        method: 'get',
    })
}

export async function apiGetPricingPlans<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/pricing',
        method: 'get',
    })
}

export async function apiGetSettingsProfile<
    T,
    U extends Record<string, unknown>,
>(params: U): Promise<T> {
    return graphqlRequest<T, U>(GET_USERS_BY_ID_STRING, {
        ...params,
        getUserId: params.id,
    })
}

export async function apiGetSettingsMerchant<
    T,
    U extends Record<string, unknown>,
>(params: U): Promise<T> {
    return graphqlRequest<T, U>(GET_MERCHANT_BY_ID_STRING, {
        ...params,
        getMerchantByIdId: params.id,
    })
}
