import { lazy } from 'react'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const othersRoute: Routes = [
    {
        key: 'accessDenied',
        path: `/access-denied`,
        component: lazy(() => import('@/views/others/AccessDenied')),
        authority: [ADMIN, USER],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    {
        key: 'setting',
        path: `/complete-profile`,
        component: lazy(() => import('@/views/user/UserCreate')),
        authority: [ADMIN, USER],
    },
    {
        key: 'setting',
        path: `/complete-merchant`,
        component: lazy(() => import('@/views/merchant/MerchantCreate')),
        authority: [ADMIN, USER],
    },
    {
        key: 'onboard',
        path: `/onboard`,
        component: lazy(() => import('@/views/onboard')),
        authority: [ADMIN, USER],
    },

    

]

export default othersRoute
