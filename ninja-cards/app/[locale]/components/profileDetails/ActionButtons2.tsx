'use client'

import React, { useState } from 'react';
import { User } from '@/types/user';
import { BASE_API_URL } from '@/utils/constants';
import LeadForm from './LeadForm';
import { motion, AnimatePresence } from 'framer-motion';
import { ResolvedCardStyle, isLightTheme } from '@/utils/cardTheme';

// ─── Icons ────────────────────────────────────────────────────────────────────
const PhoneIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] flex-shrink-0">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.02 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
)
const ShareIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] flex-shrink-0">
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
)
const DownloadIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] flex-shrink-0">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
)
const ContactIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px] flex-shrink-0">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
)
const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] flex-shrink-0">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)
const EmailIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] flex-shrink-0">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
)

// ─── Build mailto link ────────────────────────────────────────────────────────
function buildMailto(user: User, isBg: boolean): string {
    const to = user.email ?? '';

    const name = user.name
        || [user.firstName, user.lastName].filter(Boolean).join(' ')
        || (isBg ? 'вас' : 'you');

    const position = user.position
        ? (isBg ? ` (${user.position})` : ` (${user.position})`)
        : '';

    const subject = isBg
        ? `Здравейте, ${name}${position}`
        : `Hello, ${name}${position}`;

    const body = isBg
        ? `Здравейте, ${name},\n\nВидях вашата дигитална визитка и исках да се свържа с вас.\n\nС уважение,`
        : `Hi ${name},\n\nI came across your digital business card and wanted to get in touch.\n\nBest regards,`;

    return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// ─── Component ────────────────────────────────────────────────────────────────
const ActionButtons2: React.FC<{
    generateVCF: () => void
    user: User | null
    cardStyle: ResolvedCardStyle
}> = ({ generateVCF, user, cardStyle }) => {
    const [showLeadForm, setShowLeadForm] = useState(false)
    const [saved, setSaved] = useState(false)
    const [shared, setShared] = useState(false)

    if (!user) return null

    const isBg = user.language === 'bg'
    const isLight = isLightTheme(cardStyle)
    const accent = cardStyle.accent

    const ghostClass = isLight
        ? 'border border-black/[0.1] bg-black/[0.04] hover:bg-black/[0.08] text-gray-700 hover:text-gray-900'
        : 'border border-white/[0.1] bg-white/[0.05] hover:bg-white/[0.09] text-gray-200'

    const handleSave = () => {
        generateVCF()
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }

    const handleShare = () => {
        if (user.id) {
            fetch(`${BASE_API_URL}/api/dashboard/incrementProfileShares`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id }),
            }).catch(console.error)
        }
        if (navigator.share) {
            navigator.share({
                title: user.name || 'Share Contact',
                text: `Contact ${user.name || 'User'}`,
                url: window.location.href,
            }).catch(console.error)
        } else {
            navigator.clipboard?.writeText(window.location.href)
            setShared(true)
            setTimeout(() => setShared(false), 2500)
        }
    }

    const hasEmail = !!user.email

    return (
        <>
            <AnimatePresence>
                {showLeadForm && (
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                        aria-hidden="true"
                    />
                )}
            </AnimatePresence>

            <div className="flex flex-col gap-3 px-1">

                {/* ── Call — solid accent ── */}
                <motion.a
                    href={`tel:${user.phone1}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.50, duration: 0.42 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-base text-black transition-all duration-200 select-none"
                    style={{
                        background: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)`,
                        boxShadow: `0 8px 28px ${accent}40`,
                    }}
                >
                    <PhoneIcon />
                    {isBg ? 'Обади се' : 'Call'}
                </motion.a>

                {/* ── Share + Save — 2 col ghost ── */}
                <div className="grid grid-cols-2 gap-3">
                    <motion.button
                        onClick={handleShare}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.57, duration: 0.42 }}
                        whileTap={{ scale: 0.97 }}
                        className={`flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 select-none ${ghostClass}`}
                    >
                        <AnimatePresence mode="wait">
                            {shared
                                ? <motion.span key="c" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-emerald-500"><CheckIcon /></motion.span>
                                : <motion.span key="s" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><ShareIcon /></motion.span>
                            }
                        </AnimatePresence>
                        {shared ? (isBg ? 'Копирано!' : 'Copied!') : (isBg ? 'Сподели' : 'Share')}
                    </motion.button>

                    <motion.button
                        onClick={handleSave}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.63, duration: 0.42 }}
                        whileTap={{ scale: 0.97 }}
                        className={`flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 select-none ${ghostClass}`}
                    >
                        <AnimatePresence mode="wait">
                            {saved
                                ? <motion.span key="c" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-emerald-500"><CheckIcon /></motion.span>
                                : <motion.span key="d" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><DownloadIcon /></motion.span>
                            }
                        </AnimatePresence>
                        {saved ? (isBg ? 'Запазено!' : 'Saved!') : (isBg ? 'Запази' : 'Save')}
                    </motion.button>
                </div>

                {/* ── Send Email — ghost, само ако има email ── */}
                {hasEmail && (
                    <motion.a
                        href={buildMailto(user, isBg)}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.67, duration: 0.42 }}
                        whileTap={{ scale: 0.97 }}
                        className={`flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 select-none ${ghostClass}`}
                    >
                        <EmailIcon />
                        {isBg ? 'Изпрати имейл' : 'Send Email'}
                    </motion.a>
                )}

                {/* ── Leave Contact — dominant accent outline ── */}
                <motion.button
                    onClick={() => setShowLeadForm(true)}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: hasEmail ? 0.73 : 0.69, duration: 0.42 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl font-bold text-base transition-all duration-200 select-none"
                    style={{
                        border: `1.5px solid ${accent}`,
                        color: accent,
                        background: `${accent}0d`,
                        boxShadow: `0 0 0 0 ${accent}00`,
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = `${accent}18`;
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 24px ${accent}28`;
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = `${accent}0d`;
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 0 0 ${accent}00`;
                    }}
                >
                    <ContactIcon />
                    {isBg ? 'Остави контакт' : 'Leave Contact'}
                </motion.button>

            </div>

            <LeadForm
                userId={user.id}
                name={user.name ?? user.firstName}
                isVisible={showLeadForm}
                onClose={() => setShowLeadForm(false)}
                cardStyle={cardStyle}
            />
        </>
    )
}

export default ActionButtons2