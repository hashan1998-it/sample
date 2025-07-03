import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useAuth0 } from '@auth0/auth0-react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const { unAuthenticatedEntryPath } = appConfig

const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth0()

    const { pathname } = useLocation()

    const getPathName =
        pathname === '/' ? '' : `?${REDIRECT_URL_KEY}=${location.pathname}`

    if (!isAuthenticated) {
        return (
            <Navigate
                replace
                to={`${unAuthenticatedEntryPath}${getPathName}`}
            />
        )
    }

    return <Outlet />
}

export default ProtectedRoute
