'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const ctas = [
    { key: 'booking', accent: '#f59e0b' },
    { key: 'inquiry', accent: '#60a5fa' },
    { key: 'resource', accent: '#4ade80' },
] as const;

const trackingEvents = [
    { key: 'profileView', tone: 'neutral' },
    { key: 'bookingClick', tone: 'amber' },
    { key: 'leadFormClick', tone: 'blue' },
    { key: 'resourceUnlock', tone: 'green' },
    { key: 'leadCreated', tone: 'amber' },
    { key: 'meetingBooked', tone: 'green' },
] as const;

const leadSources = [
    { key: 'nfcDirect' },
    { key: 'qrBackside' },
    { key: 'linkedinProfile' },
    { key: 'expoEvent' },
    { key: 'referralPartner' },
] as const;

const followUpSteps = [
    { key: 'twoHours' },
    { key: 'twentyFourHours' },
    { key: 'sevenDays' },
] as const;

const profileBlockKeys = [
    'hero',
    'trustBar',
    'solutions',
    'booking',
    'magnet',
    'proof',
] as const;

function toneClass(tone: string) {
    switch (tone) {
        case 'amber':
            return 'border-amber-500/20 bg-amber-500/10 text-amber-300';
        case 'blue':
            return 'border-sky-500/20 bg-sky-500/10 text-sky-300';
        case 'green':
            return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300';
        default:
            return 'border-white/10 bg-white/5 text-gray-300';
    }
}

export default function ConversionFoundationPage() {
    const t = useTranslations('conversionFoundation');

    return (
        <div
            className="min-h-screen px-4 pb-24 pt-24 sm:px-6 lg:px-8"
            style={{
                background:
                    'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(245,158,11,0.08) 0%, transparent 55%), #080A0F',
            }}
        >
            <div
                className="pointer-events-none fixed inset-0 -z-10"
                style={{
                    opacity: 0.018,
                    backgroundImage:
                        'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                    backgroundSize: '52px 52px',
                }}
            />

            <div className="mx-auto max-w-7xl space-y-10">
                <motion.section
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="overflow-hidden rounded-[32px] border border-amber-500/15 bg-white/[0.03]"
                >
                    <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.25fr_0.95fr] lg:px-10 lg:py-10">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2">
                                <div className="h-2 w-2 rounded-full bg-amber-400" />
                                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-300">
                                    {t('hero.badge')}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl">
                                    {t('hero.title')}
                                </h1>
                                <p className="max-w-2xl text-sm leading-7 text-gray-300 sm:text-[15px]">
                                    {t('hero.descriptionPrefix')}{' '}
                                    <span className="font-semibold text-amber-300">
                                        {t('hero.descriptionHighlightOne')}
                                    </span>
                                    ,{' '}
                                    <span className="font-semibold text-amber-300">
                                        {t('hero.descriptionHighlightTwo')}
                                    </span>{' '}
                                    {t('hero.descriptionSuffix')}
                                </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3">
                                {['profile', 'source', 'followUp'].map((key) => (
                                    <div
                                        key={key}
                                        className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4"
                                    >
                                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500">
                                            {t(`hero.stats.${key}.label`)}
                                        </p>
                                        <p className="mt-2 text-sm font-semibold text-white">
                                            {t(`hero.stats.${key}.value`)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-white/10 bg-[#0d1016] p-5 shadow-2xl shadow-black/40">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                                            {t('layout.eyebrow')}
                                        </p>
                                        <p className="mt-1 text-lg font-bold text-white">
                                            {t('layout.title')}
                                        </p>
                                    </div>
                                    <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                                        {t('layout.pill')}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {profileBlockKeys.map((blockKey, index) => (
                                        <div
                                            key={blockKey}
                                            className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                                        >
                                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-xs font-black text-amber-300">
                                                {index + 1}
                                            </div>
                                            <p className="text-sm text-gray-200">{t(`layout.blocks.${blockKey}`)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, duration: 0.45 }}
                    className="space-y-4"
                >
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-300/80">
                            {t('ctaSection.eyebrow')}
                        </p>
                        <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
                            {t('ctaSection.title')}
                        </h2>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                        {ctas.map((cta, index) => (
                            <motion.div
                                key={cta.key}
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.12 + index * 0.06, duration: 0.4 }}
                                className="rounded-[28px] border p-6"
                                style={{
                                    borderColor: `${cta.accent}35`,
                                    background: `linear-gradient(135deg, ${cta.accent}12 0%, rgba(255,255,255,0.02) 100%)`,
                                }}
                            >
                                <div className="space-y-4">
                                    <div
                                        className="inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em]"
                                        style={{ background: `${cta.accent}1c`, color: cta.accent }}
                                    >
                                        {t('ctaSection.cardLabel', { number: index + 1 })}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white">
                                            {t(`ctas.${cta.key}.title`)}
                                        </h3>
                                        <p className="mt-2 text-sm leading-6 text-gray-300">
                                            {t(`ctas.${cta.key}.subtitle`)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-4xl font-black" style={{ color: cta.accent }}>
                                            {t(`ctas.${cta.key}.stat`)}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-400">
                                            {t(`ctas.${cta.key}.detail`)}
                                        </p>
                                    </div>
                                    <div
                                        className="rounded-2xl border px-4 py-3 text-sm"
                                        style={{
                                            borderColor: `${cta.accent}25`,
                                            background: 'rgba(8,10,15,0.45)',
                                        }}
                                    >
                                        <p className="font-semibold text-white">
                                            {t('ctaSection.trackingTitle')}
                                        </p>
                                        <p className="mt-1 text-gray-400">{t('ctaSection.trackingDetail')}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <motion.section
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18, duration: 0.45 }}
                        className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-300/80">
                                    {t('tracking.eyebrow')}
                                </p>
                                <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
                                    {t('tracking.title')}
                                </h2>
                            </div>
                            <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-right">
                                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sky-300">
                                    {t('tracking.northStarLabel')}
                                </p>
                                <p className="text-lg font-black text-white">{t('tracking.northStarValue')}</p>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {trackingEvents.map((event) => (
                                <div
                                    key={event.key}
                                    className={`rounded-2xl border px-4 py-4 ${toneClass(event.tone)}`}
                                >
                                    <p className="text-[10px] font-bold uppercase tracking-[0.14em]">
                                        {t(`tracking.events.${event.key}.label`)}
                                    </p>
                                    <p className="mt-3 text-2xl font-black text-white">
                                        {t(`tracking.events.${event.key}.value`)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 rounded-[24px] border border-white/10 bg-black/20 p-5">
                            <p className="text-sm font-semibold text-white">{t('tracking.frameworkTitle')}</p>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                {[
                                    'ctaCtr',
                                    'scrollDepth',
                                    'touchpoints',
                                    'magnetConversion',
                                    'replyTime',
                                    'meetingConversion',
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-gray-300"
                                    >
                                        {t(`tracking.framework.${item}`)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.24, duration: 0.45 }}
                        className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6"
                    >
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-300/80">
                                {t('sources.eyebrow')}
                            </p>
                            <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
                                {t('sources.title')}
                            </h2>
                        </div>

                        <div className="mt-6 space-y-3">
                            {leadSources.map((source) => (
                                <div
                                    key={source.key}
                                    className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-bold text-white">
                                                {t(`sources.items.${source.key}.source`)}
                                            </p>
                                            <p className="mt-1 text-sm text-gray-400">
                                                {t(`sources.items.${source.key}.note`)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-black text-emerald-300">
                                                {t(`sources.items.${source.key}.rate`)}
                                            </p>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500">
                                                {t('sources.rateLabel')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-3">
                                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500">
                                                {t('sources.visitsLabel')}
                                            </p>
                                            <p className="mt-1 text-lg font-black text-white">
                                                {t(`sources.items.${source.key}.visits`)}
                                            </p>
                                        </div>
                                        <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-3">
                                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500">
                                                {t('sources.leadsLabel')}
                                            </p>
                                            <p className="mt-1 text-lg font-black text-white">
                                                {t(`sources.items.${source.key}.leads`)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                </div>

                <motion.section
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.45 }}
                    className="rounded-[30px] border border-amber-500/15 bg-gradient-to-br from-amber-500/[0.06] to-white/[0.02] p-6"
                >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-300/80">
                                {t('followUp.eyebrow')}
                            </p>
                            <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
                                {t('followUp.title')}
                            </h2>
                            <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-300">
                                {t('followUp.description')}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500">
                                {t('followUp.baseLabel')}
                            </p>
                            <p className="mt-2 text-sm text-white">{t('followUp.baseValue')}</p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 lg:grid-cols-3">
                        {followUpSteps.map((step, index) => (
                            <div
                                key={step.key}
                                className="rounded-[24px] border border-white/10 bg-[#0c1016] p-5"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-300">
                                        {t('followUp.stepLabel', { number: index + 1 })}
                                    </div>
                                    <p className="text-sm font-black text-white">
                                        {t(`followUp.steps.${step.key}.delay`)}
                                    </p>
                                </div>

                                <div className="mt-4 space-y-3">
                                    <div>
                                        <h3 className="text-lg font-black text-white">
                                            {t(`followUp.steps.${step.key}.title`)}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-400">
                                            {t(`followUp.steps.${step.key}.purpose`)}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500">
                                            {t('followUp.messageLogicLabel')}
                                        </p>
                                        <p className="mt-2 text-sm leading-6 text-gray-300">
                                            {t(`followUp.steps.${step.key}.message`)}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300">
                                        {t(`followUp.steps.${step.key}.status`)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 rounded-[24px] border border-white/10 bg-black/20 p-5">
                        <p className="text-sm font-semibold text-white">{t('followUp.backendTitle')}</p>
                        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                            {['createdAt', 'skipRules', 'promptPerStage', 'sourceTone'].map((item) => (
                                <div
                                    key={item}
                                    className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-gray-300"
                                >
                                    {t(`followUp.backend.${item}`)}
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>
            </div>
        </div>
    );
}
