import React from 'react'

interface PasswordStrengthIndicatorProps {
    password: string
    className?: string
}

type PasswordStrength = {
    score: number
    label: string
    color: string
    bgColor: string
}

const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) return { score: 0, label: '', color: '', bgColor: '' }

    let score = 0
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        numbers: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }

    // Calculate score
    Object.values(checks).forEach(check => {
        if (check) score += 1
    })

    // Bonus for length
    if (password.length >= 12) score += 1

    // Determine strength level
    if (score <= 2) {
        return { score, label: 'Weak', color: 'text-red-600', bgColor: 'bg-red-500' }
    } else if (score <= 4) {
        return { score, label: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-500' }
    } else {
        return { score, label: 'Strong', color: 'text-green-600', bgColor: 'bg-green-500' }
    }
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ 
    password, 
    className = '' 
}) => {
    const strength = calculatePasswordStrength(password)
    
    if (!password) return null

    const getRequirements = () => {
        const requirements = [
            { met: password.length >= 8, text: 'At least 8 characters' },
            { met: /[A-Z]/.test(password), text: 'One uppercase letter' },
            { met: /[a-z]/.test(password), text: 'One lowercase letter' },
            { met: /\d/.test(password), text: 'One number' },
            { met: /[!@#$%^&*(),.?":{}|<>]/.test(password), text: 'One special character' },
        ]
        return requirements
    }

    const requirements = getRequirements()
    const progressPercentage = (strength.score / 6) * 100

    return (
        <div className={`mt-2 ${className}`}>
            {/* Strength Bar */}
            <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-300 ${strength.bgColor}`}
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
                <span className={`text-sm font-medium ${strength.color}`}>
                    {strength.label}
                </span>
            </div>

            {/* Requirements List */}
            <div className="space-y-1">
                {requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            req.met ? 'bg-green-500 text-white' : 'bg-gray-300'
                        }`}>
                            {req.met && '✓'}
                        </span>
                        <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                            {req.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PasswordStrengthIndicator