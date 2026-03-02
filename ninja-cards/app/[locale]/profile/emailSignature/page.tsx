'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { BASE_API_URL } from '@/utils/constants';
import { useTranslations } from 'next-intl';

type SignatureTheme = 'modern' | 'classic' | 'minimal' | 'bold' | 'professional';

interface SignatureOptions {
    theme: SignatureTheme;
    showQR: boolean;
    showSocial: boolean;
    showImage: boolean;
    accentColor: string;
    name: string;
    position: string;
    company: string;
    email: string;
    phone1: string;
    address: string;
    website: string;
    linkedin: string;
    selectedSocialLinks: string[];
}

const SOCIAL_ICONS = {
    facebook: '/logos/fb.png',
    instagram: '/logos/ig.png',
    linkedin: '/logos/lk.png',
    twitter: '/logos/x.png',
    tiktok: '/logos/tiktok.png',
    github: '/logos/git.png',
    behance: '/logos/be.png',
    paypal: '/logos/icons8-paypal-48.png',
    telegram: '/logos/telegram.png',
    discord: '/logos/discord.png',
    youtube: '/logos/youtube.png',
    revolut: '/logos/rev.png',
    viber: '/logos/viber.png',
    googleReview: '/logos/gr.png',
    trustpilot: '/logos/tp.png',
    calendly: '/logos/calendly.png',
    tripadvisor: '/logos/tripadvisor.png',
};

export default function EmailSignaturePage() {
    const { user: authUser, loading } = useAuth();
    const [copied, setCopied] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    const t = useTranslations('EmailSignature');

    const availableSocialLinks = Object.keys(SOCIAL_ICONS).filter(
        (key) => authUser && authUser[key as keyof typeof authUser]
    );

    const [options, setOptions] = useState<SignatureOptions>({
        theme: 'modern',
        showQR: true,
        showSocial: true,
        showImage: true,
        accentColor: '#6366f1',
        name: authUser?.name || '',
        position: authUser?.position || '',
        company: authUser?.company || '',
        email: authUser?.email || '',
        phone1: authUser?.phone1 || '',
        address: authUser?.city || '',
        website: authUser?.website || '',
        linkedin: authUser?.linkedin || '',
        selectedSocialLinks: availableSocialLinks.slice(0, 3),
    });

    useEffect(() => {
        if (!loading && authUser) {
            const available = Object.keys(SOCIAL_ICONS).filter(
                (key) => authUser[key as keyof typeof authUser]
            );
            setOptions({
                theme: 'modern',
                showQR: true,
                showSocial: true,
                showImage: true,
                accentColor: '#6366f1',
                name: authUser.name || '',
                position: authUser.position || '',
                company: authUser.company || '',
                email: authUser.email || '',
                phone1: authUser.phone1 || '',
                address: authUser.street1 && (authUser.city || authUser.country) ? `${authUser.street1}, ${authUser.city || ''}${authUser.country ? ', ' + authUser.country : ''}`.replace(/^,\s+/, '') : authUser.street1 || authUser.city || authUser.country || '',
                website: authUser.website || '',
                linkedin: authUser.linkedin || '',
                selectedSocialLinks: available.slice(0, 3),
            });
        }
    }, [loading, authUser]);


    const copyToClipboard = async () => {
        const signatureHTML = generateSignatureHTML();
        try {
            const blob = new Blob([signatureHTML], { type: 'text/html' });
            const data = [new ClipboardItem({ 'text/html': blob, 'text/plain': new Blob([signatureHTML], { type: 'text/plain' }) })];
            await navigator.clipboard.write(data);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Copy failed:', error);
            fallbackCopy(signatureHTML);
        }
    };

    const fallbackCopy = (html: string) => {
        const textArea = document.createElement('textarea');
        textArea.value = html;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadSignature = () => {
        try {
            const signatureHTML = generateSignatureHTML();
            const element = document.createElement('a');
            element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(signatureHTML));
            element.setAttribute('download', `${options.name}-signature.html`);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    const getSocialUrl = (platform: string): string => {
        return authUser?.[platform as keyof typeof authUser] as string || '';
    };

    const generateSignatureHTML = () => {
        const socialIconsHTML = options.selectedSocialLinks
            .map((platform) => {
                const url = getSocialUrl(platform);
                if (!url) return '';
                return `<a href="${url}" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: linear-gradient(135deg, ${options.accentColor}, ${options.accentColor}dd); border-radius: 8px; color: white; text-decoration: none; font-weight: 900; box-shadow: 0 6px 20px rgba(0,0,0,0.1); margin-right: 8px;" title="${platform}">
                    <img src="${SOCIAL_ICONS[platform as keyof typeof SOCIAL_ICONS]}" alt="${platform}" style="width: 20px; height: 20px; filter: brightness(0) invert(1);" />
                </a>`;
            })
            .join('');

        const themes = {
            modern: `
            <div style="font-family: 'Trebuchet MS', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 680px; padding: 24px; background: linear-gradient(135deg, #ffffff 0%, #f8f9fc 100%); border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.08);">
            <table cellpadding="0" cellspacing="0" style="width: 100%;">
            <tr>
            <td style="vertical-align: top; padding-right: 20px;">
            ${options.showImage && (uploadedImage || authUser?.image) ? `<img src="${uploadedImage || `data:image/jpeg;base64,${authUser?.image}`}" alt="${options.name}" style="width: 110px; height: 110px; border-radius: 16px; object-fit: cover; box-shadow: 0 12px 40px rgba(0,0,0,0.15); border: 2px solid ${options.accentColor};" />` : ''}
            </td>
            <td style="vertical-align: middle;">
            <div style="margin-bottom: 8px;">
            <strong style="font-size: 20px; color: #0f172a; font-weight: 800; letter-spacing: -0.5px; display: block;">${options.name}</strong>
            <div style="font-size: 12px; color: ${options.accentColor}; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; margin-top: 4px;">${options.position}</div>
            </div>
            <div style="font-size: 13px; color: #475569; line-height: 1.6; font-weight: 500;">
            ${options.company ? `<div style="color: #1e293b; font-weight: 700; margin-bottom: 4px; letter-spacing: 0.3px;">${options.company}</div>` : ''}
            ${options.email ? `<div style="margin: 2px 0;">📧 <a href="mailto:${options.email}" style="color: ${options.accentColor}; text-decoration: none; font-weight: 600;">${options.email}</a></div>` : ''}
            ${options.phone1 ? `<div style="margin: 2px 0;">📱 <strong>${options.phone1}</strong></div>` : ''}
            ${options.address ? `<div style="margin: 2px 0;">📍 ${options.address}</div>` : ''}
            ${options.website ? `<div style="margin: 2px 0;">🌐 <a href="${options.website}" style="color: ${options.accentColor}; text-decoration: none; font-weight: 600;">${options.website}</a></div>` : ''}
            </div>
            </td>
            ${options.showQR && authUser?.id ? `<td style="vertical-align: top; padding-left: 20px; text-align: center;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`/profileDetails/${authUser.id}`)}" alt="QR Code" style="width: 100px; height: 100px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); border: 2px solid #e2e8f0;" />
            </td>` : ''}
            </tr>
            </table>
            ${options.showSocial && socialIconsHTML ? `<div style="margin-top: 16px; padding-top: 16px; border-top: 2px solid #e2e8f0; display: flex; gap: 8px;">
            ${socialIconsHTML}
            </div>` : ''}
            </div>
            `,
            classic: `
            <div style="font-family: 'Georgia', serif; max-width: 620px; padding: 20px; background: #ffffff;">
            <table cellpadding="0" cellspacing="0" style="width: 100%;">
            <tr>
            <td>
            <div style="border-left: 6px solid ${options.accentColor}; padding-left: 20px;">
            <div style="font-size: 18px; font-weight: 800; color: #0f172a; letter-spacing: -0.3px;">${options.name}</div>
            <div style="font-size: 13px; color: ${options.accentColor}; margin-top: 4px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">${options.position}</div>
            ${options.company ? `<div style="font-size: 13px; color: #1e293b; font-weight: 700; margin-top: 8px;">${options.company}</div>` : ''}
            <div style="font-size: 13px; color: #64748b; margin-top: 10px; line-height: 1.6; border-top: 1px solid #e2e8f0; padding-top: 10px;">
            ${options.email ? `<div>📧 <a href="mailto:${options.email}" style="color: ${options.accentColor}; text-decoration: none; font-weight: 600;">${options.email}</a></div>` : ''}
            ${options.phone1 ? `<div>📱 ${options.phone1}</div>` : ''}
            ${options.address ? `<div>📍 ${options.address}</div>` : ''}
            ${options.website ? `<div>🌐 <a href="${options.website}" style="color: ${options.accentColor}; text-decoration: none; font-weight: 600;">${options.website}</a></div>` : ''}
            </div>
            </div>
            </td>
            ${options.showImage && (uploadedImage || authUser?.image) ? `<td style="padding-left: 20px; text-align: right; vertical-align: middle;">
            <img src="${uploadedImage || `data:image/jpeg;base64,${authUser?.image}`}" alt="${options.name}" style="width: 130px; height: 130px; border-radius: 12px; box-shadow: 0 12px 40px rgba(0,0,0,0.1); border: 2px solid ${options.accentColor};" />
            </td>` : ''}
            </tr>
            </table>
            ${options.showSocial && socialIconsHTML ? `<div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e2e8f0; display: flex; gap: 8px;">
            ${socialIconsHTML}
            </div>` : ''}
            </div>
            `,
            minimal: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 450px; padding: 16px; background: #ffffff;">
            <div style="font-size: 15px; font-weight: 800; color: #0f172a; letter-spacing: -0.4px; margin-bottom: 2px;">${options.name}</div>
            <div style="font-size: 12px; color: ${options.accentColor}; margin-bottom: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;">${options.position}</div>
            ${options.company ? `<div style="font-size: 13px; color: #1e293b; font-weight: 700; margin-bottom: 10px;">${options.company}</div>` : ''}
            <div style="border-top: 2px solid #e2e8f0; padding-top: 10px; font-size: 13px; color: #64748b; line-height: 1.6;">
            ${options.email ? `<div>📧 <a href="mailto:${options.email}" style="color: ${options.accentColor}; text-decoration: none; font-weight: 600;">${options.email}</a></div>` : ''}
            ${options.phone1 ? `<div>📱 ${options.phone1}</div>` : ''}
            ${options.address ? `<div>📍 ${options.address}</div>` : ''}
            ${options.website ? `<div>🌐 <a href="${options.website}" style="color: ${options.accentColor}; text-decoration: none; font-weight: 600;">${options.website}</a></div>` : ''}
            </div>
            ${options.showSocial && socialIconsHTML ? `<div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e2e8f0; display: flex; gap: 8px;">
            ${socialIconsHTML}
            </div>` : ''}
            </div>
            `,
            bold: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 700px; padding: 32px; background: linear-gradient(135deg, ${options.accentColor}, ${options.accentColor}f0); color: #ffffff; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.15);">
            <div style="font-size: 26px; font-weight: 900; margin-bottom: 2px; letter-spacing: -0.5px;">${options.name}</div>
            <div style="font-size: 13px; font-weight: 800; opacity: 0.95; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1.2px;">${options.position}</div>
            ${options.company ? `<div style="font-size: 14px; font-weight: 700; opacity: 0.9; margin-bottom: 12px;">${options.company}</div>` : ''}
            <div style="border-top: 2px solid rgba(255,255,255,0.4); padding-top: 12px; font-size: 13px; line-height: 1.8; font-weight: 600;">
            ${options.email ? `<div>📧 ${options.email}</div>` : ''}
            ${options.phone1 ? `<div>📱 ${options.phone1}</div>` : ''}
            ${options.address ? `<div>📍 ${options.address}</div>` : ''}
            ${options.website ? `<div>🌐 ${options.website}</div>` : ''}
            </div>
            ${options.showSocial && socialIconsHTML ? `<div style="margin-top: 12px; padding-top: 12px; border-top: 2px solid rgba(255,255,255,0.4); display: flex; gap: 8px;">
            ${socialIconsHTML}
            </div>` : ''}
            </div>
            `,
            professional: `
            <div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 650px; padding: 0; background: #ffffff;">
            <table cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">
            <tr>
            <td style="background-color: #1e293b; padding: 32px 24px; vertical-align: middle;">
            <div style="font-size: 24px; font-weight: 900; color: #ffffff; margin-bottom: 4px; letter-spacing: -0.5px;">${options.name}</div>
            <div style="font-size: 12px; color: ${options.accentColor}; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px;">${options.position}</div>
            ${options.company ? `<div style="font-size: 13px; color: #cbd5e1; font-weight: 600;">${options.company}</div>` : ''}
            </td>
            ${options.showImage && (uploadedImage || authUser?.image) ? `<td style="background-color: #1e293b; padding: 24px; text-align: center; vertical-align: middle;">
            <img src="${uploadedImage || `data:image/jpeg;base64,${authUser?.image}`}" alt="${options.name}" style="width: 90px; height: 90px; border-radius: 8px; object-fit: cover; border: 3px solid ${options.accentColor}; display: block;" />
            </td>` : ''}
            </tr>
            </table>
            <div style="padding: 20px 24px; background: #f8fafc; border-top: 3px solid ${options.accentColor};">
            <table cellpadding="0" cellspacing="0" style="width: 100%;">
            <tr>
            <td style="font-size: 13px; color: #334155; line-height: 1.8; font-weight: 500;">
            ${options.email ? `<div style="margin-bottom: 6px;"><span style="font-weight: 700; color: #0f172a;">Email:</span> <a href="mailto:${options.email}" style="color: ${options.accentColor}; text-decoration: none; font-weight: 600;">${options.email}</a></div>` : ''}
            ${options.phone1 ? `<div style="margin-bottom: 6px;"><span style="font-weight: 700; color: #0f172a;">Phone:</span> ${options.phone1}</div>` : ''}
            </td>
            <td style="text-align: right; font-size: 13px; color: #334155; line-height: 1.8; font-weight: 500; padding-left: 20px;">
            ${options.address ? `<div style="margin-bottom: 6px;"><span style="font-weight: 700; color: #0f172a;">Address:</span> ${options.address}</div>` : ''}
            ${options.website ? `<div style="margin-bottom: 6px;"><span style="font-weight: 700; color: #0f172a;">Website:</span> <a href="${options.website}" style="color: ${options.accentColor}; text-decoration: none; font-weight: 600;">${options.website}</a></div>` : ''}
            </td>
            </tr>
            </table>
            </div>
            ${options.showSocial && socialIconsHTML ? `<div style="padding: 12px 24px; background: #f8fafc; display: flex; gap: 8px; border-top: 1px solid #e2e8f0;">
            ${socialIconsHTML}
            </div>` : ''}
            ${options.showQR && authUser?.id ? `<div style="padding: 12px 24px; text-align: center; background: #f8fafc; border-top: 1px solid #e2e8f0;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(`/profileDetails/${authUser.id}`)}" alt="QR Code" style="width: 80px; height: 80px; border-radius: 8px;" />
            </div>` : ''}
            </div>
            `,
        };

        return themes[options.theme];
    };

    const handleFieldChange = (field: keyof SignatureOptions, value: string | boolean | string[]) => {
        setOptions({ ...options, [field]: value });
    };

    const toggleSocialLink = (platform: string) => {
        setOptions((prev) => {
            const updated = prev.selectedSocialLinks.includes(platform)
                ? prev.selectedSocialLinks.filter((p) => p !== platform)
                : [...prev.selectedSocialLinks, platform];
            return { ...prev, selectedSocialLinks: updated };
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black pt-32 px-4 flex items-center justify-center">
                <div className="text-amber-400">{t('loading')}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black pt-24 sm:pt-32 px-3 sm:px-4 pb-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-12 sm:mb-16"
                >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-400 via-orange to-amber-600 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight">
                        {t('header.title')}
                    </h1>
                    <p className="text-white text-base sm:text-lg max-w-2xl mx-auto px-2">
                        {t('header.subtitle')}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8"
                >
                    {/* Customization Panel */}
                    <div className="lg:col-span-2 bg-gradient-to-b from-gray-900/80 to-gray-950/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-amber-500/20 backdrop-blur-xl max-h-[70vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl hover:border-amber-500/30 transition-all">
                        <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange bg-clip-text text-transparent mb-6 sm:mb-8 sticky top-0 pb-4">
                            ✨ {t('sections.customization')}
                        </h3>

                        {/* Theme Selection */}
                        <div className="mb-8">
                            <label className="block text-gray-300 text-xs sm:text-sm font-semibold mb-3 sm:mb-4 uppercase tracking-wider">{t('sections.theme')}</label>
                            <div className="space-y-2">
                                {(['modern', 'classic', 'minimal', 'bold', 'professional'] as SignatureTheme[]).map((theme) => (
                                    <button
                                        key={theme}
                                        onClick={() => handleFieldChange('theme', theme)}
                                        className={`w-full px-4 py-3 sm:py-3.5 rounded-xl font-semibold transition-all capitalize text-sm sm:text-base ${options.theme === theme
                                            ? 'bg-gradient-to-r from-amber-500 to-orange text-white shadow-lg shadow-amber-500/50 scale-105'
                                            : 'bg-gray-800/40 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50 hover:border-amber-500/30'
                                            }`}
                                    >
                                        {t(`themes.${theme}`)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Accent Color */}
                        <div className="mb-8">
                            <label className="block text-gray-300 text-xs sm:text-sm font-semibold mb-3 sm:mb-4 uppercase tracking-wider">{t('sections.accentColor')}</label>
                            <div className="grid grid-cols-5 gap-2 sm:gap-3">
                                {[
                                    { color: '#f97316', name: 'Orange' },
                                    { color: '#f59e0b', name: 'Amber' },
                                    { color: '#ea580c', name: 'Burnt Orange' },
                                    { color: '#dc2626', name: 'Red' },
                                    { color: '#6366f1', name: 'Indigo' },
                                    { color: '#8b5cf6', name: 'Violet' },
                                    { color: '#ec4899', name: 'Pink' },
                                    { color: '#22c55e', name: 'Green' },
                                    { color: '#06b6d4', name: 'Cyan' },
                                    { color: '#3b82f6', name: 'Blue' },
                                ].map(({ color, name }) => (
                                    <button
                                        key={color}
                                        onClick={() => handleFieldChange('accentColor', color)}
                                        className={`w-full aspect-square rounded-xl transition-all duration-300 ${options.accentColor === color
                                            ? 'ring-2 ring-white shadow-lg shadow-amber-500/40 scale-110'
                                            : 'hover:scale-105 shadow-md hover:shadow-lg'
                                            }`}
                                        style={{ backgroundColor: color }}
                                        title={name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Text Fields */}
                        <div className="mb-8">
                            <h4 className="text-gray-300 font-semibold mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider">📋 {t('sections.contactInfo')}</h4>
                            <div className="space-y-2.5 sm:space-y-3">
                                {[
                                    { key: 'name', label: 'fields.name' },
                                    { key: 'position', label: 'fields.position' },
                                    { key: 'company', label: 'fields.company' },
                                    { key: 'email', label: 'fields.email' },
                                    { key: 'phone1', label: 'fields.phone1' },
                                    { key: 'address', label: 'fields.address' },
                                    { key: 'website', label: 'fields.website' },
                                    { key: 'linkedin', label: 'fields.linkedin' },
                                ].map(({ key, label }) => (
                                    <input
                                        key={key}
                                        type="text"
                                        placeholder={t(label)}
                                        value={options[key as keyof SignatureOptions] as string}
                                        onChange={(e) => handleFieldChange(key as keyof SignatureOptions, e.target.value)}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/40 text-gray-200 placeholder-gray-500 rounded-lg sm:rounded-xl border border-amber-500/20 focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-sm transition-all hover:border-amber-500/40"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Social Media Links Selection */}
                        {availableSocialLinks.length > 0 && (
                            <div className="mb-8">
                                <h4 className="text-gray-300 font-semibold mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider">🔗 {t('sections.socialMedia')}</h4>
                                <p className="text-gray-400 text-xs mb-3">{t('social.hint')}</p>
                                <div className="space-y-2.5 max-h-48 overflow-y-auto">
                                    {availableSocialLinks.map((platform) => (
                                        <label key={platform} className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-800/40 transition-all">
                                            <input
                                                type="checkbox"
                                                checked={options.selectedSocialLinks.includes(platform)}
                                                onChange={() => toggleSocialLink(platform)}
                                                className="w-5 h-5 rounded accent-amber-500 cursor-pointer"
                                            />
                                            <img
                                                src={SOCIAL_ICONS[platform as keyof typeof SOCIAL_ICONS]}
                                                alt={platform}
                                                className="w-4 h-4 filter brightness-0 invert group-hover:brightness-125"
                                            />
                                            <span className="text-gray-300 text-sm group-hover:text-amber-400 transition-colors capitalize flex-1">{platform}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Toggle Options */}
                        <div className="space-y-3 sm:space-y-4 p-4 sm:p-5 bg-gray-800/20 rounded-xl border border-amber-500/10">
                            <h4 className="text-gray-300 font-semibold text-xs sm:text-sm uppercase tracking-wider">⚙️ {t('sections.displayOptions')}</h4>
                            {[
                                { key: 'showImage', label: 'toggles.showImage' },
                                { key: 'showQR', label: 'toggles.showQR' },
                                { key: 'showSocial', label: 'toggles.showSocial' },
                            ].map(({ key, label }) => (
                                <label key={key} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={options[key as keyof SignatureOptions] as boolean}
                                        onChange={(e) =>
                                            handleFieldChange(key as keyof SignatureOptions, e.target.checked)
                                        }
                                        className="w-5 h-5 rounded accent-amber-500 cursor-pointer"
                                    />
                                    <span className="text-gray-300 text-sm group-hover:text-amber-400 transition-colors">{t(label)}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Preview Panel */}
                    <div className="lg:col-span-3">
                        <div className="bg-gradient-to-b from-gray-900/80 to-gray-950/80 rounded-2xl sm:rounded-3xl border border-amber-500/20 backdrop-blur-xl p-6 sm:p-8 mb-6 sm:mb-8 shadow-2xl hover:border-amber-500/30 transition-all">
                            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange bg-clip-text text-transparent mb-4 sm:mb-6">👁️ {t('preview.title')}</h2>
                            <p className="text-gray-400 text-xs sm:text-sm mb-4">{t('preview.note')}</p>
                            <div
                                className="p-6 sm:p-8 bg-gray-950/90 rounded-xl overflow-auto border border-amber-500/20 shadow-inner max-h-96 sm:max-h-[500px]"
                                dangerouslySetInnerHTML={{ __html: generateSignatureHTML() }}
                            />
                        </div>

                        {/* Email Provider Guide */}
                        <div className="bg-gradient-to-b from-gray-900/60 to-gray-950/60 rounded-xl sm:rounded-2xl border border-amber-500/10 p-4 sm:p-6 mb-4 sm:mb-6">
                            <h3 className="text-gray-300 font-semibold mb-3 sm:mb-4 text-sm uppercase tracking-wider">📧 {t('howTo.title')}</h3>
                            <div className="space-y-2 text-xs sm:text-sm text-gray-400">
                                <details className="cursor-pointer group" open>
                                    <summary className="font-semibold text-amber-400 hover:text-amber-300 transition-colors outline-none">{t('howTo.gmail.label')}</summary>
                                    <div className="mt-2 ml-4 text-gray-400 space-y-1">
                                        {['1) Click "Copy signature"', '2) Gmail → Settings → See all settings', '3) In the Signature section, paste it', '4) Save changes'].map((step: string, idx: number) => (
                                            <p key={idx}>{step}</p>
                                        ))}
                                    </div>
                                </details>
                                <details className="cursor-pointer group" open>
                                    <summary className="font-semibold text-amber-400 hover:text-amber-300 transition-colors outline-none">{t('howTo.outlook.label')}</summary>
                                    <div className="mt-2 ml-4 text-gray-400 space-y-1">
                                        {['1) Click "Copy signature"', '2) Settings → Mail → Compose and reply', '3) Paste into Email signature', '4) Save your settings'].map((step: string, idx: number) => (
                                            <p key={idx}>{step}</p>
                                        ))}
                                    </div>
                                </details>
                                <details className="cursor-pointer group" open>
                                    <summary className="font-semibold text-amber-400 hover:text-amber-300 transition-colors outline-none">{t('howTo.appleMail.label')}</summary>
                                    <div className="mt-2 ml-4 text-gray-400 space-y-1">
                                        {['1) Click "Copy signature"', '2) Mail → Settings → Signatures', '3) Create a new signature and paste the content', '4) Select which account should use it'].map((step: string, idx: number) => (
                                            <p key={idx}>{step}</p>
                                        ))}
                                    </div>
                                </details>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 sm:gap-4">
                            <button
                                onClick={copyToClipboard}
                                className="w-full bg-gradient-to-r from-amber-500 to-orange hover:from-amber-400 hover:to-orange text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-amber-500/50 hover:shadow-amber-500/70 text-base sm:text-lg"
                            >
                                {copied ? t('actions.copied') : t('actions.copy')}
                            </button>
                            <p className="text-gray-400 text-center text-xs sm:text-sm px-2">{t('actions.copyHelp')}</p>
                            <button
                                onClick={downloadSignature}
                                className="w-full bg-gray-800/50 hover:bg-gray-700/60 text-gray-200 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 border border-gray-700/50 hover:border-amber-500/40 text-base sm:text-lg"
                            >
                                {t('actions.download')}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
