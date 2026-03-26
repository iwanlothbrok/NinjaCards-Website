'use client'

import React, { Fragment } from 'react'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { motion } from 'framer-motion'
import { ResolvedCardStyle } from '@/utils/cardTheme'

interface QRModalProps {
    isOpen: boolean
    onClose: () => void
    qrCode: string       // base64 or URL
    name?: string
    cardStyle: ResolvedCardStyle
}

export default function QRModal({ isOpen, onClose, qrCode, name, cardStyle }: QRModalProps) {
    const accent = cardStyle.accent

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
                <div className="flex min-h-screen items-center justify-center p-4">

                    {/* Backdrop */}
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                        leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/75 backdrop-blur-md" aria-hidden="true" />
                    </TransitionChild>

                    {/* Panel */}
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300" enterFrom="opacity-0 scale-90" enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-90"
                    >
                        <DialogPanel
                            className="relative w-full max-w-xs rounded-3xl overflow-hidden border border-white/[0.08]"
                            style={{
                                background: '#0e0e0e',
                                boxShadow: `0 32px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.05), 0 -1px 0 0 ${accent}40`,
                            }}
                        >
                            {/* Accent top line */}
                            <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
                                style={{ background: `linear-gradient(90deg, transparent, ${accent}80, transparent)` }} />

                            <div className="px-6 pt-6 pb-7 flex flex-col items-center gap-5">

                                {/* Header */}
                                <div className="w-full flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: `${accent}99` }}>
                                            QR Код
                                        </p>
                                        {name && <p className="text-sm font-bold text-white mt-0.5">{name}</p>}
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="w-8 h-8 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-gray-500 hover:text-gray-300 transition-all"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* QR Image */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.92 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    className="rounded-2xl overflow-hidden p-3"
                                    style={{ background: '#fff', boxShadow: `0 0 40px ${accent}20` }}
                                >
                                    <img
                                        src={qrCode}
                                        alt="QR Code"
                                        className="w-48 h-48 object-contain"
                                    />
                                </motion.div>

                                {/* Hint */}
                                <p className="text-[11px] text-gray-600 text-center leading-relaxed">
                                    Сканирай за да отвориш визитката
                                </p>

                                {/* Download button */}
                                <a
                                    href={qrCode}
                                    download="qr-code.png"
                                    className="w-full py-3 rounded-xl text-sm font-bold text-center transition-all"
                                    style={{
                                        background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                                        color: '#000',
                                        boxShadow: `0 6px 20px ${accent}30`,
                                    }}
                                >
                                    ⬇ Изтегли QR код
                                </a>

                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    )
}