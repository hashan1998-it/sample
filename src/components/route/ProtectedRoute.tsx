// src/components/route/ProtectedRoute.tsx
import { ReactNode } from 'react'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useAuth0 } from '@auth0/auth0-react'
import { Navigate, useLocation } from 'react-router-dom'

const { unAuthenticatedEntryPath } = appConfig

interface ProtectedRouteProps {
    children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated } = useAuth0()
    const { pathname } = useLocation()

    const getPathName =
        pathname === '/' ? '' : `?${REDIRECT_URL_KEY}=${pathname}`

    if (!isAuthenticated) {
        return (
            <Navigate
                replace
                to={`${unAuthenticatedEntryPath}${getPathName}`}
            />
        )
    }

    return <>{children}</>
}

export default ProtectedRoute