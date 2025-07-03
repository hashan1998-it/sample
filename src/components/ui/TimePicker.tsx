interface TimePickerProps {
    value?: { hours: number; minutes: number }
    onChange: (val: { hours: number; minutes: number }) => void
}

const TimePicker = ({
    value = { hours: 0, minutes: 0 },
    onChange,
}: TimePickerProps) => {
    return (
        <div className="flex gap-2">
            <select
                value={value.hours}
                onChange={(e) =>
                    onChange({ ...value, hours: parseInt(e.target.value) })
                }
            >
                {[...Array(24).keys()].map((h) => (
                    <option key={h} value={h}>
                        {h.toString().padStart(2, '0')}
                    </option>
                ))}
            </select>
            <select
                value={value.minutes}
                onChange={(e) =>
                    onChange({ ...value, minutes: parseInt(e.target.value) })
                }
            >
                {[0, 15, 30, 45].map((m) => (
                    <option key={m} value={m}>
                        {m.toString().padStart(2, '0')}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default TimePicker
