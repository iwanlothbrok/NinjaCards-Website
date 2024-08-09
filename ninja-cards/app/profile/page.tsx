"use client";

import React, { useState } from 'react';
import Settings from '../components/profile/Settings';
import Information from '../components/profile/Information';
import ImportantLinks from '../components/profile/ImportantLinks';
import Preview from '../components/profile/Preview';

const Profile: React.FC = () => {
    const [activeTab, setActiveTab] = useState('settings');

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
            default:
                return <Settings />;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 ">
            <div className="w-full max-w-3xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 mt-28 gap-4 mb-4">
                    <button
                        className={`px-4 py-3 rounded transition transform hover:scale-105 duration-300 ${activeTab === 'settings' ? 'bg-teil text-orange' : 'bg-orange text-white'}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        Settings
                    </button>
                    <button
                        className={`px-4 py-3 rounded transition transform hover:scale-105 duration-300 ${activeTab === 'information' ? 'bg-teil text-orange' : 'bg-orange text-white'}`}
                        onClick={() => setActiveTab('information')}
                    >
                        Information
                    </button>
                    <button
                        className={`px-4 py-3 rounded transition transform hover:scale-105 duration-300 ${activeTab === 'links' ? 'bg-teil text-orange' : 'bg-orange text-white'}`}
                        onClick={() => setActiveTab('links')}
                    >
                        Important Links
                    </button>
                    <button
                        className={`px-4 py-3 rounded transition transform hover:scale-105 duration-300 ${activeTab === 'preview' ? 'bg-teil text-orange' : 'bg-orange text-white'}`}
                        onClick={() => setActiveTab('preview')}
                    >
                        Preview
                    </button>
                </div>
                <div className="  border rounded-lg bg-white shadow-md">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Profile;
