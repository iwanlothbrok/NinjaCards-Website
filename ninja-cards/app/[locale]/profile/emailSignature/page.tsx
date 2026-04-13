'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import type { CSSProperties } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

type SignatureTheme = 'modern' | 'classic' | 'minimal' | 'bold' | 'professional';

interface SignatureOptions {
    theme: SignatureTheme;
    showQR: boolean;
    showImage: boolean;
    accentColor: string;
    name: string;
    position: string;
    company: string;
    email: string;
    phone1: string;
    address: string;
    website: string;
}

const THEMES: SignatureTheme[] = ['modern', 'classic', 'minimal', 'bold', 'professional'];
const COLORS = ['#f97316', '#f59e0b', '#ea580c', '#dc2626', '#8b5cf6', '#06b6d4', '#22c55e', '#e11d48'];
const CLIENTS = ['gmail', 'outlook', 'appleMail'] as const;

const esc = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const normalizeUrl = (value: string) => !value.trim() ? '' : /^(https?:\/\/|mailto:|tel:)/i.test(value) ? value.trim() : value.includes('@') ? `mailto:${value.trim()}` : `https://${value.trim()}`;

const Icon = {
    Sparkle: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L14.2 8.8L20 11L14.2 13.2L12 19L9.8 13.2L4 11L9.8 8.8L12 3Z" /></svg>,
    Copy: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>,
    Check: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><polyline points="20 6 9 17 4 12" /></svg>,
    Download: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
    Eye: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
    Chevron: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>,
    Mail: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2,4 12,13 22,4" /></svg>,
    Code: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
    Share: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>,
    SelectAll: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9h6v6H9z" /></svg>,
};

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
    return (
        <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</span>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-amber-400/60 focus:bg-white/[0.06]"
            />
        </label>
    );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
    return (
        <button type="button" onClick={() => onChange(!checked)} className="flex w-full items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3.5 text-left transition hover:bg-white/[0.05] active:scale-[0.98]">
            <span className="text-sm text-zinc-200">{label}</span>
            <span className={`relative h-6 w-11 rounded-full transition ${checked ? 'bg-amber-500' : 'bg-zinc-700'}`}>
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
            </span>
        </button>
    );
}

function HowToItem({ title, steps }: { title: string; steps: string[] }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="rounded-2xl border border-white/8 bg-white/[0.03]">
            <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between px-4 py-3.5 text-left">
                <span className="text-sm font-semibold text-white">{title}</span>
                <span className={`text-zinc-500 transition ${open ? 'rotate-180' : ''}`}><Icon.Chevron /></span>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.ol initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-4 pb-4 text-sm text-zinc-400">
                        {steps.map((step) => <li key={step} className="mb-2 last:mb-0">{step}</li>)}
                    </motion.ol>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function EmailSignaturePage() {
    const { user: authUser, loading } = useAuth();
    const t = useTranslations('EmailSignature');
    const locale = useLocale();
    const [copied, setCopied] = useState(false);
    const [codeCopied, setCodeCopied] = useState(false);
    const [origin, setOrigin] = useState('');
    const [isPhone, setIsPhone] = useState(false);
    const [showHtmlPanel, setShowHtmlPanel] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const htmlTextareaRef = useRef<HTMLTextAreaElement>(null);
    const [options, setOptions] = useState<SignatureOptions>({
        theme: 'modern',
        showQR: true,
        showImage: true,
        accentColor: '#f97316',
        name: '',
        position: '',
        company: '',
        email: '',
        phone1: '',
        address: '',
        website: '',
    });

    useEffect(() => {
        const syncViewport = () => {
            setOrigin(window.location.origin);
            setIsPhone(window.innerWidth < 640);
        };
        syncViewport();
        window.addEventListener('resize', syncViewport);
        return () => window.removeEventListener('resize', syncViewport);
    }, []);

    useEffect(() => {
        if (!authUser) return;
        setOptions((prev) => ({
            ...prev,
            name: authUser.name || '',
            position: authUser.position || '',
            company: authUser.company || '',
            email: authUser.email || '',
            phone1: authUser.phone1 || '',
            address: [authUser.street1, authUser.city, authUser.country].filter(Boolean).join(', '),
            website: authUser.website || '',
        }));
    }, [authUser]);

    const setField = <K extends keyof SignatureOptions>(field: K, value: SignatureOptions[K]) =>
        setOptions((prev) => ({ ...prev, [field]: value }));

    const profileUrl = authUser?.id && origin ? `${origin}/${locale}/profileDetails/${authUser.id}` : '';
    const previewImage = authUser?.id && origin && options.showImage ? `${origin}/api/profile/image/${authUser.id}` : '';
    const qrUrl = options.showQR && profileUrl ? `https://api.qrserver.com/v1/create-qr-code/?size=96x96&data=${encodeURIComponent(profileUrl)}` : '';

    const signatureHtml = useMemo(() => {
        const name = esc(options.name);
        const position = esc(options.position);
        const company = esc(options.company);
        const email = esc(options.email);
        const phone = esc(options.phone1);
        const address = esc(options.address);
        const websiteText = esc(options.website);
        const websiteHref = normalizeUrl(options.website);
        const accent = options.accentColor;
        const photo = previewImage && options.showImage
            ? `<td style="width:88px;padding-right:18px;vertical-align:top;"><img src="${previewImage}" alt="${name}" width="72" height="72" style="display:block;width:72px;height:72px;border-radius:18px;object-fit:cover;border:2px solid ${accent};" /></td>`
            : '';
        const qr = qrUrl
            ? `<td style="width:90px;padding-left:18px;vertical-align:middle;text-align:center;"><img src="${qrUrl}" alt="QR" width="74" height="74" style="display:block;width:74px;height:74px;border-radius:14px;border:1px solid #e5e7eb;" /><div style="margin-top:6px;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#94a3b8;font-weight:700;">${esc(t('preview.scanMe'))}</div></td>`
            : '';
        const details = `${email ? `<div style="margin-bottom:4px;"><a href="mailto:${email}" style="color:${accent};text-decoration:none;font-weight:600;">${email}</a></div>` : ''}${phone ? `<div style="margin-bottom:4px;color:#475569;">${phone}</div>` : ''}${address ? `<div style="margin-bottom:4px;color:#64748b;">${address}</div>` : ''}${websiteHref ? `<div><a href="${esc(websiteHref)}" style="color:${accent};text-decoration:none;font-weight:600;">${websiteText}</a></div>` : ''}`;
        const common = `<table cellpadding="0" cellspacing="0" role="presentation" style="max-width:640px;width:100%;font-family:Arial,'Segoe UI',sans-serif;border-collapse:collapse;">`;
        const tail = `</table>`;
        const map: Record<SignatureTheme, string> = {
            modern: `${common}<tr><td style="padding:24px;border:1px solid #e5e7eb;border-radius:24px;background:linear-gradient(135deg,#ffffff 0%,#fff7ed 100%);box-shadow:0 12px 40px rgba(15,23,42,0.08);"><table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;border-collapse:collapse;"><tr>${photo}<td style="vertical-align:middle;"><div style="font-size:24px;line-height:1.1;font-weight:800;color:#0f172a;">${name}</div><div style="margin-top:6px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${accent};font-weight:700;">${position}${company ? ` &bull; ${company}` : ''}</div><div style="margin-top:14px;font-size:13px;line-height:1.65;">${details}</div></td>${qr}</tr></table></td></tr>${tail}`,
            classic: `${common}<tr><td style="padding:0 0 0 18px;border-left:4px solid ${accent};background:#ffffff;"><table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;border-collapse:collapse;"><tr><td style="padding:8px 0;vertical-align:middle;"><div style="font-size:22px;font-weight:700;color:#111827;">${name}</div><div style="margin-top:6px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${accent};font-weight:700;">${position}</div>${company ? `<div style="margin-top:6px;font-size:13px;color:#475569;font-weight:600;">${company}</div>` : ''}<div style="margin-top:14px;font-size:13px;line-height:1.65;">${details}</div></td>${photo}${qr}</tr></table></td></tr>${tail}`,
            minimal: `${common}<tr><td style="padding:4px 0;"><div style="font-size:20px;font-weight:700;color:#0f172a;">${name}</div><div style="margin-top:4px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${accent};font-weight:700;">${position}${company ? ` - ${company}` : ''}</div><div style="margin-top:12px;padding-top:12px;border-top:1px solid #e5e7eb;font-size:13px;line-height:1.65;">${details}</div></td></tr>${tail}`,
            bold: `${common}<tr><td style="padding:24px;border-radius:24px;background:${accent};"><table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;border-collapse:collapse;"><tr>${photo.replace(`border:2px solid ${accent};`, 'border:2px solid rgba(255,255,255,0.55);')}<td style="vertical-align:middle;"><div style="font-size:24px;line-height:1.1;font-weight:800;color:#ffffff;">${name}</div><div style="margin-top:6px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.8);font-weight:700;">${position}${company ? ` &bull; ${company}` : ''}</div><div style="margin-top:14px;font-size:13px;line-height:1.65;color:rgba(255,255,255,0.88);">${email ? `<div style="margin-bottom:4px;">${email}</div>` : ''}${phone ? `<div style="margin-bottom:4px;">${phone}</div>` : ''}${address ? `<div style="margin-bottom:4px;">${address}</div>` : ''}${websiteText ? `<div>${websiteText}</div>` : ''}</div></td>${qr.replace('border:1px solid #e5e7eb;', 'border:1px solid rgba(255,255,255,0.3);')}</tr></table></td></tr>${tail}`,
            professional: `${common}<tr><td style="border:1px solid #e5e7eb;border-radius:22px;overflow:hidden;background:#ffffff;"><table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;border-collapse:collapse;"><tr><td style="padding:20px 24px;background:#111827;"><div style="font-size:22px;font-weight:800;color:#ffffff;">${name}</div><div style="margin-top:6px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${accent};font-weight:700;">${position}</div>${company ? `<div style="margin-top:6px;font-size:13px;color:#cbd5e1;">${company}</div>` : ''}</td></tr><tr><td style="padding:20px 24px;"><table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;border-collapse:collapse;"><tr>${photo}<td style="vertical-align:top;"><div style="font-size:13px;line-height:1.7;">${details}</div></td>${qr}</tr></table></td></tr></table></td></tr>${tail}`,
        };
        return map[options.theme];
    }, [options, previewImage, qrUrl, t]);

    const copySignature = async () => {
        try {
            await navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([signatureHtml], { type: 'text/html' }), 'text/plain': new Blob([signatureHtml], { type: 'text/plain' }) })]);
        } catch {
            const area = document.createElement('textarea');
            area.value = signatureHtml;
            document.body.appendChild(area);
            area.select();
            document.execCommand('copy');
            document.body.removeChild(area);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2400);
    };

    const copyHtmlCode = async () => {
        try {
            await navigator.clipboard.writeText(signatureHtml);
        } catch {
            if (htmlTextareaRef.current) {
                htmlTextareaRef.current.select();
                document.execCommand('copy');
            }
        }
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 2400);
    };

    const selectAllHtml = () => {
        htmlTextareaRef.current?.select();
    };

    const downloadSignature = () => {
        const link = document.createElement('a');
        link.href = `data:text/html;charset=utf-8,${encodeURIComponent(signatureHtml)}`;
        link.download = `${options.name || 'email-signature'}.html`;
        link.click();
    };

    const shareSignature = async () => {
        const file = new File([signatureHtml], `${options.name || 'email-signature'}.html`, { type: 'text/html' });
        if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({ files: [file], title: 'Email подпис' });
        } else if (navigator.share) {
            await navigator.share({ title: 'Email подпис', text: signatureHtml });
        } else {
            downloadSignature();
        }
    };

    const sendToEmail = () => {
        const subject = encodeURIComponent(`Email подпис — ${options.name}`);
        const body = encodeURIComponent(
            `Здравей,\n\nТук е твоят нов email подпис.\n\nЗа да го инсталираш:\n1. Копирай HTML кода от линка по-долу\n2. Отвори настройките на Gmail / Apple Mail\n3. Постави в полето за подпис\n\nHTML код:\n\n${signatureHtml}\n\n---\nГенериран от Ninja Cards`
        );
        const to = options.email ? encodeURIComponent(options.email) : '';
        window.open(`mailto:${to}?subject=${subject}&body=${body}`, '_blank');
        setEmailSent(true);
        setTimeout(() => setEmailSent(false), 3000);
    };

    if (loading) return (
        <div className="min-h-screen bg-[#080808] flex items-center justify-center">
            <div className="h-8 w-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#080808] px-3 pt-20 pb-8 sm:px-6 sm:pt-28 sm:pb-16">
            <div className="pointer-events-none fixed inset-x-0 top-0 h-[340px] bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.18),transparent_55%)]" />
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mb-6 rounded-[28px] border border-white/10 bg-white/[0.03] p-4 sm:mb-8 sm:rounded-[32px] sm:p-8">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-300 sm:px-4 sm:py-2 sm:text-[11px]">
                        <Icon.Sparkle />{t('header.badge')}
                    </div>
                    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-white sm:text-5xl">{t('header.title')}</h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base sm:leading-7">{t('header.subtitle')}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-white/8 bg-black/30 p-4">
                                <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{t('stats.themes')}</div>
                                <div className="mt-2 text-xl font-bold text-white">5</div>
                            </div>
                            <div className="rounded-2xl border border-white/8 bg-black/30 p-4">
                                <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{t('stats.format')}</div>
                                <div className="mt-2 text-base font-bold text-white">HTML</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">

                    {/* Left: Form — first on mobile */}
                    <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} className="order-1 rounded-[24px] border border-white/10 bg-[#101010] p-4 sm:rounded-[28px] sm:p-6 xl:sticky xl:top-28 xl:h-fit">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{t('sections.customization')}</div>
                                <div className="mt-2 text-xl font-bold text-white">{t('sections.quickSetup')}</div>
                            </div>
                            <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-400">{options.theme}</div>
                        </div>
                        <div className="space-y-6">

                            {/* Theme */}
                            <section className="space-y-3">
                                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{t('sections.theme')}</div>
                                <div className="grid grid-cols-2 gap-2 xl:grid-cols-1">
                                    {THEMES.map((theme) => (
                                        <button key={theme} type="button" onClick={() => setField('theme', theme)} className={`rounded-2xl border px-4 py-3.5 text-left transition active:scale-[0.97] ${options.theme === theme ? 'border-amber-400/50 bg-amber-500/12 text-white' : 'border-white/8 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.05]'}`}>
                                            <div className="text-sm font-semibold">{t(`themes.${theme}`)}</div>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Accent color */}
                            <section className="space-y-3">
                                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{t('sections.accentColor')}</div>
                                <div className="flex flex-wrap gap-2.5">
                                    {COLORS.map((color) => (
                                        <button key={color} type="button" onClick={() => setField('accentColor', color)} className="h-11 w-11 rounded-2xl border border-white/10 transition active:scale-95" style={{ backgroundColor: color, boxShadow: options.accentColor === color ? `0 0 0 2px ${color}` : 'none' }} />
                                    ))}
                                    <label className="flex h-11 min-w-[92px] cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-3 text-xs font-semibold text-zinc-300">
                                        <input type="color" value={options.accentColor} onChange={(e) => setField('accentColor', e.target.value)} className="sr-only" />
                                        {t('actions.customColor')}
                                    </label>
                                </div>
                            </section>

                            {/* Info fields */}
                            <section className="space-y-3">
                                <Field label={t('fields.name')} value={options.name} onChange={(v) => setField('name', v)} placeholder={t('placeholders.name')} />
                                <Field label={t('fields.position')} value={options.position} onChange={(v) => setField('position', v)} placeholder={t('placeholders.position')} />
                                <Field label={t('fields.company')} value={options.company} onChange={(v) => setField('company', v)} placeholder={t('placeholders.company')} />
                                <Field label={t('fields.email')} value={options.email} onChange={(v) => setField('email', v)} placeholder={t('placeholders.email')} />
                                <Field label={t('fields.phone1')} value={options.phone1} onChange={(v) => setField('phone1', v)} placeholder={t('placeholders.phone1')} />
                                <Field label={t('fields.address')} value={options.address} onChange={(v) => setField('address', v)} placeholder={t('placeholders.address')} />
                                <Field label={t('fields.website')} value={options.website} onChange={(v) => setField('website', v)} placeholder={t('placeholders.website')} />
                            </section>

                            {/* Toggles */}
                            <section className="grid gap-3">
                                <Toggle checked={options.showImage} onChange={(v) => setField('showImage', v)} label={t('toggles.showImage')} />
                                <Toggle checked={options.showQR} onChange={(v) => setField('showQR', v)} label={t('toggles.showQR')} />
                            </section>

                        </div>
                    </motion.div>

                    {/* Right: Preview + Actions */}
                    <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} className="order-2 space-y-4 sm:space-y-6">

                        {/* Preview */}
                        <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#101010] sm:rounded-[28px]">
                            <div className="flex flex-col gap-3 border-b border-white/8 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                                <div>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-white"><Icon.Eye />{t('preview.title')}</div>
                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">{t('preview.note')}</p>
                                </div>
                                <div className="self-start rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs uppercase tracking-[0.18em] text-zinc-500">{t(`themes.${options.theme}`)}</div>
                            </div>
                            <div className="bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.08),transparent_40%),linear-gradient(180deg,#161616_0%,#0d0d0d_100%)] p-2 sm:p-8">
                                <div className="overflow-hidden rounded-[22px] border border-white/8 bg-[#f8fafc] p-3 sm:overflow-x-auto sm:rounded-[28px] sm:p-8">
                                    <div
                                        className="origin-top-left sm:w-auto sm:min-w-[340px]"
                                        style={isPhone ? ({ zoom: 0.55, width: '640px' } as CSSProperties) : undefined}
                                        dangerouslySetInnerHTML={{ __html: signatureHtml }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ── Action buttons — always visible ── */}
                        <div className="grid grid-cols-2 gap-3">
                            <button type="button" onClick={copySignature} className={`flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-semibold transition active:scale-[0.97] ${copied ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-black hover:bg-amber-400'}`}>
                                {copied ? <Icon.Check /> : <Icon.Copy />}
                                <span>{copied ? t('actions.copied') : t('actions.copy')}</span>
                            </button>
                            <button type="button" onClick={downloadSignature} className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/[0.07] active:scale-[0.97]">
                                <Icon.Download />
                                <span className="hidden xs:inline">{t('actions.download')}</span>
                                <span className="xs:hidden">Свали</span>
                            </button>
                        </div>

                        {/* ── Изпрати / Сподели на телефон ── */}
                        <div className="rounded-[24px] border border-white/10 bg-[#101010] p-4 sm:rounded-[28px] sm:p-6">
                            <div className="mb-1 text-sm font-semibold text-white">Запази в имейл приложението</div>
                            <p className="mb-4 text-xs leading-5 text-zinc-500">Изпрати подписа на себе си или го сподели — после го копирай от имейл приложението и постави в настройките.</p>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {/* Изпрати на имейла ми */}
                                <button type="button" onClick={sendToEmail} className={`flex items-center justify-center gap-2.5 rounded-2xl border px-5 py-4 text-sm font-semibold transition active:scale-[0.97] ${emailSent ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.07]'}`}>
                                    {emailSent ? <Icon.Check /> : <Icon.Mail />}
                                    <span>{emailSent ? 'Изпратено!' : 'Изпрати на имейла ми'}</span>
                                </button>
                                {/* Сподели (Web Share API) */}
                                <button type="button" onClick={shareSignature} className="flex items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/[0.07] active:scale-[0.97]">
                                    <Icon.Share />
                                    <span>Сподели файл</span>
                                </button>
                            </div>
                        </div>

                        {/* ── HTML код (разгъваем) ── */}
                        <div className="rounded-[24px] border border-white/10 bg-[#101010] sm:rounded-[28px]">
                            <button type="button" onClick={() => setShowHtmlPanel((v) => !v)} className="flex w-full items-center justify-between p-4 sm:p-6">
                                <div className="flex items-center gap-2.5">
                                    <Icon.Code />
                                    <div>
                                        <div className="text-sm font-semibold text-white text-left">Виж HTML кода</div>
                                        <div className="text-xs text-zinc-500 text-left">Избери всичко → Копирай → Постави в имейл</div>
                                    </div>
                                </div>
                                <span className={`text-zinc-500 transition-transform ${showHtmlPanel ? 'rotate-180' : ''}`}><Icon.Chevron /></span>
                            </button>
                            <AnimatePresence initial={false}>
                                {showHtmlPanel && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                        <div className="border-t border-white/8 p-4 sm:p-6 space-y-3">
                                            <div className="flex gap-2">
                                                <button type="button" onClick={selectAllHtml} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.07] active:scale-[0.97]">
                                                    <Icon.SelectAll />
                                                    Избери всичко
                                                </button>
                                                <button type="button" onClick={copyHtmlCode} className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition active:scale-[0.97] ${codeCopied ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-black hover:bg-amber-400'}`}>
                                                    {codeCopied ? <Icon.Check /> : <Icon.Copy />}
                                                    {codeCopied ? 'Копирано!' : 'Копирай кода'}
                                                </button>
                                            </div>
                                            <textarea
                                                ref={htmlTextareaRef}
                                                readOnly
                                                value={signatureHtml}
                                                rows={6}
                                                className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 font-mono text-xs text-zinc-400 outline-none resize-none focus:border-amber-400/40 select-all"
                                                onClick={selectAllHtml}
                                            />
                                            <p className="text-xs text-zinc-600">На телефон: натисни в текста → Избери всичко → Копирай</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="rounded-[24px] border border-white/10 bg-[#101010] p-4 sm:rounded-[28px] sm:p-6">
                            <div className="mb-2 text-sm font-semibold text-white">{t('imageSupport.title')}</div>
                            <p className="text-sm leading-6 text-zinc-400 sm:leading-7">{t('imageSupport.description')}</p>
                        </div>

                        <div className="rounded-[24px] border border-white/10 bg-[#101010] p-4 sm:rounded-[28px] sm:p-6">
                            <div className="mb-4 text-sm font-semibold text-white">{t('howTo.title')}</div>
                            <div className="space-y-3">
                                {CLIENTS.map((client) => (
                                    <HowToItem key={client} title={t(`howTo.${client}.label`)} steps={t.raw(`howTo.${client}.steps`) as string[]} />
                                ))}
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>
        </div>
    );
}
