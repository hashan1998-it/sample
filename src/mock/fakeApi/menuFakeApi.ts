/* eslint-disable @typescript-eslint/no-explicit-any */
import wildCardSearch from '@/utils/wildCardSearch'
import sortBy, { Primer } from '@/utils/sortBy'
import paginate from '@/utils/paginate'
import { mock } from '../MockAdapter'
import { menuData } from '../data/menuData'

mock.onGet(`/api/menus`).reply((config) => {
    const { pageIndex, pageSize, sort, query } = config.params

    const { order, key } = sort

    const menus = menuData as any[]

    const sanitizeMenus = menus.filter((elm) => typeof elm !== 'function')
    let data = sanitizeMenus
    let total = menus.length

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

mock.onGet(/\/api\/menus\/\d+/).reply(function (config) {
    const id = config.url?.split('/')[2]
    const menu = menuData.find((menu) => menu.id === id)

    if (!menu) {
        return [404, {}]
    }

    return [200, menu]
})
