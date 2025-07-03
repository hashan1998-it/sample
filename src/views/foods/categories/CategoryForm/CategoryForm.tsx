import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import GeneralSection from './components/GeneralSection'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import isEmpty from 'lodash/isEmpty'
import type { CategoryFormSchema } from './types'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'

type CategoryFormProps = {
    onFormSubmit: (values: CategoryFormSchema) => void
    defaultValues?: CategoryFormSchema
    newCategory?: boolean
} & CommonProps

const validationSchema: ZodType<CategoryFormSchema> = z.object({
    name: z
        .string()
        .min(1, 'Category Name is required')
        .max(100, 'Name must be less than 100 characters'),
    description: z.string(),
    menus: z.array(z.string()).optional(),
})

const CategoryForm = (props: CategoryFormProps) => {
    const { onFormSubmit, defaultValues = {}, children } = props

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm<CategoryFormSchema>({
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

    const onSubmit = (values: CategoryFormSchema) => {
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
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default CategoryForm
