'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
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

const EyeIcon = ({ open }: { open: boolean }) => open
    ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
    : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;

const RegisterPage = ({ params }: { params?: { id?: string } }) => {
    const userId = params?.id;
    const router = useRouter();
    const t = useTranslations('Register');

    const schema: yup.ObjectSchema<FormValues> = yup.object({
        email: yup.string().email(t('errors.emailInvalid')).required(t('errors.emailRequired')),
        password: yup.string().min(6, t('errors.passwordMin')).required(t('errors.passwordRequired')),
        confirmPassword: yup.string().oneOf([yup.ref('password')], t('errors.passwordsMismatch')).required(t('errors.confirmRequired')),
        acceptTerms: yup.boolean().oneOf([true], t('errors.acceptTerms')).required(t('errors.acceptTerms')),
        acceptGdpr: yup.boolean().oneOf([true], t('errors.acceptGdpr')).required(t('errors.acceptGdpr')),
    });

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: yupResolver(schema),
    });

    const [alert, setAlert] = useState<Alert | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [step, setStep] = useState<'form' | 'done'>('form');

    useEffect(() => {
        const checkUserData = async () => {
            if (!userId) return;
            try {
                const res = await fetch(`${BASE_API_URL}/api/profile/check?userId=${userId}`);
                if (!res.ok) throw new Error();
                const data = await res.json();
                if (!data.needsSetup) router.push('/profile');
            } catch { }
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
                setStep('done');
                setTimeout(() => router.push('/login'), 2500);
            } else {
                showAlert(payload?.error || t('errors.generic'), t('errors.title'), 'red');
            }
        } catch {
            showAlert(t('errors.tryAgain'), t('errors.title'), 'red');
        } finally {
            setLoading(false);
        }
    };

    const bgStyle = {
        background: 'radial-gradient(ellipse 100% 60% at 50% -10%, rgba(245,158,11,0.1) 0%, transparent 60%), #080A0F',
    };

    // Success state
    if (step === 'done') {
        return (
            <div className="min-h-screen flex items-center justify-center px-4" style={bgStyle}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-4"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                        className="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto"
                    >
                        <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </motion.div>
                    <h2 className="text-2xl font-bold text-white">{t('success.title')}</h2>
                    <p className="text-gray-500 text-sm">{t('success.saved')}</p>
                </motion.div>
            </div>
        );
    }

    // Main form
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20" style={bgStyle}>

            {/* Grid overlay */}
            <div className="fixed inset-0 -z-10 pointer-events-none" style={{
                opacity: 0.012,
                backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                backgroundSize: '52px 52px',
            }} />

            {/* Glow */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-amber-500/[0.05] rounded-full blur-[100px] pointer-events-none -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col items-center mb-8 gap-3"
                >
                    <Image src="/navlogo.png" alt="logo" width={72} height={72} priority className="opacity-90" />
                    <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500/60 mb-1">Ninja Cards NFC</p>
                        <h1 className="text-3xl font-black text-white tracking-tight">{t('title')}</h1>
                        <p className="text-gray-600 text-sm mt-1">{t('subtitle')}</p>
                    </div>
                </motion.div>

                {/* Card */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="rounded-2xl border border-white/[0.07] overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}
                >
                    <div className="h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

                    <div className="p-7 space-y-5">

                        {/* Alert */}
                        <AnimatePresence>
                            {alert && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`rounded-xl p-4 text-sm font-medium text-center ${alert.color === 'green'
                                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                        : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
                                >
                                    <strong>{alert.title}:</strong> {alert.message}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

                            {/* Email */}
                            <Field label={t('fields.email')} error={errors.email?.message}>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="example@email.com"
                                    {...register('email')}
                                    className={inputCls(!!errors.email)}
                                />
                            </Field>

                            {/* Password */}
                            <Field label={t('fields.password')} error={errors.password?.message}>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="********"
                                        {...register('password')}
                                        className={inputCls(!!errors.password) + ' pr-10'}
                                    />
                                    <button type="button" onClick={() => setShowPassword(v => !v)}
                                        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-amber-400 transition-colors">
                                        <EyeIcon open={showPassword} />
                                    </button>
                                </div>
                            </Field>

                            {/* Confirm Password */}
                            <Field label={t('fields.confirm')} error={errors.confirmPassword?.message}>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        type={showConfirm ? 'text' : 'password'}
                                        placeholder="********"
                                        {...register('confirmPassword')}
                                        className={inputCls(!!errors.confirmPassword) + ' pr-10'}
                                    />
                                    <button type="button" onClick={() => setShowConfirm(v => !v)}
                                        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-amber-400 transition-colors">
                                        <EyeIcon open={showConfirm} />
                                    </button>
                                </div>
                            </Field>


                            {/* Divider */}
                            <div className="h-px bg-white/[0.05]" />

                            {/* Terms */}
                            <div className="space-y-3">
                                <CheckboxField
                                    id="acceptTerms"
                                    error={errors.acceptTerms?.message}
                                    register={register('acceptTerms')}
                                >
                                    {t.rich('legal.termsLine', {
                                        privacy: (chunks) => <a href="/privacy/PrivacyPolicy" className="text-amber-400/80 hover:text-amber-400 underline underline-offset-2">{chunks}</a>,
                                        terms: (chunks) => <a href="/privacy/TermsOfUse" className="text-amber-400/80 hover:text-amber-400 underline underline-offset-2">{chunks}</a>,
                                    })}
                                </CheckboxField>

                                <CheckboxField
                                    id="acceptGdpr"
                                    error={errors.acceptGdpr?.message}
                                    register={register('acceptGdpr')}
                                >
                                    {t('legal.gdpr')}
                                </CheckboxField>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                                style={{
                                    background: loading ? 'rgba(245,158,11,0.3)' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                                    color: '#000',
                                    boxShadow: loading ? 'none' : '0 8px 28px rgba(245,158,11,0.3)',
                                }}
                            >
                                {loading
                                    ? <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                                        {t('actions.saving')}
                                    </span>
                                    : t('actions.save')
                                }
                            </button>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;

// Helpers

const inputCls = (hasError: boolean) =>
    `w-full rounded-xl bg-white/[0.04] border ${hasError ? 'border-red-500/50' : 'border-white/[0.08]'} text-white text-sm px-4 py-3 placeholder-gray-600 focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.06] transition-all`;

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{label}</label>
            {children}
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
    );
}

function CheckboxField({ id, error, register, children }: { id: string; error?: string; register: any; children: React.ReactNode }) {
    return (
        <div>
            <label htmlFor={id} className="flex items-start gap-3 cursor-pointer group">
                <input
                    type="checkbox"
                    id={id}
                    {...register}
                    className="mt-0.5 w-4 h-4 rounded border-gray-600 bg-white/[0.05] accent-amber-500 cursor-pointer flex-shrink-0"
                />
                <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors leading-relaxed">{children}</span>
            </label>
            {error && <p className="text-red-400 text-xs mt-1 ml-7">{error}</p>}
        </div>
    );
}
