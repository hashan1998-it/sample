import { apiGetItemList } from '@/services/ItemService'
import useSWR from 'swr'
import { useItemListStore } from '../store/itemListStore'
import type { GetItemListResponse } from '../types'
import { TableQueries } from '@/@types/common'
import useMerchantStore from '@/store/useMerchantStore'
// import type { TableQueries } from '@/@types/common'

const useItemList = () => {
    const merchantId = useMerchantStore((state) => state.merchantId)
    const {
        tableData,
        filterData,
        setTableData,
        setFilterData,
        selectedItem,
        setSelectedItem,
        setSelectAllItem,
    } = useItemListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        [
            '/api/outlets',
            {
                ...tableData,
                ...filterData,
                // merchantId: '67efb6b174a576558e0aae82',
                merchantId,
            },
        ],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetItemList<GetItemListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )

    console.log(data)
    const itemList = data?.getItems || []

    const itemListTotal = data?.getItems.length || 0

    return {
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        itemList,
        itemListTotal,
        setTableData,
        selectedItem,
        setSelectedItem,
        setSelectAllItem,
        setFilterData,
    }
}

export default useItemList
