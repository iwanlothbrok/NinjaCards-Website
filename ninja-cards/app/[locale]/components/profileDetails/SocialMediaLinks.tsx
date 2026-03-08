'use client'
import React, { useState } from 'react';
import { BASE_API_URL } from '@/utils/constants';
import { FaPlayCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { User } from '@/types/user';
import { ResolvedCardStyle, isLightTheme } from '@/utils/cardTheme';

interface SocialMediaLinksProps {
    user: User | null
    cardStyle: ResolvedCardStyle
}

// ─── Simple Icons CDN map ─────────────────────────────────────────────────────
// darkColor / lightColor = icon color per theme
// svgOverride = inline SVG string for icons removed from Simple Icons CDN (e.g. LinkedIn)
const SOCIAL_PLATFORMS: Record<string, {
    slug?: string
    darkColor: string
    lightColor: string
    label: string
    svgOverride?: string  // raw SVG path data — used instead of CDN if present
}> = {
    website: { slug: 'googlechrome', darkColor: '4285F4', lightColor: '4285F4', label: 'Website' },
    viber: { slug: 'viber', darkColor: 'A076F9', lightColor: '7360F2', label: 'Viber' },
    facebook: { slug: 'facebook', darkColor: '4C9FFF', lightColor: '1877F2', label: 'Facebook' },
    instagram: { slug: 'instagram', darkColor: 'E4405F', lightColor: 'E4405F', label: 'Instagram' },
    // LinkedIn removed from Simple Icons CDN (brand policy) → inline SVG
    linkedin: {
        darkColor: '5EAEFF', lightColor: '0A66C2', label: 'LinkedIn',
        svgOverride: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    },
    twitter: { slug: 'x', darkColor: 'ffffff', lightColor: '000000', label: 'X' },
    github: { slug: 'github', darkColor: 'ffffff', lightColor: '181717', label: 'GitHub' },
    youtube: { slug: 'youtube', darkColor: 'FF4444', lightColor: 'FF0000', label: 'YouTube' },
    tiktok: { slug: 'tiktok', darkColor: 'ffffff', lightColor: '010101', label: 'TikTok' },
    behance: { slug: 'behance', darkColor: '4D8FFF', lightColor: '1769FF', label: 'Behance' },
    paypal: { slug: 'paypal', darkColor: '5EAEFF', lightColor: '003087', label: 'PayPal' },
    trustpilot: { slug: 'trustpilot', darkColor: '00B67A', lightColor: '00B67A', label: 'TrustPilot' },
    whatsapp: { slug: 'whatsapp', darkColor: '25D366', lightColor: '25D366', label: 'WhatsApp' },
    revolut: { slug: 'revolut', darkColor: 'ffffff', lightColor: '0075EB', label: 'Revolut' },
    googleReview: { slug: 'google', darkColor: '6EA8FF', lightColor: '4285F4', label: 'Google' },
    telegram: { slug: 'telegram', darkColor: '26A5E4', lightColor: '26A5E4', label: 'Telegram' },
    calendly: { slug: 'calendly', darkColor: '4D8FFF', lightColor: '006BFF', label: 'Calendly' },
    discord: { slug: 'discord', darkColor: '7289FF', lightColor: '5865F2', label: 'Discord' },
    tripadvisor: { slug: 'tripadvisor', darkColor: '34E0A1', lightColor: '34E0A1', label: 'Tripadvisor' },
    pdf: { slug: 'adobeacrobatreader', darkColor: 'FF4444', lightColor: 'EC1C24', label: 'PDF' },
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ user, cardStyle }) => {
    const [isModalOpen, setModalOpen] = useState(false)
    const isLight = isLightTheme(cardStyle)

    const cardBg = isLight
        ? 'bg-black/[0.04] hover:bg-black/[0.08] border-black/[0.08]'
        : 'bg-white/[0.04] hover:bg-white/[0.09] border-white/[0.08]'
    const labelColor = isLight
        ? 'text-gray-500 group-hover:text-gray-700'
        : 'text-gray-600 group-hover:text-gray-400'

    const socialLinks = [
        { key: 'website', url: user?.website },
        { key: 'viber', url: user?.viber ? `viber://chat?number=${user.viber}` : null },
        { key: 'pdf', url: user?.pdf ? `${BASE_API_URL}/api/profile/download-pdf/${user.id}` : null },
        { key: 'facebook', url: user?.facebook },
        { key: 'instagram', url: user?.instagram },
        { key: 'linkedin', url: user?.linkedin },
        { key: 'twitter', url: user?.twitter },
        { key: 'github', url: user?.github },
        { key: 'youtube', url: user?.youtube },
        { key: 'tiktok', url: user?.tiktok },
        { key: 'behance', url: user?.behance },
        { key: 'paypal', url: user?.paypal },
        { key: 'trustpilot', url: user?.trustpilot },
        { key: 'whatsapp', url: user?.whatsapp && user.whatsapp.length > 5 ? `https://wa.me/${user.whatsapp}` : null },
        { key: 'revolut', url: user?.revolut ? `https://revolut.me/${user.revolut}` : null },
        { key: 'googleReview', url: user?.googleReview },
        { key: 'telegram', url: user?.telegram },
        { key: 'calendly', url: user?.calendly },
        { key: 'discord', url: user?.discord },
        { key: 'tripadvisor', url: user?.tripadvisor },
    ].filter(l => l.url)

    const handleLinkClick = async () => {
        if (!user?.id) return
        try {
            await fetch(`${BASE_API_URL}/api/dashboard/incrementSocialMediaLinks`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id }),
            })
        } catch (error) {
            console.error('Failed to increment social media link clicks:', error)
        }
    }

    const hasLinks = socialLinks.length > 0 || !!user?.videoUrl
    if (!hasLinks) return null

    return (
        <div className="px-1 pt-4 pb-2">

            {/* Section label */}
            <p className={`text-center text-[9px] font-black uppercase tracking-[0.22em] mb-4 ${isLight ? 'text-gray-400' : 'text-gray-700'}`}>
                Connect
            </p>

            {/* Grid — 4 columns */}
            <div className="grid grid-cols-4 gap-2.5">
                {socialLinks.map(({ key, url }, i) => {
                    const platform = SOCIAL_PLATFORMS[key]
                    if (!platform) return null
                    const iconColor = isLight ? platform.lightColor : platform.darkColor
                    const iconUrl = platform.slug
                        ? `https://cdn.simpleicons.org/${platform.slug}/${iconColor}`
                        : null

                    return (
                        <motion.a
                            key={key}
                            href={url!}
                            target={key !== 'viber' ? '_blank' : undefined}
                            rel="noopener noreferrer"
                            aria-label={platform.label}
                            onClick={handleLinkClick}
                            initial={{ opacity: 0, scale: 0.65 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.72 + i * 0.04, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                            whileTap={{ scale: 0.9 }}
                            className="group flex flex-col items-center gap-1.5"
                        >
                            <div
                                className={`w-full aspect-square rounded-2xl border flex items-center justify-center transition-all duration-200 ${cardBg}`}
                                style={{ padding: '22%' }}
                            >
                                {platform.svgOverride ? (
                                    // Inline SVG — for icons removed from Simple Icons CDN
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill={`#${iconColor}`}
                                        className="w-full h-full"
                                        aria-hidden="true"
                                    >
                                        <path d={platform.svgOverride} />
                                    </svg>
                                ) : (
                                    <img
                                        src={iconUrl!}
                                        alt={platform.label}
                                        className="w-full h-full object-contain"
                                        onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0' }}
                                    />
                                )}
                            </div>
                            <span className={`text-[9px] transition-colors truncate max-w-full font-medium ${labelColor}`}>
                                {platform.label}
                            </span>
                        </motion.a>
                    )
                })}

                {/* Video */}
                {user?.videoUrl && (
                    <motion.button
                        onClick={() => setModalOpen(true)}
                        aria-label="Watch Video"
                        initial={{ opacity: 0, scale: 0.65 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.72 + socialLinks.length * 0.04, duration: 0.32 }}
                        whileTap={{ scale: 0.9 }}
                        className="group flex flex-col items-center gap-1.5"
                    >
                        <div className={`w-full aspect-square rounded-2xl border flex items-center justify-center transition-all duration-200 ${cardBg}`}
                            style={{ padding: '22%' }}>
                            <FaPlayCircle className="w-full h-full text-amber-500/70 group-hover:text-amber-400 transition-colors" />
                        </div>
                        <span className={`text-[9px] font-medium transition-colors ${labelColor}`}>Video</span>
                    </motion.button>
                )}
            </div>

            {/* ── Video Modal ── */}
            <AnimatePresence>
                {isModalOpen && createPortal(
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center z-[9999] p-4"
                        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
                        onClick={() => setModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.88, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.88, opacity: 0, y: 20 }}
                            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                            className="relative w-full max-w-xl rounded-3xl overflow-hidden border border-white/[0.08]"
                            style={{ background: '#0f0f0f', boxShadow: '0 32px 80px rgba(0,0,0,0.85)' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
                                style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.5), transparent)' }} />

                            <button
                                onClick={() => setModalOpen(false)}
                                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-xl border border-white/[0.08] bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center text-gray-400 hover:text-white transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="p-5">
                                <video controls autoPlay className="w-full rounded-2xl max-h-[75vh]">
                                    <source src={user?.videoUrl} type="video/mp4" />
                                </video>
                            </div>
                        </motion.div>
                    </motion.div>,
                    document.body
                )}
            </AnimatePresence>
        </div>
    )
}

export default SocialMediaLinks