// layout/OnboardingLayout.tsx
import React from 'react'
import Logo from '@/components/template/Logo'
import { StepProgress } from '@/components/ui/Progress/StepProgress'
import { ONBOARDING_STEPS } from '../../../constants/onboard.constants'
import type { OnboardingLayoutProps } from '../../../@types/onboarding'

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
    children,
    currentStep,
    title = 'Welcome to U-Dine',
    subtitle = 'But before we start we need some info to make your operations smooth.',
    showHeader = true,
    showProgress = true,
    className = '',
}) => {
    return (
        <div className="h-screen bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
            <div className="w-full max-w-md h-full max-h-[95vh] flex flex-col">
                <div
                    className={`bg-white rounded-lg shadow-sm flex flex-col h-full ${className}`}
                >
                    {/* Fixed Header Section */}
                    <div className="flex-shrink-0 p-4 sm:p-6">
                        {/* Logo */}
                        <Logo
                            type="streamline"
                            logoWidth={40}
                            className="mx-auto mb-3 sm:mb-4"
                        />

                        {/* Progress Steps */}
                        {showProgress && (
                            <div className="mb-3 sm:mb-4">
                                <StepProgress
                                    currentStep={currentStep}
                                    totalSteps={
                                        Object.keys(ONBOARDING_STEPS).length
                                    }
                                />
                            </div>
                        )}

                        {/* Header */}
                        {showHeader && (
                            <div className="text-center mb-4 sm:mb-6">
                                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                                    {title}
                                </h1>
                                <p className="text-gray-600 text-xs leading-relaxed">
                                    {subtitle}
                                </p>
                                <p className="text-gray-500 text-xs mt-1">
                                    <span className="text-red-500 mr-1">*</span>
                                    indicates required fields.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Scrollable Form Content */}
                    <div className="flex-1 overflow-y-auto px-4 sm:px-6">
                        <div className="pb-4">{children}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
