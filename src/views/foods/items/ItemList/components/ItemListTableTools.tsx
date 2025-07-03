import useItemList from '../hooks/useItemList'
import cloneDeep from 'lodash/cloneDeep'
import ItemListSearch from './ItemListSearch'

const ItemListTableTools = () => {
    const { tableData, setTableData } = useItemList()

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
            <ItemListSearch onInputChange={handleInputChange} />
        </div>
    )
}

export default ItemListTableTools
