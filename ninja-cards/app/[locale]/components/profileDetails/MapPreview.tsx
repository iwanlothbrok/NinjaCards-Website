"use client";

import React from "react";
import { motion } from "framer-motion";
import { ResolvedCardStyle } from "../../../../utils/cardTheme";
import { User } from "@/types/user";

// ─── Build a full address string from User fields ─────────────────────────────
export function buildAddressString(user: User): string | null {
    const parts = [
        (user as any).street1,
        (user as any).street2,
        (user as any).city,
        (user as any).state,
        (user as any).zipCode,
        (user as any).country,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : null;
}

// ─── Component ────────────────────────────────────────────────────────────────
interface MapPreviewProps {
    user: User;
    cardStyle: ResolvedCardStyle;
}

const MapPreview: React.FC<MapPreviewProps> = ({ user, cardStyle }) => {
    const address = buildAddressString(user);
    if (!address) return null;

    const embedSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
    const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}`;

    // Derive colours from cardStyle so it blends with the card theme
    const accentHex = cardStyle.accent;                          // e.g. "#f59e0b"
    const textPrimary = cardStyle.textPrimary;                     // e.g. "#ffffff"
    const isDark = cardStyle.name.includes('dark') ||
        cardStyle.bgClass.includes('black') ||
        cardStyle.bgClass.includes('gray-9') ||
        cardStyle.bgClass.includes('zinc-9');

    const headerBg = isDark
        ? `rgba(255,255,255,0.04)`
        : `rgba(0,0,0,0.03)`;
    const borderColor = `${accentHex}22`;

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
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                </div>

                {/* Address text */}
                <div className="flex-1 min-w-0">
                    <p
                        className="text-[10px] font-black uppercase tracking-widest leading-none truncate"
                        style={{ color: accentHex }}
                    >
                        Местоположение
                    </p>
                    <p
                        className="text-[11px] font-medium mt-0.5 truncate"
                        style={{ color: `${textPrimary}99` }}
                    >
                        {address}
                    </p>
                </div>

                {/* Open link */}
                <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] font-bold transition-opacity hover:opacity-70 flex-shrink-0"
                    style={{
                        color: accentHex,
                        background: `${accentHex}15`,
                        border: `1px solid ${accentHex}30`,
                        borderRadius: 7,
                        padding: '4px 10px',
                    }}
                >
                    Отвори
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </div>

            {/* Map iframe */}
            <iframe
                src={embedSrc}
                loading="lazy"
                width="100%"
                height="200"
                style={{ border: 0, display: 'block' }}
                referrerPolicy="no-referrer-when-downgrade"
                title="Местоположение"
                allowFullScreen
            />
        </motion.div>
    );
};

export default MapPreview;