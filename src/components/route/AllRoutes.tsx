import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import AuthorityGuard from './AuthorityGuard'
import AppRoute from './AppRoute'
import PageContainer from '@/components/template/PageContainer'
import { protectedRoutes, publicRoutes } from '@/configs/routes.config'
import appConfig from '@/configs/app.config'
import { Routes, Route, Navigate } from 'react-router-dom'
import type { LayoutType } from '@/@types/theme'
import { useOnboardStatus } from '@/utils/hooks/useOnboardStatus'
import { useAuth } from '@/auth'
import Loading from '../shared/Loading'

interface ViewsProps {
    pageContainerType?: 'default' | 'gutterless' | 'contained'
    layout?: LayoutType
}

type AllRoutesProps = ViewsProps

const { authenticatedEntryPath } = appConfig

const AllRoutes = (props: AllRoutesProps) => {
    const { authenticated, user } = useAuth()
    const {
        isLoading: onboardingLoading,
        shouldRedirectToOnboard,
        redirectPath,
    } = useOnboardStatus()

    // Enhanced ProtectedRoute component that handles onboarding
    const EnhancedProtectedRoute = ({
        children,
    }: {
        children: React.ReactNode
    }) => {
        if (onboardingLoading) {
            return <Loading loading={true} />
        }
        if (
            shouldRedirectToOnboard &&
            window.location.pathname !== '/onboard'
        ) {
            return <Navigate replace to={redirectPath || '/onboard'} />
        }
        return <ProtectedRoute>{children}</ProtectedRoute>
    }

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <EnhancedProtectedRoute>
                        <Route
                            path="/"
                            element={
                                <Navigate replace to={authenticatedEntryPath} />
                            }
                        />
                        {authenticated &&
                            protectedRoutes.map((route, index) => (
                                <Route
                                    key={route.key + index}
                                    path={route.path}
                                    element={
                                        <AuthorityGuard
                                            userAuthority={
                                                user?.authority || []
                                            }
                                            authority={route.authority}
                                        >
                                            <PageContainer
                                                {...props}
                                                {...route.meta}
                                            >
                                                <AppRoute
                                                    routeKey={route.key}
                                                    component={route.component}
                                                    {...route.meta}
                                                />
                                            </PageContainer>
                                        </AuthorityGuard>
                                    }
                                />
                            ))}
                        <Route path="*" element={<Navigate replace to="/" />} />
                    </EnhancedProtectedRoute>
                }
            ></Route>
            <Route path="/" element={<PublicRoute />}>
                {publicRoutes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            <AppRoute
                                routeKey={route.key}
                                component={route.component}
                                {...route.meta}
                            />
                        }
                    />
                ))}
            </Route>
        </Routes>
    )
}

export default AllRoutes
