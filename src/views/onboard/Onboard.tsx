import React from 'react'
import { useOnboardingFlow } from '../../utils/hooks/useOnboardingFlow'
import { OnboardingLayout } from './layouts/OnboardingLayout'
import { PersonalInfoForm } from './components/PersonalInfoForm'
import { AddressForm } from './components/AddressForm'
import { MerchantInfoForm } from './components/MerchantInfoForm'
import { MerchantAddressForm } from './components/MerchantAddressForm'
import { OpeningHoursForm } from './components/OpeningHoursForm'
import { ONBOARDING_STEPS } from '../../utils/constants'

const Onboard: React.FC = () => {
    const {
        currentStep,
        formData,
        goToNextStep,
        goToPreviousStep,
        updateFormData,
        resetForm,
    } = useOnboardingFlow()

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
                        onCancel={resetForm}
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
                        data={formData.businessInfo}
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
                        data={formData.merchantInfo}
                        onNext={(data) => {
                            updateFormData('merchantInfo', data)
                            goToNextStep()
                        }}
                        onBack={goToPreviousStep}
                    />
                )
            case ONBOARDING_STEPS.STEP_FIVE:
                return (
                    <OpeningHoursForm
                        data={formData.openingHours}
                        onSubmit={(data) => {
                            updateFormData('openingHours', data)
                            // Handle final submission here
                            console.log('Onboarding completed!', {
                                ...formData,
                                openingHours: data,
                            })
                            // You can navigate to success page or dashboard here
                        }}
                        onBack={goToPreviousStep}
                    />
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
