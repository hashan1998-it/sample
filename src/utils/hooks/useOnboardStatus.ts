// src/utils/hooks/useOnboardStatus.ts
import { useState, useEffect } from 'react'
import { useAuth } from '@/auth'
import { apiCheckOnboardingStatus } from '@/services/OnboardService'

interface OnboardStatus {
    hasUser: boolean
    hasMerchant: boolean
    shouldRedirectToOnboard: boolean
    redirectPath: string
    isLoading: boolean
    error: string | null
}

export const useOnboardStatus = () => {
    const { authenticated } = useAuth()
    const [status, setStatus] = useState<OnboardStatus>({
        hasUser: false,
        hasMerchant: false,
        shouldRedirectToOnboard: false,
        redirectPath: '/outlets',
        isLoading: true,
        error: null,
    })

    useEffect(() => {
        const checkStatus = async () => {
            if (!authenticated) {
                setStatus(prev => ({
                    ...prev,
                    isLoading: false,
                    shouldRedirectToOnboard: false,
                    redirectPath: '/sign-in',
                }))
                return
            }

            try {
                setStatus(prev => ({ ...prev, isLoading: true, error: null }))
                
                const result = await apiCheckOnboardingStatus()
                
                setStatus({
                    hasUser: result.hasUser,
                    hasMerchant: result.hasMerchant,
                    shouldRedirectToOnboard: result.shouldRedirectToOnboard,
                    redirectPath: result.redirectPath,
                    isLoading: false,
                    error: null,
                })
            } catch (error) {
                console.error('Error checking onboarding status:', error)
                setStatus(prev => ({
                    ...prev,
                    isLoading: false,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    shouldRedirectToOnboard: true,
                    redirectPath: '/onboard',
                }))
            }
        }

        checkStatus()
    }, [authenticated])

    const refetch = () => {
        if (authenticated) {
            const checkStatus = async () => {
                try {
                    setStatus(prev => ({ ...prev, isLoading: true, error: null }))
                    
                    const result = await apiCheckOnboardingStatus()
                    
                    setStatus({
                        hasUser: result.hasUser,
                        hasMerchant: result.hasMerchant,
                        shouldRedirectToOnboard: result.shouldRedirectToOnboard,
                        redirectPath: result.redirectPath,
                        isLoading: false,
                        error: null,
                    })
                } catch (error) {
                    console.error('Error checking onboarding status:', error)
                    setStatus(prev => ({
                        ...prev,
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Unknown error',
                        shouldRedirectToOnboard: true,
                        redirectPath: '/onboard',
                    }))
                }
            }
            checkStatus()
        }
    }

    return {
        ...status,
        refetch,
    }
}