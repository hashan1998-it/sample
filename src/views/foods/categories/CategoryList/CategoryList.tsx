import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import CategoryListActionTools from './components/CategoryListActionTools'
import CategoryListTableTools from './components/CategoryListTableTools'
import CategoryListTable from './components/CategoryListTable'
import CategoryListSelected from './components/CategoryListSelected'

const CategoryList = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Categories</h3>
                            <CategoryListActionTools />
                        </div>
                        <CategoryListTableTools />
                        <CategoryListTable />
                    </div>
                </AdaptiveCard>
            </Container>
            <CategoryListSelected />
        </>
    )
}

export default CategoryList
