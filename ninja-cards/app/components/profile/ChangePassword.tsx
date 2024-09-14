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
    password: yup.string().min(6, 'Паролата трябва да е поне 6 символа').required('Паролата е задължителна'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), ''], 'Паролите трябва да съвпадат')
        .required('Потвърждението на паролата е задължително'),
});

interface FormData {
    password: string;
    confirmPassword: string;
}

interface Alert {
    message: string;
    title: string;
    color: string;
}

const ChangePassword: React.FC = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<Alert | null>(null);
    const router = useRouter();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (user) {
            setValue('password', '');
            setValue('confirmPassword', '');
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
        updateData.append('password', data.password);

        try {
            const response = await fetch(`${BASE_API_URL}/api/profile/changePassword`, {
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
            <h2 className="text-3xl font-extrabold mb-6 text-center text-white">Смяна на парола</h2>
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
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                            Промяна на паролата
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register('password')}
                            placeholder="Въведете новата парола"
                            className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                        />
                        {errors.password && (
                            <div className="text-red-500 mt-2">{errors.password.message}</div>
                        )}
                    </div>
                    <div className="relative">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                            Потвърдете паролата
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            {...register('confirmPassword')}
                            placeholder="Потвърдете новата парола"
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
                        {loading ? 'Запазване...' : 'Запази'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default ChangePassword;
