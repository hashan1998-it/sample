// import { useState } from 'react'
// import { Controller } from 'react-hook-form'
// import Card from '@/components/ui/Card'
// import Select from '@/components/ui/Select'
// import { FormItem } from '@/components/ui/Form'
// import TimePicker from '@/components/ui/TimePicker' // You need to create this
// import type { FormSectionBaseProps } from './types'
// import { EScheduleDay } from './enums'

// const scheduleOptions = [
//     { label: 'Everyday', value: 'everyday' },
//     { label: 'Weekdays', value: 'weekdays' },
//     { label: 'Weekends', value: 'weekends' },
//     { label: 'Custom', value: 'custom' },
// ]

// const daysMap: Record<
//     'weekdays' | 'weekends' | 'everyday' | 'custom',
//     EScheduleDay[]
// > = {
//     everyday: Object.values(EScheduleDay),
//     weekdays: [
//         EScheduleDay.MONDAY,
//         EScheduleDay.TUESDAY,
//         EScheduleDay.WEDNESDAY,
//         EScheduleDay.THURSDAY,
//         EScheduleDay.FRIDAY,
//     ],
//     weekends: [EScheduleDay.SATURDAY, EScheduleDay.SUNDAY],
//     custom: Object.values(EScheduleDay),
// }

// const dayLabels: Record<EScheduleDay, string> = {
//     MONDAY: 'Monday',
//     TUESDAY: 'Tuesday',
//     WEDNESDAY: 'Wednesday',
//     THURSDAY: 'Thursday',
//     FRIDAY: 'Friday',
//     SATURDAY: 'Saturday',
//     SUNDAY: 'Sunday',
// }

// const ScheduleSection = ({ control }: FormSectionBaseProps) => {
//     const [mode, setMode] = useState<
//         'everyday' | 'weekdays' | 'weekends' | 'custom'
//     >('everyday')

//     const renderTimeInputs = (day: EScheduleDay, index: number) => (
//         <div
//             key={day}
//             className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center"
//         >
//             <div>{dayLabels[day]}</div>
//             <div className="flex gap-2">
//                 <FormItem label="From">
//                     <Controller
//                         name={`schedule.${index}.from`}
//                         control={control}
//                         render={({
//                             field,
//                         }: {
//                             field: {
//                                 value:
//                                     | string
//                                     | { hours: number; minutes: number }
//                                     | undefined
//                             }
//                         }) => (
//                             <TimePicker
//                                 {...field}
//                                 value={
//                                     field.value &&
//                                     typeof field.value === 'string'
//                                         ? {
//                                               hours: parseInt(
//                                                   field.value.split(':')[0],
//                                                   10,
//                                               ),
//                                               minutes: parseInt(
//                                                   field.value.split(':')[1],
//                                                   10,
//                                               ),
//                                           }
//                                         : field.value &&
//                                             typeof field.value === 'object' &&
//                                             'hours' in field.value &&
//                                             'minutes' in field.value
//                                           ? field.value
//                                           : undefined
//                                 }
//                             />
//                         )}
//                     />
//                 </FormItem>
//                 <FormItem label="To">
//                     <Controller
//                         name={`schedule.${index}.to`}
//                         control={control}
//                         render={({ field }) => (
//                             <TimePicker
//                                 {...field}
//                                 value={
//                                     field.value &&
//                                     typeof field.value === 'string'
//                                         ? {
//                                               hours: parseInt(
//                                                   field.value.split(':')[0],
//                                                   10,
//                                               ),
//                                               minutes: parseInt(
//                                                   field.value.split(':')[1],
//                                                   10,
//                                               ),
//                                           }
//                                         : field.value &&
//                                             typeof field.value === 'object' &&
//                                             'hours' in field.value &&
//                                             'minutes' in field.value
//                                           ? field.value
//                                           : undefined
//                                 }
//                             />
//                         )}
//                     />
//                 </FormItem>
//             </div>
//         </div>
//     )

//     const days = daysMap[mode]

//     return (
//         <Card>
//             <h4 className="mb-6">Schedule</h4>

//             <FormItem label="Schedule Mode">
//                 <Select
//                     options={scheduleOptions}
//                     value={scheduleOptions.find((opt) => opt.value === mode)}
//                     onChange={(selected) => setMode(selected?.value)}
//                 />
//             </FormItem>

//             {mode !== 'custom' ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <FormItem label="From">
//                         <Controller
//                             name="generalSchedule.from"
//                             control={control}
//                             render={({ field }) => (
//                                 <TimePicker
//                                     {...field}
//                                     value={
//                                         field.value &&
//                                         typeof field.value === 'string'
//                                             ? {
//                                                   hours: parseInt(
//                                                       field.value.split(':')[0],
//                                                       10,
//                                                   ),
//                                                   minutes: parseInt(
//                                                       field.value.split(':')[1],
//                                                       10,
//                                                   ),
//                                               }
//                                             : field.value &&
//                                                 typeof field.value ===
//                                                     'object' &&
//                                                 'hours' in field.value &&
//                                                 'minutes' in field.value
//                                               ? field.value
//                                               : undefined
//                                     }
//                                 />
//                             )}
//                         />
//                     </FormItem>
//                     <FormItem label="To">
//                         <Controller
//                             name="generalSchedule.to"
//                             control={control}
//                             render={({ field }) => (
//                                 <TimePicker
//                                     {...field}
//                                     value={
//                                         field.value &&
//                                         typeof field.value === 'string'
//                                             ? {
//                                                   hours: parseInt(
//                                                       field.value.split(':')[0],
//                                                       10,
//                                                   ),
//                                                   minutes: parseInt(
//                                                       field.value.split(':')[1],
//                                                       10,
//                                                   ),
//                                               }
//                                             : field.value &&
//                                                 typeof field.value ===
//                                                     'object' &&
//                                                 'hours' in field.value &&
//                                                 'minutes' in field.value
//                                               ? field.value
//                                               : undefined
//                                     }
//                                 />
//                             )}
//                         />
//                     </FormItem>
//                 </div>
//             ) : (
//                 days.map((day, index) => renderTimeInputs(day, index))
//             )}
//         </Card>
//     )
// }

// export default ScheduleSection
