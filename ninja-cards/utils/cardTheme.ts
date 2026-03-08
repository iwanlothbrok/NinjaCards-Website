// ─── Card Theme Types ─────────────────────────────────────────────────────────
// Stored as JSON string in User.selectedColor field in the DB
// Example: '{"base":"black","accent":"#f59e0b","textPrimary":"#ffffff","textSecondary":"rgba(255,255,255,0.45)"}'

export interface CardTheme {
    base: string          // preset name e.g. "black", "white", "midnight-blue"
    accent: string        // hex — used for: name highlight, Call button, avatar ring
    textPrimary: string   // hex — used for: first name parts, company badge
    textSecondary: string // hex/rgba — used for: position, subtitle
}

// What gets passed as `cardStyle` prop throughout the app
export interface ResolvedCardStyle {
    name: string          // same as CardTheme.base
    bgClass: string       // Tailwind bg class
    cssVar: string        // hex bg color for CSS variable --card-bg
    accent: string        // from CardTheme or preset default
    textPrimary: string   // from CardTheme or preset default
    textSecondary: string // from CardTheme or preset default
    // Legacy helpers (still used in some places)
    textClass: string
    borderClass: string
    highlightClass: string
    cardCoverBgClass: string
}

// ─── Base presets ─────────────────────────────────────────────────────────────
// These define the bg + safe defaults for accent/text if user hasn't customised
export const CARD_PRESETS: Record<string, {
    bgClass: string
    cssVar: string
    cardCoverBgClass: string
    textClass: string
    borderClass: string
    highlightClass: string
    defaultAccent: string
    defaultTextPrimary: string
    defaultTextSecondary: string
    isLight: boolean
}> = {
    'black': {
        bgClass: 'bg-black',
        cssVar: '#000000',
        cardCoverBgClass: 'from-black',
        textClass: 'text-gray-200',
        borderClass: 'border-amber-500',
        highlightClass: 'text-amber-400',
        defaultAccent: '#f59e0b',
        defaultTextPrimary: '#ffffff',
        defaultTextSecondary: 'rgba(255,255,255,0.45)',
        isLight: false,
    },
    'white': {
        bgClass: 'bg-white',
        cssVar: '#ffffff',
        cardCoverBgClass: 'from-white',
        textClass: 'text-gray-900',
        borderClass: 'border-blue-600',
        highlightClass: 'text-blue-600',
        defaultAccent: '#2563eb',
        defaultTextPrimary: '#111111',
        defaultTextSecondary: 'rgba(0,0,0,0.45)',
        isLight: true,
    },
    'midnight-blue': {
        bgClass: 'bg-slate-900',
        cssVar: '#0f172a',
        cardCoverBgClass: 'from-slate-900',
        textClass: 'text-slate-100',
        borderClass: 'border-cyan-400',
        highlightClass: 'text-cyan-400',
        defaultAccent: '#22d3ee',
        defaultTextPrimary: '#f1f5f9',
        defaultTextSecondary: 'rgba(241,245,249,0.45)',
        isLight: false,
    },
    'royal-purple': {
        bgClass: 'bg-purple-900',
        cssVar: '#581c87',
        cardCoverBgClass: 'from-purple-900',
        textClass: 'text-purple-50',
        borderClass: 'border-fuchsia-400',
        highlightClass: 'text-fuchsia-400',
        defaultAccent: '#e879f9',
        defaultTextPrimary: '#fdf4ff',
        defaultTextSecondary: 'rgba(253,244,255,0.45)',
        isLight: false,
    },
    'emerald-forest': {
        bgClass: 'bg-emerald-950',
        cssVar: '#022c22',
        cardCoverBgClass: 'from-emerald-950',
        textClass: 'text-emerald-50',
        borderClass: 'border-emerald-400',
        highlightClass: 'text-emerald-300',
        defaultAccent: '#6ee7b7',
        defaultTextPrimary: '#ecfdf5',
        defaultTextSecondary: 'rgba(236,253,245,0.45)',
        isLight: false,
    },
    'golden-sunset': {
        bgClass: 'bg-amber-900',
        cssVar: '#78350f',
        cardCoverBgClass: 'from-amber-900',
        textClass: 'text-amber-50',
        borderClass: 'border-amber-400',
        highlightClass: 'text-yellow-300',
        defaultAccent: '#fde047',
        defaultTextPrimary: '#fffbeb',
        defaultTextSecondary: 'rgba(255,251,235,0.45)',
        isLight: false,
    },
    'rose-gold': {
        bgClass: 'bg-rose-950',
        cssVar: '#4c0519',
        cardCoverBgClass: 'from-rose-950',
        textClass: 'text-rose-50',
        borderClass: 'border-rose-400',
        highlightClass: 'text-pink-300',
        defaultAccent: '#f9a8d4',
        defaultTextPrimary: '#fff1f2',
        defaultTextSecondary: 'rgba(255,241,242,0.45)',
        isLight: false,
    },
    'ocean-depth': {
        bgClass: 'bg-blue-950',
        cssVar: '#172554',
        cardCoverBgClass: 'from-blue-950',
        textClass: 'text-blue-50',
        borderClass: 'border-sky-400',
        highlightClass: 'text-sky-300',
        defaultAccent: '#7dd3fc',
        defaultTextPrimary: '#eff6ff',
        defaultTextSecondary: 'rgba(239,246,255,0.45)',
        isLight: false,
    },
    'charcoal-premium': {
        bgClass: 'bg-zinc-900',
        cssVar: '#18181b',
        cardCoverBgClass: 'from-zinc-900',
        textClass: 'text-zinc-100',
        borderClass: 'border-violet-400',
        highlightClass: 'text-violet-300',
        defaultAccent: '#c4b5fd',
        defaultTextPrimary: '#f4f4f5',
        defaultTextSecondary: 'rgba(244,244,245,0.45)',
        isLight: false,
    },
    'burgundy-luxury': {
        bgClass: 'bg-red-950',
        cssVar: '#450a0a',
        cardCoverBgClass: 'from-red-950',
        textClass: 'text-red-50',
        borderClass: 'border-red-400',
        highlightClass: 'text-orange-300',
        defaultAccent: '#fdba74',
        defaultTextPrimary: '#fff1f2',
        defaultTextSecondary: 'rgba(255,241,242,0.45)',
        isLight: false,
    },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Parse selectedColor from DB (JSON string OR legacy plain name) */
export function parseCardTheme(raw: string | null | undefined): CardTheme {
    if (!raw) return { base: 'black', accent: '#f59e0b', textPrimary: '#ffffff', textSecondary: 'rgba(255,255,255,0.45)' }
    try {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === 'object' && parsed.base) return parsed as CardTheme
    } catch {
        // legacy — plain name like "black" or "midnight-blue"
    }
    // Legacy string — resolve defaults from preset
    const preset = CARD_PRESETS[raw]
    if (!preset) return { base: 'black', accent: '#f59e0b', textPrimary: '#ffffff', textSecondary: 'rgba(255,255,255,0.45)' }
    return {
        base: raw,
        accent: preset.defaultAccent,
        textPrimary: preset.defaultTextPrimary,
        textSecondary: preset.defaultTextSecondary,
    }
}

/** Serialize CardTheme → JSON string for DB */
export function serializeCardTheme(theme: CardTheme): string {
    return JSON.stringify(theme)
}

/** Resolve full ResolvedCardStyle from a CardTheme */
export function resolveCardStyle(theme: CardTheme): ResolvedCardStyle {
    const preset = CARD_PRESETS[theme.base] ?? CARD_PRESETS['black']
    return {
        name: theme.base,
        bgClass: preset.bgClass,
        cssVar: preset.cssVar,
        cardCoverBgClass: preset.cardCoverBgClass,
        textClass: preset.textClass,
        borderClass: preset.borderClass,
        highlightClass: preset.highlightClass,
        accent: theme.accent,
        textPrimary: theme.textPrimary,
        textSecondary: theme.textSecondary,
    }
}

/** Quick helper — is this a light-bg theme? */
export function isLightTheme(style: ResolvedCardStyle): boolean {
    return CARD_PRESETS[style.name]?.isLight ?? false
}

/** All preset names as array — for BackgroundSelector */
export const PRESET_NAMES = Object.keys(CARD_PRESETS)