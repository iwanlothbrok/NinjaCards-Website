"use client";

import React from "react";
import CoverImage from "./CoverImage";
import { FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { ResolvedCardStyle } from "@/utils/cardTheme";

const ProfileHeader: React.FC<{
    user: any
    cardStyle: ResolvedCardStyle
    coverPreview: string | null
    handleCoverChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    saveCover: () => void
    cancelCover: () => void
}> = ({ user, cardStyle }) => {

    return (
        <div id="profile-content" className={`relative ${cardStyle.bgClass}`}>

            {/* ── Cover ── */}
            <div className="relative overflow-hidden" style={{ height: 230 }}>
                <CoverImage
                    coverPreview={null}
                    userCoverImage={user?.coverImage || ""}
                    height="230px"
                />
                <div
                    className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
                    style={{
                        background: `linear-gradient(to bottom, transparent 0%, ${cardStyle.cssVar} 100%)`,
                    }}
                />
            </div>

            {/* ── Avatar ── */}
            <div className="relative flex justify-center" style={{ marginTop: -56 }}>
                <motion.div
                    initial={{ scale: 0.72, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10"
                >
                    {/* Accent ring — uses theme accent color */}
                    <div
                        className="absolute -inset-[3px] rounded-full pointer-events-none"
                        style={{
                            background: `conic-gradient(from 0deg, ${cardStyle.accent} 0%, ${cardStyle.accent}cc 30%, ${cardStyle.accent} 60%, ${cardStyle.accent}99 85%, ${cardStyle.accent} 100%)`,
                        }}
                    />
                    {/* Gap ring */}
                    <div
                        className={`absolute -inset-[1.5px] rounded-full ${cardStyle.bgClass}`}
                        style={{ zIndex: 1 }}
                    />
                    {/* Photo */}
                    <div
                        className="relative rounded-full overflow-hidden"
                        style={{ width: 136, height: 136, zIndex: 2, background: '#1a1a1a' }}
                    >
                        {user?.image ? (
                            <img
                                className="w-full h-full object-cover"
                                src={`data:image/jpeg;base64,${user.image}`}
                                alt={user?.name ?? "Profile"}
                            />
                        ) : (
                            <FaUserCircle className="w-full h-full text-gray-600" />
                        )}
                    </div>
                </motion.div>
            </div>

            {/* ── Name / Company / Position ── */}
            <div className="flex flex-col items-center text-center px-6 pt-5 pb-8 gap-3">

                {/* Name — uses textPrimary + accent for last word */}
                <motion.h1
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.52 }}
                    className="font-black leading-[1.05] tracking-[-0.02em]"
                    style={{ fontSize: 'clamp(30px, 8.5vw, 46px)' }}
                >
                    {user?.name
                        ? user.name.split(/\s+/).map((part: string, i: number, arr: string[]) => (
                            <span
                                key={i}
                                className="block"
                                style={{
                                    color: i === arr.length - 1
                                        ? cardStyle.accent
                                        : cardStyle.textPrimary,
                                }}
                            >
                                {part}
                            </span>
                        ))
                        : '\u00A0'}
                </motion.h1>

                {/* Company */}
                {user?.company && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.82 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.35, duration: 0.42 }}
                    >
                        <span
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase"
                            style={{
                                color: cardStyle.textPrimary,
                                border: `1px solid ${cardStyle.textPrimary}18`,
                                background: `${cardStyle.textPrimary}08`,
                            }}
                        >
                            {user.company}
                        </span>
                    </motion.div>
                )}

                {/* Position */}
                {user?.position && (
                    <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.43, duration: 0.42 }}
                        className="italic font-light leading-snug max-w-[28ch]"
                        style={{
                            fontSize: 'clamp(15px, 4vw, 20px)',
                            color: cardStyle.textSecondary,
                        }}
                    >
                        {user.position}
                    </motion.p>
                )}

            </div>
        </div>
    )
}

export default ProfileHeader