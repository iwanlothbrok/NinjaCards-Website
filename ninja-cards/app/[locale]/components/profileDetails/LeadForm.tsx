'use client';

import React, { useEffect, useState, Fragment } from 'react';
import { notFound } from 'next/navigation';
import { BASE_API_URL } from '@/utils/constants';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useTranslations } from 'next-intl';

type LeadFormData = {
    name: string;
    email?: string;
    phone?: string;
    message?: string;
    gdpr: boolean;
};

type LeadFormProps = {
    userId: string;
    name: string;
    isVisible: boolean;
    onClose: () => void;
};

const LeadForm: React.FC<LeadFormProps> = ({ userId, name, isVisible, onClose }) => {
    const t = useTranslations('LeadForm');
    const [form, setForm] = useState<LeadFormData>({ name: '', gdpr: false });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!userId) notFound();
    }, [userId]);

    const handleChange = (field: keyof LeadFormData, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setError('');
        if (!form.name) return setError(t('errors.name'));
        if (!form.phone) return setError(t('errors.phone'));
        if (!form.gdpr) return setError(t('errors.gdpr'));

        setSubmitting(true);
        try {
            const res = await fetch(`${BASE_API_URL}/api/subscribed`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, userId, isAccepted: true }),
            });
            if (!res.ok) throw new Error(t('errors.submit'));
            onClose();
        } catch (err) {
            console.error(err);
            setError(t('errors.failed'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Transition appear show={isVisible} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={onClose}>
                <div className="flex min-h-screen items-center justify-center p-4">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <DialogPanel className="w-full max-w-lg rounded-lg bg-white p-8 shadow-2xl space-y-6">
                            <DialogTitle className="text-xl font-semibold text-gray-800">
                                {t('title', { name })}
                            </DialogTitle>

                            <div className="space-y-4 text-black">
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange"
                                    placeholder={t('placeholders.name')}
                                    value={form.name}
                                    onChange={e => handleChange('name', e.target.value)}
                                    required
                                />
                                <input
                                    type="tel"
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange"
                                    placeholder={t('placeholders.phone')}
                                    value={form.phone || ''}
                                    onChange={e => handleChange('phone', e.target.value)}
                                    required
                                />
                                <input
                                    type="email"
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange"
                                    placeholder={t('placeholders.email')}
                                    value={form.email || ''}
                                    onChange={e => handleChange('email', e.target.value)}
                                />
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange"
                                    placeholder={t('placeholders.message')}
                                    value={form.message || ''}
                                    onChange={e => handleChange('message', e.target.value)}
                                />
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="gdpr"
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-orange"
                                        checked={form.gdpr}
                                        onChange={e => setForm(prev => ({ ...prev, gdpr: e.target.checked }))}
                                    />
                                    <label htmlFor="gdpr" className="text-sm text-gray-700">
                                        {t('gdpr')}
                                    </label>
                                </div>
                            </div>

                            {error && <p className="text-red-500 text-sm">{error}</p>}

                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={onClose}
                                    className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                    type="button"
                                >
                                    {t('skip')}
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="px-5 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                                    type="submit"
                                >
                                    {submitting ? t('submitting') : t('submit')}
                                </button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
};

export default LeadForm;
