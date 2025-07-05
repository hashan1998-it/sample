import { apiGetOutletList } from '@/services/OutletService'
import useSWR from 'swr'
import { useOutletListStore } from '../store/outletListStore'
import { GetOutletListResponse } from '../types'
import { TableQueries } from '@/@types/common'
import useMerchantStore from '@/store/useMerchantStore'

const useOutletList = () => {
    const merchantId = useMerchantStore((state) => state.merchantId)
    const {
        tableData,
        filterData,
        setTableData,
        setFilterData,
        selectedOutlet,
        setSelectedOutlet,
        setSelectAllOutlet,
    } = useOutletListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        merchantId ? [
            '/api/outlets',
            {
                ...tableData,
                ...filterData,
                merchantId,
            },
        ] : null, // Don't fetch if no merchantId
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async ([_, params]) => {
            try {
                return await apiGetOutletList<GetOutletListResponse, TableQueries>(params);
            } catch (error) {
                console.error('Outlet list fetch error:', error);
                throw error;
            }
        },
        {
            revalidateOnFocus: false,
            errorRetryCount: 3,
            errorRetryInterval: 2000,
            timeout: 30000, // 30 second timeout
            dedupingInterval: 5000, // Prevent duplicate requests within 5 seconds
            shouldRetryOnError: (error) => {
                // Don't retry on client errors (4xx) or specific server errors
                if (error?.message?.includes('timeout') || 
                    error?.message?.includes('network') ||
                    error?.status >= 500) {
                    return true;
                }
                return false;
            }
        },
    )

    const outletList = data?.getOutlets || []
    const outletListTotal = outletList.length || 0

    return {
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        outletList,
        outletListTotal,
        setTableData,
        selectedOutlet,
        setSelectedOutlet,
        setSelectAllOutlet,
        setFilterData,
    }
}

export default useOutletList