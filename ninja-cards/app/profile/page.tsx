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

const TabCard: React.FC<{ tab: string; label: string; description: string; backgroundImage: string; activeTab: string; onClick: () => void }> = ({ tab, label, description, backgroundImage, activeTab, onClick }) => (
    <div
        className={`relative flex flex-col items-center justify-center p-4 rounded-lg shadow-lg border border-gray-700 transition-all duration-300 cursor-pointer
                    ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300'}
                    hover:bg-blue-600 hover:text-white`}
        onClick={onClick}
        aria-pressed={activeTab === tab}
        style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            width: '100%',   // Ensures the card takes up full width of the grid cell
            height: '150px', // Set a fixed height for uniformity 
        }}
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
            default:
                return <Settings />;
        }
    }, [activeTab]);

    const handleTabClick = useCallback((tab: string) => {
        setLoading(true);
        if (tab === 'profileDetails') {
            router.push(`/profileDetails/${userId}`);
        } else {
            setActiveTab(tab);
            router.push(`/profile?tab=${tab}`);
        }
    }, [router, userId]);

    useEffect(() => {
        setLoading(false);
    }, [activeTab]);

    return (
        <div className="flex flex-col items-center pt-24 sm:pt-32 justify-center min-h-screen p-4 bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-200">
            <div className="w-full max-w-4xl">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">Управление на профила</h2>
                <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                    <TabCard
                        tab="settings"
                        label="Смяна на паролата"
                        description="Настройки на акаунта"
                        backgroundImage="/settingsBg/security.png"
                        activeTab={activeTab}
                        onClick={() => handleTabClick('settings')}
                    />
                    <TabCard
                        tab="changeEmail"
                        label="Смяна на имейла"
                        description="Промяна на имейл адреса"
                        backgroundImage="/settingsBg/email.png"
                        activeTab={activeTab}
                        onClick={() => handleTabClick('changeEmail')}
                    />
                    <TabCard
                        tab="changeAddress"
                        label="Смяна на адреса"
                        description="Промяна на адреса"
                        backgroundImage="/settingsBg/address.png"
                        activeTab={activeTab}
                        onClick={() => handleTabClick('changeAddress')}
                    />
                    <TabCard
                        tab="changeImage"
                        label="Смяна на профилната снимка"
                        description="Промяна на профилната снимка"
                        backgroundImage="/settingsBg/img.png"
                        activeTab={activeTab}
                        onClick={() => handleTabClick('changeImage')}
                    />
                    <TabCard
                        tab="information"
                        label="Лична информация"
                        description="Актуализиране на личните данни"
                        backgroundImage="/settingsBg/information.png"
                        activeTab={activeTab}
                        onClick={() => handleTabClick('information')}
                    />
                    <TabCard
                        tab="links"
                        label="Важни връзки"
                        description="Управление на външни връзки"
                        backgroundImage="/settingsBg/laptop.png"
                        activeTab={activeTab}
                        onClick={() => handleTabClick('links')}
                    />
                    <TabCard
                        tab="preview"
                        label="Преглед на профила"
                        description="Преглед на профила"
                        backgroundImage="/settingsBg/profile.png"
                        activeTab={activeTab}
                        onClick={() => handleTabClick('preview')}
                    />
                    <TabCard
                        tab="profileDetails"
                        label="Визитка"
                        description="Промяна на детайлите"
                        backgroundImage="/settingsBg/profile-details.png"
                        activeTab={activeTab}
                        onClick={() => handleTabClick('profileDetails')}
                    />
                    <TabCard
                        tab="profileQr"
                        label="Вашият QR код"
                        description="Преглед на QR кода"
                        backgroundImage="/settingsBg/qr.png"
                        activeTab={activeTab}
                        onClick={() => handleTabClick('profileQr')}
                    />
                </div>
                <div className="transition-all">
                    {loading ? (
                        <div className="flex justify-center items-center">
                            <img src="/load.gif" alt="Зареждане..." className="w-12 h-12" />
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
