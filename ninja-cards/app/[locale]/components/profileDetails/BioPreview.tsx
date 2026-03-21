"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ResolvedCardStyle } from "../../../../utils/cardTheme";
import { User } from "@/types/user";

const COLLAPSED_LINES = 3;

interface BioPreviewProps {
    user: User;
    cardStyle: ResolvedCardStyle;
}

const BioPreview: React.FC<BioPreviewProps> = ({ user, cardStyle }) => {
    const [expanded, setExpanded] = useState(false);

    const bio = user.bio?.trim();
    if (!bio) return null;

    const accentHex = cardStyle.accent;
    const textPrimary = cardStyle.textPrimary;
    const isDark = cardStyle.name.includes('dark') ||
        cardStyle.bgClass.includes('black') ||
        cardStyle.bgClass.includes('gray-9') ||
        cardStyle.bgClass.includes('zinc-9');

    const headerBg = isDark ? `rgba(255,255,255,0.04)` : `rgba(0,0,0,0.03)`;
    const borderColor = `${accentHex}22`;

    // Roughly estimate if text is long enough to need a "read more"
    const needsToggle = bio.length > 160 || bio.split('\n').length > COLLAPSED_LINES;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mx-4 rounded-2xl overflow-hidden"
            style={{
                border: `1px solid ${borderColor}`,
                boxShadow: `0 4px 20px ${accentHex}10, 0 1px 4px rgba(0,0,0,0.08)`,
            }}
        >
            {/* Header */}
            <div
                className="flex items-center gap-3 px-4 py-2.5"
                style={{ background: headerBg, borderBottom: `1px solid ${borderColor}` }}
            >
                {/* Icon */}
                <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                        background: `linear-gradient(135deg, ${accentHex}, ${accentHex}bb)`,
                        boxShadow: `0 3px 8px ${accentHex}40`,
                    }}
                >
                    <svg className="w-3.5 h-3.5" fill="white" viewBox="0 0 24 24">
                        <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z" />
                    </svg>
                </div>

                <p
                    className="text-[10px] font-black uppercase tracking-widest leading-none"
                    style={{ color: accentHex }}
                >
                    За мен
                </p>
            </div>

            {/* Bio text */}
            <div className="px-4 py-3.5" style={{ background: headerBg }}>
                <AnimatePresence initial={false}>
                    <motion.p
                        key={expanded ? 'expanded' : 'collapsed'}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.25 }}
                        className="text-[13px] leading-relaxed whitespace-pre-line break-words"
                        style={{
                            color: `${textPrimary}cc`,
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: expanded ? 'unset' : COLLAPSED_LINES,
                            overflow: 'hidden',
                        } as React.CSSProperties}
                    >
                        {bio}
                    </motion.p>
                </AnimatePresence>

                {/* Read more / less */}
                {needsToggle && (
                    <button
                        onClick={() => setExpanded(e => !e)}
                        className="mt-2 text-[11px] font-bold transition-opacity hover:opacity-70"
                        style={{ color: accentHex }}
                    >
                        {expanded ? '↑ Скрий' : 'Прочети повече →'}
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default BioPreview;