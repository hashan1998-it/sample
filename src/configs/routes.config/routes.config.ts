import { lazy } from 'react'
import authRoute from './authRoute'
import othersRoute from './othersRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute, ...othersRoute]

export const protectedRoutes: Routes = [
    {
        key: 'overview',
        path: '/overview',
        component: lazy(() => import('@/views/overview/Overview')),
        authority: [],
    },

    {
        key: 'outlets',
        path: '/outlets',
        component: lazy(() => import('@/views/outlets/OutletList')),
        authority: [],
    },
    {
        key: 'outlets',
        path: '/outlets/create',
        component: lazy(() => import('@/views/outlets/OutletCreate')),
        authority: [],
    },
    {
        key: 'outlets',
        path: '/outlets/edit/:id',
        component: lazy(() => import('@/views/outlets/OutletEdit')),
        authority: [],
    },
    {
        key: 'menus',
        path: '/menus',
        component: lazy(() => import('@/views/menus/MenuList')),
        authority: [],
    },
    {
        key: 'menus',
        path: '/menus/create',
        component: lazy(() => import('@/views/menus/MenuCreate')),
        authority: [],
    },

    {
        key: 'menus',
        path: '/menus/edit/:id',
        component: lazy(() => import('@/views/menus/MenuEdit')),
        authority: [],
    },
    {
        key: 'menus',
        path: '/menus/:menuid/item/edit/:id',
        component: lazy(() => import('@/views/menus/ItemMenuEdit')),
        authority: [],
    },
    // {
    //     key: 'foods',
    //     path: '/foods',
    //     component: lazy(() => import('')),
    //     authority: [],
    // },
    {
        key: 'foods.items',
        path: '/foods/items',
        component: lazy(() => import('@/views/foods/items/ItemList')),
        authority: [],
    },
    {
        key: 'foods.items',
        path: '/foods/items/create',
        component: lazy(() => import('@/views/foods/items/ItemCreate')),
        authority: [],
    },
    {
        key: 'foods.items',
        path: '/foods/items/edit/:id',
        component: lazy(() => import('@/views/foods/items/ItemEdit')),
        authority: [],
    },
    {
        key: 'foods.categories',
        path: '/foods/categories',
        component: lazy(() => import('@/views/foods/categories/CategoryList')),
        authority: [],
    },
    {
        key: 'foods.categories',
        path: '/foods/categories/create',
        component: lazy(
            () => import('@/views/foods/categories/CategoryCreate'),
        ),
        authority: [],
    },
    {
        key: 'foods.categories',
        path: '/foods/categories/edit/:id',
        component: lazy(() => import('@/views/foods/categories/CategoryEdit')),
        authority: [],
    },
    {
        key: 'setting',
        path: '/settings',
        component: lazy(() => import('@/views/Settings')),
        authority: [],
    },
    {
        key: 'reviews',
        path: '/reviews',
        component: lazy(() => import('@/views/reviews/Reviews')),
        authority: [],
    },
    {
        key: 'complaints',
        path: '/complaints',
        component: lazy(() => import('@/views/complaints/Complaints')),
        authority: [],
    },
    // {
    //     key: 'settings',
    //     path: '/settings',
    //     component: lazy(() => import('@/views/demo/Settings')),
    //     authority: [],
    // },
    // {
    //     key: 'settings.account',
    //     path: '/settings/account',
    //     component: lazy(() => import('@/views/demo/Settings')),
    //     authority: [],
    // },
    // {
    //     key: 'settings.restaurant',
    //     path: '/settings/restaurant',
    //     component: lazy(() => import('@/views/demo/Settings')),
    //     authority: [],
    // },

    ...othersRoute,
]
