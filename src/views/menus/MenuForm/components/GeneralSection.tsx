import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import type { FormSectionBaseProps } from '../types'
import Select from '@/components/ui/Select'
import { graphqlRequest } from '@/services/GraphQLService'
import { GET_OUTLETS_STRING } from '@/graphql/queries/outlet.queries'
import { Outlet } from '@/views/outlets/OutletList/types'
import { useEffect, useState } from 'react'

type GeneralSectionProps = FormSectionBaseProps

type Options = {
    label: string
    value: string
}[]

const GeneralSection = ({ control, errors }: GeneralSectionProps) => {
    const [outlets, setOutlets] = useState<Options>([])
    // const [categories, setCategories] = useState<Options>([])

    const variables = {
        merchantId: '67efb6b174a576558e0aae82',
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [outletRes] = await Promise.all([
                    graphqlRequest<{ getOutlets: Outlet[] }, typeof variables>(
                        GET_OUTLETS_STRING,
                        variables,
                    ),
                    // graphqlRequest<
                    //     { getAllCategories: Category[] },
                    //     typeof variables
                    // >(GET_ALL_CATEGORIES_STRING, variables),
                ])

                setOutlets(
                    outletRes.getOutlets.map((outlet) => ({
                        label: outlet.name,
                        value: outlet.id,
                    })),
                )
                // setCategories(
                //     categoryRes.getAllCategories.map((category) => ({
                //         label: category.name,
                //         value: category.id,
                //     })),
                // )
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Card>
            <h4>Menu Information</h4>
            <p className="text-xs text-gray-500 mb-4">
                <span className="text-red-500">*</span> indicates required
                fields.
            </p>
            <div>
                <FormItem
                    label={
                        <span>
                            Menu Name <span className="text-red-500">*</span>
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
                                placeholder="Product Name"
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

                {/* <FormItem
                    label={
                        <span>
                            Outlet Names <span className="text-red-500">*</span>
                        </span>
                    }
                    invalid={Boolean(errors.outlets)}
                    errorMessage={errors.outlets?.message}
                >
                    <Controller
                        name="outlets"
                        control={control}
                        render={({ field }) => (
                            <Select
                                // isClearable
                                // isMulti
                                placeholder="Select Outlets"
                                options={outlets}
                                value={
                                    field.value && Array.isArray(field.value)
                                        ? outlets.filter((outlet) =>
                                              (
                                                  field.value as unknown as string[]
                                              ).includes(outlet.value),
                                          )
                                        : []
                                }
                                onChange={(selectedOptions) => {
                                    const values =
                                        selectedOptions?.map(
                                            (option) => option.value,
                                        ) || []
                                    field.onChange(values)
                                }}
                            />
                        )}
                    />
                </FormItem> */}
                <FormItem
                    label={
                        <span>
                            Outlet Names <span className="text-red-500">*</span>
                        </span>
                    }
                    invalid={Boolean(errors.outletId)}
                    errorMessage={errors.outletId?.message}
                >
                    <Controller
                        name="outletId"
                        control={control}
                        render={({ field }) => (
                            <Select
                                isClearable
                                placeholder="Select Outlet"
                                options={outlets}
                                value={
                                    outlets.find(
                                        (outlet) =>
                                            outlet.value === field.value,
                                    ) || null
                                }
                                onChange={(selectedOption) => {
                                    field.onChange(selectedOption?.value || '')
                                }}
                            />
                        )}
                    />
                </FormItem>

                {/* <FormItem
                    label={
                        <span>
                            Category Names{' '}
                            <span className="text-red-500">*</span>
                        </span>
                    }
                    invalid={Boolean(errors.categories)}
                    errorMessage={errors.categories?.message}
                >
                    <Controller
                        name="categories"
                        control={control}
                        render={({ field }) => (
                            <Select
                                isClearable
                                isMulti
                                placeholder="Select Categories"
                                options={categories}
                                value={
                                    field.value && Array.isArray(field.value)
                                        ? categories.filter((category) =>
                                              (
                                                  field.value as string[]
                                              ).includes(category.value),
                                          )
                                        : []
                                }
                                onChange={(selectedOptions) => {
                                    const values =
                                        selectedOptions?.map(
                                            (option) => option.value,
                                        ) || []
                                    field.onChange(values)
                                }}
                            />
                        )}
                    />
                </FormItem> */}
            </div>
        </Card>
    )
}

export default GeneralSection
