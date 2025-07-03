import { Navigate, Outlet } from 'react-router-dom'
import appConfig from '@/configs/app.config'
import { useAuth0 } from '@auth0/auth0-react'

const { authenticatedEntryPath } = appConfig

const PublicRoute = () => {
    const { isAuthenticated } = useAuth0()

    return isAuthenticated ? <Navigate to={authenticatedEntryPath} /> : <Outlet />
}

export default PublicRoute
