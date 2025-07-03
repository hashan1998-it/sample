import { FormData, CompletionStatus, FormSummary } from '../@types/onboarding'

export const getInitialFormData = (): FormData => ({
    personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
    },
    address: {
        country: 'Sri Lanka',
        state: '',
        city: '',
        postalCode: '',
        addressLine1: '',
        addressLine2: '',
    },
    businessInfo: {
        businessName: '',
        businessType: '',
        phone: '',
        website: '',
        description: '',
    },
    merchantInfo: {
        name: '',
        description: '',
        website: '',
        countryCode: '+94',
        contactNumber: '',
    },
    merchantAddress: {
        country: 'Sri Lanka',
        website: '',
        city: '',
        postalCode: '',
        addressLine1: '',
        addressLine2: '',
    },
    openingHours: {
        scheduleMode: 'daily',
        dailyOpenTime: '09:00',
        dailyCloseTime: '16:00',
        daySchedules: {
            monday: { isOpen: true, openTime: '09:00', closeTime: '16:00' },
            tuesday: { isOpen: true, openTime: '09:00', closeTime: '16:00' },
            wednesday: { isOpen: true, openTime: '09:00', closeTime: '16:00' },
            thursday: { isOpen: true, openTime: '09:00', closeTime: '16:00' },
            friday: { isOpen: true, openTime: '09:00', closeTime: '16:00' },
            saturday: { isOpen: true, openTime: '09:00', closeTime: '16:00' },
            sunday: { isOpen: false, openTime: '09:00', closeTime: '16:00' },
        },
    },
})

export const getCompletionStatus = (formData: FormData): CompletionStatus => {
    const personalComplete = isSectionComplete(
        formData.personalInfo as unknown as Record<string, unknown>,
        ['firstName', 'lastName', 'email'],
    )
    const addressComplete = isSectionComplete(
        formData.address as unknown as Record<string, unknown>,
        ['country', 'state', 'city', 'postalCode', 'addressLine1'],
    )
    const businessComplete = isSectionComplete(
        formData.businessInfo as unknown as Record<string, unknown>,
        ['businessName', 'businessType', 'phone'],
    )
    const merchantComplete = isSectionComplete(
        formData.merchantInfo as unknown as Record<string, unknown>,
        ['name', 'website', 'contactNumber'],
    )

    return {
        personalInfo: personalComplete,
        address: addressComplete,
        businessInfo: businessComplete,
        merchantInfo: merchantComplete,
        overall:
            personalComplete &&
            addressComplete &&
            businessComplete &&
            merchantComplete,
    }
}

export const generateFormSummary = (formData: FormData): FormSummary => {
    const summary: FormSummary = {
        totalFields: 0,
        completedFields: 0,
        overallPercentage: 0,
        sections: {},
    }

    const sectionFields = {
        personalInfo: ['firstName', 'lastName', 'email'],
        address: [
            'country',
            'state',
            'city',
            'postalCode',
            'addressLine1',
            'addressLine2',
        ],
        businessInfo: [
            'businessName',
            'businessType',
            'phone',
            'website',
            'description',
        ],
        merchantInfo: [
            'name',
            'description',
            'website',
            'countryCode',
            'contactNumber',
        ],
        merchantAddress: [
            'country',
            'website',
            'city',
            'postalCode',
            'addressLine1',
            'addressLine2',
        ],
        openingHours: ['scheduleMode', 'dailyOpenTime', 'dailyCloseTime'],
    } as const

    Object.keys(sectionFields).forEach((section) => {
        const fields = sectionFields[section as keyof typeof sectionFields]
        const sectionData =
            (formData[section as keyof FormData] as unknown as Record<
                string,
                unknown
            >) || {}

        let completed = 0
        const total = fields.length

        fields.forEach((field) => {
            const value = sectionData[field]
            if (typeof value === 'string') {
                if (value.trim() !== '') completed++
            } else if (typeof value === 'number') {
                completed++
            } else if (value !== undefined && value !== null) {
                completed++
            }
        })

        summary.sections[section] = {
            completed,
            total,
            percentage: Math.round((completed / total) * 100),
        }

        summary.totalFields += total
        summary.completedFields += completed
    })

    summary.overallPercentage = Math.round(
        (summary.completedFields / summary.totalFields) * 100,
    )

    return summary
}

function isSectionComplete<T extends Record<string, unknown>>(
    section: T,
    requiredFields: (keyof T)[],
): boolean {
    return requiredFields.every((field) => {
        const value = section[field]
        if (typeof value === 'string') {
            return value.trim() !== ''
        }
        if (typeof value === 'number') {
            return true
        }
        return value !== undefined && value !== null
    })
}
