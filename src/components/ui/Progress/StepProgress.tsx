// components/StepProgress.tsx
import React from 'react'
import Progress from '@/components/ui/Progress'
import classNames from '@/utils/classNames'
import type { StepProgressProps } from '../../../@types/onboard'

export const StepProgress: React.FC<StepProgressProps> = ({
    currentStep,
    totalSteps = 4,
    className = '',
    activeColor = 'bg-green-500',
    inactiveColor = 'bg-gray-200',
    strokeWidth = 8,
}) => {
    const steps = Array.from({ length: totalSteps }, (_, index) => index + 1)

    const containerClass = classNames('mb-4 sm:mb-6', className)

    return (
        <div className={containerClass}>
            <div className="flex space-x-1">
                {steps.map((step) => (
                    <Progress
                        key={step}
                        percent={step <= currentStep ? 100 : 0}
                        variant="line"
                        showInfo={false}
                        customColorClass={
                            step <= currentStep ? activeColor : inactiveColor
                        }
                        strokeWidth={strokeWidth}
                        className="flex-1"
                        aria-label={`Step ${step} ${step <= currentStep ? 'completed' : 'pending'}`}
                    />
                ))}
            </div>
        </div>
    )
}
