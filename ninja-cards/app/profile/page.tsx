'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Settings from '../components/profile/ChangePassword';
import ChangeProfileInformation from '../components/profile/ChangeProfileInformation';
import ImportantLinks from '../components/profile/ChangeSocialLinks';
import Preview from '../components/profile/Preview';
import { useAuth } from '../context/AuthContext';
import ChangeEmail from '../components/profile/ChangeEmail';
import ChangeAddress from '../components/profile/ChangeAdress';
import ChangeProfileImage from '../components/profile/ChangeProfileImage';
import QRCodeDownload from '../components/profile/QRCodeDownload';

const TabCard: React.FC<{
    tab: string; 
    label: string; 
    backgroundImage: string; 
    activeTab: string; 
    onClick: () => void;
}> = ({ tab, label, backgroundImage, activeTab, onClick }) => (
    <div
        className={`relative flex items-center justify-center p-2 rounded-lg shadow-md border border-gray-700 transition-all duration-300 cursor-pointer text-center bg-cover bg-center
                    ${activeTab === tab ? 'bg-blue-300 text-white' : 'bg-gray-800 text-gray-300'}
                    hover:bg-blue-500 hover:text-white`}
        onClick={onClick}
        aria-pressed={activeTab === tab}
        style={{ backgroundImage: `url(${backgroundImage})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
    >
        <div className="absolute inset-0 bg-black opacity-70 rounded-lg"></div>
        <div className="relative z-10">
            <h3 className="text-lg font-semibold mb-1">{label}</h3>
        </div>
    </div>
);

function ProfileContent() {
    const router = useRouter();
    const { user } = useAuth();
    const searchParams = useSearchParams();
    
    // Redirect to login page if no user is logged in
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

    // UseMemo to memoize the rendered tab content for performance
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
            default:
                return <Settings />;
        }
    }, [activeTab]);

    const handleTabClick = useCallback((tab: string) => {
        setLoading(true); // Start loading

        if (tab === 'profileDetails') {
            router.push(`/profileDetails/${userId}`);
        } else {
            setActiveTab(tab);
            router.push(`/profile?tab=${tab}`);
        }
    }, [router, userId]);

    // Stop loading once activeTab is updated
    useEffect(() => {
        setLoading(false);
    }, [activeTab]);

    return (
        <div className="flex flex-col items-center pt-32 justify-center min-h-screen p-4 bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-200">
            <div className="w-full max-w-3xl">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Управление на профила</h2>
                
                {/* Tab Navigation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <TabCard
                        tab="settings"
                        label="Смяна на паролата"
                        backgroundImage="/settingsBg/profile.png"
                        activeTab={activeTab}
                        onClick={() => handleTabClick('settings')}
                    />
                    <TabCard
                        tab="changeEmail"
                        label="Смяна на имейла"
                        backgroundImage="/settingsBg/files.png"
                        activeTab={activeTab}
                        onClick={() => handleTabClick('changeEmail')}
                    />
                    <TabCard
                        tab="changeAddress"
                        label="Смяна на адреса"
                        backgroundImage="/settingsBg/files.png"
                        activeTab={activeTab}
                        onClick={() => handleTabClick('changeAddress')}
                    />
                    <TabCard
                        tab="changeImage"
                        label="Смяна на профилната снимка"
                        backgroundImage="/settingsBg/settingcash.png"
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
                        backgroundImage="/settingsBg/settingcash.png"
                        activeTab={activeTab}
                        onClick={() => handleTabClick('preview')}
                    />
                    <TabCard
                        tab="profileDetails"
                        label="Редактиране на детайлите на профила"
                        backgroundImage="/settingsBg/files.png"
                        activeTab={activeTab}
                        onClick={() => handleTabClick('profileDetails')}
                    />
                    <TabCard
                        tab="profileQr"
                        label="Прегледайте вашия QR код"
                        backgroundImage="/settingsBg/qr.png"
                        activeTab={activeTab}
                        onClick={() => handleTabClick('profileQr')}
                    />
                </div>
                
                {/* Content Section */}
                <div className="transition-all">
                    {loading ? (
                        <div className="flex justify-center items-center">
                            <img src="/load.gif" alt="Зареждане..." className="w-16 h-16" />
                        </div>
                    ) : (
                        renderContent
                    )}
                </div>
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
