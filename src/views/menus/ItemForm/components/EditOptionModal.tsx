// // import { useState } from 'react'
// // // import { Modal } from '@/components/ui/'
// // import { Input } from '@/components/ui/Input'
// // import { NumericInput } from '@/components/shared'
// // import { Button } from '@/components/ui/Button'
// // import Modal from '@/components/ui/Modal/Modal'

// // // Define OptionItem type if not imported from elsewhere
// // type OptionItem = {
// //     label: string
// //     values: {
// //         name: string
// //         price: number
// //     }[]
// // }

// // type EditOptionModalProps = {
// //     option: OptionItem
// //     onSave: (option: OptionItem) => void
// //     onCancel: () => void
// // }

// // const EditOptionModal = ({
// //     option,
// //     onSave,
// //     onCancel,
// // }: EditOptionModalProps) => {
// //     const [edited, setEdited] = useState<OptionItem>(option)

// //     const updateValue = (
// //         index: number,
// //         key: 'name' | 'price',
// //         value: string | number,
// //     ) => {
// //         const updatedValues = [...edited.values]
// //         if (key === 'price') {
// //             updatedValues[index].price = Number(value)
// //         } else {
// //             updatedValues[index].name = String(value)
// //         }
// //         setEdited({ ...edited, values: updatedValues })
// //     }

// //     return (
// //         <Modal open title="Edit Option" onClose={onCancel}>
// //             <div className="flex flex-col gap-4">
// //                 <Input
// //                     value={edited.label}
// //                     placeholder="Option Label"
// //                     onChange={(e) =>
// //                         setEdited({ ...edited, label: e.target.value })
// //                     }
// //                 />
// //                 {edited.values.map((val, idx) => (
// //                     <div key={idx} className="flex gap-2">
// //                         <Input
// //                             value={val.name}
// //                             placeholder="Size"
// //                             onChange={(e) =>
// //                                 updateValue(idx, 'name', e.target.value)
// //                             }
// //                         />
// //                         <NumericInput
// //                             value={val.price}
// //                             placeholder="0.00"
// //                             onChange={(e) =>
// //                                 updateValue(
// //                                     idx,
// //                                     'price',
// //                                     typeof e === 'number'
// //                                         ? e
// //                                         : Number(
// //                                               (e?.target as HTMLInputElement)
// //                                                   ?.value,
// //                                           ),
// //                                 )
// //                             }
// //                         />
// //                     </div>
// //                 ))}
// //                 <Button onClick={() => onSave(edited)}>Save</Button>
// //             </div>
// //         </Modal>
// //     )
// // }

// // export default EditOptionModal
// // import { useState } from 'react'
// // import { Input } from '@/components/ui/Input'
// // import { NumericInput } from '@/components/shared'
// // import { Button } from '@/components/ui/Button'
// // import Modal from '@/components/ui/Modal/Modal'

// // type OptionItem = {
// //     label: string
// //     values: {
// //         name: string
// //         price: number
// //     }[]
// // }

// // type EditOptionModalProps = {
// //     option: OptionItem
// //     onSave: (option: OptionItem) => void
// //     onCancel: () => void
// // }

// // const EditOptionModal = ({
// //     option,
// //     onSave,
// //     onCancel,
// // }: EditOptionModalProps) => {
// //     const [edited, setEdited] = useState<OptionItem>(option)

// //     const updateValue = (
// //         index: number,
// //         key: 'name' | 'price',
// //         value: string | number,
// //     ) => {
// //         const updatedValues = [...edited.values]
// //         if (key === 'price') {
// //             updatedValues[index].price = Math.max(0, Number(value)) // Ensure non-negative
// //         } else {
// //             updatedValues[index].name = String(value)
// //         }
// //         setEdited({ ...edited, values: updatedValues })
// //     }

// //     return (
// //         <Modal open title="Edit Option" onClose={onCancel}>
// //             <div className="flex flex-col gap-4">
// //                 <Input
// //                     value={edited.label}
// //                     placeholder="Option Label"
// //                     onChange={(e) =>
// //                         setEdited({ ...edited, label: e.target.value })
// //                     }
// //                 />
// //                 {edited.values.map((val, idx) => (
// //                     <div key={idx} className="flex gap-2">
// //                         <Input
// //                             value={val.name}
// //                             placeholder="Size"
// //                             onChange={(e) =>
// //                                 updateValue(idx, 'name', e.target.value)
// //                             }
// //                         />
// //                         <NumericInput
// //                             value={val.price}
// //                             placeholder="0.00"
// //                             onChange={(e) =>
// //                                 updateValue(
// //                                     idx,
// //                                     'price',
// //                                     typeof e === 'number'
// //                                         ? e
// //                                         : Number(
// //                                               (e?.target as HTMLInputElement)
// //                                                   ?.value,
// //                                           ),
// //                                 )
// //                             }
// //                         />
// //                     </div>
// //                 ))}
// //                 <Button onClick={() => onSave(edited)}>Save</Button>
// //             </div>
// //         </Modal>
// //     )
// // }

// // export default EditOptionModal
// import { NumericInput } from '@/components/shared'
// import { Button } from '@/components/ui/Button'

// import { Controller } from 'react-hook-form'
// import FormItem from '@/components/ui/Form/FormItem'

// type OptionItem = {
//     label: string
//     values: {
//         name: string
//         price: number
//     }[]
// }

// type EditOptionModalProps = {
//     option: OptionItem
//     onSave: (option: OptionItem) => void
//     onCancel: () => void
// }

// const EditOptionModal = ({
//     option,
//     onSave,
//     onCancel,
// }: EditOptionModalProps) => {
//     // const [edited, setEdited] = useState<OptionItem>(option)

//     // const updateValue = (
//     //     index: number,
//     //     key: 'name' | 'price',
//     //     value: string | number,
//     // ) => {
//     //     const updatedValues = [...edited.values]
//     //     if (key === 'price') {
//     //         updatedValues[index].price =
//     //             typeof value === 'number' ? value : Number(value)
//     //     } else {
//     //         updatedValues[index].name = String(value)
//     //     }
//     //     setEdited({ ...edited, values: updatedValues })
//     // }

//     return (
//         // <Modal title="Edit Option" onClose={onCancel}>
//         <div className="flex flex-col gap-4">
//             <FormItem
//                 label="Price"
//                 invalid={Boolean(errors.price)}
//                 errorMessage={errors.price?.message}
//             >
//                 <Controller
//                     name="price"
//                     control={control}
//                     render={({ field }) => (
//                         <NumericInput
//                             thousandSeparator
//                             type="text"
//                             inputPrefix="$"
//                             autoComplete="off"
//                             placeholder="0.00"
//                             value={field.value}
//                             onChange={field.onChange}
//                         />
//                     )}
//                 />
//             </FormItem>
//             <Button onClick={() => onSave(edited)}>Save</Button>
//         </div>
//         // </Modal>
//     )
// }

// export default EditOptionModal
