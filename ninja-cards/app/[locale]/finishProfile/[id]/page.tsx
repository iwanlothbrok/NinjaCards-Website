'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslations } from 'next-intl';
import { BASE_API_URL } from '@/utils/constants';

type FormValues = {
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
    acceptGdpr: boolean;
};

interface Alert {
    message: string;
    title: string;
    color: 'green' | 'red';
}

const RegisterPage = ({ params }: { params?: { id?: string } }) => {
    const userId = params?.id;
    const router = useRouter();
    const t = useTranslations('Register');

    // Build the schema with localized messages
    const schema: yup.ObjectSchema<FormValues> = yup.object({
        email: yup
            .string()
            .email(t('errors.emailInvalid'))
            .required(t('errors.emailRequired')),
        password: yup
            .string()
            .min(6, t('errors.passwordMin'))
            .required(t('errors.passwordRequired')),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('password')], t('errors.passwordsMismatch'))
            .required(t('errors.confirmRequired')),
        acceptTerms: yup
            .boolean()
            .oneOf([true], t('errors.acceptTerms'))
            .required(t('errors.acceptTerms')),
        acceptGdpr: yup
            .boolean()
            .oneOf([true], t('errors.acceptGdpr'))
            .required(t('errors.acceptGdpr')),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: yupResolver(schema),
    });

    const [alert, setAlert] = useState<Alert | null>(null);
    const [loading, setLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const checkUserData = async () => {
            if (!userId) return;
            try {
                const res = await fetch(`${BASE_API_URL}/api/profile/check?userId=${userId}`);
                if (!res.ok) throw new Error('check_failed');
                const data = await res.json();
                if (data.needsSetup) {
                    setIsUpdating(true);
                } else {
                    router.push('/profile');
                }
            } catch (e) {
                // soft-fail; keep user on page
                // console.error(e);
            }
        };
        checkUserData();
    }, [userId, router]);

    const showAlert = (message: string, title: string, color: Alert['color']) => {
        setAlert({ message, title, color });
        setTimeout(() => setAlert(null), 4000);
    };

    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        setAlert(null);
        try {
            const res = await fetch(`${BASE_API_URL}/api/profile/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    email: data.email,
                    password: data.password,
                    confirmPassword: data.confirmPassword,
                }),
            });

            const payload = await res.json().catch(() => null);

            if (res.ok) {
                showAlert(t('success.saved'), t('success.title'), 'green');
                router.push('/login');
            } else {
                showAlert(payload?.error || t('errors.generic'), t('errors.title'), 'red');
            }
        } catch {
            showAlert(t('errors.tryAgain'), t('errors.title'), 'red');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-black min-h-screen flex items-center justify-center px-6 pt-32">
            <div className="w-full max-w-lg bg-gray-900 p-10 rounded-xl shadow-lg border border-gray-800">
                <a
                    href="#"
                    className="flex items-center mb-6 text-3xl justify-center font-semibold text-white"
                    aria-label="Logo"
                >
                    <Image
                        className="w-28 h-28 filter grayscale"
                        src="/navlogo.png"
                        alt="logo"
                        width={122}
                        height={122}
                        priority
                    />
                </a>

                <h1 className="text-3xl font-bold text-white text-center mb-6">
                    {t('title')}
                </h1>

                {alert && (
                    <div
                        className={`my-4 p-3 text-white text-center font-semibold rounded ${alert.color === 'green' ? 'bg-green-500' : 'bg-red-500'
                            }`}
                        role="status"
                        aria-live="polite"
                    >
                        {alert.title}: {alert.message}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
                    {/* Email */}
                    <div>
                        <label className="block text-gray-300 mb-2" htmlFor="email">
                            {t('fields.email')}
                        </label>
                        <input
                            id="email"
                            type="email"
                            className={`w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange ${errors.email ? 'border-red-500' : ''
                                }`}
                            placeholder="example@email.com"
                            {...register('email')}
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? 'email-error' : undefined}
                        />
                        {errors.email && (
                            <p id="email-error" className="text-red-500 text-sm">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-gray-300 mb-2" htmlFor="password">
                            {t('fields.password')}
                        </label>
                        <input
                            id="password"
                            type="password"
                            className={`w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange ${errors.password ? 'border-red-500' : ''
                                }`}
                            placeholder="••••••••"
                            {...register('password')}
                            aria-invalid={!!errors.password}
                            aria-describedby={errors.password ? 'password-error' : undefined}
                        />
                        {errors.password && (
                            <p id="password-error" className="text-red-500 text-sm">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-gray-300 mb-2" htmlFor="confirmPassword">
                            {t('fields.confirm')}
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            className={`w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange ${errors.confirmPassword ? 'border-red-500' : ''
                                }`}
                            placeholder="••••••••"
                            {...register('confirmPassword')}
                            aria-invalid={!!errors.confirmPassword}
                            aria-describedby={errors.confirmPassword ? 'confirm-error' : undefined}
                        />
                        {errors.confirmPassword && (
                            <p id="confirm-error" className="text-red-500 text-sm">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Terms */}
                    <div className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            id="acceptTerms"
                            {...register('acceptTerms')}
                            className="mt-1"
                            aria-invalid={!!errors.acceptTerms}
                            aria-describedby={errors.acceptTerms ? 'terms-error' : undefined}
                        />
                        <label htmlFor="acceptTerms" className="text-sm text-gray-300">
                            {t.rich('legal.termsLine', {
                                privacy: (chunks) => (
                                    <a href="/privacy/PrivacyPolicy" className="text-blue-500 underline">
                                        {chunks}
                                    </a>
                                ),
                                terms: (chunks) => (
                                    <a href="/privacy/TermsOfUse" className="text-blue-500 underline">
                                        {chunks}
                                    </a>
                                ),
                            })}
                        </label>
                    </div>
                    {errors.acceptTerms && (
                        <p id="terms-error" className="text-red-500 text-sm">
                            {errors.acceptTerms.message}
                        </p>
                    )}

                    {/* GDPR */}
                    <div className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            id="acceptGdpr"
                            {...register('acceptGdpr')}
                            className="mt-1"
                            aria-invalid={!!errors.acceptGdpr}
                            aria-describedby={errors.acceptGdpr ? 'gdpr-error' : undefined}
                        />
                        <label htmlFor="acceptGdpr" className="text-sm text-gray-300">
                            {t('legal.gdpr')}
                        </label>
                    </div>
                    {errors.acceptGdpr && (
                        <p id="gdpr-error" className="text-red-500 text-sm">
                            {errors.acceptGdpr.message}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full text-white bg-orange hover:bg-orange focus:ring-4 focus:ring-orange font-semibold rounded-lg text-lg px-6 py-3 transition disabled:opacity-70"
                        disabled={loading}
                    >
                        {loading ? t('actions.saving') : t('actions.save')}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default RegisterPage;
