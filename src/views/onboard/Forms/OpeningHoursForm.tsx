// src/views/onboard/Forms/OpeningHoursForm.tsx - Updated version
import React, { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Switcher from '@/components/ui/Switcher'
import { useFormValidation } from '../../../utils/hooks/useFormValidation'
import { openingHoursValidation } from '../../../utils/validations/onboardValidationRules'
import type {
    OpeningHoursFormProps,
    OpeningHours,
    DaySchedule,
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

    const { formData, errors, handleInputChange, validate } = useFormValidation<
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

    const validateCustomSchedule = (): boolean => {
        // Check if at least one day is open
        const hasOpenDay = Object.values(daySchedules).some(schedule => schedule.isOpen)
        if (!hasOpenDay) {
            return false
        }

        // Validate time formats for open days
        for (const schedule of Object.values(daySchedules)) {
            if (schedule.isOpen) {
                const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
                if (!timeRegex.test(schedule.openTime) || !timeRegex.test(schedule.closeTime)) {
                    return false
                }
                
                // Check if close time is after open time
                const [openHour, openMin] = schedule.openTime.split(':').map(Number)
                const [closeHour, closeMin] = schedule.closeTime.split(':').map(Number)
                const openMinutes = openHour * 60 + openMin
                const closeMinutes = closeHour * 60 + closeMin
                
                if (closeMinutes <= openMinutes) {
                    return false
                }
            }
        }

        return true
    }

    const handleSubmit = async (): Promise<void> => {
        // Validate based on current mode
        let isValid = false
        
        if (scheduleMode === 'daily') {
            isValid = validate()
            
            if (isValid) {
                // Additional validation for daily mode - ensure close time is after open time
                const [openHour, openMin] = (formData.dailyOpenTime || '09:00').split(':').map(Number)
                const [closeHour, closeMin] = (formData.dailyCloseTime || '16:00').split(':').map(Number)
                const openMinutes = openHour * 60 + openMin
                const closeMinutes = closeHour * 60 + closeMin
                
                if (closeMinutes <= openMinutes) {
                    isValid = false
                }
            }
        } else {
            isValid = validateCustomSchedule()
        }

        if (!isValid) {
            return
        }

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

        onSubmit(openingHoursData)
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
                        Opening Hours
                    </h2>
                </div>

                {/* Opening Hours Mode Selector */}
                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 mb-3 block">
                        Schedule Type
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
                            type="button"
                            onClick={() => handleModeChange('daily')}
                        >
                            Same Daily Hours
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
                            type="button"
                            onClick={() => handleModeChange('customize')}
                        >
                            Custom Schedule
                        </Button>
                    </div>
                </div>

                {/* Daily Mode */}
                {scheduleMode === 'daily' && (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                            These hours will apply to all days.
                        </p>

                        <div className="flex gap-4 items-start">
                            <div className="flex-1">
                                <label className="text-sm text-gray-600 block mb-1">
                                    Opening Time
                                </label>
                                <Input
                                    type="time"
                                    value={formData.dailyOpenTime}
                                    size="sm"
                                    className="w-full"
                                    invalid={!!errors.dailyOpenTime}
                                    onChange={handleInputChange('dailyOpenTime')}
                                />
                                {errors.dailyOpenTime && (
                                    <p className="text-xs text-red-600 mt-1">
                                        {errors.dailyOpenTime}
                                    </p>
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="text-sm text-gray-600 block mb-1">
                                    Closing Time
                                </label>
                                <Input
                                    type="time"
                                    value={formData.dailyCloseTime}
                                    size="sm"
                                    className="w-full"
                                    invalid={!!errors.dailyCloseTime}
                                    onChange={handleInputChange('dailyCloseTime')}
                                />
                                {errors.dailyCloseTime && (
                                    <p className="text-xs text-red-600 mt-1">
                                        {errors.dailyCloseTime}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Customize Mode */}
                {scheduleMode === 'customize' && (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Set individual hours for each day. At least one day must be open.
                        </p>

                        <div className="space-y-3">
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
                                            <div className="flex gap-3 items-center pl-4">
                                                <div className="flex-1">
                                                    <label className="text-xs text-gray-500 block mb-1">
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
                                                    <label className="text-xs text-gray-500 block mb-1">
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

                                        {daySchedule?.isOpen === false && (
                                            <div className="pl-4">
                                                <p className="text-xs text-gray-500">Closed</p>
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
                        type="button"
                        onClick={handleCancel}
                    >
                        Go Back
                    </Button>
                    <Button
                        variant="solid"
                        className="flex-1 bg-black text-white hover:bg-gray-800"
                        size="sm"
                        type="button"
                        onClick={handleSubmit}
                    >
                        Complete Setup
                    </Button>
                </div>
            </div>
        </div>
    )
}