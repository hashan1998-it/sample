import type { Control, FieldErrors } from 'react-hook-form'

export type OverviewFields = {
    firstName: string
    lastName: string
    email: string
    dialCode: string
    phoneNumber: string
}

export type UserFormSchema = OverviewFields

export type FormSectionBaseProps = {
    control: Control<UserFormSchema>
    errors: FieldErrors<UserFormSchema>
}
