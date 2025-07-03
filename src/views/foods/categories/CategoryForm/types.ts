import type { Control, FieldErrors } from 'react-hook-form'

export type Category = {
    id: string
    name: string
    description: string
    menus?: string[]
}

export type GeneralFields = {
    name: string
    description: string
    menus?: string[]
}

export type CategoryFormSchema = GeneralFields

export type FormSectionBaseProps = {
    control: Control<CategoryFormSchema>
    errors: FieldErrors<CategoryFormSchema>
}
