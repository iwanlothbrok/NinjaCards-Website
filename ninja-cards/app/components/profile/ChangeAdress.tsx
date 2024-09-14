"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { BASE_API_URL } from '@/utils/constants';

// Validation schema using Yup (no fields are required)
const schema = yup.object().shape({
    street1: yup.string(),
    street2: yup.string(),
    zipCode: yup.string(),
    city: yup.string(),
    state: yup.string(),
    country: yup.string(),
});

interface FormData {
    street1?: string;
    street2?: string;
    zipCode?: string;
    city?: string;
    state?: string;
    country?: string;
}

interface Alert {
    message: string;
    title: string;
    color: string;
}

const ChangeAddress: React.FC = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<Alert | null>(null);
    const router = useRouter();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (user) {
            setValue('street1', user?.street1 || '');
            setValue('street2', user?.street2 || '');
            setValue('zipCode', user?.zipCode || '');
            setValue('city', user?.city || '');
            setValue('state', user?.state || '');
            setValue('country', user?.country || '');
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
        updateData.append('street1', data.street1 || '');
        updateData.append('street2', data.street2 || '');
        updateData.append('zipCode', data.zipCode || '');
        updateData.append('city', data.city || '');
        updateData.append('state', data.state || '');
        updateData.append('country', data.country || '');

        try {
            const response = await fetch(`${BASE_API_URL}/api/profile/changeAddress`, {
                method: 'PUT',
                body: updateData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Грешка при актуализацията:', errorText);
                showAlert('Неуспешно актуализиране на профила', 'Грешка', 'red');
                return;
            }

            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;

            const updatedUser = await response.json();
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            showAlert('Адресът е успешно актуализиран', 'Успех', 'green');
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
            <h2 className="text-3xl font-extrabold mb-6 text-center text-white">Промяна на адрес</h2>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">Улица 1</label>
                                <input
                                    type="text"
                                    {...register('street1')}
                                    placeholder="Улица 1"
                                    className="block w-full p-3 md:p-4 text-lg border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">Улица 2</label>
                                <input
                                    type="text"
                                    {...register('street2')}
                                    placeholder="Улица 2"
                                    className="block w-full p-3 md:p-4 text-lg border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">Пощенски код</label>
                                <input
                                    type="text"
                                    {...register('zipCode')}
                                    placeholder="Пощенски код"
                                    className="block w-full p-3 md:p-4 text-lg border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">Град</label>
                                <input
                                    type="text"
                                    {...register('city')}
                                    placeholder="Град"
                                    className="block w-full p-3 md:p-4 text-lg border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">Област</label>
                                <input
                                    type="text"
                                    {...register('state')}
                                    placeholder="Област"
                                    className="block w-full p-3 md:p-4 text-lg border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium mb-2 text-gray-300">Държава</label>
                            <input
                                type="text"
                                {...register('country')}
                                placeholder="Държава"
                                className="block w-full p-3 md:p-4 text-lg border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                            />
                        </div>
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
};

export default ChangeAddress;
