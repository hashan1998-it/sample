import { useMemo, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select, { Option as DefaultOption } from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import { Form, FormItem } from '@/components/ui/Form'
import NumericInput from '@/components/shared/NumericInput'
import { countryList } from '@/constants/countries.constant'
import { components } from 'react-select'
import type { ControlProps, OptionProps } from 'react-select'
import { apiGetSettingsMerchant } from '@/services/AccontsService'
import sleep from '@/utils/sleep'
import useSWR from 'swr'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { GetSettingsMerchantResponse } from '../types'
import { graphqlRequest } from '@/services/GraphQLService'
import { UPDATE_MERCHANT_STRING } from '@/graphql/mutations/merchant.mutations'

type ProfileSchema = {
    name: string
    description: string
    email: string
    contact: {
        countryCode: string
        mobileNumber: string
    }

    address: {
        country: string
        addressLine1: string
        addressLine2?: string
        state: string
        postal: string
        city: string
    }
}

type CountryOption = {
    label: string
    dialCode: string
    value: string
}

const { Control } = components

const validationSchema: ZodType<ProfileSchema> = z.object({
    name: z.string().min(1, { message: 'First Name is required' }),
    description: z.string().min(1, { message: 'Last Name is required' }),
    email: z
        .string()
        .min(1, { message: 'Email is required' })
        .email({ message: 'Invalid email' }),
    contact: z.object({
        countryCode: z
            .string()
            .min(1, { message: 'Please select your country code' }),
        mobileNumber: z
            .string()
            .min(1, { message: 'Please input your mobile number' }),
    }),
    address: z.object({
        country: z.string().min(1, { message: 'Please select a country' }),
        addressLine1: z.string().min(1, { message: 'Addrress is required' }),
        addressLine2: z.string().optional(),
        postal: z.string().min(1, { message: 'Postal Code is required' }),
        city: z.string().min(1, { message: 'City is required' }),
        state: z.string().min(1, { message: 'State is required' }),
    }),
})

const CustomSelectOption = (
    props: OptionProps<CountryOption> & { variant: 'country' | 'phone' },
) => {
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
                    {props.variant === 'country' && <span>{label}</span>}
                    {props.variant === 'phone' && <span>{data.dialCode}</span>}
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

const SettingsMerchant = () => {
    const { data, mutate } = useSWR(
        '/api/settings/merchant/',
        () =>
            apiGetSettingsMerchant<
                { getMerchantById: GetSettingsMerchantResponse },
                { id: string }
            >({
                id: '67efb6b174a576558e0aae82',
            }),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    )
    // console.log('data', data)

    const dialCodeList = useMemo(() => {
        const newCountryList: Array<CountryOption> = JSON.parse(
            JSON.stringify(countryList),
        )

        return newCountryList.map((country) => {
            country.label = country.dialCode
            return country
        })
    }, [])

    const {
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        control,
    } = useForm<ProfileSchema>({
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (data?.getMerchantById) {
            reset(data.getMerchantById)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    const onSubmit = async (values: ProfileSchema) => {
        console.log('values', values)

        const variables = {
            merchant: {
                ...values,
                userId: '67efc1be2324ff23420eb1a5',
            },
            updateMerchantId: '67efb6b174a576558e0aae82',
        }

        const data = await graphqlRequest<
            { updateMerchant: GetSettingsMerchantResponse },
            typeof variables
        >(UPDATE_MERCHANT_STRING, variables)

        console.log('data', data)

        await sleep(500)
        if (data) {
            mutate({ getMerchantById: { ...data, ...values } }, false)
        }
    }

    return (
        <>
            <h4 className="mb-8">Merchant Information</h4>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <FormItem
                    label={
                        <span>
                            Merchant Name{' '}
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
                                placeholder="First Name"
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
                                type="text"
                                autoComplete="off"
                                placeholder="Description"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label={
                        <span>
                            Email <span className="text-red-500">*</span>
                        </span>
                    }
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
                </FormItem>

                <div className="flex items-end gap-4 w-full mb-6">
                    <FormItem
                        invalid={
                            Boolean(errors.contact?.mobileNumber) ||
                            Boolean(errors.contact?.countryCode)
                        }
                        label={
                            <span>
                                Phone Number{' '}
                                <span className="text-red-500">*</span>
                            </span>
                        }
                    >
                        {/* <label className="form-label mb-2">Phone Number</label> */}
                        <Controller
                            name="contact.countryCode"
                            control={control}
                            render={({ field }) => (
                                <Select<CountryOption>
                                    options={dialCodeList}
                                    {...field}
                                    className="w-[150px]"
                                    components={{
                                        Option: (props) => (
                                            <CustomSelectOption
                                                variant="phone"
                                                {...(props as OptionProps<CountryOption>)}
                                            />
                                        ),
                                        Control: CustomControl,
                                    }}
                                    placeholder=""
                                    value={dialCodeList.filter(
                                        (option) =>
                                            option.dialCode === field.value,
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

                <h4 className="mb-6">Address Information</h4>
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
                                        Option: (props) => (
                                            <CustomSelectOption
                                                variant="country"
                                                {...(props as OptionProps<CountryOption>)}
                                            />
                                        ),
                                        Control: CustomControl,
                                    }}
                                    placeholder=""
                                    value={countryList.filter(
                                        (option) =>
                                            option.value === field.value,
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
                                Postal Code{' '}
                                <span className="text-red-500">*</span>
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
                            Address Line 1{' '}
                            <span className="text-red-500">*</span>
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
                                {...field}
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

                <div className="flex justify-end">
                    <Button
                        variant="solid"
                        type="submit"
                        loading={isSubmitting}
                    >
                        Save
                    </Button>
                </div>
            </Form>
        </>
    )
}

export default SettingsMerchant

{
    /* <div className="mb-8">
                    <Controller
                        name="img"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-center gap-4">
                                <Avatar
                                    size={90}
                                    className="border-4 border-white bg-gray-100 text-gray-300 shadow-lg"
                                    icon={<HiOutlineUser />}
                                    src={field.value}
                                />
                                <div className="flex items-center gap-2">
                                    <Upload
                                        showList={false}
                                        uploadLimit={1}
                                        beforeUpload={beforeUpload}
                                        onChange={(files) => {
                                            if (files.length > 0) {
                                                field.onChange(
                                                    URL.createObjectURL(
                                                        files[0],
                                                    ),
                                                )
                                            }
                                        }}
                                    >
                                        <Button
                                            variant="solid"
                                            size="sm"
                                            type="button"
                                            icon={<TbPlus />}
                                        >
                                            Upload Image
                                        </Button>
                                    </Upload>
                                    <Button
                                        size="sm"
                                        type="button"
                                        onClick={() => {
                                            field.onChange('')
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        )}
                    />
                </div> */
}
