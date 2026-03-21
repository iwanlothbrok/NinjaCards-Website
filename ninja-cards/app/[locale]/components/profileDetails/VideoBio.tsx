'use client'

import React, { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ResolvedCardStyle } from '@/utils/cardTheme'
import { User } from '@/types/user'

interface VideoBioProps {
    user: User
    cardStyle: ResolvedCardStyle
}

export default function VideoBio({ user, cardStyle }: VideoBioProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [playing, setPlaying] = useState(false)
    const [expanded, setExpanded] = useState(false)

    const videoUrl = (user as any).videoUrl
    if (!videoUrl) return null

    const accent = cardStyle.accent
    const textPrimary = cardStyle.textPrimary
    const isDark = cardStyle.bgClass.includes('black') || cardStyle.bgClass.includes('gray-9') || cardStyle.bgClass.includes('zinc-9') || cardStyle.name.includes('dark')
    const headerBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'
    const borderColor = `${accent}22`

    const togglePlay = () => {
        if (!videoRef.current) return
        if (playing) { videoRef.current.pause(); setPlaying(false) }
        else { videoRef.current.play(); setPlaying(true) }
    }

    const toggleExpand = () => setExpanded(e => !e)

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mx-4 rounded-2xl overflow-hidden"
            style={{ border: `1px solid ${borderColor}`, boxShadow: `0 4px 20px ${accent}10` }}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between px-4 py-2.5 cursor-pointer select-none"
                style={{ background: headerBg, borderBottom: `1px solid ${borderColor}` }}
                onClick={toggleExpand}
            >
                <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}bb)`, boxShadow: `0 3px 8px ${accent}40` }}>
                        <svg className="w-3.5 h-3.5" fill="white" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest leading-none" style={{ color: accent }}>
                            Видео представяне
                        </p>
                        <p className="text-[11px] font-medium mt-0.5" style={{ color: `${textPrimary}66` }}>
                            Гледай в 30 секунди
                        </p>
                    </div>
                </div>

                {/* Chevron */}
                <motion.div
                    animate={{ rotate: expanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: `${textPrimary}44` }}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </motion.div>
            </div>

            {/* Collapsible video */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div className="relative" style={{ background: '#000' }}>
                            <video
                                ref={videoRef}
                                src={videoUrl}
                                className="w-full max-h-64 object-cover"
                                playsInline
                                preload="metadata"
                                onEnded={() => setPlaying(false)}
                                onPause={() => setPlaying(false)}
                                onPlay={() => setPlaying(true)}
                            />

                            {/* Play overlay */}
                            <AnimatePresence>
                                {!playing && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        onClick={togglePlay}
                                        className="absolute inset-0 flex items-center justify-center"
                                        style={{ background: 'rgba(0,0,0,0.4)' }}
                                    >
                                        <div
                                            className="w-14 h-14 rounded-full flex items-center justify-center"
                                            style={{
                                                background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                                                boxShadow: `0 8px 28px ${accent}50`,
                                            }}
                                        >
                                            <svg className="w-6 h-6 ml-1" fill="black" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </motion.button>
                                )}
                            </AnimatePresence>

                            {/* Pause button when playing */}
                            {playing && (
                                <button
                                    onClick={togglePlay}
                                    className="absolute bottom-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center transition-opacity hover:opacity-80"
                                    style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}
                                >
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}