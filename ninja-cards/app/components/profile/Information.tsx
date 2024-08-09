"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const Information: React.FC = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        cardName: user?.name || '',
        company: user?.company || '',
        position: user?.position || '',
        phone1: user?.phone1 || '',
        phone2: user?.phone2 || '',
        email1: user?.email || '',
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

        const updateData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            name: formData.cardName,
            company: formData.company,
            position: formData.position,
            phone1: formData.phone1,
            phone2: formData.phone2,
            email: formData.email1,
            email2: formData.email2,
            website1: formData.website1,
            website2: formData.website2,
            street1: formData.street1,
            street2: formData.street2,
            zipCode: formData.zipCode,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            bio: formData.bio,
        };

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
        <div className="w-full max-w-3xl mx-auto p-3 bg-darkBg rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-gray-400">
                <div className="information border border-white rounded p-2">
                    <h3 className="text-lg font-bold  mb-2 text-white">Данни на картата</h3>

                    {/* Card Name */}
                    <div>
                        <label className="block text-sm mb-1">Име на картата *</label>
                        <input
                            type="text"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleChange}
                            placeholder="Dj Zdravko"
                            className="block w-full p-2 mb-2 border border-gray-600 rounded bg-darkesBg text-white"
                        />
                    </div>

                    {/* Name and Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Име</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Име"
                                className="block w-full p-2 border border-gray-600 rounded bg-darkesBg text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Фамилия</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Фамилия"
                                className="block w-full p-2 border border-gray-600 rounded bg-darkesBg text-white"
                            />
                        </div>
                    </div>

                    {/* Company and Position */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Фирма</label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="Фирма"
                                className="block w-full p-2 border border-gray-600 rounded bg-darkesBg text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Роля / Позиция</label>
                            <input
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                placeholder="Роля / Позиция"
                                className="block w-full p-2 border border-gray-600 rounded bg-darkesBg text-white"
                            />
                        </div>
                    </div>

                </div>

                <div className="contacts border border-white rounded p-2">
                    {/* Contacts */}
                    <h3 className="text-lg font-bold  mb-2 text-white">Контакти</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Телефон 1</label>
                            <input
                                type="text"
                                name="phone1"
                                value={formData.phone1}
                                onChange={handleChange}
                                placeholder="Телефон 1"
                                className="block w-full p-2 border border-gray-600 rounded bg-darkesBg text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Телефон 2</label>
                            <input
                                type="text"
                                name="phone2"
                                value={formData.phone2}
                                onChange={handleChange}
                                placeholder="Телефон 2"
                                className="block w-full p-2 border border-gray-600 rounded bg-darkesBg text-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Имейл 1</label>
                            <input
                                type="email"
                                name="email1"
                                value={formData.email1}
                                onChange={handleChange}
                                placeholder="Имейл 1"
                                className="block w-full p-2 border border-gray-600 rounded bg-darkesBg text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Имейл 2</label>
                            <input
                                type="email"
                                name="email2"
                                value={formData.email2}
                                onChange={handleChange}
                                placeholder="Имейл 2"
                                className="block w-full p-2 border border-gray-600 rounded bg-darkesBg text-white"
                            />
                        </div>
                    </div>

                    {/* Websites */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Сайт 1</label>
                            <input
                                type="url"
                                name="website1"
                                value={formData.website1}
                                onChange={handleChange}
                                placeholder="Сайт 1"
                                className="block w-full p-2 border border-gray-600 rounded bg-darkesBg text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Сайт 2</label>
                            <input
                                type="url"
                                name="website2"
                                value={formData.website2}
                                onChange={handleChange}
                                placeholder="Сайт 2"
                                className="block w-full p-2 border border-gray-600 rounded bg-darkesBg text-white"
                            />
                        </div>
                    </div>
                </div>

                <div className="address border border-white rounded p-2">
                    {/* Address */}
                    <h3 className="text-lg font-bold mb-2 text-white">Адрес / Локация</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Улица</label>
                            <input
                                type="text"
                                name="street1"
                                value={formData.street1}
                                onChange={handleChange}
                                placeholder="Улица"
                                className="block w-full p-2 border border-gray-600 rounded bg-darkesBg text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Улица 2</label>
                            <input
                                type="text"
                                name="street2"
                                value={formData.street2}
                                onChange={handleChange}
                                placeholder="Улица 2"
                                className="block w-full p-2 border border-gray-600 rounded bg-darkesBg text-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                        <div>
                            <label className="block text-sm mb-1">Пощенски код</label>
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                placeholder="Пощенски код"
                                className="block w-full p-2 border border-gray-600 rounded bg-darkesBg text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Град</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="Град"
                                className="block w-full p-2 border border-gray-600 rounded bg-darkesBg text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Област</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="Област"
                                className="block w-full p-2 border border-gray-600 rounded bg-darkesBg text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Държава</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="Държава"
                                className="block w-full p-2 border border-gray-600 rounded bg-darkesBg text-white"
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm mb-1">Повече информация за Вас / Описание</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Повече информация за Вас / Описание"
                            className="block w-full p-2 border border-gray-600 rounded bg-darkesBg text-white"
                        ></textarea>
                    </div>
                </div>


                <button className="bg-teil text-white px-6 py-4 rounded mt-4 hover:bg-orange transition-colors">
                    Запази
                </button>
            </form>
        </div>
    );
};

export default Information;
