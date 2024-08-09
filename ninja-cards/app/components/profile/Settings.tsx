"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface Alert {
    message: string;
    title: string;
    color: string;
}

const Settings: React.FC = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<Alert | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: '',
                confirmPassword: ''
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!user) {
            showAlert('User not authenticated', 'Error', 'orange');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            showAlert('Passwords do not match', 'Error', 'orange');
            setLoading(false);
            return;
        }

        const updateData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,  // Only include password if it has been changed
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
                showAlert('Failed to update profile', 'Error', 'orange');
                return;
            }

            const updatedUser = await response.json();
            localStorage.setItem('user', JSON.stringify(updatedUser));
            showAlert('Profile updated successfully', 'Success', 'green');
            setTimeout(() => {
                router.push('/');
            }, 1000);
        } catch (error) {
            console.error('Error:', error);
            showAlert('Failed to update profile', 'Error', 'orange');
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (message: string, title: string, color: string) => {
        setAlert({ message, title, color });
        setTimeout(() => {
            setAlert(null);
        }, 4000);
    };

    return (
        <div className="flex items-center px-8 py-5 mb-0 rounded shadow-md justify-center min-h-screen text-black bg-gray-100 ">

            <div className="w-full p-0 max-w-lg mt-0 mb-28">
                <h2 className="text-2xl mt-0 font-bold mb-6 text-center">Profile Details</h2>
                <form className="text-lg" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700">Добавете или сменете името в профила</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Име *"
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700">Промени имейл</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Имейл *"
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700">Смени парола</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Нова парола *"
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-gray-700">Повтори паролата *</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Повтори паролата *"
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full p-2 rounded transform transition-transform duration-300 ${loading ? 'bg-gray-400' : 'bg-teil hover:bg-orange hover:scale-105'}`}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Запази'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Settings;
