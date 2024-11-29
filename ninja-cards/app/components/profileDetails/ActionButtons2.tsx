// File: components/ActionButtons2.tsx

import React from 'react';
import { FaPhoneAlt, FaShareAlt } from 'react-icons/fa';
import { User } from '@/types/user';

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
                onClick={() => navigator.share && navigator.share({
                    title: user?.name,
                    text: `Contact ${user?.name}`,
                    url: window.location.href
                })}
                className="flex items-center justify-center bg-white text-gray-900 px-8 py-3 rounded-full shadow-xl hover:shadow-2xl hover:bg-gray-50 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50 w-full sm:w-auto mt-4"
            >
                <FaShareAlt className="mr-3 text-xl text-blue-600" />
                <span className="text-xl font-semibold">Сподели</span>
            </button>
        </>
    )
};

export default ActionButtons2;
