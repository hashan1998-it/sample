import { useMemo, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Upload from '@/components/ui/Upload'
import Input from '@/components/ui/Input'
import Select, { Option as DefaultOption } from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import { Form, FormItem } from '@/components/ui/Form'
import NumericInput from '@/components/shared/NumericInput'
import { countryList } from '@/constants/countries.constant'
import { components } from 'react-select'
import type { ControlProps, OptionProps } from 'react-select'
import { apiGetSettingsProfile } from '@/services/AccontsService'
import sleep from '@/utils/sleep'
import useSWR from 'swr'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { HiOutlineUser } from 'react-icons/hi'
import { TbPlus } from 'react-icons/tb'
import type { ZodType } from 'zod'
import type { GetSettingsProfileResponse } from '../types'

type ProfileSchema = {
    firstName: string
    lastName: string
    email: string
    contact: {
        countryCode: string
        mobileNumber: string
    }
    address: {
        addressLine1: string
        addressLine2?: string
        postal: string
        state: string
        city: string
        country: string
    }
    img: string
}

type CountryOption = {
    label: string
    dialCode: string
    value: string
}

const { Control } = components

const validationSchema: ZodType<ProfileSchema> = z.object({
    firstName: z.string().min(1, { message: 'First Name is required' }),
    lastName: z.string().min(1, { message: 'Last Name is required' }),
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
        state: z.string().min(1, { message: 'State is required' }),
        city: z.string().min(1, { message: 'City is required' }),
    }),

    img: z.string(),
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

const SettingsProfile = () => {
    const { data, mutate } = useSWR(
        '/api/settings/profile/',
        () =>
            apiGetSettingsProfile<
                { getUser: GetSettingsProfileResponse },
                { id: string }
            >({
                id: '68262d562d330001fc46e0fb',
            }),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    )
    console.log('userData', data)
    const dialCodeList = useMemo(() => {
        const newCountryList: Array<CountryOption> = JSON.parse(
            JSON.stringify(countryList),
        )

        return newCountryList.map((country) => {
            country.label = country.dialCode
            return country
        })
    }, [])

    const beforeUpload = (files: FileList | null) => {
        let valid: string | boolean = true

        const allowedFileType = ['image/jpeg', 'image/png']
        if (files) {
            for (const file of files) {
                if (!allowedFileType.includes(file.type)) {
                    valid = 'Please upload a .jpeg or .png file!'
                }
            }
        }

        return valid
    }

    const {
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        control,
    } = useForm<ProfileSchema>({
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (data?.getUser) {
            reset(data?.getUser)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    const onSubmit = async (values: ProfileSchema) => {
        console.log('values', values)
        await sleep(500)
        if (data) {
            mutate({ ...data, ...values }, false)
        }
    }

    return (
        <>
            <h4 className="mb-8">Personal Information</h4>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-8">
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
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <FormItem
                        label={
                            <span>
                                First Name{' '}
                                <span className="text-red-500">*</span>
                            </span>
                        }
                        invalid={Boolean(errors.firstName)}
                        errorMessage={errors.firstName?.message}
                    >
                        <Controller
                            name="firstName"
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
                                Last Name{' '}
                                <span className="text-red-500">*</span>
                            </span>
                        }
                        invalid={Boolean(errors.lastName)}
                        errorMessage={errors.lastName?.message}
                    >
                        <Controller
                            name="lastName"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Last Name"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                </div>

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
                        {/* <label className="form-label mb-2">
                            Phone Number <span className="text-red-500">*</span>
                        </label> */}
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
                                placeholder="Address Line 1"
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
                                placeholder="Address Line 2"
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

export default SettingsProfile
