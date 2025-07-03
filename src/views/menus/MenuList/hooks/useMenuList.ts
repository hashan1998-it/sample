import { apiGetMenuList } from '@/services/MenuService'
import useSWR from 'swr'
import { useMenuListStore } from '../store/MenuListStore'
import type { GetProductListResponse } from '../types'
import { TableQueries } from '@/@types/common'
import useMerchantStore from '@/store/useMerchantStore'

// import type { TableQueries } from '@/@types/common'

const useMenuList = () => {
    const merchantId = useMerchantStore((state) => state.merchantId)
    const {
        tableData,
        filterData,
        setTableData,
        setFilterData,
        selectedMenu,
        setSelectedMenu,
        setSelectAllMenu,
    } = useMenuListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        [
            '/api/products',
            {
                ...tableData,
                ...filterData,
                // merchantId: '67efb6b174a576558e0aae82',
                merchantId,
            },
        ],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetMenuList<GetProductListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )

    const menuList = data?.getMenus || []
    // console.log('menuList', menuList)

    const menuListTotal = data?.getMenus.length || 0

    return {
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        menuList,
        menuListTotal,
        setTableData,
        selectedMenu,
        setSelectedMenu,
        setSelectAllMenu,
        setFilterData,
    }
}

export default useMenuList
