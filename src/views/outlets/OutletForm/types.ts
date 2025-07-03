import type { Control, FieldErrors } from 'react-hook-form'

export type OverviewFields = {
    name: string
    description?: string
    // email: string
    contact: {
        countryCode: string
        mobileNumber: string
    }
}

export type AddressFields = {
    address: {
        country: string
        addressLine1: string
        addressLine2?: string
        state: string
        postal: string
        city: string
    }
}

export type OutletFormSchema = OverviewFields & AddressFields

export type FormSectionBaseProps = {
    control: Control<OutletFormSchema>
    errors: FieldErrors<OutletFormSchema>
}
