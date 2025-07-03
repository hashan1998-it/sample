import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Upload from '@/components/ui/Upload'
import { FormItem } from '@/components/ui/Form'
import Dialog from '@/components/ui/Dialog'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Button from '@/components/ui/Button'
import { Controller } from 'react-hook-form'
import { HiEye, HiTrash } from 'react-icons/hi'
import { PiImagesThin } from 'react-icons/pi'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '@/utils/cropImage'

import type { FormSectionBaseProps } from '../types'

type ImageSectionProps = FormSectionBaseProps

type Image = {
    id: string
    name: string
    img: string
}

type ImageListProps = {
    imgList: Image[]
    onImageDelete: () => void
}

const ImageList = ({ imgList, onImageDelete }: ImageListProps) => {
    const [selectedImg, setSelectedImg] = useState<Image>({} as Image)
    const [viewOpen, setViewOpen] = useState(false)
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

    const onViewOpen = (img: Image) => {
        setSelectedImg(img)
        setViewOpen(true)
    }

    const onDialogClose = () => {
        setViewOpen(false)
        setTimeout(() => setSelectedImg({} as Image), 300)
    }

    const onDeleteConfirmation = (img: Image) => {
        setSelectedImg(img)
        setDeleteConfirmationOpen(true)
    }

    const onDeleteConfirmationClose = () => {
        setSelectedImg({} as Image)
        setDeleteConfirmationOpen(false)
    }

    const onDelete = () => {
        onImageDelete()
        setDeleteConfirmationOpen(false)
    }

    return (
        <>
            {imgList.map((img) => (
                <div
                    key={img.id}
                    className="group relative rounded-xl border border-gray-200 dark:border-gray-600 p-2 flex"
                >
                    <img
                        className="rounded-lg max-h-[140px] mx-auto max-w-full dark:bg-transparent"
                        src={img.img}
                        alt={img.name}
                    />
                    <div className="absolute inset-2 bg-[#000000ba] group-hover:flex hidden text-xl items-center justify-center">
                        <span
                            className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
                            onClick={() => onViewOpen(img)}
                        >
                            <HiEye />
                        </span>
                        <span
                            className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
                            onClick={() => onDeleteConfirmation(img)}
                        >
                            <HiTrash />
                        </span>
                    </div>
                </div>
            ))}
            <Dialog
                isOpen={viewOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <h5 className="mb-4">{selectedImg.name}</h5>
                <img
                    className="w-full"
                    src={selectedImg.img}
                    alt={selectedImg.name}
                />
            </Dialog>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove image"
                onClose={onDeleteConfirmationClose}
                onRequestClose={onDeleteConfirmationClose}
                onCancel={onDeleteConfirmationClose}
                onConfirm={onDelete}
            >
                <p>Are you sure you want to remove this image?</p>
            </ConfirmDialog>
        </>
    )
}

const ImageSection = ({ control, errors }: ImageSectionProps) => {
    const [cropDialogOpen, setCropDialogOpen] = useState(false)
    const [imageToCrop, setImageToCrop] = useState<File | null>(null)
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

    const [pendingChangeCallback, setPendingChangeCallback] = useState<
        ((images: Image[]) => void) | null
    >(null)

    const [uploadKey, setUploadKey] = useState(0) // Force reset file input

    useEffect(() => {
        if (imageToCrop) {
            const url = URL.createObjectURL(imageToCrop)
            setImageUrl(url)

            return () => {
                URL.revokeObjectURL(url)
            }
        }
    }, [imageToCrop])

    const handleUpload = (
        onChange: (images: Image[]) => void,
        files: File[],
    ) => {
        const file = files[0]
        setImageToCrop(file)
        setPendingChangeCallback(() => onChange)
        setCropDialogOpen(true)
    }

    const handleImageDelete = (onChange: (images: Image[]) => void) => {
        onChange([])
    }

    const cancelCropDialog = () => {
        if (pendingChangeCallback) {
            pendingChangeCallback([]) // Clear the form value
        }
        setCropDialogOpen(false)
        setImageToCrop(null)
        setImageUrl(null)
        setCroppedAreaPixels(null)
        setPendingChangeCallback(null)
        setUploadKey((prev) => prev + 1) // Reset the Upload component
    }

    return (
        <Card>
            <h4>Item Image</h4>
            <p className="text-xs text-gray-500 mb-6">
                <span className="text-red-500">*</span> indicates required
                fields.
            </p>
            <p>
                Choose an Item photo or simply drag and drop one photo here.{' '}
                <span className="text-red-500">*</span>
            </p>
            <div className="mt-4">
                <FormItem
                    invalid={Boolean(errors.imgList)}
                    errorMessage={errors.imgList?.message}
                    className="mb-4"
                >
                    <Controller
                        name="imgList"
                        control={control}
                        render={({ field }) => (
                            <>
                                {field.value && field.value.length ? (
                                    <div className="grid grid-cols-1 gap-2">
                                        <ImageList
                                            imgList={field.value}
                                            onImageDelete={() =>
                                                handleImageDelete(
                                                    field.onChange,
                                                )
                                            }
                                        />
                                    </div>
                                ) : (
                                    <Upload
                                        key={uploadKey} // 💡 force re-render to clear input
                                        draggable
                                        showList={false}
                                        onChange={(files) =>
                                            handleUpload(field.onChange, files)
                                        }
                                    >
                                        <div className="max-w-full flex flex-col px-4 py-8 justify-center items-center">
                                            <div className="text-[60px]">
                                                <PiImagesThin />
                                            </div>
                                            <p className="flex flex-col items-center mt-2">
                                                <span className="text-gray-800 dark:text-white">
                                                    Drop your image here, or{' '}
                                                </span>
                                                <span className="text-primary">
                                                    Click to browse
                                                </span>
                                            </p>
                                        </div>
                                    </Upload>
                                )}
                            </>
                        )}
                    />
                </FormItem>
            </div>
            <p>
                Image formats: .jpg, .jpeg, .png. Preferred size: 1:1. You can
                upload any size and crop it before saving.
            </p>

            {/* Cropper Dialog */}
            <Dialog
                isOpen={cropDialogOpen}
                width={600}
                height={500}
                closable={false}
                onClose={cancelCropDialog}
                onRequestClose={cancelCropDialog}
            >
                <div className="flex flex-col justify-between">
                    <div className="h-[400px] bg-black relative">
                        {imageUrl && (
                            <Cropper
                                image={imageUrl}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={(_, areaPixels) =>
                                    setCroppedAreaPixels(areaPixels)
                                }
                            />
                        )}
                    </div>
                    <div className="text-right mt-4 flex gap-2 justify-end">
                        <Button
                            type="button"
                            customColorClass={() =>
                                'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                            }
                            onClick={cancelCropDialog}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="solid"
                            onClick={async () => {
                                if (
                                    !imageUrl ||
                                    !croppedAreaPixels ||
                                    !pendingChangeCallback ||
                                    !imageToCrop
                                )
                                    return

                                const croppedImg = await getCroppedImg(
                                    imageUrl,
                                    croppedAreaPixels,
                                )

                                const image = {
                                    id: Date.now().toString(),
                                    name: imageToCrop.name,
                                    img: croppedImg,
                                }

                                pendingChangeCallback([image])
                                setCropDialogOpen(false)
                                setImageToCrop(null)
                                setImageUrl(null)
                                setCroppedAreaPixels(null)
                                setPendingChangeCallback(null)
                                setUploadKey((prev) => prev + 1)
                            }}
                        >
                            Crop & Upload
                        </Button>
                    </div>
                </div>
            </Dialog>
        </Card>
    )
}

export default ImageSection

// import { useState } from 'react'
// import Card from '@/components/ui/Card'
// import Upload from '@/components/ui/Upload'
// import { FormItem } from '@/components/ui/Form'
// import Dialog from '@/components/ui/Dialog'
// import ConfirmDialog from '@/components/shared/ConfirmDialog'
// import { Controller } from 'react-hook-form'
// import { HiEye, HiTrash } from 'react-icons/hi'
// import { PiImagesThin } from 'react-icons/pi'

// import type { FormSectionBaseProps } from '../types'

// type ImageSectionProps = FormSectionBaseProps

// type Image = {
//     id: string
//     name: string
//     img: string
//     // file: File
// }

// type ImageListProps = {
//     imgList: Image[]
//     onImageDelete: () => void
// }

// const ImageList = ({ imgList, onImageDelete }: ImageListProps) => {
//     const [selectedImg, setSelectedImg] = useState<Image>({} as Image)
//     const [viewOpen, setViewOpen] = useState(false)
//     const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

//     const onViewOpen = (img: Image) => {
//         setSelectedImg(img)
//         setViewOpen(true)
//     }

//     const onDialogClose = () => {
//         setViewOpen(false)
//         setTimeout(() => setSelectedImg({} as Image), 300)
//     }

//     const onDeleteConfirmation = (img: Image) => {
//         setSelectedImg(img)
//         setDeleteConfirmationOpen(true)
//     }

//     const onDeleteConfirmationClose = () => {
//         setSelectedImg({} as Image)
//         setDeleteConfirmationOpen(false)
//     }

//     const onDelete = () => {
//         onImageDelete()
//         setDeleteConfirmationOpen(false)
//     }

//     return (
//         <>
//             {imgList.map((img) => (
//                 <div
//                     key={img.id}
//                     className="group relative rounded-xl border border-gray-200 dark:border-gray-600 p-2 flex"
//                 >
//                     <img
//                         className="rounded-lg max-h-[140px] mx-auto max-w-full dark:bg-transparent"
//                         src={img.img}
//                         alt={img.name}
//                     />
//                     <div className="absolute inset-2 bg-[#000000ba] group-hover:flex hidden text-xl items-center justify-center">
//                         <span
//                             className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
//                             onClick={() => onViewOpen(img)}
//                         >
//                             <HiEye />
//                         </span>
//                         <span
//                             className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
//                             onClick={() => onDeleteConfirmation(img)}
//                         >
//                             <HiTrash />
//                         </span>
//                     </div>
//                 </div>
//             ))}
//             <Dialog
//                 isOpen={viewOpen}
//                 onClose={onDialogClose}
//                 onRequestClose={onDialogClose}
//             >
//                 <h5 className="mb-4">{selectedImg.name}</h5>
//                 <img
//                     className="w-full"
//                     src={selectedImg.img}
//                     alt={selectedImg.name}
//                 />
//             </Dialog>
//             <ConfirmDialog
//                 isOpen={deleteConfirmationOpen}
//                 type="danger"
//                 title="Remove image"
//                 onClose={onDeleteConfirmationClose}
//                 onRequestClose={onDeleteConfirmationClose}
//                 onCancel={onDeleteConfirmationClose}
//                 onConfirm={onDelete}
//             >
//                 <p>Are you sure you want to remove this image?</p>
//             </ConfirmDialog>
//         </>
//     )
// }

// const ImageSection = ({ control, errors }: ImageSectionProps) => {
//     const beforeUpload = (file: FileList | null) => {
//         let valid: boolean | string = true
//         const allowedFileType = ['image/jpeg', 'image/png']
//         const maxFileSize = 500000

//         if (file) {
//             const f = file[0]
//             if (!allowedFileType.includes(f.type)) {
//                 valid = 'Please upload a .jpeg or .png file!'
//             }
//             if (f.size >= maxFileSize) {
//                 valid = 'Upload image cannot be more than 500kb!'
//             }
//         }

//         return valid
//     }

//     // const handleUpload = (
//     //     onChange: (images: Image[]) => void,
//     //     files: File[],
//     // ) => {
//     //     const file = files[0]
//     //     const image = {
//     //         id: 'img-1',
//     //         name: file.name,
//     //         img: URL.createObjectURL(file),
//     //     }
//     //     onChange([image])
//     // }
//     const handleUpload = async (
//         onChange: (images: Image[]) => void,
//         files: File[],
//     ) => {
//         const file = files[0]

//         const toBase64 = (file: File): Promise<string> =>
//             new Promise((resolve, reject) => {
//                 const reader = new FileReader()
//                 reader.readAsDataURL(file)
//                 reader.onload = () => resolve(reader.result as string)
//                 reader.onerror = (error) => reject(error)
//             })

//         const base64 = await toBase64(file)

//         const image = {
//             id: 'img-1',
//             name: file.name,
//             img: base64, // now contains base64 string, not blob URL
//             // file: file, // optional: keep raw file if needed later
//         }

//         onChange([image])
//     }

//     const handleImageDelete = (onChange: (images: Image[]) => void) => {
//         onChange([])
//     }

//     return (
//         <Card>
//             <h4>Item Image</h4>
//             <p className="text-xs text-gray-500 mb-6">
//                 <span className="text-red-500">*</span> indicates required
//                 fields.
//             </p>
//             <p>
//                 Choose a Item photo or simply drag and drop one photo here.{' '}
//                 <span className="text-red-500">*</span>
//             </p>
//             <div className="mt-4">
//                 <FormItem
//                     invalid={Boolean(errors.imgList)}
//                     errorMessage={errors.imgList?.message}
//                     className="mb-4"
//                 >
//                     <Controller
//                         name="imgList"
//                         control={control}
//                         render={({ field }) => (
//                             <>
//                                 {field.value && field.value.length ? (
//                                     <div className="grid grid-cols-1 gap-2">
//                                         <ImageList
//                                             imgList={field.value}
//                                             onImageDelete={() =>
//                                                 handleImageDelete(
//                                                     field.onChange,
//                                                 )
//                                             }
//                                         />
//                                     </div>
//                                 ) : (
//                                     <Upload
//                                         draggable
//                                         beforeUpload={beforeUpload}
//                                         showList={false}
//                                         onChange={(files) =>
//                                             handleUpload(field.onChange, files)
//                                         }
//                                     >
//                                         <div className="max-w-full flex flex-col px-4 py-8 justify-center items-center">
//                                             <div className="text-[60px]">
//                                                 <PiImagesThin />
//                                             </div>
//                                             <p className="flex flex-col items-center mt-2">
//                                                 <span className="text-gray-800 dark:text-white">
//                                                     Drop your image here, or{' '}
//                                                 </span>
//                                                 <span className="text-primary">
//                                                     Click to browse
//                                                 </span>
//                                             </p>
//                                         </div>
//                                     </Upload>
//                                 )}
//                             </>
//                         )}
//                     />
//                 </FormItem>
//             </div>
//             <p>
//                 Image formats: .jpg, .jpeg, .png, preferred size: 1:1, file size
//                 is restricted to a maximum of 500kb.
//             </p>
//         </Card>
//     )
// }

// export default ImageSection

// import { useState } from 'react'
// import Card from '@/components/ui/Card'
// import Upload from '@/components/ui/Upload'
// import { FormItem } from '@/components/ui/Form'
// import Dialog from '@/components/ui/Dialog'
// import ConfirmDialog from '@/components/shared/ConfirmDialog'
// import { Controller } from 'react-hook-form'
// import { HiEye, HiTrash } from 'react-icons/hi'
// // import cloneDeep from 'lodash/cloneDeep'
// import { PiImagesThin } from 'react-icons/pi'

// import type { FormSectionBaseProps } from '../types'

// type ImageSectionProps = FormSectionBaseProps

// type Image = {
//     id: string
//     name: string
//     img: string
// }

// type ImageListProps = {
//     imgList: Image[]
//     onImageDelete: (img: Image) => void
// }

// const ImageList = ({ imgList, onImageDelete }: ImageListProps) => {
//     const [selectedImg, setSelectedImg] = useState<Image>({} as Image)
//     const [viewOpen, setViewOpen] = useState(false)
//     const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

//     const onViewOpen = (img: Image) => {
//         setSelectedImg(img)
//         setViewOpen(true)
//     }

//     const onDialogClose = () => {
//         setViewOpen(false)
//         setTimeout(() => setSelectedImg({} as Image), 300)
//     }

//     const onDeleteConfirmation = (img: Image) => {
//         setSelectedImg(img)
//         setDeleteConfirmationOpen(true)
//     }

//     const onDeleteConfirmationClose = () => {
//         setSelectedImg({} as Image)
//         setDeleteConfirmationOpen(false)
//     }

//     const onDelete = () => {
//         onImageDelete?.(selectedImg)
//         setDeleteConfirmationOpen(false)
//     }

//     return (
//         <>
//             {imgList.map((img) => (
//                 <div
//                     key={img.id}
//                     className="group relative rounded-xl border border-gray-200 dark:border-gray-600 p-2 flex"
//                 >
//                     <img
//                         className="rounded-lg max-h-[140px] mx-auto max-w-full dark:bg-transparent"
//                         src={img.img}
//                         alt={img.name}
//                     />
//                     <div className="absolute inset-2 bg-[#000000ba] group-hover:flex hidden text-xl items-center justify-center">
//                         <span
//                             className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
//                             onClick={() => onViewOpen(img)}
//                         >
//                             <HiEye />
//                         </span>
//                         <span
//                             className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
//                             onClick={() => onDeleteConfirmation(img)}
//                         >
//                             <HiTrash />
//                         </span>
//                     </div>
//                 </div>
//             ))}
//             <Dialog
//                 isOpen={viewOpen}
//                 onClose={onDialogClose}
//                 onRequestClose={onDialogClose}
//             >
//                 <h5 className="mb-4">{selectedImg.name}</h5>
//                 <img
//                     className="w-full"
//                     src={selectedImg.img}
//                     alt={selectedImg.name}
//                 />
//             </Dialog>
//             <ConfirmDialog
//                 isOpen={deleteConfirmationOpen}
//                 type="danger"
//                 title="Remove image"
//                 onClose={onDeleteConfirmationClose}
//                 onRequestClose={onDeleteConfirmationClose}
//                 onCancel={onDeleteConfirmationClose}
//                 onConfirm={onDelete}
//             >
//                 <p>Are you sure you want to remove this image?</p>
//             </ConfirmDialog>
//         </>
//     )
// }

// const ImageSection = ({ control, errors }: ImageSectionProps) => {
//     const beforeUpload = (file: FileList | null) => {
//         let valid: boolean | string = true
//         const allowedFileType = ['image/jpeg', 'image/png']
//         const maxFileSize = 500000

//         if (file) {
//             for (const f of file) {
//                 if (!allowedFileType.includes(f.type)) {
//                     valid = 'Please upload a .jpeg or .png file!'
//                 }
//                 if (f.size >= maxFileSize) {
//                     valid = 'Upload image cannot be more than 500kb!'
//                 }
//             }
//         }

//         return valid
//     }

//     const handleUpload = (
//         onChange: (images: Image[]) => void,
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//         _originalImageList: Image[] = [],
//         files: File[],
//     ) => {
//         const latestFile = files[files.length - 1]
//         const image = {
//             id: 'img-1',
//             name: latestFile.name,
//             img: URL.createObjectURL(latestFile),
//         }
//         onChange([image]) // Only one image allowed
//     }

//     const handleImageDelete = (
//         onChange: (images: Image[]) => void,
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//         _originalImageList: Image[] = [],
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//         _deletedImg: Image,
//     ) => {
//         onChange([])
//     }

//     return (
//         <Card>
//             <h4>Item Image</h4>
//             <p className="text-xs text-gray-500 mb-6">
//                 <span className="text-red-500">*</span> indicates required
//                 fields.
//             </p>
//             <p>
//                 Choose a Item photo or simply drag and drop one photo here.{' '}
//                 <span className="text-red-500">*</span>
//             </p>
//             <div className="mt-4">
//                 <FormItem
//                     invalid={Boolean(errors.imgList)}
//                     errorMessage={errors.imgList?.message}
//                     className="mb-4"
//                 >
//                     <Controller
//                         name="imgList"
//                         control={control}
//                         render={({ field }) => (
//                             <>
//                                 {field.value && field.value.length ? (
//                                     <div className="grid grid-cols-1 gap-2">
//                                         <ImageList
//                                             imgList={field.value}
//                                             onImageDelete={(img: Image) =>
//                                                 handleImageDelete(
//                                                     field.onChange,
//                                                     field.value,
//                                                     img,
//                                                 )
//                                             }
//                                         />
//                                     </div>
//                                 ) : (
//                                     <Upload
//                                         draggable
//                                         beforeUpload={beforeUpload}
//                                         showList={false}
//                                         onChange={(files) =>
//                                             handleUpload(
//                                                 field.onChange,
//                                                 field.value,
//                                                 files,
//                                             )
//                                         }
//                                     >
//                                         <div className="max-w-full flex flex-col px-4 py-8 justify-center items-center">
//                                             <div className="text-[60px]">
//                                                 <PiImagesThin />
//                                             </div>
//                                             <p className="flex flex-col items-center mt-2">
//                                                 <span className="text-gray-800 dark:text-white">
//                                                     Drop your image here, or{' '}
//                                                 </span>
//                                                 <span className="text-primary">
//                                                     Click to browse
//                                                 </span>
//                                             </p>
//                                         </div>
//                                     </Upload>
//                                 )}
//                             </>
//                         )}
//                     />
//                 </FormItem>
//             </div>
//             <p>
//                 Image formats: .jpg, .jpeg, .png, preferred size: 1:1, file size
//                 is restricted to a maximum of 500kb.
//             </p>
//         </Card>
//     )
// }

// export default ImageSection

// 'use client'

// import { useState } from 'react'
// import Card from '@/components/ui/Card'
// import Upload from '@/components/ui/Upload'
// import { FormItem } from '@/components/ui/Form'
// import Dialog from '@/components/ui/Dialog'
// import ConfirmDialog from '@/components/shared/ConfirmDialog'
// import { Controller } from 'react-hook-form'
// import { HiEye, HiTrash } from 'react-icons/hi'
// import { PiImagesThin } from 'react-icons/pi'
// import Modal from '../../../../../components/ui/Image/Modal'
// import Cropper from 'react-easy-crop'
// import { getCroppedImg } from '../../../../../../src/utils/cropImage'

// import type { FormSectionBaseProps } from '../types'

// type ImageSectionProps = FormSectionBaseProps

// type Image = {
//     id: string
//     name: string
//     img: string
// }

// type ImageListProps = {
//     imgList: Image[]
//     onImageDelete: () => void
// }

// const ImageList = ({ imgList, onImageDelete }: ImageListProps) => {
//     const [selectedImg, setSelectedImg] = useState<Image>({} as Image)
//     const [viewOpen, setViewOpen] = useState(false)
//     const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

//     const onViewOpen = (img: Image) => {
//         setSelectedImg(img)
//         setViewOpen(true)
//     }

//     const onDialogClose = () => {
//         setViewOpen(false)
//         setTimeout(() => setSelectedImg({} as Image), 300)
//     }

//     const onDeleteConfirmation = (img: Image) => {
//         setSelectedImg(img)
//         setDeleteConfirmationOpen(true)
//     }

//     const onDeleteConfirmationClose = () => {
//         setSelectedImg({} as Image)
//         setDeleteConfirmationOpen(false)
//     }

//     const onDelete = () => {
//         onImageDelete()
//         setDeleteConfirmationOpen(false)
//     }

//     return (
//         <>
//             {imgList.map((img) => (
//                 <div
//                     key={img.id}
//                     className="group relative rounded-xl border border-gray-200 dark:border-gray-600 p-2 flex"
//                 >
//                     <img
//                         className="rounded-lg max-h-[140px] mx-auto max-w-full dark:bg-transparent"
//                         src={img.img}
//                         alt={img.name}
//                     />
//                     <div className="absolute inset-2 bg-[#000000ba] group-hover:flex hidden text-xl items-center justify-center">
//                         <span
//                             className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
//                             onClick={() => onViewOpen(img)}
//                         >
//                             <HiEye />
//                         </span>
//                         <span
//                             className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
//                             onClick={() => onDeleteConfirmation(img)}
//                         >
//                             <HiTrash />
//                         </span>
//                     </div>
//                 </div>
//             ))}
//             <Dialog
//                 isOpen={viewOpen}
//                 onClose={onDialogClose}
//                 onRequestClose={onDialogClose}
//             >
//                 <h5 className="mb-4">{selectedImg.name}</h5>
//                 <img
//                     className="w-full"
//                     src={selectedImg.img}
//                     alt={selectedImg.name}
//                 />
//             </Dialog>
//             <ConfirmDialog
//                 isOpen={deleteConfirmationOpen}
//                 type="danger"
//                 title="Remove image"
//                 onClose={onDeleteConfirmationClose}
//                 onRequestClose={onDeleteConfirmationClose}
//                 onCancel={onDeleteConfirmationClose}
//                 onConfirm={onDelete}
//             >
//                 <p>Are you sure you want to remove this image?</p>
//             </ConfirmDialog>
//         </>
//     )
// }

// const ImageSection = ({ control, errors }: ImageSectionProps) => {
//     const [cropModalOpen, setCropModalOpen] = useState(false)
//     const [imageToCrop, setImageToCrop] = useState<File | null>(null)
//     const [crop, setCrop] = useState({ x: 0, y: 0 })
//     const [zoom, setZoom] = useState(1)
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
//     const [onCropCompleteCallback, setOnCropCompleteCallback] = useState<
//         ((images: Image[]) => void) | null
//     >(null)

//     const handleUpload = (
//         onChange: (images: Image[]) => void,
//         files: File[],
//     ) => {
//         const file = files[0]
//         setImageToCrop(file)
//         setOnCropCompleteCallback(() => onChange)
//         setCropModalOpen(true)
//     }

//     const handleImageDelete = (onChange: (images: Image[]) => void) => {
//         onChange([])
//     }

//     return (
//         <Card>
//             <h4>Item Image</h4>
//             <p className="text-xs text-gray-500 mb-6">
//                 <span className="text-red-500">*</span> indicates required
//                 fields.
//             </p>
//             <p>
//                 Choose a Item photo or simply drag and drop one photo here.{' '}
//                 <span className="text-red-500">*</span>
//             </p>
//             <div className="mt-4">
//                 <FormItem
//                     invalid={Boolean(errors.imgList)}
//                     errorMessage={errors.imgList?.message}
//                     className="mb-4"
//                 >
//                     <Controller
//                         name="imgList"
//                         control={control}
//                         render={({ field }) => (
//                             <>
//                                 {field.value && field.value.length ? (
//                                     <div className="grid grid-cols-1 gap-2">
//                                         <ImageList
//                                             imgList={field.value}
//                                             onImageDelete={() =>
//                                                 handleImageDelete(
//                                                     field.onChange,
//                                                 )
//                                             }
//                                         />
//                                     </div>
//                                 ) : (
//                                     <Upload
//                                         draggable
//                                         showList={false}
//                                         onChange={(files) =>
//                                             handleUpload(field.onChange, files)
//                                         }
//                                     >
//                                         <div className="max-w-full flex flex-col px-4 py-8 justify-center items-center">
//                                             <div className="text-[60px]">
//                                                 <PiImagesThin />
//                                             </div>
//                                             <p className="flex flex-col items-center mt-2">
//                                                 <span className="text-gray-800 dark:text-white">
//                                                     Drop your image here, or{' '}
//                                                 </span>
//                                                 <span className="text-primary">
//                                                     Click to browse
//                                                 </span>
//                                             </p>
//                                         </div>
//                                     </Upload>
//                                 )}
//                             </>
//                         )}
//                     />
//                 </FormItem>
//             </div>
//             <p>
//                 Image formats: .jpg, .jpeg, .png. Preferred size: 1:1. You can
//                 upload any size and crop it as needed.
//             </p>

//             {/* Crop Modal */}
//             <Modal
//                 isOpen={cropModalOpen}
//                 onClose={() => setCropModalOpen(false)}
//             >
//                 <div className="relative w-full h-[400px] bg-black">
//                     {imageToCrop && (
//                         <Cropper
//                             image={URL.createObjectURL(imageToCrop)}
//                             crop={crop}
//                             zoom={zoom}
//                             aspect={1}
//                             onCropChange={setCrop}
//                             onZoomChange={setZoom}
//                             onCropComplete={(_, croppedArea) =>
//                                 setCroppedAreaPixels(croppedArea)
//                             }
//                         />
//                     )}
//                 </div>
//                 <div className="flex justify-end mt-4">
//                     <button
//                         className="bg-primary text-white px-4 py-2 rounded"
//                         onClick={async () => {
//                             if (
//                                 !imageToCrop ||
//                                 !croppedAreaPixels ||
//                                 !onCropCompleteCallback
//                             )
//                                 return

//                             const croppedImg = await getCroppedImg(
//                                 URL.createObjectURL(imageToCrop),
//                                 croppedAreaPixels,
//                             )

//                             const image = {
//                                 id: Date.now().toString(),
//                                 name: imageToCrop.name,
//                                 img: croppedImg,
//                             }

//                             onCropCompleteCallback([image])
//                             setCropModalOpen(false)
//                             setImageToCrop(null)
//                         }}
//                     >
//                         Crop & Upload
//                     </button>
//                 </div>
//             </Modal>
//         </Card>
//     )
// }

// export default ImageSection

// import { useState } from 'react'
// import Card from '@/components/ui/Card'
// import Upload from '@/components/ui/Upload'
// import { FormItem } from '@/components/ui/Form'
// import Dialog from '@/components/ui/Dialog'
// import ConfirmDialog from '@/components/shared/ConfirmDialog'
// import Button from '@/components/ui/Button'
// import { Controller } from 'react-hook-form'
// import { HiEye, HiTrash } from 'react-icons/hi'
// import { PiImagesThin } from 'react-icons/pi'
// import Cropper from 'react-easy-crop'
// import { getCroppedImg } from '@/utils/cropImage'

// import type { FormSectionBaseProps } from '../types'

// type ImageSectionProps = FormSectionBaseProps

// type Image = {
//     id: string
//     name: string
//     img: string
// }

// type ImageListProps = {
//     imgList: Image[]
//     onImageDelete: () => void
// }

// const ImageList = ({ imgList, onImageDelete }: ImageListProps) => {
//     const [selectedImg, setSelectedImg] = useState<Image>({} as Image)
//     const [viewOpen, setViewOpen] = useState(false)
//     const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

//     const onViewOpen = (img: Image) => {
//         setSelectedImg(img)
//         setViewOpen(true)
//     }

//     const onDialogClose = () => {
//         setViewOpen(false)
//         setTimeout(() => setSelectedImg({} as Image), 300)
//     }

//     const onDeleteConfirmation = (img: Image) => {
//         setSelectedImg(img)
//         setDeleteConfirmationOpen(true)
//     }

//     const onDeleteConfirmationClose = () => {
//         setSelectedImg({} as Image)
//         setDeleteConfirmationOpen(false)
//     }

//     const onDelete = () => {
//         onImageDelete()
//         setDeleteConfirmationOpen(false)
//     }

//     return (
//         <>
//             {imgList.map((img) => (
//                 <div
//                     key={img.id}
//                     className="group relative rounded-xl border border-gray-200 dark:border-gray-600 p-2 flex"
//                 >
//                     <img
//                         className="rounded-lg max-h-[140px] mx-auto max-w-full dark:bg-transparent"
//                         src={img.img}
//                         alt={img.name}
//                     />
//                     <div className="absolute inset-2 bg-[#000000ba] group-hover:flex hidden text-xl items-center justify-center">
//                         <span
//                             className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
//                             onClick={() => onViewOpen(img)}
//                         >
//                             <HiEye />
//                         </span>
//                         <span
//                             className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
//                             onClick={() => onDeleteConfirmation(img)}
//                         >
//                             <HiTrash />
//                         </span>
//                     </div>
//                 </div>
//             ))}
//             <Dialog
//                 isOpen={viewOpen}
//                 onClose={onDialogClose}
//                 onRequestClose={onDialogClose}
//             >
//                 <h5 className="mb-4">{selectedImg.name}</h5>
//                 <img
//                     className="w-full"
//                     src={selectedImg.img}
//                     alt={selectedImg.name}
//                 />
//             </Dialog>
//             <ConfirmDialog
//                 isOpen={deleteConfirmationOpen}
//                 type="danger"
//                 title="Remove image"
//                 onClose={onDeleteConfirmationClose}
//                 onRequestClose={onDeleteConfirmationClose}
//                 onCancel={onDeleteConfirmationClose}
//                 onConfirm={onDelete}
//             >
//                 <p>Are you sure you want to remove this image?</p>
//             </ConfirmDialog>
//         </>
//     )
// }

// const ImageSection = ({ control, errors }: ImageSectionProps) => {
//     const [cropDialogOpen, setCropDialogOpen] = useState(false)
//     const [imageToCrop, setImageToCrop] = useState<File | null>(null)
//     const [crop, setCrop] = useState({ x: 0, y: 0 })
//     const [zoom, setZoom] = useState(1)
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
//     const [onCropCompleteCallback, setOnCropCompleteCallback] = useState<
//         ((images: Image[]) => void) | null
//     >(null)

//     const handleUpload = (
//         onChange: (images: Image[]) => void,
//         files: File[],
//     ) => {
//         const file = files[0]
//         setImageToCrop(file)
//         setOnCropCompleteCallback(() => onChange)
//         setCropDialogOpen(true)
//     }

//     const handleImageDelete = (onChange: (images: Image[]) => void) => {
//         onChange([])
//     }

//     return (
//         <Card>
//             <h4>Item Image</h4>
//             <p className="text-xs text-gray-500 mb-6">
//                 <span className="text-red-500">*</span> indicates required
//                 fields.
//             </p>
//             <p>
//                 Choose a Item photo or simply drag and drop one photo here.{' '}
//                 <span className="text-red-500">*</span>
//             </p>
//             <div className="mt-4">
//                 <FormItem
//                     invalid={Boolean(errors.imgList)}
//                     errorMessage={errors.imgList?.message}
//                     className="mb-4"
//                 >
//                     <Controller
//                         name="imgList"
//                         control={control}
//                         render={({ field }) => (
//                             <>
//                                 {field.value && field.value.length ? (
//                                     <div className="grid grid-cols-1 gap-2">
//                                         <ImageList
//                                             imgList={field.value}
//                                             onImageDelete={() =>
//                                                 handleImageDelete(
//                                                     field.onChange,
//                                                 )
//                                             }
//                                         />
//                                     </div>
//                                 ) : (
//                                     <Upload
//                                         draggable
//                                         showList={false}
//                                         onChange={(files) =>
//                                             handleUpload(field.onChange, files)
//                                         }
//                                     >
//                                         <div className="max-w-full flex flex-col px-4 py-8 justify-center items-center">
//                                             <div className="text-[60px]">
//                                                 <PiImagesThin />
//                                             </div>
//                                             <p className="flex flex-col items-center mt-2">
//                                                 <span className="text-gray-800 dark:text-white">
//                                                     Drop your image here, or{' '}
//                                                 </span>
//                                                 <span className="text-primary">
//                                                     Click to browse
//                                                 </span>
//                                             </p>
//                                         </div>
//                                     </Upload>
//                                 )}
//                             </>
//                         )}
//                     />
//                 </FormItem>
//             </div>
//             <p>
//                 Image formats: .jpg, .jpeg, .png. Preferred size: 1:1. You can
//                 upload any size and crop it before saving.
//             </p>

//             {/* Cropping Dialog */}
//             <Dialog
//                 isOpen={cropDialogOpen}
//                 width={600}
//                 height={500}
//                 onClose={() => setCropDialogOpen(false)}
//                 onRequestClose={() => setCropDialogOpen(false)}
//             >
//                 <div className="flex flex-col h-full justify-between">
//                     <div className="h-[400px] bg-black relative">
//                         {imageToCrop && (
//                             <Cropper
//                                 image={URL.createObjectURL(imageToCrop)}
//                                 crop={crop}
//                                 zoom={zoom}
//                                 aspect={1}
//                                 onCropChange={setCrop}
//                                 onZoomChange={setZoom}
//                                 onCropComplete={(_, areaPixels) =>
//                                     setCroppedAreaPixels(areaPixels)
//                                 }
//                             />
//                         )}
//                     </div>
//                     <div className="text-right mt-4">
//                         <Button
//                             className="mr-2"
//                             variant="plain"
//                             onClick={() => setCropDialogOpen(false)}
//                         >
//                             Cancel
//                         </Button>
//                         <Button
//                             variant="solid"
//                             onClick={async () => {
//                                 if (
//                                     !imageToCrop ||
//                                     !croppedAreaPixels ||
//                                     !onCropCompleteCallback
//                                 )
//                                     return

//                                 const croppedImg = await getCroppedImg(
//                                     URL.createObjectURL(imageToCrop),
//                                     croppedAreaPixels,
//                                 )

//                                 const image = {
//                                     id: Date.now().toString(),
//                                     name: imageToCrop.name,
//                                     img: croppedImg,
//                                 }

//                                 onCropCompleteCallback([image])
//                                 setCropDialogOpen(false)
//                                 setImageToCrop(null)
//                             }}
//                         >
//                             Crop & Upload
//                         </Button>
//                     </div>
//                 </div>
//             </Dialog>
//         </Card>
//     )
// }

// export default ImageSection
