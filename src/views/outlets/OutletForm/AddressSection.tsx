import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select, { Option as DefaultOption } from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import { FormItem } from '@/components/ui/Form'
import { countryList } from '@/constants/countries.constant'
import { Controller } from 'react-hook-form'
import { components } from 'react-select'
import type { FormSectionBaseProps } from './types'
import type { ControlProps, OptionProps } from 'react-select'

type AddressSectionProps = FormSectionBaseProps

type CountryOption = {
    label: string
    dialCode: string
    value: string
}

const { Control } = components

const CustomSelectOption = (props: OptionProps<CountryOption>) => {
    return (
        <DefaultOption<CountryOption>
            {...props}
            customLabel={(data, label) => (
                <span className="flex items-center gap-2">
                    <Avatar
                        shape="circle"
                        size={20}
                        src={`/img/countries/${data.value}.png`}
                    />
                    <span>{label}</span>
                </span>
            )}
        />
    )
}

const CustomControl = ({ children, ...props }: ControlProps<CountryOption>) => {
    const selected = props.getValue()[0]
    return (
        <Control {...props}>
            {selected && (
                <Avatar
                    className="ltr:ml-4 rtl:mr-4"
                    shape="circle"
                    size={20}
                    src={`/img/countries/${selected.value}.png`}
                />
            )}
            {children}
        </Control>
    )
}

const AddressSection = ({ control, errors }: AddressSectionProps) => {
    return (
        <Card>
            <h4>Address Information</h4>
            <p className="text-xs text-gray-500 mb-6">
                <span className="text-red-500">*</span> indicates required
                fields.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem
                    label={
                        <span>
                            Country <span className="text-red-500">*</span>
                        </span>
                    }
                    invalid={Boolean(errors.address?.country)}
                    errorMessage={errors.address?.country?.message}
                >
                    <Controller
                        name="address.country"
                        control={control}
                        render={({ field }) => (
                            <Select<CountryOption>
                                options={countryList}
                                {...field}
                                components={{
                                    Option: CustomSelectOption,
                                    Control: CustomControl,
                                }}
                                placeholder=""
                                value={countryList.find(
                                    (option) => option.value === field.value,
                                    // console.log(field.value),
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label={
                        <span>
                            State <span className="text-red-500">*</span>
                        </span>
                    }
                    invalid={Boolean(errors.address?.state)}
                    errorMessage={errors.address?.state?.message}
                >
                    <Controller
                        name="address.state"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="State"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem
                    label={
                        <span>
                            City <span className="text-red-500">*</span>
                        </span>
                    }
                    invalid={Boolean(errors.address?.city)}
                    errorMessage={errors.address?.city?.message}
                >
                    <Controller
                        name="address.city"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="City"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label={
                        <span>
                            Postal Code <span className="text-red-500">*</span>
                        </span>
                    }
                    invalid={Boolean(errors.address?.postal)}
                    errorMessage={errors.address?.postal?.message}
                >
                    <Controller
                        name="address.postal"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Postal Code"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>

            <FormItem
                label={
                    <span>
                        Address Line 1 <span className="text-red-500">*</span>
                    </span>
                }
                invalid={Boolean(errors.address?.addressLine1)}
                errorMessage={errors.address?.addressLine1?.message}
            >
                <Controller
                    name="address.addressLine1"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="text"
                            autoComplete="off"
                            placeholder="Address"
                            value={
                                typeof field.value === 'string'
                                    ? field.value
                                    : ''
                            }
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                        />
                    )}
                />
            </FormItem>

            <FormItem
                label={
                    <span>
                        Address Line 2{' '}
                        <span className="text-gray-400 text-sm">
                            (optional)
                        </span>
                    </span>
                }
                invalid={Boolean(errors.address?.addressLine2)}
                errorMessage={errors.address?.addressLine2?.message}
            >
                <Controller
                    name="address.addressLine2"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="text"
                            autoComplete="off"
                            placeholder="Address"
                            {...field}
                        />
                    )}
                />
            </FormItem>
        </Card>
    )
}

export default AddressSection
