'use client';

import React, { useEffect, useState, Fragment } from 'react';
import { notFound } from 'next/navigation';
import { BASE_API_URL } from '@/utils/constants';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import { ResolvedCardStyle, isLightTheme } from '@/utils/cardTheme';

type LeadFormData = {
    name: string;
    email?: string;
    phone?: string;
    message?: string;
    gdpr: boolean;
};

type LeadFormProps = {
    userId: string;
    name: string;
    isVisible: boolean;
    onClose: () => void;
    cardStyle?: ResolvedCardStyle;
};

const LeadForm: React.FC<LeadFormProps> = ({ userId, name, isVisible, onClose, cardStyle }) => {
    const t = useTranslations('LeadForm');
    const [form, setForm] = useState<LeadFormData>({ name: '', gdpr: false });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string>('');

    const accent = cardStyle?.accent ?? '#f59e0b';

    useEffect(() => {
        if (!userId) notFound();
    }, [userId]);

    // Reset on open
    useEffect(() => {
        if (isVisible) {
            setForm({ name: '', gdpr: false });
            setError('');
            setSubmitted(false);
        }
    }, [isVisible]);

    const handleChange = (field: keyof LeadFormData, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setError('');
        if (!form.name) return setError(t('errors.name'));
        if (!form.phone) return setError(t('errors.phone'));
        if (!form.gdpr) return setError(t('errors.gdpr'));

        setSubmitting(true);
        try {
            const res = await fetch(`${BASE_API_URL}/api/subscribed`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, userId, isAccepted: true }),
            });
            if (!res.ok) throw new Error(t('errors.submit'));
            setSubmitted(true);
            setTimeout(() => onClose(), 2000);
        } catch (err) {
            console.error(err);
            setError(t('errors.failed'));
        } finally {
            setSubmitting(false);
        }
    };

    // ── Shared input style ────────────────────────────────────────────────────
    const inputCls = [
        'w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200',
        'bg-white/[0.05] border border-white/[0.08]',
        'text-gray-100 placeholder:text-gray-600',
        'focus:border-[var(--accent)] focus:bg-white/[0.08]',
    ].join(' ');

    return (
        <Transition appear show={isVisible} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
                <div className="flex min-h-screen items-end sm:items-center justify-center p-4">

                    {/* Backdrop */}
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                        leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
                    </TransitionChild>

                    {/* Panel */}
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300" enterFrom="opacity-0 translate-y-6 scale-95" enterTo="opacity-100 translate-y-0 scale-100"
                        leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 scale-100" leaveTo="opacity-0 translate-y-4 scale-95"
                    >
                        <DialogPanel
                            className="relative w-full max-w-md rounded-3xl overflow-hidden border border-white/[0.08]"
                            style={{
                                background: '#0e0e0e',
                                boxShadow: `0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05), 0 -1px 0 0 ${accent}40`,
                                '--accent': accent,
                            } as React.CSSProperties}
                        >
                            {/* Accent top line */}
                            <div
                                className="absolute top-0 inset-x-0 h-px pointer-events-none"
                                style={{ background: `linear-gradient(90deg, transparent, ${accent}80, transparent)` }}
                            />

                            {/* ── Success state ── */}
                            {submitted ? (
                                <div className="flex flex-col items-center justify-center gap-4 px-8 py-14 text-center">
                                    <div
                                        className="w-14 h-14 rounded-full flex items-center justify-center"
                                        style={{ background: `${accent}18`, border: `1px solid ${accent}40` }}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth={2.5}
                                            strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                    <p className="text-white font-bold text-lg">{t('successTitle') ?? 'Благодаря!'}</p>
                                    <p className="text-gray-500 text-sm">{t('successMessage') ?? 'Контактът ви е записан.'}</p>
                                </div>
                            ) : (
                                <div className="px-7 py-8 space-y-5">

                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <DialogTitle className="text-white font-bold text-lg leading-tight">
                                                {t('title', { name })}
                                            </DialogTitle>
                                            <p className="text-gray-600 text-xs mt-1">{t('subtitle') ?? 'Оставете вашите данни'}</p>
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="flex-shrink-0 w-8 h-8 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-gray-500 hover:text-gray-300 transition-all"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Fields */}
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            className={inputCls}
                                            placeholder={t('placeholders.name')}
                                            value={form.name}
                                            onChange={e => handleChange('name', e.target.value)}
                                        />
                                        <input
                                            type="tel"
                                            className={inputCls}
                                            placeholder={t('placeholders.phone')}
                                            value={form.phone || ''}
                                            onChange={e => handleChange('phone', e.target.value)}
                                        />
                                        <input
                                            type="email"
                                            className={inputCls}
                                            placeholder={t('placeholders.email')}
                                            value={form.email || ''}
                                            onChange={e => handleChange('email', e.target.value)}
                                        />
                                        <textarea
                                            rows={3}
                                            className={`${inputCls} resize-none`}
                                            placeholder={t('placeholders.message')}
                                            value={form.message || ''}
                                            onChange={e => handleChange('message', e.target.value)}
                                        />
                                    </div>

                                    {/* GDPR */}
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div className="relative flex-shrink-0 mt-0.5">
                                            <input
                                                type="checkbox"
                                                id="gdpr"
                                                className="sr-only"
                                                checked={form.gdpr}
                                                onChange={e => setForm(prev => ({ ...prev, gdpr: e.target.checked }))}
                                            />
                                            <div
                                                className="w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200"
                                                style={{
                                                    background: form.gdpr ? accent : 'transparent',
                                                    borderColor: form.gdpr ? accent : 'rgba(255,255,255,0.15)',
                                                    boxShadow: form.gdpr ? `0 0 10px ${accent}50` : 'none',
                                                }}
                                            >
                                                {form.gdpr && (
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth={3}
                                                        strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors leading-relaxed">
                                            {t('gdpr')}
                                        </span>
                                    </label>

                                    {/* Error */}
                                    {error && (
                                        <p className="text-red-400 text-xs flex items-center gap-1.5">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                                                strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 flex-shrink-0">
                                                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                            </svg>
                                            {error}
                                        </p>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-1">
                                        <button
                                            onClick={onClose}
                                            type="button"
                                            className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-300 border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06] transition-all"
                                        >
                                            {t('skip')}
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={submitting}
                                            type="button"
                                            className="flex-1 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                                            style={{
                                                background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                                                color: '#000',
                                                boxShadow: `0 6px 20px ${accent}35`,
                                            }}
                                        >
                                            {submitting ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={3} />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                                    </svg>
                                                    {t('submitting')}
                                                </span>
                                            ) : t('submit')}
                                        </button>
                                    </div>

                                </div>
                            )}
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
};

export default LeadForm;