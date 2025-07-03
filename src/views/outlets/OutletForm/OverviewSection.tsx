import { useMemo } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select, { Option as DefaultOption } from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import { FormItem } from '@/components/ui/Form'
import NumericInput from '@/components/shared/NumericInput'
import { countryList } from '@/constants/countries.constant'
import { Controller } from 'react-hook-form'
import { components } from 'react-select'
import type { FormSectionBaseProps } from './types'
import type { ControlProps, OptionProps } from 'react-select'

type OverviewSectionProps = FormSectionBaseProps

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
            customLabel={(data) => (
                <span className="flex items-center gap-2">
                    <Avatar
                        shape="circle"
                        size={20}
                        src={`/img/countries/${data.value}.png`}
                    />
                    <span>{data.dialCode}</span>
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

const OverviewSection = ({ control, errors }: OverviewSectionProps) => {
    const dialCodeList = useMemo(() => {
        const newCountryList: Array<CountryOption> = JSON.parse(
            JSON.stringify(countryList),
        )

        return newCountryList.map((country) => {
            country.label = country.dialCode
            return country
        })
    }, [])

    return (
        <Card>
            <h4>Outlet Information</h4>
            <p className="text-xs text-gray-500 mb-4">
                <span className="text-red-500">*</span> indicates required
                fields.
            </p>
            {/* <div className="grid md:grid-cols-2 gap-4"> */}
            <FormItem
                label={
                    <span>
                        Outlet Name <span className="text-red-500">*</span>
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
                            placeholder="Outlet Name"
                            {...field}
                        />
                    )}
                />
            </FormItem>

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

            {/* </div> */}

            {/* <FormItem
                label="Email"
                invalid={Boolean(errors.email)}
                errorMessage={errors.email?.message}
            >
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="email"
                            autoComplete="off"
                            placeholder="Email"
                            {...field}
                        />
                    )}
                />
            </FormItem> */}

            <div className="flex items-end gap-4 w-full">
                <FormItem
                    invalid={
                        Boolean(errors.contact?.mobileNumber) ||
                        Boolean(errors.contact?.countryCode)
                    }
                >
                    <label className="form-label mb-2">
                        Phone Number <span className="text-red-500">*</span>
                    </label>
                    <Controller
                        name="contact.countryCode"
                        control={control}
                        render={({ field }) => (
                            <Select<CountryOption>
                                options={dialCodeList}
                                {...field}
                                className="w-[150px]"
                                components={{
                                    Option: CustomSelectOption,
                                    Control: CustomControl,
                                }}
                                placeholder=""
                                value={dialCodeList.filter(
                                    (option) => option.dialCode === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.dialCode)
                                }
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    className="w-full"
                    invalid={
                        Boolean(errors.contact?.mobileNumber) ||
                        Boolean(errors.contact?.countryCode)
                    }
                    errorMessage={errors.contact?.mobileNumber?.message}
                >
                    <Controller
                        name="contact.mobileNumber"
                        control={control}
                        render={({ field }) => (
                            <NumericInput
                                autoComplete="off"
                                placeholder="Phone Number"
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default OverviewSection
