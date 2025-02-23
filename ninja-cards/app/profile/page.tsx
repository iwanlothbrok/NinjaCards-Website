'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Settings from '../components/profile/ChangePassword';
import ChangeProfileInformation from '../components/profile/ChangeProfileInformation';
import ImportantLinks from '../components/profile/ChangeSocialLinks';
import Preview from '../components/profile/Preview';
import { useAuth } from '../context/AuthContext';
import ChangeEmail from '../components/profile/ChangeEmail';
import ChangeAddress from '../components/profile/ChangeAdress';
import ChangeProfileImage from '../components/profile/ChangeProfileImage';
import QRCodeDownload from '../components/profile/QRCodeDownload';
import FeaturesComponent from '../components/profile/FeaturesComponent';
import VideoUpload from '../components/profile/VideoUpload';

const TabCard: React.FC<{
    tab: string;
    label: string;
    backgroundImage: string;
    activeTab: string;
    onClick: () => void;
}> = React.memo(({ tab, label, backgroundImage, activeTab, onClick }) => (
    <div
        className={`relative flex flex-col items-center justify-center p-4 rounded-lg shadow-lg border border-gray-700 transition-all cursor-pointer
                    ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300'}
                    hover:bg-blue-600 hover:text-white`}
        onClick={onClick}
        aria-pressed={activeTab === tab}
        style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            width: '100%',
            height: '150px',
            filter: activeTab === tab ? 'none' : 'grayscale(100%)',
        }}
    >
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
        <div className="relative z-10 text-center">
            <h3 className="text-base sm:text-md md:text-lg lg:text-lg font-semibold mb-1">
                {label}
            </h3>
        </div>
    </div>
));

TabCard.displayName = 'TabCard';

function ProfileContent() {
    const router = useRouter();
    const { user } = useAuth();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    const [activeTab, setActiveTab] = useState(() => searchParams?.get('tab') || 'settings');
    const [loading, setLoading] = useState(false);
    const userId = user?.id;

    useEffect(() => {
        const currentTab = searchParams?.get('tab');
        if (currentTab) {
            setActiveTab(currentTab);
        }
    }, [searchParams]);

    const renderContent = useMemo(() => {
        switch (activeTab) {
            case 'settings':
                return <Settings />;
            case 'information':
                return <ChangeProfileInformation />;
            case 'links':
                return <ImportantLinks />;
            case 'preview':
                return <Preview />;
            case 'changeEmail':
                return <ChangeEmail />;
            case 'changeAddress':
                return <ChangeAddress />;
            case 'changeImage':
                return <ChangeProfileImage />;
            case 'profileQr':
                return <QRCodeDownload />;
            case 'features':
                return <FeaturesComponent />;
            case 'video':
                return <VideoUpload />;
            default:
                return <Settings />;
        }
    }, [activeTab]);

    const handleTabClick = useCallback((tab: string) => {
        setLoading(true);
        if (tab === 'profileDetails') {
            router.push(`/profileDetails/${userId}`);
        }
        else if (tab === 'analyse') {
            router.push('/analyse');
        }
        else {
            setActiveTab(tab);
            router.push(`/profile?tab=${tab}`);
        }
    }, [router, userId]);

    useEffect(() => {
        setLoading(false);
    }, [activeTab]);

    useEffect(() => {
        const isIphone = /iPhone/.test(navigator.userAgent);
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        if (isIphone && isSafari && !window.location.search.includes('iphoneReload')) {
            console.log("iPhone Safari detected, forcing hard reload...");
            const newUrl = window.location.origin + window.location.pathname + '?iphoneReload=' + new Date().getTime();
            window.location.replace(newUrl);
        }
    }, []);


    return (
        <div className="flex flex-col items-center pt-28 sm:pt-36 justify-center min-h-screen p-4 bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-200">
            <div className="w-full max-w-4xl">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">Управление на профила</h2>
                <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                    <TabCard
                        tab="settings"
                        label="Смяна на паролата"
                        backgroundImage="/settingsBg/security.png"
                        activeTab={activeTab}
                        onClick={() => handleTabClick('settings')}
                    />
                    <TabCard
                        tab="changeEmail"
                        label="Смяна на имейла"
                        backgroundImage="/settingsBg/email.png"
                        activeTab={activeTab}
                        onClick={() => handleTabClick('changeEmail')}
                    />
                    <TabCard
                        tab="changeAddress"
                        label="Смяна на адреса"
                        backgroundImage="/settingsBg/address.png"
                        activeTab={activeTab}
                        onClick={() => handleTabClick('changeAddress')}
                    />
                    <TabCard
                        tab="changeImage"
                        label="Смяна на профилната снимка"
                        backgroundImage="/settingsBg/img.png"
                        activeTab={activeTab}
                        onClick={() => handleTabClick('changeImage')}
                    />
                    <TabCard
                        tab="information"
                        label="Лична информация"
                        backgroundImage="/settingsBg/information.png"
                        activeTab={activeTab}
                        onClick={() => handleTabClick('information')}
                    />
                    <TabCard
                        tab="links"
                        label="Важни връзки"
                        backgroundImage="/settingsBg/laptop.png"
                        activeTab={activeTab}
                        onClick={() => handleTabClick('links')}
                    />
                    <TabCard
                        tab="preview"
                        label="Преглед на профила"
                        backgroundImage="/settingsBg/profile.png"
                        activeTab={activeTab}
                        onClick={() => handleTabClick('preview')}
                    />
                    <TabCard
                        tab="profileDetails"
                        label="Визитка"
                        backgroundImage="/settingsBg/profile-details.png"
                        activeTab={activeTab}
                        onClick={() => handleTabClick('profileDetails')}
                    />
                    <TabCard
                        tab="profileQr"
                        label="Вашият QR код"
                        backgroundImage="/settingsBg/qr.png"
                        activeTab={activeTab}
                        onClick={() => handleTabClick('profileQr')}
                    />
                    <TabCard
                        tab="features"
                        label="Функции"
                        backgroundImage="/settingsBg/important.png"
                        activeTab={activeTab}
                        onClick={() => handleTabClick('features')}
                    />
                    <TabCard
                        tab="analyse"
                        label="Анализ"
                        backgroundImage="/settingsBg/analyze.png"
                        activeTab={activeTab}
                        onClick={() => handleTabClick('analyse')}
                    />
                    <TabCard
                        tab="video"
                        label="Видео клип"
                        backgroundImage="/settingsBg/security02.png"
                        activeTab={activeTab}
                        onClick={() => handleTabClick('video')}
                    />
                </div>
                {loading ? (
                    <div className="flex justify-center items-center">
                        <motion.img
                            src="/load.gif"
                            alt="Зареждане..."
                            className="w-12 h-12"
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity }}
                        />
                    </div>
                ) : (
                    renderContent
                )}
            </div>
        </div>
    );
}

export default function Profile() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProfileContent />
        </Suspense>
    );
}
