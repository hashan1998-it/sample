import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiCheckOnboardingStatus } from '@/services/OnboardService'
import useAuth from '@/utils/hooks/useAuth'

interface OnboardingStatus {
    hasUser: boolean
    hasMerchant: boolean
    shouldRedirectToOnboard: boolean
    redirectPath: string
}

interface UseOnboardStatusReturn {
    onboardingStatus: OnboardingStatus | null
    isChecking: boolean
    error: string | null
    checkStatus: () => Promise<void>
    navigateToOnboard: () => void
    isOnboarded: boolean
}

const useOnboardStatus = (): UseOnboardStatusReturn => {
    const { isAuthenticated, token } = useAuth()
    const navigate = useNavigate()

    const [onboardingStatus, setOnboardingStatus] =
        useState<OnboardingStatus | null>(null)
    const [isChecking, setIsChecking] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const checkStatus = useCallback(async () => {
        if (!isAuthenticated || !token) {
            setOnboardingStatus(null)
            setError(null)
            return
        }

        setIsChecking(true)
        setError(null)

        try {
            const status = await apiCheckOnboardingStatus(token)
            console.log('useOnboardStatus: API Response:', status)

            if (status) {
                setOnboardingStatus({
                    hasUser: status.hasUser || false,
                    hasMerchant: status.hasMerchant || false,
                    shouldRedirectToOnboard:
                        status.shouldRedirectToOnboard || false,
                    redirectPath: status.redirectPath || '/onboard',
                })
            } else {
                setOnboardingStatus(null)
                setError('Invalid response from onboarding API')
            }
        } catch (err) {
            console.error(
                'useOnboardStatus: Error checking onboarding status:',
                err,
            )
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to check onboarding status',
            )
            setOnboardingStatus(null)
        } finally {
            setIsChecking(false)
        }
    }, [isAuthenticated, token])

    const navigateToOnboard = useCallback(() => {
        const path = onboardingStatus?.redirectPath || '/onboard'
        navigate(path, { replace: true })
    }, [navigate, onboardingStatus?.redirectPath])

    // Auto-check status when authentication changes
    useEffect(() => {
        checkStatus()
    }, [checkStatus])

    // Computed property to check if user is fully onboarded
    const isOnboarded = onboardingStatus
        ? onboardingStatus.hasUser &&
          onboardingStatus.hasMerchant &&
          !onboardingStatus.shouldRedirectToOnboard
        : false

    return {
        onboardingStatus,
        isChecking,
        error,
        checkStatus,
        navigateToOnboard,
        isOnboarded,
    }
}

export default useOnboardStatus
