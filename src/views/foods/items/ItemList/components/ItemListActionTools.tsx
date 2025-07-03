import { useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { TbDownload, TbPlus, TbUpload } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import useMerchantStore from '@/store/useMerchantStore'
import { useItemListStore } from '../store/itemListStore'
import { apiGetItemList } from '@/services/ItemService' // adjust if needed
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'

const ItemListActionTools = () => {
    const merchantId = useMerchantStore((state) => state.merchantId)
    const { tableData, filterData } = useItemListStore((state) => state)

    const navigate = useNavigate()
    const fileInputRef = useRef<HTMLInputElement>(null)

    // SWR mutate key
    const swrKey: [string, Record<string, unknown>] = [
        '/api/items',
        {
            ...tableData,
            ...filterData,
            merchantId,
        },
    ]

    // Bind mutate to the same key as useSWR (so we can refetch)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { mutate } = useSWR(swrKey, ([_, params]) => apiGetItemList(params), {
        revalidateOnFocus: false,
    })

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)
        formData.append('merchantId', merchantId ?? '')

        // try {
        //     const response = await fetch(
        //         'http://localhost:3000/dev/upload-csv',
        //         {
        //             method: 'POST',
        //             body: formData,
        //         },
        //     )

        //     const result = await response.json()
        //     if (response.ok) {
        //         toast.push(
        //             <Notification type="success">
        //                 Successfully Uploaded{' '}
        //                 {result.insertedCount ?? result.count ?? 0} Items.
        //             </Notification>,
        //             {
        //                 placement: 'top-center',
        //             },
        //         )

        //         await mutate()
        //     } else {
        //         toast.push(
        //             <Notification type="success">
        //                 Upload failed: ${result.error || 'Unknown error'}
        //             </Notification>,
        //             {
        //                 placement: 'top-center',
        //             },
        //         )
        //     }
        // } catch (error: unknown) {
        //     console.error('Upload failed:', error)
        //     alert(' An error occurred while uploading.')
        // } finally {
        //     // Reset the input so same file can be re-selected
        //     if (fileInputRef.current) {
        //         fileInputRef.current.value = ''
        //     }
        // }
        try {
            const response = await fetch(
                'http://localhost:3000/dev/upload-csv',
                {
                    method: 'POST',
                    body: formData,
                },
            )

            const result = await response.json()

            if (response.ok) {
                toast.push(
                    <Notification type="success">
                        Successfully Uploaded{' '}
                        {result.insertedCount ?? result.count ?? 0} Items.
                    </Notification>,
                    {
                        placement: 'top-center',
                    },
                )

                await mutate()
            } else {
                // Handle MongoDB duplicate key error (E11000)
                const errorMessage = result.error || 'Unknown error'

                if (
                    errorMessage.includes('E11000') &&
                    errorMessage.includes('duplicate key')
                ) {
                    // Optional: extract duplicate value (e.g., item name)
                    const match = errorMessage.match(
                        /dup key: { name: "(.*?)" }/,
                    )
                    const duplicateValue = match?.[1]

                    toast.push(
                        <Notification type="danger">
                            Upload failed: Item with name &quot;
                            {duplicateValue ?? 'already exists'}&quot; already
                            exists.
                        </Notification>,
                        {
                            placement: 'top-center',
                        },
                    )
                } else {
                    toast.push(
                        <Notification type="danger">
                            Upload failed: {errorMessage}
                        </Notification>,
                        {
                            placement: 'top-center',
                        },
                    )
                }
            }
        } catch (error: unknown) {
            console.error('Upload failed:', error)
            toast.push(
                <Notification type="danger">
                    Upload failed due to a network or server error.
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
        } finally {
            // Reset the input so same file can be re-selected
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handleDownload = () => {
        const headers = [
            'name',
            'description',
            'price',
            'isAvailable',
            'isFeatured',
            'isVegetarian',
            'category',
            'flags',
            'options',
            'addOns',
        ]

        const rows = [
            {
                name: 'Veg Burger',
                description: 'Delicious vegetarian burger',
                price: 4.99,
                isAvailable: true,
                isFeatured: false,
                isVegetarian: true,
                category: 'Burger',
                flags: 'hot;spicy',
                options: JSON.stringify([
                    { label: 'Small', price: 1.0 },
                    { label: 'Medium', price: 1.5 },
                ]),
                addOns: JSON.stringify([
                    { label: 'Cheese', price: 0.5 },
                    { label: 'Extra Sauce', price: 0.25 },
                ]),
            },
        ]

        // Convert to CSV string
        const csvContent =
            headers.join(',') +
            '\n' +
            rows
                .map((row) =>
                    headers
                        .map((header) => {
                            const cell = row[header as keyof typeof row]
                            // Escape double quotes
                            return `"${String(cell).replace(/"/g, '""')}"`
                        })
                        .join(','),
                )
                .join('\n')

        // Create Blob and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'item-template.csv')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <Button
                variant="solid"
                icon={<TbPlus className="text-xl" />}
                onClick={() => navigate('/foods/items/create')}
            >
                Create Item
            </Button>

            <Button
                variant="solid"
                icon={<TbUpload className="text-xl" />}
                onClick={handleUploadClick}
            >
                Upload CSV
            </Button>
            <Button
                variant="solid"
                icon={<TbDownload className="text-xl" />}
                onClick={handleDownload}
            >
                Download CSV
            </Button>

            <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    )
}

export default ItemListActionTools

// import Button from '@/components/ui/Button'
// import { TbPlus } from 'react-icons/tb'
// import { useNavigate } from 'react-router-dom'

// const ItemListActionTools = () => {
//     const navigate = useNavigate()

//     return (
//         <div className="flex flex-col md:flex-row gap-3">
//             <Button
//                 variant="solid"
//                 icon={<TbPlus className="text-xl" />}
//                 onClick={() => navigate('/foods/items/create')}
//             >
//                 Create Item
//             </Button>
//         </div>
//     )
// }

// export default ItemListActionTools
