"use client";

import React, { useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaTiktok, FaGoogle, FaCashRegister } from 'react-icons/fa';
import { AiOutlineGlobal } from 'react-icons/ai';

type LinkInputProps = {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    IconComponent: React.ElementType;
    focusRingColor: string;
};

const LinkInput: React.FC<LinkInputProps> = React.memo(({ name, value, onChange, placeholder, IconComponent, focusRingColor }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    return (
        <div className="flex items-center bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <IconComponent className={`text-6xl sm:text-6xl md:text-4xl lg:text-3xl mr-4 transition-colors duration-300 ${isFocused ? focusRingColor : 'text-gray-400'} !important`} />
            <input
                type="url"
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
        website: '',
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
            }, 1000);


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
                    IconComponent={FaFacebook}
                    focusRingColor="text-[#1877F2]"
                />
                <LinkInput
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    placeholder="Instagram URL"
                    IconComponent={FaInstagram}
                    focusRingColor="text-[#E4405F]"
                />
                <LinkInput
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="LinkedIn URL"
                    IconComponent={FaLinkedin}
                    focusRingColor="text-[#0077B5]"
                />
                <LinkInput
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    placeholder="Twitter URL"
                    IconComponent={FaTwitter}
                    focusRingColor="text-[#1DA1F2]"
                />
                <LinkInput
                    name="tiktok"
                    value={formData.tiktok}
                    onChange={handleChange}
                    placeholder="TikTok URL"
                    IconComponent={FaTiktok}
                    focusRingColor="text-[#69C9D0]"
                />
                <LinkInput
                    name="googleReview"
                    value={formData.googleReview}
                    onChange={handleChange}
                    placeholder="Google Review URL"
                    IconComponent={FaGoogle}
                    focusRingColor="text-[#4285F4]"
                />
                <LinkInput
                    name="revolut"
                    value={formData.revolut}
                    onChange={handleChange}
                    placeholder="Revolut URL"
                    IconComponent={FaCashRegister}
                    focusRingColor="text-[#0075EB]"
                />
                <LinkInput
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="Website URL"
                    IconComponent={AiOutlineGlobal}
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
