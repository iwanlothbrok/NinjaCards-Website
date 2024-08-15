"use client";

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaTiktok, FaGoogle, FaCashRegister } from 'react-icons/fa';
import { AiOutlineGlobal, AiOutlineQrcode } from 'react-icons/ai';

type LinkInputProps = {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    IconComponent: React.ElementType;
    focusRingColor: string;
};

const LinkInput: React.FC<LinkInputProps> = ({ name, value, onChange, placeholder, IconComponent, focusRingColor }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    return (
        <div className="flex items-center mb-4">
            <IconComponent className={`text-2xl mr-2 transition-colors duration-300 ${isFocused ? focusRingColor : 'text-gray-400'}`} />
            <input
                type="url"
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`block w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 ${focusRingColor}`}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
        </div>
    );
};

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
        qrCode: '',
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });

    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setAlert({ message: '', type: null });

        if (!user || user.id === undefined) {
            setAlert({ message: 'User not authenticated', type: 'error' });
            return;
        }

        const formDataObj = new FormData();
        formDataObj.append('id', user.id); // Ensure ID is appended

        Object.entries(formData).forEach(([key, value]) => {
            formDataObj.append(key, value);
        });

        try {
            const response = await fetch('/api/profile/updateLinks', {
                method: 'PUT',
                body: formDataObj,  // Send the FormData object
            });

            if (response.ok) {
                const updatedUser = await response.json();
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setAlert({ message: 'Links updated successfully', type: 'success' });
                setTimeout(() => {
                    router.replace(`/?update=${new Date().getTime()}`); // Append a query to force reload
                }, 1500);
            } else {
                const errorData = await response.json();
                setAlert({ message: errorData.error || 'Failed to update links', type: 'error' });
            }
        } catch (error) {
            console.error('Error updating links:', error);
            setAlert({ message: 'An unexpected error occurred. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mt-0 mx-auto p-6 bg-gray-800 rounded-lg shadow-lg animate-fadeIn">
            <h2 className="text-3xl font-bold mb-6 text-white">Important Links</h2>
            {alert.message && (
                <div
                    className={`p-4 rounded mb-6 ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white animate-fadeIn`}
                >
                    {alert.message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4 text-gray-300">
                <LinkInput
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                    placeholder="Facebook URL"
                    IconComponent={FaFacebook}
                    focusRingColor="text-[#1877F2]"  // Facebook's brand color
                />

                <LinkInput
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    placeholder="Instagram URL"
                    IconComponent={FaInstagram}
                    focusRingColor="text-[#E4405F]"  // Instagram's brand color
                />

                <LinkInput
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="LinkedIn URL"
                    IconComponent={FaLinkedin}
                    focusRingColor="text-[#0077B5]"  // LinkedIn's brand color
                />

                <LinkInput
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    placeholder="Twitter URL"
                    IconComponent={FaTwitter}
                    focusRingColor="text-[#1DA1F2]"  // Twitter's brand color
                />

                <LinkInput
                    name="tiktok"
                    value={formData.tiktok}
                    onChange={handleChange}
                    placeholder="TikTok URL"
                    IconComponent={FaTiktok}
                    focusRingColor="text-[#69C9D0]"  // TikTok's brand color
                />

                <LinkInput
                    name="googleReview"
                    value={formData.googleReview}
                    onChange={handleChange}
                    placeholder="Google Review URL"
                    IconComponent={FaGoogle}
                    focusRingColor="text-[#4285F4]"  // Google's brand color
                />

                <LinkInput
                    name="revolut"
                    value={formData.revolut}
                    onChange={handleChange}
                    placeholder="Revolut URL"
                    IconComponent={FaCashRegister}
                    focusRingColor="text-[#0075EB]"  // Revolut's brand color
                />

                <LinkInput
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="Website URL"
                    IconComponent={AiOutlineGlobal}
                    focusRingColor="text-green-500"  // Website brand color (customizable)
                />
                <LinkInput
                    name="qrCode"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="QR Code URL"
                    IconComponent={AiOutlineQrcode}
                    focusRingColor="text-green-500"  // Website brand color (customizable)
                />


                <button
                    type="submit"
                    className={`w-full bg-blue-600 text-white p-3 rounded-lg mt-6 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 transition-transform transform hover:scale-105 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save'}
                </button>
            </form>
        </div>
    );
};

export default ImportantLinks;
