// src/components/auth/AuthRedirectGuard.tsx
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { apiCheckOnboardingStatus } from '@/services/OnboardService'
import Loading from '@/components/shared/Loading'

interface AuthRedirectGuardProps {
    children: React.ReactNode
}

const AuthRedirectGuard: React.FC<AuthRedirectGuardProps> = ({ children }) => {
    const { isAuthenticated, isLoading: auth0Loading, user } = useAuth0()
    const navigate = useNavigate()
    const location = useLocation()
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        const checkAndRedirect = async () => {
            // Wait for Auth0 to finish loading
            if (auth0Loading) {
                return
            }

            // If not authenticated, don't check onboarding
            if (!isAuthenticated) {
                setIsChecking(false)
                return
            }

            // Skip onboarding check for certain paths
            const skipOnboardingPaths = [
                '/onboard',
                '/sign-out',
                '/access-denied',
            ]

            if (skipOnboardingPaths.some(path => location.pathname.startsWith(path))) {
                setIsChecking(false)
                return
            }

            try {
                console.log('Checking onboarding status for user:', user?.sub)
                const status = await apiCheckOnboardingStatus()
                
                if (status.shouldRedirectToOnboard) {
                    console.log('Redirecting to onboarding:', status.redirectPath)
                    navigate(status.redirectPath, { replace: true })
                    return
                }
                
                console.log('User is fully onboarded, allowing access')
            } catch (error) {
                console.error('Error checking onboarding status:', error)
                // On error, redirect to onboarding to be safe
                navigate('/onboard', { replace: true })
                return
            }
            
            setIsChecking(false)
        }

        checkAndRedirect()
    }, [isAuthenticated, auth0Loading, navigate, location.pathname, user?.sub])

    // Show loading while Auth0 is loading or while checking onboarding status
    if (auth0Loading || isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loading loading={true} />
            </div>
        )
    }

    return <>{children}</>
}

export default AuthRedirectGuard