import { useState, useCallback } from 'react'
import { ONBOARDING_STEPS } from '../../constants/onboard.constants'
import { getInitialFormData } from '../formHelper'
import type {
    FormData,
    OnboardingFlowReturn,
    PersonalInfo,
    Address,
    BusinessInfo,
    MerchantInfo,
    MerchantAddress,
    OpeningHours,
} from '../../@types/onboarding'

export const useOnboardingFlow = (): OnboardingFlowReturn => {
    const [currentStep, setCurrentStep] = useState<number>(
        ONBOARDING_STEPS.STEP_ONE,
    )
    const [formData, setFormData] = useState<FormData>(getInitialFormData())

    const goToNextStep = useCallback((): void => {
        setCurrentStep((prev) => {
            switch (prev) {
                case ONBOARDING_STEPS.STEP_ONE:
                    return ONBOARDING_STEPS.STEP_TWO
                case ONBOARDING_STEPS.STEP_TWO:
                    return ONBOARDING_STEPS.STEP_THREE
                case ONBOARDING_STEPS.STEP_THREE:
                    return ONBOARDING_STEPS.STEP_FOUR
                case ONBOARDING_STEPS.STEP_FOUR:
                    return ONBOARDING_STEPS.STEP_FIVE
                case ONBOARDING_STEPS.STEP_FIVE:
                    return ONBOARDING_STEPS.STEP_FIVE
                default:
                    return prev
            }
        })
    }, [])

    const goToPreviousStep = useCallback((): void => {
        setCurrentStep((prev) => {
            switch (prev) {
                case ONBOARDING_STEPS.STEP_TWO:
                    return ONBOARDING_STEPS.STEP_ONE
                case ONBOARDING_STEPS.STEP_THREE:
                    return ONBOARDING_STEPS.STEP_TWO
                case ONBOARDING_STEPS.STEP_FOUR:
                    return ONBOARDING_STEPS.STEP_THREE
                case ONBOARDING_STEPS.STEP_FIVE:
                    return ONBOARDING_STEPS.STEP_FOUR
                default:
                    return prev
            }
        })
    }, [])

    const updateFormData = useCallback(
        (
            section: keyof FormData,
            data:
                | Partial<PersonalInfo>
                | Partial<Address>
                | Partial<BusinessInfo>
                | Partial<MerchantInfo>
                | Partial<MerchantAddress>
                | Partial<OpeningHours>,
        ): void => {
            if (
                typeof data === 'object' &&
                data !== null &&
                !Array.isArray(data)
            ) {
                setFormData((prev) => ({
                    ...prev,
                    [section]: {
                        ...prev[section],
                        ...data,
                    },
                }))
            }
        },
        [],
    )

    const resetForm = useCallback((): void => {
        setCurrentStep(ONBOARDING_STEPS.STEP_ONE)
        setFormData(getInitialFormData())
    }, [])

    const goToStep = useCallback(
        (
            step: (typeof ONBOARDING_STEPS)[keyof typeof ONBOARDING_STEPS],
        ): void => {
            if (Object.values(ONBOARDING_STEPS).includes(step)) {
                setCurrentStep(step)
            }
        },
        [],
    )

    return {
        currentStep,
        formData,
        goToNextStep,
        goToPreviousStep,
        updateFormData: updateFormData as (
            section: keyof FormData,
            data: unknown,
        ) => void,
        resetForm,
        goToStep: goToStep as (step: number) => void,
    }
}
