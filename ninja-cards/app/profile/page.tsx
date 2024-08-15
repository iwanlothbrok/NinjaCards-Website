"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Settings from '../components/profile/Settings';
import Information from '../components/profile/Information';
import ImportantLinks from '../components/profile/ImportantLinks';
import Preview from '../components/profile/Preview';
import ProfileDetail from '../components/profile/ProfileDetails'; // Detailed Profile Component

const Profile: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams?.get('tab') || 'settings');
    const userId = searchParams?.get('id') || "1"; // Replace this with the actual user ID you want to use

    useEffect(() => {
        // Set activeTab from URL query parameters on initial load
        const currentTab = searchParams?.get('tab');
        if (currentTab) {
            setActiveTab(currentTab);
        }
    }, [searchParams]);

    const renderContent = () => {
        switch (activeTab) {
            case 'settings':
                return <Settings />;
            case 'information':
                return <Information />;
            case 'links':
                return <ImportantLinks />;
            case 'preview':
                return <Preview />;
            case 'profileDetails':
                return <ProfileDetail />;
            default:
                return <Settings />;
        }
    };

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        if (tab === 'profileDetails') {
            // Update the URL with the ID when navigating to the Profile tab
            router.push(`/profile?tab=${tab}&id=${userId}`);
        } else {
            // Update the URL without the ID for other tabs
            router.push(`/profile?tab=${tab}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-3xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 mt-28 gap-4 mb-4">
                    <button
                        className={`px-4 py-3 rounded transition transform hover:scale-105 duration-300 ${activeTab === 'settings' ? 'bg-teil text-white' : 'bg-orange text-white'}`}
                        onClick={() => handleTabClick('settings')}
                    >
                        Settings
                    </button>
                    <button
                        className={`px-4 py-3 rounded transition transform hover:scale-105 duration-300 ${activeTab === 'information' ? 'bg-teil text-white' : 'bg-orange text-white'}`}
                        onClick={() => handleTabClick('information')}
                    >
                        Information
                    </button>
                    <button
                        className={`px-4 py-3 rounded transition transform hover:scale-105 duration-300 ${activeTab === 'links' ? 'bg-teil text-white' : 'bg-orange text-white'}`}
                        onClick={() => handleTabClick('links')}
                    >
                        Important Links
                    </button>
                    <button
                        className={`px-4 py-3 rounded transition transform hover:scale-105 duration-300 ${activeTab === 'preview' ? 'bg-teil text-white' : 'bg-orange text-white'}`}
                        onClick={() => handleTabClick('preview')}
                    >
                        Preview
                    </button>
                    <button
                        className={`px-4 py-3 rounded transition transform hover:scale-105 duration-300 ${activeTab === 'profileDetails' ? 'bg-teil text-white' : 'bg-orange text-white'}`}
                        onClick={() => handleTabClick('profileDetails')}
                    >
                        Profile Details
                    </button>
                </div>
                <div className="border rounded-lg shadow-md">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Profile;
