import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import clsx from 'clsx'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    className?: string
}

const Modal = ({ isOpen, onClose, title, children, className }: ModalProps) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/75 bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel
                                className={clsx(
                                    'w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all',
                                    className,
                                )}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    {title && (
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900"
                                        >
                                            {title}
                                        </Dialog.Title>
                                    )}
                                    <button
                                        className="text-gray-500 hover:text-gray-700"
                                        onClick={onClose}
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default Modal
