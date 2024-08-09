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
            password: formData.password,
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
        <div className="w-full max-w-3xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg animate-fadeIn">
            <h2 className="text-4xl font-extrabold mb-6 text-white">Profile Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6 text-gray-300">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm mb-1">Име на картата</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Име *"
                        className="block w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm mb-1">Промени имейл</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Имейл *"
                        className="block w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm mb-1">Смени парола</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Нова парола *"
                        className="block w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-sm mb-1">Повтори паролата *</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Повтори паролата *"
                        className="block w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className={`w-full p-3 rounded-lg transform transition-transform duration-300 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500'}`}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Запази'}
                </button>
            </form>
            {alert && (
                <div className={`mt-4 p-4 rounded ${alert.color === 'green' ? 'bg-green-500' : 'bg-orange-500'} text-white animate-fadeIn`}>
                    <strong>{alert.title}: </strong> {alert.message}
                </div>
            )}
        </div>
    );
};

export default Settings;
