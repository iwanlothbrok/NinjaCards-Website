"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

interface Alert {
    message: string;
    title: string;
    color: string;
}

const Information: React.FC = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<Alert | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        name: user?.name || '',
        company: user?.company || '',
        position: user?.position || '',
        phone1: user?.phone1 || '',
        phone2: user?.phone2 || '',
        email: user?.email || '',
        email2: user?.email2 || '',
        street1: user?.street1 || '',
        street2: user?.street2 || '',
        zipCode: user?.zipCode || '',
        city: user?.city || '',
        state: user?.state || '',
        country: user?.country || '',
        bio: user?.bio || '',
        image: null as File | null,
    });

    const alertRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    }, []);

    const showAlert = useCallback((message: string, title: string, color: string) => {
        setAlert({ message, title, color });
        setTimeout(() => {
            setAlert(null);
        }, 4000);
        if (alertRef.current) {
            alertRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 700 * 1024) {
                setImageError('Image size exceeds the 700 KB limit');
                setFormData((prevData) => ({ ...prevData, image: null }));
                return;
            }
            setImageError(null);
            setFormData((prevData) => ({ ...prevData, image: file }));
        }
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        window.scrollTo({ top: 0, behavior: 'smooth' });


        if (!user) {
            showAlert('User not authenticated', 'Error', 'red');
            return;
        }

        if (formData.image && formData.image.size > 700 * 1024) {
            setImageError('Image size exceeds the 700 KB limit');
            return;
        }

        const updateData = new FormData();
        updateData.append('id', user.id);

        Object.keys(formData).forEach((key) => {
            const value = formData[key as keyof typeof formData];
            if (value !== null) {
                updateData.append(key, value);
            }
        });

        if (formData.image) {
            updateData.append('image', formData.image);
        }

        try {
            const response = await fetch('/api/profile/updateInformation', {
                method: 'PUT',
                body: updateData,
            });

            if (!response.ok) {
                const errorText = await response.json();
                showAlert(errorText.error || 'Failed to update information', 'Error', 'red');
                return;
            }

            const updatedUser = await response.json();
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setUser(updatedUser);
            showAlert('Profile updated successfully', 'Success', 'green');
            setTimeout(() => {
                router.push('/');
            }, 2000);

        } catch (error) {
            console.error('Error:', error);
            showAlert('Failed to update information', 'Error', 'red');
        }
    }, [formData, router, setUser, showAlert, user]);

    return (
        <div className="w-full max-w-4xl mx-auto mt-10 p-8 bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800 rounded-xl shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-white">Update Information</h2>
            {alert && (
                <div ref={alertRef} className={`p-4 rounded-lg text-white animate-fadeIn transition-all duration-300 ${alert.color === 'green' ? 'bg-green-500' : 'bg-red-500'} mb-6`}>
                    <strong>{alert.title}: </strong> {alert.message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="border border-gray-700 rounded-lg p-4 md:p-6 mb-6">
                    <h3 className="text-2xl font-semibold mb-4 text-white">Personal Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                                className="block w-full p-3 md:p-4 text-lg border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last Name"
                                className="block w-full p-3 md:p-4 text-lg border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                            />
                        </div>
                    </div>
                    <div className="mt-6">
                        <label className="block text-sm font-medium mb-2 text-gray-300">Card Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter Card Name"
                            className="block w-full p-3 md:p-4 text-lg border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Contact Information */}
                <div className="border border-gray-700 rounded-lg p-4 md:p-6 mb-6">
                    <h3 className="text-2xl font-semibold mb-4 text-white">Contact Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Phone 1</label>
                            <input
                                type="text"
                                name="phone1"
                                value={formData.phone1}
                                onChange={handleChange}
                                placeholder="Phone 1"
                                className="block w-full p-3 md:p-4 text-lg border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Phone 2</label>
                            <input
                                type="text"
                                name="phone2"
                                value={formData.phone2}
                                onChange={handleChange}
                                placeholder="Phone 2"
                                className="block w-full p-3 md:p-4 text-lg border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Email 1</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email 1"
                                className="block w-full p-3 md:p-4 text-lg border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Email 2</label>
                            <input
                                type="email"
                                name="email2"
                                value={formData.email2}
                                onChange={handleChange}
                                placeholder="Email 2"
                                className="block w-full p-3 md:p-4 text-lg border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Address Information */}
                <div className="border border-gray-700 rounded-lg p-4 md:p-6 mb-6">
                    <h3 className="text-2xl font-semibold mb-4 text-white">Address Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Street 1</label>
                            <input
                                type="text"
                                name="street1"
                                value={formData.street1}
                                onChange={handleChange}
                                placeholder="Street 1"
                                className="block w-full p-3 md:p-4 text-lg border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Street 2</label>
                            <input
                                type="text"
                                name="street2"
                                value={formData.street2}
                                onChange={handleChange}
                                placeholder="Street 2"
                                className="block w-full p-3 md:p-4 text-lg border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Zip Code</label>
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                placeholder="Zip Code"
                                className="block w-full p-3 md:p-4 text-lg border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="City"
                                className="block w-full p-3 md:p-4 text-lg border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">State</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="State"
                                className="block w-full p-3 md:p-4 text-lg border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium mb-2 text-gray-300">Country</label>
                        <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="Country"
                            className="block w-full p-3 md:p-4 text-lg border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Bio and Profile Image */}
                <div className="border border-gray-700 rounded-lg p-4 md:p-6 mb-6">
                    <h3 className="text-2xl font-semibold mb-4 text-white">Bio and Profile Image</h3>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2 text-gray-300">Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell us more about yourself"
                            className="block w-full p-3 md:p-4 text-lg border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                        ></textarea>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                            Profile Image
                        </label>
                        {imageError && (
                            <div className="text-red-500 mb-2">
                                {imageError}
                            </div>
                        )}
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full px-4 py-3 text-sm md:text-base border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 ease-in-out"
                        />
                    </div>

                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-teal-600 to-orange text-white py-3 md:py-4 rounded-lg hover:from-teal-600 hover:to-orange hover:opacity-70 focus:outline-none focus:ring-4 focus:ring-teal-400 transition-transform transform hover:scale-105"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save'}
                </button>
            </form>
        </div>
    );
};

export default Information;
