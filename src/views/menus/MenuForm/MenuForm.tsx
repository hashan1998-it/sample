import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import GeneralSection from './components/GeneralSection'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import isEmpty from 'lodash/isEmpty'
import type { MenuFormSchema } from './types'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import ItemMenuSection from './components/ItemMenuSection'
import { Item } from '../ItemList/types'

type ProductFormProps = {
    onFormSubmit: (values: MenuFormSchema) => void
    defaultValues?: MenuFormSchema
    newMenu?: boolean
    menuId: string
} & CommonProps
export const OutletSchema = z.object({
    id: z.string().min(1, { message: 'Outlet ID is required' }),
    name: z.string().min(1, { message: 'Outlet name is required' }),
})
const validationSchema: ZodType<MenuFormSchema> = z.object({
    name: z.string().min(1, { message: 'Menu Name is required!' }),
    description: z.string().optional(),
    // categories: z
    //     .array(z.string().min(1, 'Category is required'))
    //     .min(1, 'At least one Category is required')
    //     .refine((val) => val.length > 0, {
    //         message: 'Categories are required',
    //     }),
    // outlets: z
    //     .array(z.string().min(1, 'Outlet is required'))
    //     .min(1, 'At least one Outlet is required')
    //     .refine((val) => val.length > 0, {
    //         message: 'Outlets are required',
    //     }),
    outletId: z.string().min(1, 'Outlet is required'),
})

const ProductForm = (props: ProductFormProps) => {
    const { onFormSubmit, defaultValues = {}, children, menuId } = props

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm<MenuFormSchema>({
        defaultValues: {
            ...defaultValues,
            // items: [],
        },
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultValues)])

    const onSubmit = (values: MenuFormSchema) => {
        console.log(values)
        onFormSubmit?.(values)
    }
    const methods = useForm<Item>({
        defaultValues: {
            id: '',
        },
    })
    // Or use _id if available
    const isEditMode = Boolean(defaultValues && defaultValues.id)
    return (
        <FormProvider {...methods}>
            <Form
                className="flex w-full h-full"
                containerClassName="flex flex-col w-full justify-between"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Container>
                    <div className="flex flex-col gap-4">
                        <GeneralSection control={control} errors={errors} />

                        {isEditMode && (
                            <div>
                                {/* Replace this with your actual item list component */}
                                <ItemMenuSection menuId={menuId} />
                            </div>
                        )}
                    </div>
                </Container>
                <BottomStickyBar>{children}</BottomStickyBar>
            </Form>
        </FormProvider>
    )
}

export default ProductForm
