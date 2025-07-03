import useSWR from 'swr'
import { useCategoryListStore } from '../store/categoryListStore'
import type { GetCategoryListResponse } from '../types'
import { apiGetCategoryList } from '@/services/CategoryService'
import useMerchantStore from '@/store/useMerchantStore'

const useCategoryList = () => {
    const merchantId = useMerchantStore((state) => state.merchantId)
    const {
        tableData,
        filterData,
        setTableData,
        setFilterData,
        selectedCategory,
        setSelectedCategory,
        setSelectAllCategory,
    } = useCategoryListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        [
            '/api/categories',
            {
                ...tableData,
                ...filterData,
                // merchantId: '67efb6b174a576558e0aae82',
                merchantId,
            },
        ],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) => apiGetCategoryList<GetCategoryListResponse>(params),
        {
            revalidateOnFocus: false,
        },
    )

    const categoryList = data?.getAllCategoriesByMerchant || []

    const categoryListTotal = data?.getAllCategoriesByMerchant?.length || 0

    return {
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        categoryList,
        categoryListTotal,
        setTableData,
        selectedCategory,
        setSelectedCategory,
        setSelectAllCategory,
        setFilterData,
    }
}

export default useCategoryList
