'use client';

import React, { useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LinkInput from './LinkInput';
import { BASE_API_URL } from '@/utils/constants';

const ImportantLinks: React.FC = () => {
    const { user, setUser } = useAuth();
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
        whatsapp: user?.whatsapp || '',
        github: user?.github || '',
        behance: user?.behance || '',
        paypal: user?.paypal || '',
        trustpilot: user?.trustpilot || '',
        telegram: user?.telegram || '',
        calendly: user?.calendly || '',
        discord: user?.discord || '',
        tripadvisor: user?.tripadvisor || '',

    });
    const [pdf, setPdf] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });

    const router = useRouter();

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        let updatedValue = value;

        // Ensure Viber and WhatsApp phone numbers start with +359 and remove any spaces
        if (name === 'viber' || name === 'whatsapp') {
            // Remove all spaces from the input
            updatedValue = value.replace(/\s+/g, '');

            // Ensure the number starts with +359
            if (!updatedValue.startsWith('+359')) {
                updatedValue = `+359${updatedValue.replace(/^\+?359/, '')}`; // Ensure no double prefix
            }
        }

        setFormData({ ...formData, [name]: updatedValue });
    }, [formData]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPdf(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setLoading(true);
        setAlert({ message: '', type: null });

        if (!user || user.id === undefined) {
            setAlert({ message: 'Потребителят не е удостоверен', type: 'error' });
            setLoading(false);
            return;
        }

        const formDataObj = new FormData();
        formDataObj.append('id', user.id);

        Object.entries(formData).forEach(([key, value]) => {
            formDataObj.append(key, value);
        });

        if (pdf) {
            formDataObj.append('pdf', pdf);
        }

        try {
            const response = await fetch(`${BASE_API_URL}/api/profile/updateLinks`, {
                method: 'PUT',
                body: formDataObj,
            });

            if (!response.ok) {
                const errorText = await response.json();
                setAlert({ message: errorText.error || 'Неуспешна актуализация на връзките', type: 'error' });
                return;
            }

            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;

            const updatedUser = await response.json();
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            setAlert({ message: 'Връзките са успешно актуализирани', type: 'success' });
        } catch (error) {
            console.error('Грешка при актуализация на връзките:', error);
            setAlert({ message: 'Възникна неочаквана грешка. Моля, опитайте отново.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-10 p-8 bg-gradient-to-b from-black via-gray-950 to-gray-950 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-bold mb-8 text-center text-white">Управление на важни връзки</h2>
            {alert.message && (
                <div
                    className={`p-4 rounded mb-6 text-white transition-all duration-300 ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
                >
                    {alert.message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    placeholder="Viber Телефонен номер"
                    iconSrc="/logos/viber.png"
                    focusRingColor="text-purple-500"
                />
                <LinkInput
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="WhatsApp Телефонен номер"
                    iconSrc="/logos/wa.png"
                    focusRingColor="text-green-500"
                />
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
                    placeholder="Уебсайт URL"
                    iconSrc="/logos/website.png"
                    focusRingColor="text-green-500"
                />

                <div
                    className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition-all"
                >
                    <img src="/logos/pdf.png" alt="PDF logo" className="w-10 h-10 object-contain" />
                    <label className="flex-1 text-white">
                        <span className="block mb-1">Качете PDF</span>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <span className="block text-sm text-gray-400 truncate">
                            {pdf ? pdf.name : 'Няма Качен Файл'}
                        </span>
                    </label>
                </div>

                <button
                    type="submit"
                    className={`col-span-1 md:col-span-2 w-full bg-gradient-to-r from-teal-500 via-teal-600 to-orange text-white py-3 rounded-lg mt-6 hover:from-teal-600 hover:via-teal-700 hover:to-orange focus:outline-none focus:ring-4 focus:ring-teal-400 transition-transform transform hover:scale-105 ${loading ? 'opacity-100 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Запазване...' : 'Запази'}
                </button>
            </form>
        </div>
    );
};

// Adding displayName property to the ImportantLinks component
ImportantLinks.displayName = 'ImportantLinks';

export default ImportantLinks;
