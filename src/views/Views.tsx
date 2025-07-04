// The Views component is responsible for rendering all application routes wrapped in a Suspense component.
// It handles lazy loading of route components, displaying a loading indicator while routes are being resolved.
// The component accepts props for customizing the page container type and layout, which are passed to the AllRoutes component.
import { Suspense } from 'react'
import Loading from '@/components/shared/Loading'
import AllRoutes from '@/components/route/AllRoutes'
import type { LayoutType } from '@/@types/theme'

interface ViewsProps {
    pageContainerType?: 'default' | 'gutterless' | 'contained'
    layout?: LayoutType
}

const Views = (props: ViewsProps) => {
    return (
        <Suspense fallback={<Loading loading={true} className="w-full" />}>
            <AllRoutes {...props} />
        </Suspense>
    )
}

export default Views
