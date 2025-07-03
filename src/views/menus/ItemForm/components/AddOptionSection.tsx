import { useState } from 'react'
import { useFieldArray, Controller, useWatch } from 'react-hook-form'
import Input from '@/components/ui/Input'
import { NumericInput } from '@/components/shared'
import { FormItem } from '@/components/ui/Form'
import Card from '@/components/ui/Card'
import type { FormSectionBaseProps } from '../types'
import { TbPlus } from 'react-icons/tb'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'

const AddOptionsSection = ({ control, errors }: FormSectionBaseProps) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'options',
    })

    const [dialogIsOpen, setIsOpen] = useState(false)

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = (e: React.MouseEvent<HTMLElement>) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
    }

    const onDialogOk = (e: React.MouseEvent<HTMLElement>) => {
        console.log('onDialogOk', e)
        setIsOpen(false)
    }

    // Watch the options array to track live label updates
    const options = useWatch({ control, name: 'options' })

    return (
        <Card>
            <div>
                <h4 className="mb-6">Options</h4>
                <div className="flex items-center gap-3 flex-wrap mb-4">
                    {/* Tag Display */}
                    {(options?.length ?? 0) > 0 &&
                        (options ?? []).map((opt, idx) =>
                            opt.label?.trim() ? (
                                <span
                                    key={idx}
                                    className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full "
                                >
                                    {opt.label}
                                </span>
                            ) : null,
                        )}

                    <Button
                        type="button"
                        variant="solid"
                        icon={<TbPlus />}
                        onClick={openDialog}
                    >
                        Options
                    </Button>
                </div>

                <Dialog
                    isOpen={dialogIsOpen}
                    style={{
                        content: {
                            marginTop: 250,
                        },
                    }}
                    contentClassName="pb-0 px-0"
                    onClose={onDialogClose}
                    onRequestClose={onDialogClose}
                >
                    <div className="px-6 pb-6">
                        <h5 className="mb-4">Add Option</h5>

                        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="flex flex-row gap-4 w-full"
                                >
                                    <FormItem
                                        invalid={Boolean(
                                            errors.options?.[index]?.label,
                                        )}
                                        errorMessage={
                                            errors.options?.[index]?.label
                                                ?.message
                                        }
                                    >
                                        <Controller
                                            name={`options.${index}.label`}
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    type="text"
                                                    placeholder="Eg: Large"
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </FormItem>

                                    <FormItem
                                        invalid={Boolean(
                                            errors.options?.[index]?.price,
                                        )}
                                        errorMessage={
                                            errors.options?.[index]?.price
                                                ?.message
                                        }
                                    >
                                        <Controller
                                            name={`options.${index}.price`}
                                            control={control}
                                            render={({ field }) => (
                                                <NumericInput
                                                    inputPrefix="$"
                                                    type="text"
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

                            <div>
                                <Button
                                    type="button"
                                    variant="solid"
                                    size="sm"
                                    icon={<TbPlus />}
                                    onClick={() =>
                                        append({ label: '', price: 0 })
                                    }
                                >
                                    Add Option
                                </Button>
                            </div>
                        </div>

                        <div className="text-right px-6 pt-6">
                            <Button
                                type="button"
                                className="ltr:mr-2 rtl:ml-2"
                                onClick={onDialogClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="solid"
                                onClick={onDialogOk}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </Dialog>
            </div>
        </Card>
    )
}

export default AddOptionsSection
