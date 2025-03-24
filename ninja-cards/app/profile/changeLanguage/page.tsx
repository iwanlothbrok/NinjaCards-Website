'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { BASE_API_URL } from '@/utils/constants';
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

    useEffect(() => {
        if (user?.id) {
            fetchUserDetails(user.id);
        }
    }, [user?.id]);

    const fetchUserDetails = async (userId: string) => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_API_URL}/api/profile/${userId}`);
            if (!response.ok) throw new Error("Неуспешно зареждане на данните на потребителя.");

            const userData = await response.json();
            setLanguage(userData.language || 'bg');
        } catch (error) {
            console.error("Error fetching user details:", error);
        } finally {
            setLoading(false);
        }
    };


    const changeLanguage = async (lng: string) => {
        setLanguage(lng);
        setLoading(true);
        console.log('Language changed 42:', lng);

        try {
            const response = await fetch(`${BASE_API_URL}/api/profile/updateLanguage`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user?.id, language: lng }),
            });


            const result = await response.json().catch(() => null); // fallback if not JSON

            if (!response.ok) {
                const errorMessage =
                    result?.error || 'Неуспешно актуализиране на профила';
                const errorDetails = result?.details;

                console.error('Грешка при актуализацията:', errorMessage, errorDetails);
                showAlert(errorMessage, 'Грешка', 'red');
                return;
            }

            const userData = await response.json();
            setUser(userData);
            router.refresh(); // Refresh to apply language change
        } catch (error) {
            console.error('Failed to change language', error);
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
                🌍 Изберете език за визитката
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
                <>
                    {/* Language Selection Buttons */}
                    <div className="flex justify-center gap-4 mt-4 animate-fadeIn">
                        <button
                            onClick={() => changeLanguage('bg')}
                            className={`py-3 px-8 rounded-lg font-semibold text-lg transition-all duration-300 
                                ${language === 'bg' ? 'bg-orange text-white shadow-lg' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'} 
                                hover:scale-105 focus:ring-4 focus:ring-orange-400`}
                        >
                            🇧🇬 Български
                        </button>
                        <button
                            onClick={() => changeLanguage('en')}
                            className={`py-3 px-8 rounded-lg font-semibold text-lg transition-all duration-300 
                                ${language === 'en' ? 'bg-orange text-white shadow-lg' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'} 
                                hover:scale-105 focus:ring-4 focus:ring-orange-400`}
                        >
                            🇬🇧 English
                        </button>
                        {/* <button
                            onClick={() => changeLanguage('de')}
                            className={`py-3 px-8 rounded-lg font-semibold text-lg transition-all duration-300 
                                ${language === 'de' ? 'bg-orange text-white shadow-lg' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'} 
                                hover:scale-105 focus:ring-4 focus:ring-orange-400`}
                        >
                            🇩🇪 German
                        </button> */}
                    </div>

                    {/* Back Button */}
                    <div className="flex justify-center mt-6">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="bg-blue-700 text-white py-3 md:py-4 px-6 rounded-lg hover:bg-blue-600 
                            focus:outline-none focus:ring-4 focus:ring-gray-400 transition-transform transform hover:scale-105"
                        >
                            Назад
                        </button>
                    </div>
                </>
            )}
        </div>
    );

}

export default LanguageSwitcher;
