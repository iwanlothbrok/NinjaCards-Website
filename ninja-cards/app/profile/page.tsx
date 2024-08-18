"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Settings from '../components/profile/Settings';
import Information from '../components/profile/Information';
import ImportantLinks from '../components/profile/ImportantLinks';
import Preview from '../components/profile/Preview';
import { useAuth } from '../context/AuthContext';

const TabCard: React.FC<{ tab: string; label: string; description: string; image: string; activeTab: string; onClick: () => void }> = ({ tab, label, description, image, activeTab, onClick }) => (
    <div
        className={`relative p-4 rounded-lg shadow-md transition-all duration-500 transform hover:scale-105 cursor-pointer text-center ${activeTab === tab ? 'bg-gradient-to-r from-teal-600 to-orange text-white' : 'bg-gradient-to-r  text-white'}`}
        onClick={onClick}
        aria-pressed={activeTab === tab}
    >
        <img src={image} alt={label} className="mx-auto mb-4 w-20 h-20 object-contain" />
        <h3 className="text-lg font-semibold mb-2">{label}</h3>
        <p className="text-sm">{description}</p>
    </div>
);

const Profile: React.FC = () => {
    const router = useRouter();
    const { user } = useAuth();
    const searchParams = useSearchParams();

    const [activeTab, setActiveTab] = useState(() => searchParams?.get('tab') || 'settings');
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
                return <Information />;
            case 'links':
                return <ImportantLinks />;
            case 'preview':
                return <Preview />;
            default:
                return <Settings />;
        }
    }, [activeTab]);

    const handleTabClick = useCallback((tab: string) => {
        if (tab === 'profileDetails') {
            router.push(`/profileDetails?id=${userId}`);
        } else {
            setActiveTab(tab);
            router.push(`/profile?tab=${tab}`);
        }
    }, [router, userId]);

    return (
        <div className="flex flex-col items-center pt-16 justify-center min-h-screen p-6 bg-gradient-to-b from-gray-800 via-gray-900 to-black text-gray-200">
            <div className="w-full max-w-4xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-20 mb-6">
                    <TabCard tab="settings" label="Settings" description="Adjust your preferences" image="/ninja-steps/ninja-step-1.png" activeTab={activeTab} onClick={() => handleTabClick('settings')} />
                    <TabCard tab="information" label="Information" description="View your information" image="/ninja-steps/ninja-step-1.png" activeTab={activeTab} onClick={() => handleTabClick('information')} />
                    <TabCard tab="links" label="Important Links" description="Access important links" image="/ninja-steps/ninja-step-1.png" activeTab={activeTab} onClick={() => handleTabClick('links')} />
                    <TabCard tab="preview" label="Preview" description="Preview your profile" image="/ninja-steps/ninja-step-1.png" activeTab={activeTab} onClick={() => handleTabClick('preview')} />
                    <TabCard tab="profileDetails" label="Profile Details" description="Edit your profile details" image="/ninja-steps/ninja-step-1.png" activeTab={activeTab} onClick={() => handleTabClick('profileDetails')} />
                </div>
                <div className="transition-all" >
                    {renderContent}
                </div>
            </div>
        </div>
    );
};

export default Profile;
