import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n'; // Import the i18n instance from i18n.ts
import { BASE_API_URL } from '@/utils/constants';

const LanguageSwitcher: React.FC = () => {
    const { user, setUser } = useAuth();
    const [language, setLanguage] = useState<string>(user?.language || 'bg');
    const [loading, setLoading] = useState<boolean>(false);
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

    useEffect(() => {
        console.log('Language changed 36:', language);

        i18n.changeLanguage(language);
    }, [language]);

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

            if (!response.ok) {
                throw new Error('Failed to change language');
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

    return (
        <div className="w-full max-w-4xl mx-auto mt-10 p-8 bg-gradient-to-b from-black via-gray-950 to-gray-950 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">Изберете език за визитката</h2>
            {loading ? (
                <div className="flex justify-center items-center py-72"><img src="/load.gif" alt="Loading..." className="w-40 h-40" /></div>
            ) : (
                <div className="flex justify-around">
                    <button
                        onClick={() => changeLanguage('bg')}
                        className={`py-2 px-6 rounded-full transition-colors duration-300 ${language === 'bg' ? 'bg-orange text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
                    >
                        Български
                    </button>
                    <button
                        onClick={() => changeLanguage('en')}
                        className={`py-2 px-6 rounded-full transition-colors duration-300 ${language === 'en' ? 'bg-orange text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => changeLanguage('de')}
                        className={`py-2 px-6 rounded-full transition-colors duration-300 ${language === 'de' ? 'bg-orange text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
                    >
                        German
                    </button>
                </div>
            )
            }
        </div >
    );
}

export default LanguageSwitcher;
