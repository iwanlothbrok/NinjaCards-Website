"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { BASE_API_URL } from '@/utils/constants';

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
            const response = await fetch(`${BASE_API_URL}/api/profile/changeEmail`, {
                method: 'PUT',
                body: updateData,
            });


            const result = await response.json().catch(() => null); // fallback if not JSON

            if (!response.ok) {
                const errorMessage =
                    result?.error || 'Неуспешно актуализиране на профила';
                const errorDetails = result?.details;

                console.error('Грешка при актуализацията:', errorMessage, errorDetails);
                showAlert(errorMessage, 'Грешка', 'red');
                return;
            }

            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;

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
        <div className='p-4'>

            <div className="w-full max-w-3xl mx-auto mt-36 p-10 bg-gradient-to-b from-gray-900 to-gray-800 
        rounded-2xl shadow-xl border border-gray-700 sm:mx-6 md:mx-10 lg:mx-auto">


                <h2 className="text-4xl font-bold text-center text-white mb-6 tracking-wide">
                    ✉️ Смяна на имейл
                </h2>

                {/* Alert Message */}
                {alert && (
                    <div className={`p-4 rounded-lg mb-6 text-white text-center font-medium transition-all duration-300 
                    ${alert.color === 'green' ? 'bg-green-500' : 'bg-red-500'} animate-fadeIn`}>
                        <strong>{alert.title}:</strong> {alert.message}
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-40">
                        <img src="/load.gif" alt="Зареждане..." className="w-24 h-24 animate-spin" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fadeIn">
                        {/* Email Field */}
                        <div className="relative">
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                                Нов имейл
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...register('email', { required: "Имейлът е задължителен" })}
                                placeholder="Въведете новия си имейл"
                                className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none 
                            focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-400"
                            />
                            {errors.email && <p className="text-red-500 mt-2 text-sm">{errors.email.message}</p>}
                        </div>

                        {/* Work Email Field */}
                        <div className="relative">
                            <label htmlFor="workEmail" className="block text-sm font-semibold text-gray-300 mb-2">
                                Нов служебен имейл (по избор)
                            </label>
                            <input
                                id="workEmail"
                                type="email"
                                {...register('workEmail')}
                                placeholder="Въведете новия си служебен имейл"
                                className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none 
                            focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-400"
                            />
                            {errors.workEmail && <p className="text-red-500 mt-2 text-sm">{errors.workEmail.message}</p>}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-between items-center mt-6">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="bg-blue-700 text-white py-3 md:py-4 px-6 rounded-lg hover:bg-blue-600 focus:outline-none 
                            focus:ring-4 focus:ring-gray-400 transition-transform transform hover:scale-105"
                            >
                                Назад
                            </button>
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-teal-600 to-orange text-white py-3 md:py-4 px-6 rounded-lg 
                            hover:from-teal-600 hover:to-orange hover:opacity-80 focus:outline-none focus:ring-4 focus:ring-teal-400 
                            transition-transform transform hover:scale-105 shadow-lg tracking-wide"
                                disabled={loading}
                            >
                                {loading ? "Запазване..." : "Запази"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );

}
