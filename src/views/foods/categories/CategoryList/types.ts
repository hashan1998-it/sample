export type Category = {
    id: string
    name: string
    description: string
    menu: string[]
}

export type Filter = {
    minAmount: number | string
    maxAmount: number | string
    categoryStatus: string
    categoryType: string[]
}

export type GetCategoryListResponse = {
    list: Category[]
    total: number
    getAllCategoriesByMerchant: Category[]
}
