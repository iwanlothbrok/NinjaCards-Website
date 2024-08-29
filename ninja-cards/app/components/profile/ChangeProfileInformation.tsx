'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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

        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

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
            const response = await fetch('/api/profile/updateInformation', {
                method: 'PUT',
                body: updateData,
            });

            if (!response.ok) {
                const errorText = await response.json();
                showAlert(errorText.error || 'Неуспешна актуализация на информацията', 'Грешка', 'red');
                return;
            }

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
        <div className="w-full max-w-4xl mx-auto mt-10 p-8 bg-gradient-to-b from-black via-gray-950 to-gray-950 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-extrabold mb-6 text-center text-white">Актуализиране на информацията</h2>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Име</label>
                            <input
                                type="text"
                                {...register('firstName')}
                                placeholder="Име"
                                className="block w-full p-3 md:p-4 text-lg border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                            />
                            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Фамилия</label>
                            <input
                                type="text"
                                {...register('lastName')}
                                placeholder="Фамилия"
                                className="block w-full p-3 md:p-4 text-lg border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                            />
                            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                        </div>
                    </div>
                    <div className="mt-6">
                        <label className="block text-sm font-medium mb-2 text-gray-300">Име на визитка *</label>
                        <input
                            type="text"
                            {...register('name')}
                            placeholder="Въведете име на визитка"
                            className="block w-full p-3 md:p-4 text-lg border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Компания</label>
                            <input
                                type="text"
                                {...register('company')}
                                placeholder="Компания"
                                className="block w-full p-3 md:p-4 text-lg border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                            />
                            {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Позиция</label>
                            <input
                                type="text"
                                {...register('position')}
                                placeholder="Позиция"
                                className="block w-full p-3 md:p-4 text-lg border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                            />
                            {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Телефон 1</label>
                            <input
                                type="text"
                                {...register('phone1')}
                                placeholder="Телефон 1"
                                className="block w-full p-3 md:p-4 text-lg border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                            />
                            {errors.phone1 && <p className="text-red-500 text-sm mt-1">{errors.phone1.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Телефон 2</label>
                            <input
                                type="text"
                                {...register('phone2')}
                                placeholder="Телефон 2"
                                className="block w-full p-3 md:p-4 text-lg border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                            />
                            {errors.phone2 && <p className="text-red-500 text-sm mt-1">{errors.phone2.message}</p>}
                        </div>
                    </div>
                    <div className="mt-6">
                        <label className="block text-sm font-medium mb-2 text-gray-300">Биография</label>
                        <textarea
                            {...register('bio')}
                            rows={5}
                            placeholder="Разкажете ни повече за себе си"
                            className="block w-full p-3 md:p-4 text-lg border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                        ></textarea>
                        {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>}
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

export default ChangeProfileInformation;
