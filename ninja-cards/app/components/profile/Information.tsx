"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const Information: React.FC = () => {
    const { user, setUser } = useAuth();
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
        website1: user?.website1 || '',
        website2: user?.website2 || '',
        street1: user?.street1 || '',
        street2: user?.street2 || '',
        zipCode: user?.zipCode || '',
        city: user?.city || '',
        state: user?.state || '',
        country: user?.country || '',
        bio: user?.bio || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            alert('User not authenticated');
            return;
        }

        const updateData = { ...formData };

        try {
            const response = await fetch('/api/profile/updateProfile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: user?.id, ...updateData }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Update error:', errorText);
                alert('Failed to update information');
                return;
            }

            const updatedUser = await response.json();
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            alert('Information updated successfully');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to update information');
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg animate-fadeIn">
            <h2 className="text-3xl font-bold mb-6 text-white">Information</h2>
            <form onSubmit={handleSubmit} className="space-y-6 text-gray-300">
                <div className="information border border-gray-700 rounded p-4 mb-4">
                    <h3 className="text-lg font-bold mb-4 text-white">Card Information</h3>

                    <div>
                        <label className="block text-sm mb-2">Card Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter Card Name"
                            className="block w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        />
                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm mb-2">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                                className="block w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-2">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last Name"
                                className="block w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm mb-2">Company</label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="Company"
                                className="block w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-2">Position</label>
                            <input
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                placeholder="Position"
                                className="block w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                <div className="contacts border border-gray-700 rounded p-4 mb-4">
                    <h3 className="text-lg font-bold mb-4 text-white">Contact Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-2">Phone 1</label>
                            <input
                                type="text"
                                name="phone1"
                                value={formData.phone1}
                                onChange={handleChange}
                                placeholder="Phone 1"
                                className="block w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-2">Phone 2</label>
                            <input
                                type="text"
                                name="phone2"
                                value={formData.phone2}
                                onChange={handleChange}
                                placeholder="Phone 2"
                                className="block w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm mb-2">Email 1</label>
                            <input
                                type="email"
                                name="email1"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email 1"
                                className="block w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-2">Email 2</label>
                            <input
                                type="email"
                                name="email2"
                                value={formData.email2}
                                onChange={handleChange}
                                placeholder="Email 2"
                                className="block w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm mb-2">Website 1</label>
                            <input
                                type="url"
                                name="website1"
                                value={formData.website1}
                                onChange={handleChange}
                                placeholder="Website 1"
                                className="block w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-2">Website 2</label>
                            <input
                                type="url"
                                name="website2"
                                value={formData.website2}
                                onChange={handleChange}
                                placeholder="Website 2"
                                className="block w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                <div className="address border border-gray-700 rounded p-4 mb-4">
                    <h3 className="text-lg font-bold mb-4 text-white">Address</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-2">Street 1</label>
                            <input
                                type="text"
                                name="street1"
                                value={formData.street1}
                                onChange={handleChange}
                                placeholder="Street 1"
                                className="block w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-2">Street 2</label>
                            <input
                                type="text"
                                name="street2"
                                value={formData.street2}
                                onChange={handleChange}
                                placeholder="Street 2"
                                className="block w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                        <div>
                            <label className="block text-sm mb-2">Zip Code</label>
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                placeholder="Zip Code"
                                className="block w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-2">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="City"
                                className="block w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-2">State</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="State"
                                className="block w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm mb-2">Country</label>
                        <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="Country"
                            className="block w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="bio border border-gray-700 rounded p-4">
                    <h3 className="text-lg font-bold mb-4 text-white">Bio</h3>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell us more about yourself"
                        className="block w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    ></textarea>
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

export default Information;
