import { Navigate } from 'react-router-dom'
import appConfig from '@/configs/app.config'
import { useAuth0 } from '@auth0/auth0-react'

const { authenticatedEntryPath } = appConfig

interface PublicRouteProps {
    children: React.ReactNode
}

const PublicRoute = ({ children }: PublicRouteProps) => {
    const { isAuthenticated } = useAuth0()

    return isAuthenticated ? <Navigate to={authenticatedEntryPath} /> : <>{children}</>
}

export default PublicRoute