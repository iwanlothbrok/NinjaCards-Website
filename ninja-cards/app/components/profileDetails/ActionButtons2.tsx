// File: components/ActionButtons2.tsx

import React from 'react';
import { FaPhoneAlt, FaShareAlt } from 'react-icons/fa';
import { User } from '@/types/user';
import { BASE_API_URL } from '@/utils/constants';

const ActionButtons2: React.FC<{ user: User | null }> = ({ user }) => {
    return (
        <>
            {/* Call Button */}
            <button
                onClick={() => window.location.href = `tel:${user?.phone1}`}
                className="flex items-center justify-center bg-white text-gray-900 px-8 py-3 rounded-full shadow-xl hover:shadow-2xl hover:bg-gray-50 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50 w-full sm:w-auto"
            >
                <FaPhoneAlt className="mr-3 text-xl text-teal-600" />
                <span className="text-xl font-semibold">Обади се</span>
            </button>

            {/* Share Button */}
            <button
                onClick={() => {
                    // Trigger the API call asynchronously (non-blocking)
                    if (user?.id) {
                        fetch(`${BASE_API_URL}/api/dashboard/incrementProfileShares`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userId: user.id }),
                        }).catch((error) => console.error('Failed to increment profile shares:', error));
                    }

                    // Trigger the share functionality immediately
                    if (navigator.share) {
                        navigator
                            .share({
                                title: user?.name || "Share Contact",
                                text: `Contact ${user?.name || "User"}`,
                                url: window.location.href,
                            })
                            .catch((error) => console.error('Error with navigator.share:', error));
                    } else {
                        console.log('Share API is not supported in this browser.');
                    }
                }}
                className="flex items-center justify-center bg-white text-gray-900 px-8 py-3 rounded-full shadow-xl hover:shadow-2xl hover:bg-gray-50 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50 w-full sm:w-auto mt-4"
            >
                <FaShareAlt className="mr-3 text-xl text-blue-600" />
                <span className="text-xl font-semibold">Сподели</span>
            </button>

        </>
    )
};

export default ActionButtons2;
