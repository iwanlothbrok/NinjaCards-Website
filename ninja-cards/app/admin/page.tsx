"use client";
import React, { useState, useMemo, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useAuth } from '../context/AuthContext';
import AddProduct from './addProduct/page';

const TabCard: React.FC<{
    tab: string;
    label: string;
    description: string;
    image: string;
    activeTab: string;
    onClick: () => void;
}> = ({ tab, label, description, image, activeTab, onClick }) => (
    <div
        className={`relative p-4 rounded-lg shadow-md transition-all duration-500 transform hover:scale-105 cursor-pointer text-center ${activeTab === tab ? 'bg-gradient-to-r from-teal-600 to-orange text-white' : 'bg-gradient-to-r  text-white'
            }`}
        onClick={onClick}
        aria-pressed={activeTab === tab}
    >
        <img src={image} alt={label} className="mx-auto mb-4 w-20 h-20 object-contain" />
        <h3 className="text-lg font-semibold mb-2">{label}</h3>
        <p className="text-sm">{description}</p>
    </div>
);

function AdminFeaturesContent() {
    const router = useRouter();
    const { user } = useAuth();
    const searchParams = useSearchParams();

    const [activeTab, setActiveTab] = useState(() => searchParams?.get('tab') || 'addProduct');
    const userId = user?.id;

    const renderContent = useMemo(() => {
        switch (activeTab) {
            case 'addProduct':
                return <AddProduct />;
            // Add more cases for other tabs
            default:
                return <AddProduct />;
        }
    }, [activeTab]);

    const handleTabClick = useCallback(
        (tab: string) => {
            if (tab === 'profileDetails') {
                router.push(`/profileDetails?id=${userId}`);
            } else {
                setActiveTab(tab);
                router.push(`/adminFeatures?tab=${tab}`);
            }
        },
        [router, userId]
    );

    return (
        <div className="flex flex-col items-center pt-16 justify-center min-h-screen p-6 bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-200">
            <div className="w-full max-w-4xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-20 mb-6">
                    <TabCard
                        tab="addProduct"
                        label="Add Product"
                        description="Add new products to the store"
                        image="/ninja-steps/ninja-step-1.png"
                        activeTab={activeTab}
                        onClick={() => handleTabClick('addProduct')}
                    />
                    {/* Add more TabCards for other features */}
                </div>
                <div className="transition-all">{renderContent}</div>
            </div>
        </div>
    );
}

export default function AdminFeatures() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminFeaturesContent />
        </Suspense>
    );
}
