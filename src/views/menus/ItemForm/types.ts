import type { Control, FieldErrors } from 'react-hook-form'

export type ItemMenu = {
    id: string
    price: number
    addOns?: AddOn[]
    options?: Option[]
}

export type GeneralFields = {
    price: number | string
}
export type AddOn = {
    label: string
    price: number | string
}

export type FormSchema = {
    addOns?: AddOn[]
}
export type Option = {
    label: string
    price: number | string
}

export type OptionSchema = {
    options?: Option[]
}
// export type PortionFormValues = {
//     portion: string
//     portionPrices: {
//         label: string
//         price: string
//     }[]
// }
export type ItemFormSchema = GeneralFields & FormSchema & OptionSchema

export type FormSectionBaseProps = {
    control: Control<ItemFormSchema>
    errors: FieldErrors<ItemFormSchema>
}
