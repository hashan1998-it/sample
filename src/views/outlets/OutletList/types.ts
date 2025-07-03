export type Outlet = {
    id: string
    name: string
    contact: {
        countryCode: string
        mobileNumber: string
    }
    website: string
    description: string
    address: {
        addressLine1: string
        addressLine2?: string
        city: string
        state: string
        postal: string
        country: string
    }
    restaurant: string
    menu: {
        id: string
        name: string
    }
}
export type Contact = {
    countryCode: string
    mobileNumber: string
}
export type Address = {
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postal: string
    country: string
}

export type Filter = {
    minAmount: number | string
    maxAmount: number | string
    productStatus: string
    productType: string[]
}

export type GetOutletListResponse = {
    list: Outlet[]
    total: number
    getOutlets: Outlet[]
}
