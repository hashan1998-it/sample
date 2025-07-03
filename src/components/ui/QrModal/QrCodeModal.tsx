// components/QRCodeModal.tsx
import React, { useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import Button from '../Button'
import { Container } from '@/components/shared'
import { CgSoftwareDownload } from 'react-icons/cg'

interface QRCodeModalProps {
    isOpen: boolean
    onClose: () => void
    menuUrl: string
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({
    isOpen,
    onClose,
    menuUrl,
}) => {
    const qrRef = useRef<HTMLCanvasElement>(null)

    const handleDownload = () => {
        const canvas = qrRef.current
        if (!canvas) return

        const url = canvas.toDataURL('image/png')
        const a = document.createElement('a')
        a.href = url
        a.download = 'menu-qr.png'
        a.click()
    }

    if (!isOpen) return null

    return (
        <Container>
            <div className="fixed inset-0 bg-black/75 bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white min-w-[400px] p-6 rounded-lg shadow-lg text-center relative justify-center flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-4">
                        Scan this QR Code
                    </h2>
                    <QRCodeCanvas
                        ref={qrRef}
                        value={menuUrl}
                        size={200}
                        includeMargin={true}
                    />
                    {/* <p className="mt-2 text-sm break-all">{menuUrl}</p> */}

                    <div className="flex gap-3 mt-5">
                        <Button
                            size="sm"
                            type="button"
                            variant="solid"
                            icon={<CgSoftwareDownload />}
                            onClick={handleDownload}
                        >
                            Download
                        </Button>
                        <Button
                            size="sm"
                            className="ltr:mr-3 rtl:ml-3"
                            type="button"
                            customColorClass={() =>
                                'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error'
                            }
                            onClick={onClose}
                        >
                            Close
                        </Button>
                        {/* <Button type="button" variant="solid" onClick={onClose}>
                            Close
                        </Button> */}
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default QRCodeModal
