export type View =
    | 'profile'
    | 'merchant'
    | 'notification'
    | 'billing'
    | 'integration'

export type Integration = {
    id: string
    name: string
    desc: string
    img: string
    type: string
    active: boolean
    installed?: boolean
}

export type GetSettingsMerchantResponse = {
    // id: string
    name: string
    email: string
    address: {
        addressLine1: string
        addressLine2?: string
        postal: string
        state: string
        city: string
        country: string
    }
    contact: {
        countryCode: string
        mobileNumber: string
    }
}
export type GetSettingsProfileResponse = {
    id: string
    firstName: string
    lastName: string
    email: string
    address: {
        addressLine1: string
        addressLine2?: string
        postal: string
        state: string
        city: string
        country: string
    }
    contact: {
        countryCode: string
        mobileNumber: string
    }
}

export type GetSettingsNotificationResponse = {
    email: string[]
    desktop: boolean
    unreadMessageBadge: boolean
    notifymeAbout: string
}

export type GetSettingsIntegrationResponse = Integration[]
