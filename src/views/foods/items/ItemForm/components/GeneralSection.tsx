import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import type { FormSectionBaseProps } from '../types'
import { NumericInput } from '@/components/shared'
import { Select } from '@/components/ui/Select'
import Checkbox from '@/components/ui/Checkbox'
import { graphqlRequest } from '@/services/GraphQLService'
import { Category } from '@/views/foods/categories/CategoryList/types'
import { GET_ALL_CATEGORIES_STRING } from '@/graphql/queries/category.queries'
import { useEffect, useState } from 'react'

type GeneralSectionProps = FormSectionBaseProps
type Options = {
    label: string
    value: string
}[]

const GeneralSection = ({ control, errors }: GeneralSectionProps) => {
    const [categories, setCategories] = useState<Options>([])
    // const [loading, setLoading] = useState(true)
    const variables = {
        merchantId: '67efb6b174a576558e0aae82',
    }

    useEffect(() => {
        const fetchData = async () => {
            // setLoading(true)
            try {
                const categoryRes = await graphqlRequest<{
                    getAllCategories: Category[]
                }>(GET_ALL_CATEGORIES_STRING, variables)
                // const menuRes = await graphqlRequest<{ getMenus: Menu[] }>(
                //     GET_MENUS_STRING,
                //     variables,
                // )

                setCategories(
                    categoryRes.getAllCategories.map((category) => ({
                        label: category.name,
                        value: category.id,
                    })),
                )
                // setMenus(
                //     menuRes.getMenus.map((menu) => ({
                //         label: menu.name,
                //         value: menu.id,
                //     })),
                // )
            } catch (err) {
                console.error('Error fetching categories or menus', err)
            }
        }

        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Card>
            <h4>Item Information</h4>
            <p className="text-xs text-gray-500 mb-6">
                <span className="text-red-500">*</span> indicates required
                fields.
            </p>

            <FormItem
                label={
                    <span>
                        Item Name <span className="text-red-500">*</span>
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
                            placeholder="Item Name"
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
                        Price <span className="text-red-500">*</span>
                    </span>
                }
                invalid={Boolean(errors.price)}
                errorMessage={errors.price?.message}
            >
                <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                        <NumericInput
                            // thousandSeparator
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

            <FormItem
                label={
                    <span>
                        Category Name <span className="text-red-500">*</span>
                    </span>
                }
                invalid={Boolean(errors.categoryId)}
                errorMessage={errors.categoryId?.message}
            >
                <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                        <Select
                            isClearable
                            placeholder="Select Category"
                            options={categories}
                            value={
                                categories.find(
                                    (category) =>
                                        category.value === field.value,
                                ) || null
                            }
                            onChange={(selectedOption) => {
                                field.onChange(selectedOption?.value || null)
                            }}
                        />
                    )}
                />
            </FormItem>

            <FormItem
                label={
                    <span>
                        Diatery Products{' '}
                        <span className="text-gray-400 text-sm">
                            (optional)
                        </span>
                    </span>
                }
            >
                <div className="classname flex justify-start gap-6">
                    <FormItem
                        // label="Vegetarian"
                        invalid={Boolean(errors.isVegetarian)}
                        errorMessage={errors.isVegetarian?.message}
                    >
                        <Controller
                            name="isVegetarian"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    checked={field.value}
                                    onChange={field.onChange}
                                >
                                    Vegetarian
                                </Checkbox>
                            )}
                        />
                    </FormItem>
                    {/* <FormItem
                        // label="Vegetarian"
                        invalid={Boolean(errors.isHalal)}
                        errorMessage={errors.isHalal?.message}
                    >
                        <Controller
                            name="isHalal"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    checked={field.value}
                                    onChange={field.onChange}
                                >
                                    Halal
                                </Checkbox>
                            )}
                        />
                    </FormItem> */}
                    {/* <FormItem
                        // label="Vegetarian"
                        invalid={Boolean(errors.vegan)}
                        errorMessage={errors.vagan?.message}
                    >
                        <Controller
                            name="vegan"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    checked={field.value}
                                    onChange={field.onChange}
                                >
                                    Vegan
                                </Checkbox>
                            )}
                        />
                    </FormItem> */}
                </div>
            </FormItem>

            <FormItem
                label={
                    <span>
                        Item Status{' '}
                        <span className="text-gray-400 text-sm">
                            (optional)
                        </span>
                    </span>
                }
            >
                <div className="classname flex justify-start gap-6">
                    <FormItem
                        // label="Featured"
                        invalid={Boolean(errors.isFeatured)}
                        errorMessage={errors.isFeatured?.message}
                    >
                        <Controller
                            name="isFeatured"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    checked={field.value}
                                    onChange={field.onChange}
                                >
                                    Featured
                                </Checkbox>
                            )}
                        />
                    </FormItem>
                    <FormItem
                        // label="Available"
                        invalid={Boolean(errors.isAvailable)}
                        errorMessage={errors.isAvailable?.message}
                    >
                        <Controller
                            name="isAvailable"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    checked={field.value}
                                    onChange={field.onChange}
                                >
                                    Available
                                </Checkbox>
                            )}
                        />
                    </FormItem>
                </div>
            </FormItem>
        </Card>
    )
}

export default GeneralSection
