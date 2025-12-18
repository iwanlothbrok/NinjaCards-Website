'use client';

import React, { useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import LinkInput from '../../components/profile/LinkInput';
import { BASE_API_URL } from '@/utils/constants';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const countryCodes = [
    { code: "+1", country: "🇺🇸 USA" },
    { code: "+44", country: "🇬🇧 UK" },
    { code: "+33", country: "🇫🇷 France" },
    { code: "+49", country: "🇩🇪 Germany" },
    { code: "+39", country: "🇮🇹 Italy" },
    { code: "+34", country: "🇪🇸 Spain" },
    { code: "+359", country: "🇧🇬 Bulgaria" },
    { code: "+90", country: "🇹🇷 Turkey" }, // added
];

const validateURL = (url: string) => {
    if (!url.trim()) return true;
    try {
        const parsed = new URL(url.trim());
        return parsed.protocol === 'https:' || parsed.protocol === 'http:';
    } catch {
        return false;
    }
};

const ImportantLinks: React.FC = () => {
    const { user, setUser } = useAuth();
    const t = useTranslations('ImportantLinks');
    const router = useRouter();

    const storedWhatsApp = user?.whatsapp || '';
    const defaultCode = countryCodes.find(({ code }) => storedWhatsApp.startsWith(code))?.code || "+359";
    const defaultNumber = storedWhatsApp.replace(defaultCode, "").trim();

    const [formData, setFormData] = useState({
        facebook: user?.facebook || '',
        instagram: user?.instagram || '',
        linkedin: user?.linkedin || '',
        twitter: user?.twitter || '',
        revolut: user?.revolut || '',
        googleReview: user?.googleReview || '',
        tiktok: user?.tiktok || '',
        website: user?.website || '',
        viber: user?.viber || '',
        whatsappCode: defaultCode,
        whatsapp: defaultNumber,
        github: user?.github || '',
        behance: user?.behance || '',
        paypal: user?.paypal || '',
        trustpilot: user?.trustpilot || '',
        telegram: user?.telegram || '',
        calendly: user?.calendly || '',
        discord: user?.discord || '',
        tripadvisor: user?.tripadvisor || '',
        youtube: user?.youtube || '',
        video: user?.video || null,
    });

    const [pdf, setPdf] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            if (name === "whatsappCode") return { ...prev, whatsappCode: value };
            if (name === "whatsapp") return { ...prev, whatsapp: value.replace(/\s+/g, '') };
            return { ...prev, [name]: value };
        });
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPdf(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const fullWhatsAppNumber = `${formData.whatsappCode}${formData.whatsapp}`;
        setLoading(true);
        setAlert({ message: '', type: null });

        if (!user || user.id === undefined) {
            setAlert({ message: t('alerts.unauthenticated'), type: 'error' });
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        for (const [key, value] of Object.entries(formData)) {
            if (["facebook", "instagram", "linkedin", "twitter", "googleReview", "tiktok", "github", "behance", "paypal", "trustpilot", "telegram", "calendly", "discord", "tripadvisor", "youtube", "website"].includes(key)) {
                if (typeof value === "string" && !validateURL(value)) {
                    setAlert({ message: `${t('alerts.invalidUrl')} ${key}`, type: 'error' });
                    setLoading(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }
            }
        }

        const formDataObj = new FormData();
        formDataObj.append('id', user.id);
        Object.entries(formData).forEach(([key, value]) => {
            if (key === "video" && value instanceof File) {
                formDataObj.append(key, value);
            } else if (key === "whatsapp") {
                formDataObj.append(key, fullWhatsAppNumber);
            } else if (typeof value === "string") {
                formDataObj.append(key, value);
            }
        });
        if (pdf) formDataObj.append('pdf', pdf);

        try {
            const response = await fetch(`${BASE_API_URL}/api/profile/updateLinks`, { method: 'PUT', body: formDataObj });
            const result = await response.json().catch(() => null);

            if (!response.ok) {
                setAlert({ message: result?.error || t('alerts.errorUpdate'), type: 'error' });
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            localStorage.setItem('user', JSON.stringify(result));
            setUser(result);
            setAlert({ message: t('alerts.successUpdate'), type: 'success' });
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            console.error(error);
            setAlert({ message: t('alerts.unknownError'), type: 'error' });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePdf = async () => {
        if (!user || !user.pdf) return;
        try {
            setLoading(true);
            setAlert({ message: '', type: null });
            const response = await fetch(`${BASE_API_URL}/api/profile/deletePdf`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: user.id }),
            });
            if (!response.ok) {
                const errorText = await response.json();
                setAlert({ message: errorText.error || t('alerts.errorDeletePdf'), type: 'error' });
                return;
            }
            setAlert({ message: t('alerts.successDeletePdf'), type: 'success' });
        } catch (error) {
            setAlert({ message: t('alerts.unknownError'), type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-4'>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen pt-32 sm:pt-36 px-4 bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-200"
            >
                <div className="max-w-5xl mx-auto space-y-10">
                    {/* Header */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent mb-4">
                            {t("title")}
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            {t("subtitle")}
                        </p>
                    </motion.div>
                    {alert.message && (
                        <div className={`p-4 rounded-lg mb-6 text-white text-center font-medium ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                            {alert.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* ... всичките LinkInput-и и PDF upload остават същите ... */}
                        <LinkInput
                            name="facebook"
                            value={formData.facebook}
                            onChange={handleChange}
                            placeholder="Facebook URL"
                            iconSrc="/logos/fb.png"
                            focusRingColor="text-[#1877F2]"
                        />
                        <LinkInput
                            name="instagram"
                            value={formData.instagram}
                            onChange={handleChange}
                            placeholder="Instagram URL"
                            iconSrc="/logos/ig.png"
                            focusRingColor="text-[#E4405F]"
                        />
                        <LinkInput
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleChange}
                            placeholder="LinkedIn URL"
                            iconSrc="/logos/lk.png"
                            focusRingColor="text-[#0077B5]"
                        />
                        <LinkInput
                            name="twitter"
                            value={formData.twitter}
                            onChange={handleChange}
                            placeholder="Twitter (X) URL"
                            iconSrc="/logos/x.png"
                            focusRingColor="text-[#1DA1F2]"
                        />
                        <LinkInput
                            name="tiktok"
                            value={formData.tiktok}
                            onChange={handleChange}
                            placeholder="TikTok URL"
                            iconSrc="/logos/tiktok.png"
                            focusRingColor="text-[#69C9D0]"
                        />
                        <LinkInput
                            name="googleReview"
                            value={formData.googleReview}
                            onChange={handleChange}
                            placeholder="Google Review URL"
                            iconSrc="/logos/gr.png"
                            focusRingColor="text-[#4285F4]"
                        />
                        <LinkInput
                            name="revolut"
                            value={formData.revolut}
                            onChange={handleChange}
                            placeholder="Revolut Потребителско име"
                            iconSrc="/logos/rev.png"
                            focusRingColor="text-[#0075EB]"
                        />
                        <LinkInput
                            name="viber"
                            value={formData.viber}
                            onChange={handleChange}
                            placeholder="Тел."
                            iconSrc="/logos/viber.png"
                            focusRingColor="text-purple-500"
                        />
                        <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-3 bg-gray-800 p-4 rounded-lg shadow-md">
                            <img src="/logos/wa.png" alt="WhatsApp" className="w-10 h-10 object-contain" />

                            {/* Country Code Selector */}
                            <select
                                name="whatsappCode"
                                value={formData.whatsappCode}
                                onChange={handleChange}
                                className="p-2 text-white bg-gray-900 border border-gray-700 rounded-lg outline-none"
                            >
                                {countryCodes.map(({ code, country }) => (
                                    <option key={code} value={code}>
                                        {country} ({code})
                                    </option>
                                ))}
                            </select>

                            {/* WhatsApp Number Input */}
                            <input
                                type="text"
                                name="whatsapp"
                                value={formData.whatsapp}
                                onChange={handleChange}
                                placeholder="Teл."
                                className="w-full md:flex-grow bg-transparent text-gray-200 border-none focus:ring-0 placeholder-gray-400 focus:outline-none"
                            />
                        </div>

                        <LinkInput
                            name="github"
                            value={formData.github}
                            onChange={handleChange}
                            placeholder="GitHub URL"
                            iconSrc="/logos/git.png"
                            focusRingColor="text-gray-800"
                        />
                        <LinkInput
                            name="behance"
                            value={formData.behance}
                            onChange={handleChange}
                            placeholder="Behance URL"
                            iconSrc="/logos/be.png"
                            focusRingColor="text-blue-600"
                        />
                        <LinkInput
                            name="paypal"
                            value={formData.paypal}
                            onChange={handleChange}
                            placeholder="PayPal URL"
                            iconSrc="/logos/icons8-paypal-48.png"
                            focusRingColor="text-blue-500"
                        />
                        <LinkInput
                            name="trustpilot"
                            value={formData.trustpilot}
                            onChange={handleChange}
                            placeholder="TrustPilot URL"
                            iconSrc="/logos/tp.png"
                            focusRingColor="text-green-500"
                        />
                        <LinkInput
                            name="telegram"
                            value={formData.telegram}
                            onChange={handleChange}
                            placeholder="Telegram URL"
                            iconSrc="/logos/telegram.png"
                            focusRingColor="text-blue-500"
                        />
                        <LinkInput
                            name="calendly"
                            value={formData.calendly}
                            onChange={handleChange}
                            placeholder="Calendly URL"
                            iconSrc="/logos/calendly.png"
                            focusRingColor="text-red-500"
                        />
                        <LinkInput
                            name="discord"
                            value={formData.discord}
                            onChange={handleChange}
                            placeholder="Discord URL"
                            iconSrc="/logos/discord.png"
                            focusRingColor="text-purple-500"
                        />
                        <LinkInput
                            name="tripadvisor"
                            value={formData.tripadvisor}
                            onChange={handleChange}
                            placeholder="Tripadvisor URL"
                            iconSrc="/logos/tripadvisor.png"
                            focusRingColor="text-yellow-500"
                        />
                        <LinkInput
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="Website URL"
                            iconSrc="/logos/website.png"
                            focusRingColor="text-green-500"
                        />
                        <LinkInput
                            name="youtube"
                            value={formData.youtube}
                            onChange={handleChange}
                            placeholder="Youtube URL"
                            iconSrc="/logos/youtube.png"
                            focusRingColor="text-red-500"
                        />
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition-all"
                            >
                                <img
                                    src="/logos/pdf.png"
                                    alt="Upload logo"
                                    className="w-12 h-12 object-contain"
                                />
                                <div className="flex-1">
                                    {/* Label wraps the visible area for better interaction */}
                                    <label className="block text-white font-medium text-lg cursor-pointer">
                                        PDF file
                                        {/* Make the input clickable by associating it with the label */}
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>
                                    <span className="block text-sm text-gray-400 truncate">
                                        {pdf ? (
                                            <span className="text-blue-400">{pdf.name}</span>
                                        ) : (
                                            'No file'
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Delete Button for Database PDF */}
                            {user?.pdf && (
                                <button
                                    type="button"
                                    className={`w-full px-4 py-2 text-md font-semibold text-white bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-700 hover:via-red-600 hover:to-red-700 rounded-lg shadow-md transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    onClick={handleDeletePdf}
                                    disabled={loading}
                                >
                                    {loading ? 'Изтриване...' : 'Изтрий PDF от Базата'}
                                </button>
                            )}
                        </div>

                        <div className="flex justify-between items-center mt-6 col-span-2">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition"
                            >
                                {t('buttons.back')}
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-semibold transition"
                                disabled={loading}
                            >
                                {loading ? t('buttons.saving') : t('buttons.save')}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

ImportantLinks.displayName = 'ImportantLinks';
export default ImportantLinks;
