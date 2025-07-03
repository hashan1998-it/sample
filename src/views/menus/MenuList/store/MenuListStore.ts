import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import type { Menu, Filter } from '../types'

export const initialTableData: TableQueries = {
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
        order: '',
        key: '',
    },
}

export const initialFilterData = {
    minAmount: 0,
    maxAmount: 5000,
    menuStatus: 'published',
    menuType: ['Bags', 'Cloths', 'Devices', 'Shoes', 'Watches'],
}

export type MenuListState = {
    tableData: TableQueries
    filterData: Filter
    selectedMenu: Partial<Menu>[]
}

type MenuListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedMenu: (checked: boolean, customer: Menu) => void
    setSelectAllMenu: (customer: Menu[]) => void
}

const initialState: MenuListState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedMenu: [],
}

export const useMenuListStore = create<MenuListState & MenuListAction>(
    (set) => ({
        ...initialState,
        setFilterData: (payload) => set(() => ({ filterData: payload })),
        setTableData: (payload) => set(() => ({ tableData: payload })),
        setSelectedMenu: (checked, row) =>
            set((state) => {
                const prevData = state.selectedMenu
                if (checked) {
                    return { selectedMenu: [...prevData, ...[row]] }
                } else {
                    if (
                        prevData.some(
                            (prevProduct) => row.id === prevProduct.id,
                        )
                    ) {
                        return {
                            selectedMenu: prevData.filter(
                                (prevProduct) => prevProduct.id !== row.id,
                            ),
                        }
                    }
                    return { selectedMenu: prevData }
                }
            }),
        setSelectAllMenu: (row) => set(() => ({ selectedMenu: row })),
    }),
)
