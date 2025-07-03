import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import type { Filter, Item } from '../types'

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
    itemStatus: 'published',
    itemType: ['Bags', 'Cloths', 'Devices', 'Shoes', 'Watches'],
}

export type ItemListState = {
    tableData: TableQueries
    filterData: Filter
    selectedItem: Partial<Item>[]
}

type ItemListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedItem: (checked: boolean, customer: Item) => void
    setSelectAllItem: (customer: Item[]) => void
}

const initialState: ItemListState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedItem: [],
}

export const useItemListStore = create<ItemListState & ItemListAction>(
    (set) => ({
        ...initialState,
        setFilterData: (payload) => set(() => ({ filterData: payload })),
        setTableData: (payload) => set(() => ({ tableData: payload })),
        setSelectedItem: (checked, row) =>
            set((state) => {
                const prevData = state.selectedItem
                if (checked) {
                    return { selectedItem: [...prevData, ...[row]] }
                } else {
                    if (prevData.some((prevItem) => row.id === prevItem.id)) {
                        return {
                            selectedItem: prevData.filter(
                                (prevProduct) => prevProduct.id !== row.id,
                            ),
                        }
                    }
                    return { selecteItem: prevData }
                }
            }),
        setSelectAllItem: (row) => set(() => ({ selectedItem: row })),
    }),
)
