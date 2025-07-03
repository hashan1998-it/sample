import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import OutletListActionTools from './components/OutletListActionTools'
import OutletListTableTools from './components/OutletListTableTools'
import OutletListTable from './components/OutletListTable'
import OutletListSelected from './components/OutletListSelected'

const OutletList = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4  ">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Outlets</h3>
                            <OutletListActionTools />
                        </div>

                        <OutletListTableTools />
                        <OutletListTable />
                    </div>
                </AdaptiveCard>
            </Container>
            <OutletListSelected />
        </>
    )
}

export default OutletList
