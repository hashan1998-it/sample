import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import type { FormSectionBaseProps } from '../types'
import { NumericInput } from '@/components/shared'

type GeneralSectionProps = FormSectionBaseProps
// type Options = {
//     label: string
//     value: string
// }[]

const GeneralSection = ({ control, errors }: GeneralSectionProps) => {
    return (
        <Card>
            <h4>Update Item</h4>
            <p className="text-xs text-gray-500 mb-4">
                <span className="text-red-500">*</span> This changes only
                affects this menu.
            </p>

            <FormItem
                label="Price"
                invalid={Boolean(errors.price)}
                errorMessage={errors.price?.message}
            >
                <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                        <NumericInput
                            type="text"
                            inputPrefix="$"
                            autoComplete="off"
                            placeholder="0.00"
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
            </FormItem>
        </Card>
    )
}

export default GeneralSection
