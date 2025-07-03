import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import GeneralSection from './components/GeneralSection'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import isEmpty from 'lodash/isEmpty'
import type { ItemFormSchema } from './types'
import type { CommonProps } from '@/@types/common'
import AddOnsSection from './components/AddOnsSection'
import AddOptionSection from './components/AddOptionSection'

type ItemFormProps = {
    onFormSubmit: (values: ItemFormSchema) => void
    defaultValues?: ItemFormSchema
    newProduct?: boolean
} & CommonProps

const addOnSchema = z.object({
    label: z.string().min(1, 'Addon label is required'),
    price: z.union([z.string(), z.number()], {
        errorMap: () => ({ message: 'Price required!' }),
    }),
})

const optionSchema = z.object({
    label: z.string().min(1, 'option label is required'),
    price: z.union([z.string(), z.number()], {
        errorMap: () => ({ message: 'Price required!' }),
    }),
})

const validationSchema = z.object({
    price: z.union([z.string(), z.number()], {
        errorMap: () => ({ message: 'Price required!' }),
    }),

    addOns: z.array(addOnSchema).optional(),
    options: z.array(optionSchema).optional(),
})

const ItemForm = (props: ItemFormProps) => {
    const { onFormSubmit, defaultValues = {}, children } = props

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm<z.infer<typeof validationSchema>>({
        defaultValues: {
            ...defaultValues,
        },

        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultValues)])

    const onSubmit = (values: ItemFormSchema) => {
        onFormSubmit?.(values)
    }

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <div className="flex flex-col gap-4">
                    <GeneralSection control={control} errors={errors} />

                    <AddOnsSection control={control} errors={errors} />

                    <AddOptionSection control={control} errors={errors} />
                </div>
            </Container>

            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default ItemForm
