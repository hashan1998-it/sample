import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import type { FormSectionBaseProps } from '../types'

type GeneralSectionProps = FormSectionBaseProps
// type Options = {
//     label: string
//     value: string
// }[]

// const menus: Options = [
//     { label: 'menu1', value: 'menu1' },
//     { label: 'menu2', value: 'menu2' },
//     { label: 'menu3', value: 'menu3' },
//     { label: 'menu4', value: 'menu4' },
//     { label: 'menu5', value: 'menu5' },
// ]
const GeneralSection = ({ control, errors }: GeneralSectionProps) => {
    return (
        <Card>
            <h4>Category Information</h4>
            <p className="text-xs text-gray-500 mb-6">
                <span className="text-red-500">*</span> indicates required
                fields.
            </p>
            <div>
                <FormItem
                    label={
                        <span>
                            Category Name{' '}
                            <span className="text-red-500">*</span>
                        </span>
                    }
                    invalid={Boolean(errors.name)}
                    errorMessage={errors.name?.message}
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Category Name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>

            <FormItem
                label={
                    <span>
                        Description{' '}
                        <span className="text-gray-400 text-sm">
                            (optional)
                        </span>
                    </span>
                }
                invalid={Boolean(errors.description)}
                errorMessage={errors.description?.message}
            >
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <Input
                            textArea
                            type="text"
                            autoComplete="off"
                            placeholder="Description"
                            {...field}
                        />
                    )}
                />
            </FormItem>

            {/* <FormItem
                label="Menus"
                invalid={Boolean(errors.menus)}
                errorMessage={errors.menus?.message}
            >
                <Controller
                    name="menus"
                    control={control}
                    render={({ field }) => (
                        <Select
                            isClearable
                            isMulti
                            placeholder="Select Menus"
                            options={menus}
                            value={menus.filter((menus) =>
                                field.value?.includes(menus.value),
                            )}
                            onChange={(selectedOptions) =>
                                field.onChange(
                                    selectedOptions?.map(
                                        (menus) => menus.value,
                                    ),
                                )
                            }
                        />
                    )}
                />
            </FormItem> */}
        </Card>
    )
}

export default GeneralSection
