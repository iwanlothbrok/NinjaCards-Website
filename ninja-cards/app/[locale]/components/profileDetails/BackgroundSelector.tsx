"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { CARD_PRESETS, PRESET_NAMES, CardTheme, ResolvedCardStyle, isLightTheme } from "@/utils/cardTheme";

interface BackgroundSelectorProps {
    cardStyle: ResolvedCardStyle
    onThemeChange: (theme: CardTheme) => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function hexToRgb(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `${r},${g},${b}`
}
function extractOpacity(rgba: string): number {
    const m = rgba.match(/rgba?\([^,]+,[^,]+,[^,]+,?\s*([\d.]+)?\)/)
    return m?.[1] ? parseFloat(m[1]) : 0.45
}
function extractHexFromRgba(rgba: string): string {
    const m = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    if (!m) return '#ffffff'
    return '#' + [m[1], m[2], m[3]].map(n => parseInt(n).toString(16).padStart(2, '0')).join('')
}

// ─── Single color row ─────────────────────────────────────────────────────────
function ColorRow({ label, value, onChange, isLight }: {
    label: string; value: string; onChange: (hex: string) => void; isLight: boolean
}) {
    return (
        <div className={`flex items-center justify-between py-3 border-b last:border-0 ${isLight ? 'border-black/[0.07]' : 'border-white/[0.06]'}`}>
            <span className={`text-[11px] font-semibold ${isLight ? 'text-gray-500' : 'text-gray-500'}`}>{label}</span>
            <label className="flex items-center gap-2.5 cursor-pointer group">
                <div
                    className="w-7 h-7 rounded-lg border shadow-sm transition-transform group-hover:scale-110"
                    style={{
                        background: value,
                        borderColor: isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)',
                    }}
                />
                <span className={`text-[10px] font-mono w-16 ${isLight ? 'text-gray-500' : 'text-gray-500'}`}>
                    {value.startsWith('#') ? value.toUpperCase() : value.slice(0, 18) + '…'}
                </span>
                <input type="color"
                    value={value.startsWith('#') ? value : extractHexFromRgba(value)}
                    onChange={e => onChange(e.target.value)}
                    className="sr-only"
                />
            </label>
        </div>
    )
}

// ─── Opacity slider row ───────────────────────────────────────────────────────
function OpacityRow({ hex, opacity, onChange, isLight }: {
    hex: string; opacity: number; onChange: (rgba: string) => void; isLight: boolean
}) {
    return (
        <div className={`flex items-center justify-between py-3 border-b last:border-0 ${isLight ? 'border-black/[0.07]' : 'border-white/[0.06]'}`}>
            <span className={`text-[11px] font-semibold ${isLight ? 'text-gray-500' : 'text-gray-500'}`}>
                Secondary opacity
            </span>
            <div className="flex items-center gap-3">
                <input type="range" min={10} max={90} step={5}
                    value={Math.round(opacity * 100)}
                    onChange={e => onChange(`rgba(${hexToRgb(hex)},${parseInt(e.target.value) / 100})`)}
                    className="w-20 h-1 accent-amber-500 cursor-pointer"
                />
                <span className={`text-[10px] font-mono w-7 text-right ${isLight ? 'text-gray-500' : 'text-gray-500'}`}>
                    {Math.round(opacity * 100)}%
                </span>
            </div>
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────
const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ cardStyle, onThemeChange }) => {
    const t = useTranslations("backgroundSelector")
    const [showCustomise, setShowCustomise] = useState(false)
    const light = isLightTheme(cardStyle)

    const dividerCls = light ? 'border-black/[0.06]' : 'border-white/[0.05]'
    const sectionLbl = light ? 'text-gray-400' : 'text-gray-700'
    const toggleCls = light
        ? 'border border-black/[0.1] bg-black/[0.03] hover:bg-black/[0.07] text-gray-500 hover:text-gray-800'
        : 'border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-gray-600 hover:text-gray-300'
    const panelBg = light ? 'bg-black/[0.025] border-black/[0.07]' : 'bg-white/[0.03] border-white/[0.07]'

    const patchTheme = (patch: Partial<CardTheme>) => {
        onThemeChange({
            base: cardStyle.name,
            accent: cardStyle.accent,
            textPrimary: cardStyle.textPrimary,
            textSecondary: cardStyle.textSecondary,
            ...patch,
        })
    }

    const handleBaseChange = (base: string) => {
        const preset = CARD_PRESETS[base]
        if (!preset) return
        onThemeChange({
            base,
            accent: preset.defaultAccent,
            textPrimary: preset.defaultTextPrimary,
            textSecondary: preset.defaultTextSecondary,
        })
    }

    const secondaryHex = cardStyle.textSecondary.startsWith('rgba')
        ? extractHexFromRgba(cardStyle.textSecondary) : cardStyle.textSecondary
    const secondaryOpacity = cardStyle.textSecondary.startsWith('rgba')
        ? extractOpacity(cardStyle.textSecondary) : 0.45

    return (
        <div className={`px-5 py-6 border-t ${dividerCls}`}>

            {/* Label */}
            <p className={`text-center text-[9px] font-black uppercase tracking-[0.22em] ${sectionLbl} mb-5`}>
                {t("title")}
            </p>

            {/* ── Base presets ── */}
            <div className="flex justify-center flex-wrap gap-3 mb-5">
                {PRESET_NAMES.map((name, i) => {
                    const preset = CARD_PRESETS[name]
                    const active = cardStyle.name === name

                    return (
                        <motion.button
                            key={name}
                            onClick={() => handleBaseChange(name)}
                            aria-label={name}
                            title={name.replace(/-/g, ' ')}
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.03, duration: 0.28 }}
                            whileTap={{ scale: 0.88 }}
                            className="relative w-10 h-10 rounded-xl transition-all duration-200 hover:scale-110 focus:outline-none"
                            style={{
                                background: preset.cssVar === '#ffffff' ? '#fff'
                                    : `radial-gradient(circle at 35% 35%, ${preset.cssVar}dd, ${preset.cssVar})`,
                                boxShadow: active
                                    ? `0 0 0 2.5px ${cardStyle.accent}, 0 0 14px ${cardStyle.accent}50`
                                    : `0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)`,
                                border: active ? 'none'
                                    : `1px solid ${light ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.08)'}`,
                            }}
                        >
                            {active && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    className="absolute inset-0 flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none"
                                        stroke={preset.cssVar === '#ffffff' ? '#000' : '#fff'}
                                        strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"
                                        className="w-4 h-4 drop-shadow">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </motion.div>
                            )}
                        </motion.button>
                    )
                })}
            </div>

            {/* ── Customise toggle ── */}
            <div className="flex justify-center">
                <button
                    onClick={() => setShowCustomise(s => !s)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-semibold transition-all duration-200 ${toggleCls}`}
                >
                    <svg
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${showCustomise ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                    {showCustomise
                        ? (t("hideCustomise") ?? "Hide colours")
                        : (t("customise") ?? "Customise colours")}
                </button>
            </div>

            {/* ── Colour panel ── */}
            <AnimatePresence>
                {showCustomise && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <div className={`mt-4 rounded-2xl border px-4 py-1 ${panelBg}`}>
                            <ColorRow
                                label={t("accent") ?? "Accent colour"}
                                value={cardStyle.accent}
                                onChange={hex => patchTheme({ accent: hex })}
                                isLight={light}
                            />
                            <ColorRow
                                label={t("textPrimary") ?? "Name colour"}
                                value={cardStyle.textPrimary}
                                onChange={hex => patchTheme({ textPrimary: hex })}
                                isLight={light}
                            />
                            <ColorRow
                                label={t("textSecondary") ?? "Position colour"}
                                value={secondaryHex}
                                onChange={hex => patchTheme({
                                    textSecondary: `rgba(${hexToRgb(hex)},${secondaryOpacity})`
                                })}
                                isLight={light}
                            />
                            <OpacityRow
                                hex={secondaryHex}
                                opacity={secondaryOpacity}
                                onChange={rgba => patchTheme({ textSecondary: rgba })}
                                isLight={light}
                            />
                        </div>

                        <div className="flex justify-center mt-3">
                            <button
                                onClick={() => handleBaseChange(cardStyle.name)}
                                className={`text-[10px] font-semibold transition-colors ${light ? 'text-gray-400 hover:text-gray-700' : 'text-gray-700 hover:text-gray-400'}`}
                            >
                                ↺ {t("resetDefaults") ?? "Reset to defaults"}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}

export default BackgroundSelector