// views/onboard/Onboard.tsx - Fixed version
import React from 'react'
import { useOnboardingFlow } from '../../utils/hooks/useOnboardingFlow'
import { OnboardingLayout } from '@/components/layouts/OnboardingLayout/OnboardingLayout'
import { PersonalInfoForm } from './Forms/PersonalInfoForm'
import { AddressForm } from './Forms/AddressForm'
import { MerchantInfoForm } from './Forms/MerchantInfoForm'
import { MerchantAddressForm } from './Forms/MerchantAddressForm'
import { OpeningHoursForm } from './Forms/OpeningHoursForm'
import { ONBOARDING_STEPS } from '../../constants/onboard.constants'

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
                    <OpeningHoursForm
                        data={formData.openingHours}
                        onSubmit={(data) => {
                            updateFormData('openingHours', data)
                            console.log('Onboarding completed!', {
                                ...formData,
                                openingHours: data,
                            })
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
