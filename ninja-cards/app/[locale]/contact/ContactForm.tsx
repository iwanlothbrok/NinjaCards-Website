"use client";

import { BASE_API_URL } from '@/utils/constants';
import { useState, ChangeEvent, FormEvent } from 'react';
import { FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

interface FormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    acceptPrivacy: boolean;
}

const ContactForm: React.FC = () => {
    const t = useTranslations("Contact");

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        subject: '',
        acceptPrivacy: false,
    });

    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.acceptPrivacy) {
            setError(t("form.errors.privacyRequired"));
            return;
        }

        const response = await fetch(`${BASE_API_URL}/api/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            setSuccess(t("form.success"));
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                acceptPrivacy: false,
            });
        } else {
            setError(t("form.errors.sendFailed"));
        }
    };

    return (
        <div className="w-full min-h-screen p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-2xl">
                {/* Left Section */}
                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 lg:col-span-5 p-6 sm:p-8 md:p-12 lg:p-16 text-white relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 bg-orange/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-orange/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10">
                        <p className="text-orange font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">
                            {t("left.sectionTitle")}
                        </p>
                        <h3
                            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight font-bold tracking-tight mb-4 sm:mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                            dangerouslySetInnerHTML={{ __html: t.raw("left.header") }}
                        />
                        <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-300 mb-8 sm:mb-12">{t("left.description")}</p>

                        <div className="space-y-4 sm:space-y-6">
                            <div className="flex items-center group">
                                <div className="bg-orange/20 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 group-hover:bg-orange/30 transition-all flex-shrink-0">
                                    <FaPhone className="h-4 w-4 sm:h-5 sm:w-5 text-orange" />
                                </div>
                                <span className="text-sm sm:text-base text-gray-200">{t("left.phone1")}</span>
                            </div>

                            <div className="flex items-center group">
                                <div className="bg-orange/20 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 group-hover:bg-orange/30 transition-all flex-shrink-0">
                                    <FaEnvelope className="h-4 w-4 sm:h-5 sm:w-5 text-orange" />
                                </div>
                                <span className="text-sm sm:text-base text-gray-200">{t("left.email")}</span>
                            </div>
                            <div className="flex items-center group">
                                <div className="bg-orange/20 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 group-hover:bg-orange/30 transition-all flex-shrink-0">
                                    <FaClock className="h-4 w-4 sm:h-5 sm:w-5 text-orange" />
                                </div>
                                <span className="text-sm sm:text-base text-gray-200">{t("left.workingHours")}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="lg:col-span-7 p-6 sm:p-8 md:p-12 lg:p-16 bg-white">
                    <div className="flex flex-wrap -mx-2 sm:-mx-3 mb-6 sm:mb-8">
                        <div className="w-full sm:w-1/2 px-2 sm:px-3 mb-6 sm:mb-0">
                            <label
                                className="block text-gray-700 text-xs sm:text-sm font-semibold mb-2 sm:mb-3"
                                htmlFor="name"
                            >
                                {t("form.labels.name")}
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg py-3 sm:py-4 px-4 sm:px-5 text-sm sm:text-base leading-tight focus:outline-none focus:bg-white focus:border-orange focus:ring-2 focus:ring-orange/20 transition-all"
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ivan Ivanov"
                                required
                            />
                        </div>
                        <div className="w-full sm:w-1/2 px-2 sm:px-3">
                            <label
                                className="block text-gray-700 text-xs sm:text-sm font-semibold mb-2 sm:mb-3"
                                htmlFor="phone"
                            >
                                {t("form.labels.phone")}
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg py-3 sm:py-4 px-4 sm:px-5 text-sm sm:text-base leading-tight focus:outline-none focus:bg-white focus:border-orange focus:ring-2 focus:ring-orange/20 transition-all"
                                id="phone"
                                name="phone"
                                type="text"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+359 88 123 4567"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap -mx-2 sm:-mx-3 mb-6 sm:mb-8">
                        <div className="w-full px-2 sm:px-3">
                            <label
                                className="block text-gray-700 text-xs sm:text-sm font-semibold mb-2 sm:mb-3"
                                htmlFor="email"
                            >
                                {t("form.labels.email")}
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg py-3 sm:py-4 px-4 sm:px-5 text-sm sm:text-base leading-tight focus:outline-none focus:bg-white focus:border-orange focus:ring-2 focus:ring-orange/20 transition-all"
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="ivan@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap -mx-2 sm:-mx-3 mb-6 sm:mb-8">
                        <div className="w-full px-2 sm:px-3">
                            <label
                                className="block text-gray-700 text-xs sm:text-sm font-semibold mb-2 sm:mb-3"
                                htmlFor="subject"
                            >
                                {t("form.labels.subject")}
                            </label>
                            <textarea
                                className="appearance-none block w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg py-3 sm:py-4 px-4 sm:px-5 text-sm sm:text-base leading-tight focus:outline-none focus:bg-white focus:border-orange focus:ring-2 focus:ring-orange/20 transition-all resize-none"
                                id="subject"
                                name="subject"
                                rows={6}
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Tell us about your project..."
                                required
                            />
                        </div>
                    </div>

                    {/* Privacy Policy */}
                    <div className="flex items-start mb-6 sm:mb-8 px-2 sm:px-3 gap-2 sm:gap-3">
                        <input
                            type="checkbox"
                            id="acceptPrivacy"
                            name="acceptPrivacy"
                            checked={formData.acceptPrivacy}
                            onChange={handleChange}
                            className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-orange bg-gray-50 border-gray-300 rounded focus:ring-orange focus:ring-2 cursor-pointer flex-shrink-0"
                        />
                        <label
                            htmlFor="acceptPrivacy"
                            className="text-xs sm:text-sm text-gray-600 leading-relaxed cursor-pointer"
                            dangerouslySetInnerHTML={{ __html: t.raw("form.labels.privacy") }}
                        />
                    </div>

                    <div className="flex justify-between items-center w-full px-2 sm:px-3">
                        <button
                            className="bg-gradient-to-r from-orange to-orange/90 hover:from-orange/90 hover:to-orange text-white font-semibold py-3 sm:py-4 px-6 sm:px-10 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange/30 text-sm sm:text-base"
                            type="submit"
                        >
                            {t("form.submit")}
                        </button>
                    </div>

                    {error && (
                        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-xs sm:text-sm font-medium">{error}</p>
                        </div>
                    )}
                    {success && (
                        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-600 text-xs sm:text-sm font-medium">{success}</p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ContactForm;
