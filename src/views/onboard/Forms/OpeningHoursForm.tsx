import React, { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Switcher from '@/components/ui/Switcher'
import { useFormValidation } from '../../../utils/hooks/useFormValidation'
import { openingHoursValidation } from '../../../utils/validations/onboardValidationRules'
import { OnboardingService } from '@/services/OnboardingService'
import type {
    OpeningHoursFormProps,
    OpeningHours,
    DaySchedule,
    FormData,
} from '../../../@types/onboarding'

const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
] as const

export const OpeningHoursForm: React.FC<OpeningHoursFormProps> = ({
    data = {},
    onSubmit,
    onBack,
}) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [scheduleMode, setScheduleMode] = useState<'daily' | 'customize'>(
        data.scheduleMode || 'daily',
    )

    const initialDaySchedules: Record<string, DaySchedule> = {}
    daysOfWeek.forEach((day) => {
        initialDaySchedules[day.toLowerCase()] = {
            isOpen: data.daySchedules?.[day.toLowerCase()]?.isOpen ?? true,
            openTime:
                data.daySchedules?.[day.toLowerCase()]?.openTime || '09:00',
            closeTime:
                data.daySchedules?.[day.toLowerCase()]?.closeTime || '16:00',
        }
    })

    const [daySchedules, setDaySchedules] =
        useState<Record<string, DaySchedule>>(initialDaySchedules)

    const { formData, handleInputChange, validate } = useFormValidation<
        Pick<OpeningHours, 'dailyOpenTime' | 'dailyCloseTime'>
    >(
        {
            dailyOpenTime: data.dailyOpenTime || '09:00',
            dailyCloseTime: data.dailyCloseTime || '16:00',
        },
        openingHoursValidation,
    )

    const handleModeChange = (mode: 'daily' | 'customize') => {
        setScheduleMode(mode)
    }

    const handleDayToggle = (day: string, isOpen: boolean) => {
        setDaySchedules((prev) => {
            const dayKey = day.toLowerCase()
            const current = prev[dayKey]
            if (!current) return prev
            return {
                ...prev,
                [dayKey]: {
                    ...current,
                    isOpen,
                },
            }
        })
    }

    const handleTimeChange = (
        day: string,
        timeType: 'openTime' | 'closeTime',
        value: string,
    ) => {
        setDaySchedules((prev) => {
            const dayKey = day.toLowerCase()
            const current = prev[dayKey]
            if (!current) return prev
            return {
                ...prev,
                [dayKey]: {
                    ...current,
                    [timeType]: value,
                },
            }
        })
    }

    const handleSubmit = async (): Promise<void> => {
        // Validate based on current mode
        const isValid = scheduleMode === 'daily' ? validate() : true

        if (!isValid) {
            return
        }

        setLoading(true)
        try {
            const openingHoursData: OpeningHours = {
                scheduleMode,
                ...(scheduleMode === 'daily'
                    ? {
                          dailyOpenTime: formData.dailyOpenTime ?? '09:00',
                          dailyCloseTime: formData.dailyCloseTime ?? '16:00',
                      }
                    : {
                          daySchedules,
                      }),
            }

            // Type assertion to ensure we have all required FormData properties
            const formDataToSubmit: FormData = {
                ...data,
                openingHours: openingHoursData,
            } as FormData

            const result = await OnboardingService.apiCompleteOnboarding(
                formDataToSubmit,
            )

            if (result.success) {
                onSubmit(openingHoursData)
            } else {
                console.error('Submission failed:', result.error)
                // Handle error appropriately - maybe show a toast or error message
            }
        } catch (error) {
            console.error('Submission error:', error)
            // Continue anyway for demo purposes
            onSubmit({
                scheduleMode,
                ...(scheduleMode === 'daily'
                    ? {
                          dailyOpenTime: formData.dailyOpenTime ?? '09:00',
                          dailyCloseTime: formData.dailyCloseTime ?? '16:00',
                      }
                    : {
                          daySchedules,
                      }),
            })
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = (): void => {
        onBack?.()
    }

    return (
        <div className="flex flex-col h-full">
            {/* Form Content - Scrollable */}
            <div className="flex-1 space-y-4">
                <div className="mb-3">
                    <h2 className="text-base font-medium text-gray-800 mb-3">
                        Merchant Information
                    </h2>
                </div>

                {/* Opening Hours Mode Selector */}
                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 mb-3 block">
                        Opening Hours
                        <span className="text-red-500 ml-1">*</span>
                    </label>

                    <div className="flex gap-2 mb-4">
                        <Button
                            variant={
                                scheduleMode === 'daily' ? 'solid' : 'default'
                            }
                            className={`flex-1 ${
                                scheduleMode === 'daily'
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            size="sm"
                            onClick={() => handleModeChange('daily')}
                        >
                            Daily
                        </Button>
                        <Button
                            variant={
                                scheduleMode === 'customize'
                                    ? 'solid'
                                    : 'default'
                            }
                            className={`flex-1 ${
                                scheduleMode === 'customize'
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            size="sm"
                            onClick={() => handleModeChange('customize')}
                        >
                            Customize
                        </Button>
                    </div>
                </div>

                {/* Daily Mode */}
                {scheduleMode === 'daily' && (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                            These hours will apply to all days.
                        </p>

                        <div className="flex gap-4 items-center">
                            <div className="flex-1">
                                <label className="text-sm text-gray-600 block mb-1">
                                    From
                                </label>
                                <Input
                                    type="time"
                                    value={formData.dailyOpenTime}
                                    size="sm"
                                    className="w-full"
                                    onChange={handleInputChange(
                                        'dailyOpenTime',
                                    )}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-sm text-gray-600 block mb-1">
                                    To
                                </label>
                                <Input
                                    type="time"
                                    value={formData.dailyCloseTime}
                                    size="sm"
                                    className="w-full"
                                    onChange={handleInputChange(
                                        'dailyCloseTime',
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Customize Mode */}
                {scheduleMode === 'customize' && (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Set hours for the current day. Customize each
                            day&apos;s schedule below.
                        </p>

                        <div className="space-y-4">
                            {daysOfWeek.map((day) => {
                                const dayKey = day.toLowerCase()
                                const daySchedule = daySchedules[dayKey]
                                
                                return (
                                    <div key={day} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700">
                                                {day}
                                            </span>
                                            <Switcher
                                                checked={daySchedule?.isOpen ?? true}
                                                onChange={(checked) =>
                                                    handleDayToggle(day, checked)
                                                }
                                            />
                                        </div>

                                        {daySchedule?.isOpen && (
                                            <div className="flex gap-4 items-center pl-4">
                                                <div className="flex-1">
                                                    <label className="text-sm text-gray-600 block mb-1">
                                                        From
                                                    </label>
                                                    <Input
                                                        type="time"
                                                        value={daySchedule.openTime}
                                                        size="sm"
                                                        className="w-full"
                                                        onChange={(e) =>
                                                            handleTimeChange(
                                                                day,
                                                                'openTime',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-sm text-gray-600 block mb-1">
                                                        To
                                                    </label>
                                                    <Input
                                                        type="time"
                                                        value={daySchedule.closeTime}
                                                        size="sm"
                                                        className="w-full"
                                                        onChange={(e) =>
                                                            handleTimeChange(
                                                                day,
                                                                'closeTime',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Fixed Action Buttons */}
            <div className="flex-shrink-0 pt-4 border-t border-gray-100">
                <div className="flex gap-3">
                    <Button
                        variant="default"
                        className="flex-1"
                        size="sm"
                        disabled={loading}
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        className="flex-1 bg-black text-white hover:bg-gray-800"
                        size="sm"
                        loading={loading}
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    )
}