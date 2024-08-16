"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

interface FormData {
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
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<Alert | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            setFormData({
                // name: user.name || '',
                email: user.email || '',
                password: '',
                confirmPassword: '',
                // image: null
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
            showAlert('User not authenticated', 'Warning', 'red');
            setLoading(false);
            return;
        }
        if (!formData.email || !formData.password) {
            showAlert('Попълнете всички полета', 'Warning', 'red');
            setLoading(false);
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            showAlert('Passwords do not match', 'Warning', 'red');
            setLoading(false);
            return;
        }

        const updateData = new FormData();
        updateData.append('id', user?.id);
        updateData.append('email', formData.email);
        updateData.append('password', formData.password);


        try {
            const response = await fetch('/api/profile/changePasswordAndEmail', {
                method: 'PUT',
                body: updateData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Update error:', errorText);
                showAlert('Failed to update profile', 'Error', 'red');
                return;
            }

            const updatedUser = await response.json();
            localStorage.setItem('user', JSON.stringify(updatedUser));
            showAlert('Profile updated successfully', 'Success', 'green');

            setTimeout(() => {
                router.replace(`/?update=${new Date().getTime()}`); // Append a query to force reload
            }, 1500);

        } catch (error) {
            console.error('Error:', error);
            showAlert('Failed to update profile', 'Error', 'red');
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
            {alert && (
                <div className={`my-2 p-4 rounded ${alert.color === 'green' ? 'bg-green-500' : 'bg-red-500'} text-white animate-fadeIn`}>
                    <strong>{alert.title}: </strong> {alert.message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6 text-gray-300">

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


                {/* <div className="mb-4">
                    <label className="block text-sm mb-2 text-white">Photo</label>
                    <input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                        className="block w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div> */}

                <button
                    type="submit"
                    className={`w-full p-3 rounded-lg transform transition-transform duration-300 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500'}`}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Запази'}
                </button>
            </form>

        </div>
    );
};

export default Settings;
