import useProducList from '../hooks/useMenuList'
import cloneDeep from 'lodash/cloneDeep'
import MenuListSearch from './MenuListSearch'

const MenuListTableTools = () => {
    const { tableData, setTableData } = useProducList()

    const handleInputChange = (val: string) => {
        const newTableData = cloneDeep(tableData)
        newTableData.query = val
        newTableData.pageIndex = 1
        if (typeof val === 'string' && val.length > 1) {
            setTableData(newTableData)
        }

        if (typeof val === 'string' && val.length === 0) {
            setTableData(newTableData)
        }
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <MenuListSearch onInputChange={handleInputChange} />
            {/* <MenuTableFilter /> */}
        </div>
    )
}

export default MenuListTableTools
