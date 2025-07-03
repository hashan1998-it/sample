/* eslint-disable @typescript-eslint/no-explicit-any */
import wildCardSearch from '@/utils/wildCardSearch'
import sortBy, { Primer } from '@/utils/sortBy'
import paginate from '@/utils/paginate'
import { mock } from '../MockAdapter'
import { categoryData } from '../data/categoryData'

mock.onGet(`/api/categories`).reply((config) => {
    const { pageIndex, pageSize, sort, query } = config.params

    const { order, key } = sort

    const category = categoryData as any[]

    const sanitizeCategory = category.filter((elm) => typeof elm !== 'function')
    let data = sanitizeCategory
    let total = category.length

    if (key && order) {
        if (key === 'category' || key === 'name') {
            data.sort(
                sortBy(key, order === 'desc', (a) =>
                    (a as string).toUpperCase(),
                ),
            )
        } else {
            data.sort(sortBy(key, order === 'desc', parseInt as Primer))
        }
    }

    if (query) {
        data = wildCardSearch(data, query, 'name')
        total = data.length
    }

    data = paginate(data, pageSize, pageIndex)

    const responseData = {
        list: data,
        total: total,
    }

    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([200, responseData])
        }, 500)
    })
})

mock.onGet(/\/api\/categories\/\d+/).reply(function (config) {
    const id = config.url?.split('/')[2]
    const category = categoryData.find((category) => category.id === id)

    if (!category) {
        return [404, {}]
    }

    return [200, category]
})
