import RouteWrapper from './RouteWrapper'
import { protectedRoutes, publicRoutes } from '@/configs/routes.config'
import appConfig from '@/configs/app.config'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useMemo, useEffect } from 'react'
import type { LayoutType } from '@/@types/theme'
import useAuth from '@/utils/hooks/useAuth'
import { apiCheckOnboardingStatus } from '@/services/OnboardService'

const { authenticatedEntryPath } = appConfig

interface ViewsProps {
    pageContainerType?: 'default' | 'gutterless' | 'contained'
    layout?: LayoutType
}

const AllRoutes = (props: ViewsProps) => {
    const { isAuthenticated, user, token } = useAuth()
    const location = useLocation()
    const currentPath = useMemo(() => location.pathname, [location.pathname])

    // Check onboarding status when component mounts and user is authenticated
    useEffect(() => {
        const checkStatus = async () => {
            const status = await apiCheckOnboardingStatus(token)
            console.log('Onboarding Status:', status)
        }
        if (isAuthenticated && token) {
            checkStatus()
        }
    }, [isAuthenticated, token])

    return (
        <Routes>
            {publicRoutes.map((route) => (
                <Route
                    key={route.path}
                    path={route.path}
                    element={
                        <RouteWrapper
                            route={route}
                            isProtected={false}
                            {...props}
                        />
                    }
                />
            ))}
            {protectedRoutes.map((route, index) => (
                <Route
                    key={route.key + index}
                    path={route.path}
                    element={
                        <RouteWrapper
                            route={route}
                            isProtected={true}
                            userAuthority={user?.authority || []}
                            {...props}
                        />
                    }
                />
            ))}
            <Route
                path="/"
                element={
                    currentPath === '/' ? (
                        isAuthenticated ? (
                            <Navigate replace to={authenticatedEntryPath} />
                        ) : (
                            <Navigate replace to="/sign-in" />
                        )
                    ) : null
                }
            />
            <Route
                path="*"
                element={
                    <Navigate replace to={isAuthenticated ? '/' : '/sign-in'} />
                }
            />
        </Routes>
    )
}

export default AllRoutes
