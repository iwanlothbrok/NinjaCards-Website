"use client";

import React, { useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type LinkInputProps = {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    iconSrc: string;
    focusRingColor: string;
};

const LinkInput: React.FC<LinkInputProps> = React.memo(({ name, value, onChange, placeholder, iconSrc, focusRingColor }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    return (
        <div className="flex items-center bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Image src={iconSrc} alt={`${name} icon`} width={40} height={40} className={`mr-4 transition-colors duration-300 ${isFocused ? focusRingColor : 'text-gray-400'} !important`} />
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`flex-grow bg-transparent text-gray-200 border-none focus:ring-0 placeholder-gray-400 focus:outline-none`}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
        </div>
    );
});

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
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });

    const router = useRouter();

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }, [formData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setLoading(true);
        setAlert({ message: '', type: null });

        if (!user || user.id === undefined) {
            setAlert({ message: 'User not authenticated', type: 'error' });
            setLoading(false);
            return;
        }

        const formDataObj = new FormData();
        formDataObj.append('id', user.id);

        Object.entries(formData).forEach(([key, value]) => {
            formDataObj.append(key, value);
        });

        try {
            const response = await fetch('/api/profile/updateLinks', {
                method: 'PUT',
                body: formDataObj,
            });

            if (!response.ok) {
                const errorText = await response.json();
                setAlert({ message: errorText.error || 'Failed to update links', type: 'error' });
                return;
            }

            const updatedUser = await response.json();
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            setAlert({ message: 'Links updated successfully', type: 'success' });
            setTimeout(() => {
                router.push('/');
            }, 1500);
        } catch (error) {
            console.error('Error updating links:', error);
            setAlert({ message: 'An unexpected error occurred. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-10 p-8 bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800 rounded-xl shadow-2xl">
            <h2 className="text-4xl font-bold mb-8 text-center text-white">Manage Your Important Links</h2>
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
                    placeholder="Revolut Username"
                    iconSrc="/logos/rev.png"
                    focusRingColor="text-[#0075EB]"
                />
                <LinkInput
                    name="viber"
                    value={formData.viber}
                    onChange={handleChange}
                    placeholder="Viber Phone Number"
                    iconSrc="/logos/viber.png"
                    focusRingColor="text-purple-500"
                />
                <LinkInput
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="WhatsApp Phone Number"
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
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="Website URL"
                    iconSrc="/logos/website.png"
                    focusRingColor="text-green-500"
                />

                <button
                    type="submit"
                    className={`col-span-1 md:col-span-2 w-full bg-gradient-to-r from-teal-500 via-teal-600 to-orange text-white py-3 rounded-lg mt-6 hover:from-teal-600 hover:via-teal-700 hover:to-orange focus:outline-none focus:ring-4 focus:ring-teal-400 transition-transform transform hover:scale-105 ${loading ? 'opacity-100 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save'}
                </button>
            </form>
        </div>
    );
};

export default ImportantLinks;
