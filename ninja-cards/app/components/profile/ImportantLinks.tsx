"use client";

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

type LinkInputProps = {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    imgSrc: string;
    imgAlt: string;
    focusRingColor: string;
};

const LinkInput: React.FC<LinkInputProps> = ({ name, value, onChange, placeholder, imgSrc, imgAlt, focusRingColor }) => {
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        const prevSibling = e.target.previousElementSibling as HTMLElement;
        if (prevSibling) {
            prevSibling.classList.remove('grayscale');
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const prevSibling = e.target.previousElementSibling as HTMLElement;
        if (prevSibling) {
            prevSibling.classList.add('grayscale');
        }
    };

    return (
        <div className="flex items-center mb-4">
            <img src={imgSrc} alt={imgAlt} className="w-7 h-7 mr-2 filter grayscale transition-all duration-300" />
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setAlert({ message: '', type: null });

        const formDataObj = new FormData();
        formDataObj.append('id', user?.id || '');

        // Append all form data fields to the FormData object
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
                setUser(updatedUser);
                setAlert({ message: 'Links updated successfully', type: 'success' });
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
                    imgSrc="/logos/fb.png"
                    imgAlt="Facebook"
                    focusRingColor="focus:ring-[#1877F2]"  // Facebook's brand color
                />

                <LinkInput
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    placeholder="Instagram URL"
                    imgSrc="/logos/ig.png"
                    imgAlt="Instagram"
                    focusRingColor="focus:ring-[#E4405F]"  // Instagram's brand color
                />

                <LinkInput
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="LinkedIn URL"
                    imgSrc="/logos/lkd.png"
                    imgAlt="LinkedIn"
                    focusRingColor="focus:ring-[#0077B5]"  // LinkedIn's brand color
                />

                <LinkInput
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    placeholder="Twitter URL"
                    imgSrc="/logos/x.png"
                    imgAlt="X"
                    focusRingColor="focus:ring-[#1DA1F2]"  // Twitter's brand color
                />

                <LinkInput
                    name="tiktok"
                    value={formData.tiktok}
                    onChange={handleChange}
                    placeholder="TikTok URL"
                    imgSrc="/logos/tiktok.svg"
                    imgAlt="TikTok"
                    focusRingColor="focus:ring-[#69C9D0]"  // TikTok's brand color
                />

                <LinkInput
                    name="googleReview"
                    value={formData.googleReview}
                    onChange={handleChange}
                    placeholder="Google Review URL"
                    imgSrc="/logos/googleReview.svg"
                    imgAlt="Google Review"
                    focusRingColor="focus:ring-[#4285F4]"  // Google's brand color
                />

                <LinkInput
                    name="revolut"
                    value={formData.revolut}
                    onChange={handleChange}
                    placeholder="Revolut URL"
                    imgSrc="/logos/revolut.png"
                    imgAlt="Revolut"
                    focusRingColor="focus:ring-[#0075EB]"  // Revolut's brand color
                />

                <LinkInput
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="Website URL"
                    imgSrc="/logos/tinder.png"
                    imgAlt="Website"
                    focusRingColor="focus:ring-green-500"  // You may adjust this color based on the specific website
                />

                <div className="mb-4">
                    <label className="block text-sm mb-2 text-white">QR Code</label>
                    <input
                        type="text"
                        name="qrCode"
                        value={formData.qrCode}
                        onChange={handleChange}
                        placeholder="QR Code URL"
                        className="block w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

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
