export type Menu = {
    id: string
    name: string
    description: string
    categories: string[]
    item: string[]
    outlet: {
        name: string
    }
}

export type Filter = {
    minAmount: number | string
    maxAmount: number | string
    menuStatus: string
    menuType: string[]
}

export type GetProductListResponse = {
    getMenus: Menu[]
    list: Menu[]
    total: number
}
