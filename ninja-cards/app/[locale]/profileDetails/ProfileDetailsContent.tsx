"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ActionButtons2 from '../components/profileDetails/ActionButtons2';
import { BASE_API_URL } from '@/utils/constants';
import SocialMediaLinks from '../components/profileDetails/SocialMediaLinks';
import { User } from '@/types/user';
import BackgroundSelector from '../components/profileDetails/BackgroundSelector';
import ProfileHeader from '../components/profileDetails/ProfileHeader';
import generateVCF from "@/utils/generateVCF";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
    CardTheme,
    ResolvedCardStyle,
    parseCardTheme,
    serializeCardTheme,
    resolveCardStyle,
} from "../../../utils/cardTheme";
import "cropperjs/dist/cropper.css";
import MapPreview from "../components/profileDetails/MapPreview";
import BioPreview from "../components/profileDetails/BioPreview";
import VideoBio from "../components/profileDetails/VideoBio";

interface Alert { message: string; title: string; color: string }

// ─── API helpers ──────────────────────────────────────────────────────────────
const saveTheme = async (
    userId: string,
    theme: CardTheme,
    showAlert: (msg: string, title: string, color: string) => void
) => {
    try {
        const res = await fetch(`${BASE_API_URL}/api/profile/saveColor`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, selectedColor: serializeCardTheme(theme) }),
        })
        if (!res.ok) throw new Error()
    } catch {
        showAlert('Failed to save theme', 'Error', 'red')
    }
}

const fetchUser = async (
    userId: string,
    setUser: React.Dispatch<React.SetStateAction<User | null>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    showAlert: (msg: string, title: string, color: string) => void
) => {
    setLoading(true)
    try {
        const res = await fetch(`${BASE_API_URL}/api/profile/${userId}`)
        if (!res.ok) throw new Error()
        setUser(await res.json())
    } catch {
        showAlert('Failed to load profile', 'Error', 'red')
    } finally {
        setLoading(false)
    }
}

// ─── Loading screen ───────────────────────────────────────────────────────────
function LoadingScreen() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5" style={{ background: '#080808' }}>
            <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border border-amber-500/15" />
                <div className="absolute inset-0 rounded-full border border-transparent border-t-amber-500 animate-spin" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.22em] font-bold text-gray-700">Loading</p>
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────
const ProfileDetailsContent: React.FC<{ userId: string }> = ({ userId }) => {
    const { user } = useAuth()
    const t = useTranslations("cropModal")
    const router = useRouter()

    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState<Alert | null>(null)

    // ── Theme state — single source of truth ──────────────────────────────────
    const [cardTheme, setCardTheme] = useState<CardTheme>({
        base: 'black',
        accent: '#f59e0b',
        textPrimary: '#ffffff',
        textSecondary: 'rgba(255,255,255,0.45)',
    })
    const cardStyle: ResolvedCardStyle = resolveCardStyle(cardTheme)

    const [, setIsPhone] = useState(false)
    const [coverPreview, setCoverPreview] = useState<string | null>(null)
    const [fileForUpload, setFileForUpload] = useState<File | null>(null)
    const [cropper, setCropper] = useState<any>(null)
    const [croppedImage, setCroppedImage] = useState<string | null>(null)
    const [hasIncrementedVisit, setHasIncrementedVisit] = useState(false)
    const [hasDownloadedVCF, setHasDownloadedVCF] = useState(false)
    const [isDesktop, setIsDesktop] = useState(false)

    // Detect desktop
    useEffect(() => {
        const check = () => setIsDesktop(window.innerWidth >= 768)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    // Detect mobile
    useEffect(() => {
        const check = () => setIsPhone(window.innerWidth <= 768)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return
        const validTypes = ["image/jpeg", "image/png", "image/gif"]
        if (!validTypes.includes(file.type) || file.size > 5 * 1024 * 1024) return
        setCoverPreview(URL.createObjectURL(file))
        setFileForUpload(file)
    }

    const saveCover = async () => {
        if (!croppedImage || !currentUser) return
        try {
            const res = await fetch(`${BASE_API_URL}/api/profile/uploadCover`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: currentUser.id, coverImage: croppedImage }),
            })
            if (!res.ok) throw new Error()
            const result = await res.json()
            setCurrentUser({ ...currentUser, coverImage: result.coverImage })
            showAlert("Cover image saved.", "Success", "green")
            cancelCover()
        } catch {
            showAlert("Failed to save cover.", "Error", "red")
        }
    }

    const cancelCover = () => {
        setCoverPreview(null)
        setFileForUpload(null)
        setCroppedImage(null)
    }

    const incrementProfileVisits = async (uid: string) => {
        try {
            await fetch(`${BASE_API_URL}/api/dashboard/increaseProfileVisits`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: uid }),
            })
        } catch { /* silent */ }
    }

    // Load user
    useEffect(() => {
        if (userId) fetchUser(userId, setCurrentUser, setLoading, showAlert)
    }, [userId])

    // Once user loaded — resolve theme + side effects
    useEffect(() => {
        if (!currentUser) return

        // ── Redirect if needs setup ──
        const checkSetup = async () => {
            try {
                const res = await fetch(`${BASE_API_URL}/api/profile/check?userId=${userId}`)
                if (!res.ok) return
                const data = await res.json()
                if (data.needsSetup) router.push(`/finishProfile/${userId}`)
            } catch { /* silent */ }
        }
        checkSetup()

        // ── Restore saved theme (JSON or legacy string) ──
        if (currentUser.selectedColor) {
            setCardTheme(parseCardTheme(currentUser.selectedColor))
        }

        // ── Increment visits once ──
        if (!hasIncrementedVisit) {
            incrementProfileVisits(currentUser.id)
            setHasIncrementedVisit(true)
        }

        // ── isDirect VCF download ──
        if (!hasDownloadedVCF && currentUser.isDirect) {
            setHasDownloadedVCF(true)
            generateVCF(currentUser)
        }
    }, [currentUser])

    // ── Theme change handler (called by BackgroundSelector) ──────────────────
    const handleThemeChange = (theme: CardTheme) => {
        setCardTheme(theme)
        if (currentUser?.id) {
            saveTheme(currentUser.id, theme, showAlert)
        }
    }

    const showAlert = (message: string, title: string, color: string) => {
        setAlert({ message, title, color })
        setTimeout(() => setAlert(null), 4000)
    }

    if (!currentUser || loading) return <LoadingScreen />

    // ── Card content (shared between mobile & desktop layouts) ───────────────
    const cardContent = (
        <div
            className={`relative ${cardStyle.name}`}
            style={{ '--card-bg': cardStyle.cssVar } as React.CSSProperties}
        >
            <ProfileHeader
                user={currentUser}
                cardStyle={cardStyle}
                coverPreview={croppedImage || coverPreview}
                handleCoverChange={handleCoverChange}
                saveCover={saveCover}
                cancelCover={cancelCover}
            />

            {/* Divider */}
            <div className="mx-5 h-px" style={{ background: `${cardStyle.textPrimary}0f` }} />

            {/* Action Buttons */}
            <div className="relative z-10 px-4 pt-5 pb-2">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.50, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                    <ActionButtons2
                        generateVCF={() => generateVCF(currentUser)}
                        user={currentUser}
                        cardStyle={cardStyle}
                    />
                </motion.div>
            </div>

            {/* Social Links */}
            <div className="relative z-10 px-4 pt-3 pb-4">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.62, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                    <SocialMediaLinks user={currentUser} cardStyle={cardStyle} />
                </motion.div>
            </div>


            {currentUser.bio && (
                <motion.div className="mt-5"
                    initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.66, duration: 0.45 }}>
                    <BioPreview user={currentUser} cardStyle={cardStyle} />
                </motion.div>
            )}

            {(currentUser as any).videoUrl && (
                <motion.div className="mt-5"
                    initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.60, duration: 0.45 }}>
                    <VideoBio user={currentUser} cardStyle={cardStyle} />
                </motion.div>
            )}

            {((user as any)?.street1 || (user as any)?.city) && (
                <motion.div className="mt-5"
                    initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.62, duration: 0.45 }}>
                    <MapPreview user={currentUser} cardStyle={cardStyle} />
                </motion.div>
            )}


            {/* Background / Theme Selector (owner only) */}
            {user?.id === currentUser?.id && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.75, duration: 0.4 }}
                >
                    <BackgroundSelector
                        cardStyle={cardStyle}
                        onThemeChange={handleThemeChange}
                    />
                </motion.div>
            )}

            {/* Branding footer */}
            <div className="flex flex-col items-center pb-8 pt-2 gap-1">
                <div className="w-6 h-px" style={{ background: `${cardStyle.textPrimary}15` }} />
                <p className="text-[14px] tracking-[0.24em] uppercase font-bold pt-2"
                    style={{ color: `${cardStyle.textPrimary}18` }}>
                    Powered by Ninja Card
                </p>
            </div>
        </div>
    )

    return (
        <>
            {/* Toast */}
            <AnimatePresence>
                {alert && (
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.3 }}
                        className={`fixed top-0 inset-x-0 z-[100] px-5 py-3.5 text-sm font-semibold text-center text-white ${alert.color === 'green' ? 'bg-emerald-500' : 'bg-red-500'}`}
                        style={{ boxShadow: alert.color === 'green' ? '0 4px 24px rgba(16,185,129,0.4)' : '0 4px 24px rgba(239,68,68,0.4)' }}
                    >
                        <strong>{alert.title}:</strong> {alert.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile */}
            {!isDesktop && (
                <div className={`min-h-screen ${cardStyle.bgClass}`}>
                    {cardContent}
                </div>
            )}

            {/* Desktop — floating card */}
            {isDesktop && (
                <div
                    className="min-h-screen flex items-start justify-center py-16 px-4"
                    style={{
                        background: `radial-gradient(ellipse 70% 55% at 50% 30%, ${cardStyle.accent}0d 0%, #060606 60%)`,
                    }}
                >
                    <div className="fixed inset-0 pointer-events-none -z-10" style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
                        backgroundSize: '36px 36px',
                    }} />

                    <motion.div
                        initial={{ opacity: 0, y: 28, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full overflow-hidden"
                        style={{
                            maxWidth: 420,
                            borderRadius: 32,
                            boxShadow: `0 0 0 1px rgba(255,255,255,0.07), 0 32px 80px rgba(0,0,0,0.75), 0 0 40px ${cardStyle.accent}10`,
                        }}
                    >
                        {/* Accent top line */}
                        <div className="absolute top-0 inset-x-0 h-px z-20 pointer-events-none"
                            style={{ background: `linear-gradient(90deg, transparent, ${cardStyle.accent}80, transparent)` }} />

                        {cardContent}

                        {/* Reflection glow */}
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-64 h-16 pointer-events-none -z-10"
                            style={{ background: `radial-gradient(ellipse, ${cardStyle.accent}22 0%, transparent 70%)` }} />
                    </motion.div>
                </div>
            )}
        </>
    )
}

export default ProfileDetailsContent