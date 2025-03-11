'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEnvelope, faMapMarkerAlt, faImage, faUser, faLink, faEye, faIdCard, faQrcode, faCogs, faChartBar, faVideo, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

const tabs = [
    { tab: 'settings', label: 'Смяна на паролата', icon: faLock },
    { tab: 'changeEmail', label: 'Смяна на имейла', icon: faEnvelope },
    { tab: 'changeAddress', label: 'Смяна на адреса', icon: faMapMarkerAlt },
    { tab: 'changeImage', label: 'Смяна на профилната снимка', icon: faImage },
    { tab: 'information', label: 'Лична информация', icon: faUser },
    { tab: 'links', label: 'Важни връзки', icon: faLink },
    { tab: 'preview', label: 'Преглед на профила', icon: faEye },
    { tab: 'profileDetails', label: 'Визитка', icon: faIdCard },
    { tab: 'profileQr', label: 'Вашият QR код', icon: faQrcode },
    { tab: 'features', label: 'Функции', icon: faCogs },
    { tab: 'analyse', label: 'Анализ', icon: faChartBar },
    { tab: 'video', label: 'Видео клип', icon: faVideo },
    { tab: 'changeLanguage', label: 'Смяна на езика', icon: faGlobe },
];

interface TabCardProps {
    tab: string;
    label: string;
    icon: any;
    onClick: () => void;
}

const TabCard: React.FC<TabCardProps> = ({ tab, label, icon, onClick }) => (
    <div
        className="relative flex flex-col items-center justify-center p-5 rounded-lg shadow-lg border border-gray-700 
        transition-all cursor-pointer bg-gray-800 text-gray-300 hover:bg-gradient-to-r hover:from-amber-600 
        hover:via-amber-700 hover:to-amber-800 hover:text-white transform hover:scale-105 focus:ring-4 focus:ring-orange-300"
        onClick={onClick}
        style={{ width: '100%', height: '160px' }}
    >
        <FontAwesomeIcon icon={icon} size="2x" className="mb-3 text-amber-500 group-hover:text-white transition-colors duration-200" />
        <div className="relative z-10 text-center">
            <h3 className="text-lg font-semibold">{label}</h3>
        </div>
    </div>
);

const LoadingBar: React.FC = () => (
    <div className="flex items-center justify-center h-screen">
        <img src="/load.gif" alt="Зареждане..." className="w-24 h-24 animate-spin" />
    </div>
);

export default function ProfileTabs() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleTabClick = useCallback((tab: any) => {
        setLoading(true);
        if (tab === 'profileDetails') {
            router.push(`/profileDetails/${user?.id}`);
            return;
        } else if (tab === 'analyse') {
            router.push(`/analyse`);
            return;
        }
        router.push(`/profile/${tab}`);
    }, [router, user]);

    return (
        <div className="flex flex-col items-center pt-28 sm:pt-36 justify-center min-h-screen p-4 
        bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-200">
            {loading && <LoadingBar />}
            <div className="w-full max-w-3xl text-center">
                <h2 className="text-3xl font-bold text-white mb-8 tracking-wide">
                    ⚙️ Управление на профила
                </h2>

                {/* Tab Selection Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-10 animate-fadeIn">
                    {tabs.map(({ tab, label, icon }) => (
                        <TabCard key={tab} tab={tab} label={label} icon={icon} onClick={() => handleTabClick(tab)} />
                    ))}
                </div>
            </div>
        </div>
    );
}
