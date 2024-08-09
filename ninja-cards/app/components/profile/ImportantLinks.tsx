"use client";

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const ImportantLinks: React.FC = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        facebook: user?.facebook || '',
        instagram: user?.instagram || '',
        linkedin: user?.linkedin || '',
        twitter: user?.twitter || '',
        website: '',//user?.website || '',
        qrCode:'', //user?.qrCode || '',
        photo: null
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setFormData({ ...formData, [name]: files[0] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Handle file upload logic if necessary
        const response = await fetch('/api/user/updateLinks', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: user?.id, ...formData }),
        });

        if (response.ok) {
            const updatedUser = await response.json();
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            alert('Links updated successfully');
        } else {
            alert('Failed to update links');
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto p-6 bg-gray-800 rounded-lg shadow-lg animate-fadeIn">
            <h2 className="text-3xl font-bold mb-6 text-white">Important Links</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-gray-300">
                <div className="flex items-center mb-4">
                    <img src="/icons/facebook.svg" alt="Facebook" className="w-6 h-6 mr-2" />
                    <input
                        type="url"
                        name="facebook"
                        value={formData.facebook}
                        onChange={handleChange}
                        placeholder="Facebook URL"
                        className="block w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex items-center mb-4">
                    <img src="/icons/instagram.svg" alt="Instagram" className="w-6 h-6 mr-2" />
                    <input
                        type="url"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleChange}
                        placeholder="Instagram URL"
                        className="block w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                </div>

                <div className="flex items-center mb-4">
                    <img src="/icons/linkedin.svg" alt="LinkedIn" className="w-6 h-6 mr-2" />
                    <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        placeholder="LinkedIn URL"
                        className="block w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-700"
                    />
                </div>

                <div className="flex items-center mb-4">
                    <img src="/icons/twitter.svg" alt="Twitter" className="w-6 h-6 mr-2" />
                    <input
                        type="url"
                        name="twitter"
                        value={formData.twitter}
                        onChange={handleChange}
                        placeholder="Twitter URL"
                        className="block w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div className="flex items-center mb-4">
                    <img src="/icons/website.svg" alt="Website" className="w-6 h-6 mr-2" />
                    <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="Website URL"
                        className="block w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

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

                <div className="mb-4">
                    <label className="block text-sm mb-2 text-white">Photo</label>
                    <input
                        type="file"
                        name="photo"
                        onChange={handleFileChange}
                        className="block w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-3 rounded-lg mt-6 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 transition-transform transform hover:scale-105"
                >
                    Save
                </button>
            </form>
        </div>
    );
};

export default ImportantLinks;
