'use client';

import React, { useEffect, useState, Fragment } from 'react';
import { notFound } from 'next/navigation';
import { BASE_API_URL } from '@/utils/constants';
import { Dialog, Transition } from '@headlessui/react';

type LeadFormData = {
    name: string;
    email?: string;
    phone?: string;
    message?: string;
    gdpr: boolean;
};

type LeadFormProps = {
    userId: string;
};

const LeadForm: React.FC<LeadFormProps> = ({ userId }) => {
    const [showLeadForm, setShowLeadForm] = useState(true);
    const [form, setForm] = useState<LeadFormData>({ name: '', gdpr: false });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!userId) notFound();
    }, [userId]);

    const handleChange = (field: keyof LeadFormData, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!form.name) {
            setError('Моля, въведете име.');
            return;
        }
        if (!form.phone) {
            setError('Моля, въведете телефон.');
            return;
        }
        if (!form.gdpr) {
            setError('Моля, съгласете се с обработката на личните данни.');
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch(`${BASE_API_URL}/api/leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, userId, isAccepted: true }),
            });
            if (!res.ok) throw new Error('Грешка при изпращането.');
            setShowLeadForm(false);
        } catch (err) {
            console.error(err);
            setError('Неуспешно изпращане на формата.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Transition appear show={showLeadForm} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => setShowLeadForm(false)}>
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <div className="w-full max-w-lg space-y-6 rounded-lg bg-white p-8 shadow-2xl">
                        <h2 className="text-xl font-semibold text-gray-800">Оставете контактна информация</h2>
                        <div className="space-y-4 text-black">
                            <input
                                type="text"
                                className="w-full border  border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange"
                                placeholder="Име*"
                                value={form.name}
                                required
                                onChange={e => handleChange('name', e.target.value)}
                            />
                            <input
                                type="tel"
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange"
                                placeholder="Телефон*"
                                required
                                value={form.phone || ''}
                                onChange={e => handleChange('phone', e.target.value)}
                            />
                            <input
                                type="email"
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange"
                                placeholder="Имейл (по избор)"
                                value={form.email || ''}
                                onChange={e => handleChange('email', e.target.value)}
                            />
                            <textarea
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange"
                                placeholder="Съобщение (по избор)"
                                value={form.message || ''}
                                onChange={e => handleChange('message', e.target.value)}
                            />
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="gdpr"
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-orange"
                                    onChange={e => handleChange('gdpr', e.target.checked ? 'accepted' : '')}
                                />
                                <label htmlFor="gdpr" className="text-sm text-gray-700">
                                    Съгласен съм с обработката на личните ми данни.
                                </label>
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowLeadForm(false)}
                                className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                Пропусни
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="px-5 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                            >
                                {submitting ? 'Изпращане...' : 'Изпрати'}
                            </button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition>

    );
};

export default LeadForm;
