'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { BASE_API_URL } from '@/utils/constants';

// Валидираща схема с помощта на Yup (без задължителни полета)
const schema = yup.object().shape({
    firstName: yup.string(),
    lastName: yup.string(),
    name: yup.string(),
    company: yup.string(),
    position: yup.string(),
    phone1: yup.string(),
    phone2: yup.string(),
    email: yup.string().email('Невалиден имейл формат'),
    email2: yup.string().email('Невалиден имейл формат'),
    street1: yup.string(),
    street2: yup.string(),
    zipCode: yup.string(),
    city: yup.string(),
    state: yup.string(),
    country: yup.string(),
    bio: yup.string(),
});

interface FormData {
    firstName?: string;
    lastName?: string;
    name?: string;
    company?: string;
    position?: string;
    phone1?: string;
    phone2?: string;
    street1?: string;
    street2?: string;
    zipCode?: string;
    city?: string;
    state?: string;
    country?: string;
    bio?: string;
}

interface Alert {
    message: string;
    title: string;
    color: string;
}

const ChangeProfileInformation: React.FC = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<Alert | null>(null);
    const router = useRouter();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (user) {
            setValue('firstName', user?.firstName || '');
            setValue('lastName', user?.lastName || '');
            setValue('name', user?.name || '');
            setValue('company', user?.company || '');
            setValue('position', user?.position || '');
            setValue('phone1', user?.phone1 || '');
            setValue('phone2', user?.phone2 || '');
            setValue('street1', user?.street1 || '');
            setValue('street2', user?.street2 || '');
            setValue('zipCode', user?.zipCode || '');
            setValue('city', user?.city || '');
            setValue('state', user?.state || '');
            setValue('country', user?.country || '');
            setValue('bio', user?.bio || '');
        }
    }, [user, setValue]);

    const onSubmit = async (data: FormData) => {
        setLoading(true);



        if (!user) {
            showAlert('Потребителят не е удостоверен', 'Грешка', 'red');
            setLoading(false);
            return;
        }

        const updateData = new FormData();
        updateData.append('id', user?.id);
        Object.keys(data).forEach((key) => {
            const value = data[key as keyof typeof data];
            if (value !== undefined) {
                updateData.append(key, value);
            }
        });

        try {
            const response = await fetch(`${BASE_API_URL}/api/profile/updateInformation`, {
                method: 'PUT',
                body: updateData,
            });

            if (!response.ok) {
                const errorText = await response.json();
                showAlert(errorText.error || 'Неуспешна актуализация на информацията', 'Грешка', 'red');
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
            showAlert('Неуспешна актуализация на информацията', 'Грешка', 'red');
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
                    📝 Актуализиране на информацията
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
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Име</label>
                                <input
                                    type="text"
                                    {...register('firstName')}
                                    placeholder="Въведете име"
                                    className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white 
                                focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-400"
                                />
                                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Фамилия</label>
                                <input
                                    type="text"
                                    {...register('lastName')}
                                    placeholder="Въведете фамилия"
                                    className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white 
                                focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-400"
                                />
                                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Име на визитка *</label>
                            <input
                                type="text"
                                {...register('name')}
                                placeholder="Въведете име на визитка"
                                className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white 
                            focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-400"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Компания</label>
                                <input
                                    type="text"
                                    {...register('company')}
                                    placeholder="Въведете компания"
                                    className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white 
                                focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-400"
                                />
                                {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Позиция</label>
                                <input
                                    type="text"
                                    {...register('position')}
                                    placeholder="Въведете позиция"
                                    className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white 
                                focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-400"
                                />
                                {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Телефон 1</label>
                                <input
                                    type="text"
                                    {...register('phone1')}
                                    placeholder="Въведете телефон 1"
                                    className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white 
                                focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-400"
                                />
                                {errors.phone1 && <p className="text-red-500 text-sm mt-1">{errors.phone1.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Телефон 2</label>
                                <input
                                    type="text"
                                    {...register('phone2')}
                                    placeholder="Въведете телефон 2"
                                    className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white 
                                focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-400"
                                />
                                {errors.phone2 && <p className="text-red-500 text-sm mt-1">{errors.phone2.message}</p>}
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Биография</label>
                            <textarea
                                {...register('bio')}
                                rows={5}
                                placeholder="Разкажете ни повече за себе си"
                                className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white 
                            focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-400"
                            ></textarea>
                            {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>}
                        </div>

                        {/* Buttons */}
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
                            transform hover:scale-105 shadow-lg  tracking-wide"
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

export default ChangeProfileInformation;
