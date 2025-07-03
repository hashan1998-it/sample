import type { Control, FieldErrors } from 'react-hook-form'

export type Menu = {
    id: string
    description?: string
    name: string
    // categories: string[]
    // items: string[]
    outletId: string
}

export type GeneralFields = {
    name: string
    description?: string
    // categories: string[]
    // items: string[]
    outletId: string
}

export type MenuFormSchema = GeneralFields

export type FormSectionBaseProps = {
    control: Control<MenuFormSchema>
    errors: FieldErrors<MenuFormSchema>
}
