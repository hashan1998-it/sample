import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboardingFlow } from '../../utils/hooks/useOnboardingFlow'
import { OnboardingLayout } from '@/components/layouts/OnboardingLayout/OnboardingLayout'
import { PersonalInfoForm } from './Forms/PersonalInfoForm'
import { AddressForm } from './Forms/AddressForm'
import { MerchantInfoForm } from './Forms/MerchantInfoForm'
import { MerchantAddressForm } from './Forms/MerchantAddressForm'
import { OpeningHoursForm } from './Forms/OpeningHoursForm'
import { apiCompleteOnboarding } from '@/services/OnboardService'
import { ONBOARDING_STEPS } from '../../constants/onboard.constants'
import type { OnboardFormData } from '@/@types/onboard'

const Onboard: React.FC = () => {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    const {
        currentStep,
        formData,
        goToNextStep,
        goToPreviousStep,
        updateFormData,
        resetForm,
    } = useOnboardingFlow()

    const handleFinalSubmit = async (
        openingHoursData: import('@/@types/onboard').OpeningHours,
    ) => {
        setIsSubmitting(true)
        setSubmitError(null)

        try {
            // Update form data with final opening hours
            const finalFormData: OnboardFormData = {
                ...formData,
                openingHours: openingHoursData,
            }

            // Submit the complete onboarding data
            const result = await apiCompleteOnboarding(finalFormData)

            if (result.success) {
                console.log('Onboarding completed successfully!', {
                    user: result.user,
                    merchant: result.merchant,
                })

                // Navigate to outlets page after successful onboarding
                navigate('/outlets', { replace: true })
            } else {
                setSubmitError(
                    result.error || 'Onboarding failed. Please try again.',
                )
                console.error('Onboarding failed:', result.error)
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred'
            setSubmitError(errorMessage)
            console.error('Onboarding error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderStepContent = (): React.JSX.Element | null => {
        switch (currentStep) {
            case ONBOARDING_STEPS.STEP_ONE:
                return (
                    <PersonalInfoForm
                        data={formData.personalInfo}
                        onNext={(data) => {
                            updateFormData('personalInfo', data)
                            goToNextStep()
                        }}
                        onCancel={() => {
                            resetForm()
                            navigate('/sign-in')
                        }}
                    />
                )
            case ONBOARDING_STEPS.STEP_TWO:
                return (
                    <AddressForm
                        data={formData.address}
                        onNext={(data) => {
                            updateFormData('address', data)
                            goToNextStep()
                        }}
                        onBack={goToPreviousStep}
                    />
                )
            case ONBOARDING_STEPS.STEP_THREE:
                return (
                    <MerchantInfoForm
                        data={formData.merchantInfo}
                        onNext={(data) => {
                            updateFormData('merchantInfo', data)
                            goToNextStep()
                        }}
                        onBack={goToPreviousStep}
                    />
                )
            case ONBOARDING_STEPS.STEP_FOUR:
                return (
                    <MerchantAddressForm
                        data={formData.merchantAddress}
                        onNext={(data) => {
                            updateFormData('merchantAddress', data)
                            goToNextStep()
                        }}
                        onBack={goToPreviousStep}
                    />
                )
            case ONBOARDING_STEPS.STEP_FIVE:
                return (
                    <div>
                        <OpeningHoursForm
                            data={formData.openingHours}
                            onSubmit={handleFinalSubmit}
                            onBack={goToPreviousStep}
                        />

                        {/* Error Display */}
                        {submitError && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-600">
                                    {submitError}
                                </p>
                                <button
                                    type="button"
                                    className="mt-2 text-sm text-red-700 underline hover:no-underline"
                                    onClick={() => setSubmitError(null)}
                                >
                                    Dismiss
                                </button>
                            </div>
                        )}

                        {/* Loading Overlay */}
                        {isSubmitting && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
                                    <p className="text-sm text-blue-600">
                                        Completing your onboarding...
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <OnboardingLayout currentStep={currentStep}>
            {renderStepContent()}
        </OnboardingLayout>
    )
}

export default Onboard
