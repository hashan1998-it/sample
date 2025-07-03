import type { Control, FieldErrors } from 'react-hook-form'
// import { EScheduleDay } from './enums'

export type OverviewFields = {
    name: string
    description?: string
    email: string
    dialCode: string
    phoneNumber: string
}

export type AddressFields = {
    country: string
    postcode: string
    city: string
    state: string
    addressLine1: string
    addressLine2?: string
}

// export type Time = {
//     hours: number
//     minutes: number
// }
// export type DaySchedule = {
//     from: Time
//     to: Time
// }

// export type SheduleFields = {
//     scheduleMode: 'everyday' | 'weekdays' | 'weekends' | 'custom'

//     generalSchedule?: {
//         from: Time
//         to: Time
//     }

//     schedule: DaySchedule[]
// }

export type MerchantFormSchema = OverviewFields & AddressFields
export type FormSectionBaseProps = {
    control: Control<MerchantFormSchema>
    errors: FieldErrors<MerchantFormSchema>
}
