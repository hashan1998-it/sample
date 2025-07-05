import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import AuthorityGuard from './AuthorityGuard'
import AppRoute from './AppRoute'
import PageContainer from '@/components/template/PageContainer'
import type { Route as RouteConfig } from '@/@types/routes'
import type { LayoutType } from '@/@types/theme'

interface RouteWrapperProps {
    route: RouteConfig
    isProtected: boolean
    userAuthority?: string[]
    pageContainerType?: 'default' | 'gutterless' | 'contained'
    layout?: LayoutType
}

const RouteWrapper = ({
    route,
    isProtected,
    userAuthority = [],
    ...props
}: RouteWrapperProps) => {
    let element = (
        <AppRoute
            routeKey={route.key}
            component={route.component}
            {...route.meta}
        />
    )

    if (isProtected && route.authority && route.authority.length > 0) {
        element = (
            <AuthorityGuard
                userAuthority={userAuthority}
                authority={route.authority}
            >
                {element}
            </AuthorityGuard>
        )
    }

    if (isProtected) {
        element = (
            <PageContainer {...props} {...route.meta}>
                {element}
            </PageContainer>
        )
        element = <ProtectedRoute>{element}</ProtectedRoute>
    } else {
        element = <PublicRoute>{element}</PublicRoute>
    }

    return element
}

export default RouteWrapper
