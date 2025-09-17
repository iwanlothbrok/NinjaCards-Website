'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { BASE_API_URL } from '@/utils/constants';
import { useTranslations } from 'next-intl';

// Валидираща схема с помощта на Yup
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
    email?: string;
    email2?: string;
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
    const t = useTranslations('ProfileInformation');

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
            showAlert(t('alerts.unauthenticated'), t('alerts.warning'), 'red');
            setLoading(false);
            return;
        }

        const updateData = new FormData();
        updateData.append('id', String(user?.id));
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                updateData.append(key, value);
            }
        });

        try {
            const response = await fetch(`${BASE_API_URL}/api/profile/updateInformation`, {
                method: 'PUT',
                body: updateData,
            });

            const result = await response.json().catch(() => null);

            if (!response.ok || !result) {
                const errorMessage = result?.error || t('alerts.errorUpdate');
                showAlert(errorMessage, t('alerts.error'), 'red');
                return;
            }

            localStorage.setItem('user', JSON.stringify(result));
            setUser(result);

            showAlert(t('alerts.successUpdate'), t('alerts.success'), 'green');
            setTimeout(() => router.push('/profile'), 1500);

        } catch (error: any) {
            console.error('Грешка:', error);
            showAlert(error.message || t('alerts.errorUpdate'), t('alerts.error'), 'red');
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
                    📝 {t('title')}
                </h2>

                {alert && (
                    <div className={`p-4 rounded-lg mb-6 text-white text-center font-medium transition-all duration-300 
            ${alert.color === 'green' ? 'bg-green-500' : 'bg-red-500'} animate-fadeIn`}>
                        <strong>{alert.title}:</strong> {alert.message}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center py-40">
                        <img src="/load.gif" alt={t('loading')} className="w-24 h-24 animate-spin" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fadeIn">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">{t('fields.firstName')}</label>
                                <input
                                    type="text"
                                    {...register('firstName')}
                                    placeholder={t('placeholders.firstName')}
                                    className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">{t('fields.lastName')}</label>
                                <input
                                    type="text"
                                    {...register('lastName')}
                                    placeholder={t('placeholders.lastName')}
                                    className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-semibold text-gray-300 mb-2">{t('fields.name')}</label>
                            <input
                                type="text"
                                {...register('name')}
                                placeholder={t('placeholders.name')}
                                className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">{t('fields.company')}</label>
                                <input
                                    type="text"
                                    {...register('company')}
                                    placeholder={t('placeholders.company')}
                                    className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">{t('fields.position')}</label>
                                <input
                                    type="text"
                                    {...register('position')}
                                    placeholder={t('placeholders.position')}
                                    className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">{t('fields.phone1')}</label>
                                <input
                                    type="text"
                                    {...register('phone1')}
                                    placeholder={t('placeholders.phone1')}
                                    className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">{t('fields.phone2')}</label>
                                <input
                                    type="text"
                                    {...register('phone2')}
                                    placeholder={t('placeholders.phone2')}
                                    className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-semibold text-gray-300 mb-2">{t('fields.bio')}</label>
                            <textarea
                                {...register('bio')}
                                rows={5}
                                placeholder={t('placeholders.bio')}
                                className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white"
                            ></textarea>
                        </div>

                        <div className="flex justify-between items-center mt-6">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="bg-blue-700 text-white py-3 px-6 rounded-lg hover:bg-blue-600"
                            >
                                {t('buttons.back')}
                            </button>
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-teal-600 to-orange text-white py-3 px-6 rounded-lg hover:opacity-80"
                                disabled={loading}
                            >
                                {loading ? t('buttons.saving') : t('buttons.save')}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ChangeProfileInformation;
