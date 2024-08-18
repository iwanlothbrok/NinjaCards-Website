"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schema using Yup
const schema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), ''], 'Passwords must match')
        .required('Confirm Password is required'),
});

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
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<Alert | null>(null);
    const router = useRouter();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (user) {
            setValue('email', user.email || '');
            setValue('password', '');
            setValue('confirmPassword', '');
        }
    }, [user, setValue]);

    const onSubmit = async (data: FormData) => {
        setLoading(true);

        if (!user) {
            showAlert('User not authenticated', 'Warning', 'red');
            setLoading(false);
            return;
        }

        const updateData = new FormData();
        updateData.append('id', user?.id);
        updateData.append('email', data.email);
        updateData.append('password', data.password);

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
            setUser(updatedUser);
            showAlert('Profile updated successfully', 'Success', 'green');

            setTimeout(() => {
                router.push('/');
            }, 2000);

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
        <div className="w-full max-w-4xl mx-auto mt-10 p-8 bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800 rounded-xl shadow-2xl">
            <h2 className="text-4xl font-extrabold mb-6 text-center text-white">Profile Settings</h2>
            {alert && (
                <div className={`p-4 rounded-lg mb-6 text-white transition-all duration-300 ${alert.color === 'green' ? 'bg-green-500' : 'bg-red-500'} animate-fadeIn`}>
                    <strong>{alert.title}:</strong> {alert.message}
                </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="relative">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                        Change Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="Enter your new email"
                        className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                    />
                    {errors.email && (
                        <div className="text-red-500 mt-2">{errors.email.message}</div>
                    )}
                </div>
                <div className="relative">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                        Change Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        {...register('password')}
                        placeholder="Enter new password"
                        className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                    />
                    {errors.password && (
                        <div className="text-red-500 mt-2">{errors.password.message}</div>
                    )}
                </div>
                <div className="relative">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        {...register('confirmPassword')}
                        placeholder="Confirm new password"
                        className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                    />
                    {errors.confirmPassword && (
                        <div className="text-red-500 mt-2">{errors.confirmPassword.message}</div>
                    )}
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

export default Settings;
