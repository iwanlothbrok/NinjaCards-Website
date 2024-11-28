// File: components/ActionButtons2.tsx

import React, { useState } from 'react';
import { FaPhoneAlt, FaShareAlt, FaEnvelope } from 'react-icons/fa';
import ExchangeContactModal from './ExchangeContact';
import { BASE_API_URL } from '@/utils/constants';
import { User } from '@/types/user';


const ActionButtons2: React.FC<{ user: User | null }> = ({ user }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleExchangeContact = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleSubmitContact = async (vCard: string) => {
        try {
            await fetch(`${BASE_API_URL}/api/profile/exchangeContact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: user?.email,
                    vCard,
                }),
            });
            alert('Contact information sent successfully');
        } catch (error) {
            console.error('Error sending contact information:', error);
            alert('Failed to send contact information. Please try again.');
        }
    };

    return (
        <>
            {/* Call Button */}
            <button
                onClick={() => window.location.href = `tel:${user?.phone1}`}
                className="flex items-center justify-center bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 w-full sm:w-auto"
            >
                <FaPhoneAlt className="mr-3 text-2xl" />
                <span className="text-lg font-semibold">Обади се</span>
            </button>

            {/* Share Button */}
            <button
                onClick={() => navigator.share && navigator.share({
                    title: user?.name,
                    text: `Contact ${user?.name}`,
                    url: window.location.href
                })}
                className="flex items-center justify-center bg-gradient-to-r from-gray-200 to-gray-300 text-black px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 w-full sm:w-auto"
            >
                <FaShareAlt className="mr-3 text-2xl" />
                <span className="text-lg font-semibold">Сподели</span>
            </button>

            {/* Exchange Contact Button */}


            {/* Exchange Contact Modal */}
            <ExchangeContactModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSubmit={handleSubmitContact}
            />
        </>
    )
};

export default ActionButtons2;
