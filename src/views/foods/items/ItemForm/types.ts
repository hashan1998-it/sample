import type { Control, FieldErrors } from 'react-hook-form'

export type Item = {
    id: string
    name: string
    imageUrl: string
    imgList: {
        id: string
        name: string
        img: string
    }[]
    categoryId: string
    menu?: string
    price: number
    description?: string
    addOns?: AddOn[]
    options?: Option[]
    isVegetarian?: boolean
    isFeatured?: boolean
    isAvailable?: boolean
}

export type GeneralFields = {
    name: string
    description?: string
    isVegetarian?: boolean
    isFeatured?: boolean
    isAvailable?: boolean
    menu?: string
}

export type PricingFields = {
    price: number | string
}

export type ImageFields = {
    imgList: {
        id: string
        name: string
        img: string
        // file: File
    }[]
}

export type AttributeFields = {
    categoryId: string
    // tags?: { label: string; value: string }[]
    // brand?: string
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
export type ItemFormSchema = GeneralFields &
    PricingFields &
    ImageFields &
    AttributeFields &
    FormSchema &
    OptionSchema

export type FormSectionBaseProps = {
    control: Control<ItemFormSchema>
    errors: FieldErrors<ItemFormSchema>
}
