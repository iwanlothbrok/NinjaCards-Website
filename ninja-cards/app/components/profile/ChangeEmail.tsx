"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schema using Yup
const schema = yup.object().shape({
    email: yup.string().email('Невалиден формат на имейл').required('Имейлът е задължителен'),
    workEmail: yup.string().email('Невалиден формат на имейл').nullable().notRequired(),
});

interface FormData {
    email: string;
    workEmail?: string | null;
}

interface Alert {
    message: string;
    title: string;
    color: string;
}

export default function ChangeEmail() {
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
            setValue('workEmail', user.email2 || '');
        }
    }, [user, setValue]);

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        if (!user) {
            showAlert('Потребителят не е удостоверен', 'Предупреждение', 'red');
            setLoading(false);
            return;
        }

        const updateData = new FormData();
        updateData.append('id', user?.id);
        if (data.email === user.email && data.workEmail === user.email2) {
            showAlert('Трябва да въведете нови стойности', 'Предупреждение', 'red');
            setLoading(false);
            return;
        }

        updateData.append('email', data.email);
        if (data.workEmail) {
            updateData.append('workEmail', data.workEmail);
        }

        try {
            const response = await fetch('/api/profile/changeEmail', {
                method: 'PUT',
                body: updateData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Грешка при актуализацията:', errorText);
                showAlert('Неуспешно актуализиране на профила', 'Грешка', 'red');
                return;
            }

            const updatedUser = await response.json();
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            showAlert('Профилът е успешно актуализиран', 'Успех', 'green');

        } catch (error) {
            console.error('Грешка:', error);
            showAlert('Неуспешно актуализиране на профила', 'Грешка', 'red');
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
        <div className="w-full max-w-4xl mx-auto mt-10 p-8 bg-gradient-to-b from-black via-gray-950 to-gray-950 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-extrabold mb-6 text-center text-white">Смяна на имейл</h2>
            {alert && (
                <div className={`p-4 rounded-lg mb-6 text-white transition-all duration-300 ${alert.color === 'green' ? 'bg-green-500' : 'bg-red-500'} animate-fadeIn`}>
                    <strong>{alert.title}:</strong> {alert.message}
                </div>
            )}
            {loading ? (
                <div className="flex justify-center items-center py-72">
                    <img src="/load.gif" alt="Зареждане..." className="w-40 h-40" />
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="relative">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                            Нов имейл
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register('email')}
                            placeholder="Въведете новия си имейл"
                            className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                        />
                        {errors.email && (
                            <div className="text-red-500 mt-2">{errors.email.message}</div>
                        )}
                    </div>
                    <div className="relative">
                        <label htmlFor="workEmail" className="block text-sm font-medium text-gray-300 mb-1">
                            Нов служебен имейл (по избор)
                        </label>
                        <input
                            id="workEmail"
                            type="email"
                            {...register('workEmail')}
                            placeholder="Въведете новия си служебен имейл"
                            className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                        />
                        {errors.workEmail && (
                            <div className="text-red-500 mt-2">{errors.workEmail.message}</div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-teal-600 to-orange text-white py-3 md:py-4 rounded-lg hover:from-teal-600 hover:to-orange hover:opacity-70 focus:outline-none focus:ring-4 focus:ring-teal-400 transition-transform transform hover:scale-105"
                        disabled={loading}
                    >
                        {loading ? 'Запазване...' : 'Запази'}
                    </button>
                </form>
            )}
        </div>
    );
}