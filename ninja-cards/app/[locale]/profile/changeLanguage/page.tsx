'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BASE_API_URL } from '@/utils/constants';
import { useAuth } from '../../context/AuthContext';
import { useTranslations } from 'next-intl';

interface Alert {
    message: string;
    title: string;
    color: string;
}

const LanguageSwitcher: React.FC = () => {
    const { user, setUser } = useAuth();
    const [language, setLanguage] = useState<string>(user?.language || 'bg');
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<Alert | null>(null);

    const router = useRouter();
    const t = useTranslations('LanguageSwitcher');

    useEffect(() => {
        if (user?.id) {
            fetchUserDetails(user.id);
        }
    }, [user?.id]);

    const fetchUserDetails = async (userId: string) => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_API_URL}/api/profile/${userId}`);
            if (!response.ok) throw new Error(t('errors.fetchFail'));

            const userData = await response.json();
            setLanguage(userData.language || 'bg');
        } catch (error) {
            console.error('Error fetching user details:', error);
        } finally {
            setLoading(false);
        }
    };

    const changeLanguage = async (lng: string) => {
        setLanguage(lng);
        setLoading(true);

        try {
            const response = await fetch(`${BASE_API_URL}/api/profile/updateLanguage`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user?.id, language: lng }),
            });

            const result = await response.json().catch(() => null);

            if (!response.ok) {
                const errorMessage = result?.error || t('errors.updateFail');
                showAlert(errorMessage, t('alerts.errorTitle'), 'red');
                return;
            }

            setUser(result);
            router.refresh(); // reload page for new language
        } catch (error) {
            console.error('Failed to change language', error);
            showAlert(t('errors.updateFail'), t('alerts.errorTitle'), 'red');
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
        <div className="w-full max-w-3xl mx-auto mt-28 p-10 bg-gradient-to-b from-gray-900 to-gray-800 
      rounded-2xl shadow-xl border border-gray-700 sm:mx-6 md:mx-10 lg:mx-auto">

            <h2 className="text-4xl font-bold text-center text-white mb-6 tracking-wide">
                🌍 {t('title')}
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
                <>
                    {/* Language Buttons */}
                    <div className="flex justify-center gap-4 mt-4 animate-fadeIn">
                        <button
                            onClick={() => changeLanguage('bg')}
                            className={`py-3 px-8 rounded-lg font-semibold text-lg transition-all duration-300 
                ${language === 'bg'
                                    ? 'bg-orange text-white shadow-lg'
                                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'} 
                hover:scale-105 focus:ring-4 focus:ring-orange-400`}
                        >
                            🇧🇬 {t('bulgarian')}
                        </button>
                        <button
                            onClick={() => changeLanguage('en')}
                            className={`py-3 px-8 rounded-lg font-semibold text-lg transition-all duration-300 
                ${language === 'en'
                                    ? 'bg-orange text-white shadow-lg'
                                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'} 
                hover:scale-105 focus:ring-4 focus:ring-orange-400`}
                        >
                            🇬🇧 {t('english')}
                        </button>
                    </div>

                    {/* Back Button */}
                    <div className="flex justify-center mt-6">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="bg-blue-700 text-white py-3 md:py-4 px-6 rounded-lg hover:bg-blue-600 
                focus:outline-none focus:ring-4 focus:ring-gray-400 transition-transform transform hover:scale-105"
                        >
                            {t('buttons.back')}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default LanguageSwitcher;
