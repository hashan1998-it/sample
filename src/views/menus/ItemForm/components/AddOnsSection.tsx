import { useEffect, useRef } from 'react'
import { useFieldArray, Controller } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { NumericInput } from '@/components/shared'
import { FormItem } from '@/components/ui/Form'
import Card from '@/components/ui/Card'
import type { FormSectionBaseProps } from '../types'
import { TbPlus } from 'react-icons/tb'

const AddOnsSection = ({ control, errors }: FormSectionBaseProps) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'addOns',
    })

    const hasAppendedRef = useRef(false)

    useEffect(() => {
        if (!hasAppendedRef.current && fields.length === 0) {
            append({ label: '', price: 0 })
            hasAppendedRef.current = true
        }
    }, [append, fields.length])

    return (
        <Card>
            <h4 className="mb-6">Addons</h4>
            {fields.map((field, index) => (
                <div key={field.id} className="flex gap-4 mb-4">
                    <FormItem
                        invalid={Boolean(errors.addOns?.[index]?.label)}
                        errorMessage={errors.addOns?.[index]?.label?.message}
                    >
                        <Controller
                            name={`addOns.${index}.label`}
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Eg: Extra Cheese"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        invalid={Boolean(errors.addOns?.[index]?.price)}
                        errorMessage={errors.addOns?.[index]?.price?.message}
                        // className="w-[120px]"
                    >
                        <Controller
                            name={`addOns.${index}.price`}
                            control={control}
                            render={({ field }) => (
                                <NumericInput
                                    inputPrefix="$"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="0.00"
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </FormItem>
                    <Button
                        type="button"
                        customColorClass={() =>
                            'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error'
                        }
                        onClick={() => remove(index)}
                    >
                        Remove
                    </Button>
                </div>
            ))}
            <Button
                // size="sm"
                type="button"
                variant="solid"
                icon={<TbPlus className="text-l" />}
                onClick={() => append({ label: '', price: 0 })}
            >
                addOns
            </Button>
        </Card>
    )
}

export default AddOnsSection
