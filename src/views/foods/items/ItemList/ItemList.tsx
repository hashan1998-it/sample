import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import ItemListSelected from './components/ItemListSelected'
import ItemListTable from './components/ItemListTable'
import ItemListTableTools from './components/ItemListTableTools'
import ItemListActionTools from './components/ItemListActionTools'

const ItemList = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Items</h3>
                            <ItemListActionTools />
                        </div>
                        <ItemListTableTools />
                        <ItemListTable />
                    </div>
                </AdaptiveCard>
            </Container>
            <ItemListSelected />
        </>
    )
}

export default ItemList
