import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import type { Outlet, Filter } from '../types'

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
    productStatus: 'published',
    productType: ['Bags', 'Cloths', 'Devices', 'Shoes', 'Watches'],
}

export type OutletListState = {
    tableData: TableQueries
    filterData: Filter
    selectedOutlet: Partial<Outlet>[]
}

type OutletListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedOutlet: (checked: boolean, customer: Outlet) => void
    setSelectAllOutlet: (customer: Outlet[]) => void
}

const initialState: OutletListState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedOutlet: [],
}

export const useOutletListStore = create<OutletListState & OutletListAction>(
    (set) => ({
        ...initialState,
        setFilterData: (payload) => set(() => ({ filterData: payload })),
        setTableData: (payload) => set(() => ({ tableData: payload })),
        setSelectedOutlet: (checked, row) =>
            set((state) => {
                const prevData = state.selectedOutlet
                if (checked) {
                    return { selectedOutlet: [...prevData, ...[row]] }
                } else {
                    if (
                        prevData.some((prevOutlet) => row.id === prevOutlet.id)
                    ) {
                        return {
                            selectedOutlet: prevData.filter(
                                (prevOutlet) => prevOutlet.id !== row.id,
                            ),
                        }
                    }
                    return { selectedOutlet: prevData }
                }
            }),
        setSelectAllOutlet: (row) => set(() => ({ selectedOutlet: row })),
    }),
)
