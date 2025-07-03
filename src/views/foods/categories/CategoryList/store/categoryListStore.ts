import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import type { Category, Filter } from '../types'

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
    categoryStatus: 'published',
    categoryType: ['Bags', 'Cloths', 'Devices', 'Shoes', 'Watches'],
}

export type CategoryListState = {
    tableData: TableQueries
    filterData: Filter
    selectedCategory: Partial<Category>[]
}

type CategoryListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedCategory: (checked: boolean, customer: Category) => void
    setSelectAllCategory: (customer: Category[]) => void
}

const initialState: CategoryListState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedCategory: [],
}

export const useCategoryListStore = create<
    CategoryListState & CategoryListAction
>((set) => ({
    ...initialState,
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
    setSelectedCategory: (checked, row) =>
        set((state) => {
            const prevData = state.selectedCategory
            if (checked) {
                return { selectedCategory: [...prevData, ...[row]] }
            } else {
                if (
                    prevData.some((prevCategory) => row.id === prevCategory.id)
                ) {
                    return {
                        selectedCategory: prevData.filter(
                            (prevCategory) => prevCategory.id !== row.id,
                        ),
                    }
                }
                return { selectedCategory: prevData }
            }
        }),
    setSelectAllCategory: (row) => set(() => ({ selectedCategory: row })),
}))
