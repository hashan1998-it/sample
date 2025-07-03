export type Item = {
    id: string
    name: string
    description: string
    price: number
    category: {
        name: string
    }
    restaurant: string
    menu: string
    item_add_on: string[]
    item_option: string[]
    is_available: boolean
    is_featured: boolean
    is_vegetarian: boolean
    imageUrl: string
}

export type Filter = {
    category: string[]
}

export type GetItemListResponse = {
    list: Item[]
    total: number
    getItems: Item[]
}
