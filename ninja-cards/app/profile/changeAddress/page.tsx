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

            // if (!response.ok) {
            //     const errorText = await response.text();
            //     console.error('Грешка при актуализацията:', errorText);
            //     showAlert('Неуспешно актуализиране на профила', 'Грешка', 'red');
            //     return;
            // }


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
        <div className='p-4'>

            <div className="w-full max-w-3xl mx-auto mt-28 p-10 bg-gradient-to-b from-gray-900 to-gray-800 
            rounded-2xl shadow-xl border border-gray-700 sm:mx-6 md:mx-10 lg:mx-auto">

                <h2 className="text-4xl font-bold text-center text-white mb-6 tracking-wide">
                    🏡 Промяна на адрес
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Улица 1</label>
                                <input
                                    type="text"
                                    {...register('street1')}
                                    placeholder="Въведете улица 1"
                                    className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white 
                                focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Улица 2</label>
                                <input
                                    type="text"
                                    {...register('street2')}
                                    placeholder="Въведете улица 2"
                                    className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white 
                                focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-400"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Пощенски код</label>
                                <input
                                    type="text"
                                    {...register('zipCode')}
                                    placeholder="Въведете пощенски код"
                                    className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white 
                                focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Град</label>
                                <input
                                    type="text"
                                    {...register('city')}
                                    placeholder="Въведете град"
                                    className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white 
                                focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Област</label>
                                <input
                                    type="text"
                                    {...register('state')}
                                    placeholder="Въведете област"
                                    className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white 
                                focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-400"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Държава</label>
                            <input
                                type="text"
                                {...register('country')}
                                placeholder="Въведете държава"
                                className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white 
                            focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-400"
                            />
                        </div>

                        <div className="flex justify-between items-center mt-6">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="bg-blue-700 text-white py-3 md:py-4 px-6 rounded-lg hover:bg-blue-600 
                            focus:outline-none focus:ring-4 focus:ring-gray-400 transition-transform transform hover:scale-105"
                            >
                                Назад
                            </button>
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-teal-600 to-orange text-white py-3 md:py-4 px-6 rounded-lg 
                            hover:opacity-80 focus:outline-none focus:ring-4 focus:ring-teal-400 transition-transform 
                            transform hover:scale-105 shadow-lg tracking-wide"
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


};

export default ChangeAddress;
