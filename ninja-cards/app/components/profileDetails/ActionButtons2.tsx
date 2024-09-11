// File: components/ActionButtons2.tsx

import React, { useState } from 'react';
import { FaPhoneAlt, FaShareAlt, FaEnvelope } from 'react-icons/fa';
import ExchangeContactModal from './ExchangeContact';
import { BASE_API_URL } from '@/utils/constants';

interface User {
    id: string;
    name: string;
    email: string;
    phone1: string;
    // ... other properties
}

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
        <div className="flex flex-col space-y-4  mb-8">
            <button
                onClick={() => window.location.href = `tel:${user?.phone1}`}
                className="flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white px-8 py-4 rounded-full shadow-lg hover:gray-950 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-50 w-full sm:w-auto"
            >
                <FaPhoneAlt className="mr-3 text-2xl" />
                <span className="text-lg font-semibold">Обади се</span>
            </button>
            <button
                onClick={() => navigator.share && navigator.share({
                    title: user?.name,
                    text: `Contact ${user?.name}`,
                    url: window.location.href
                })}
                className="flex items-center justify-center bg-white  text-black px-8 py-4 rounded-full shadow-lg hover:gray-500  transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 w-full sm:w-auto"
            >
                <FaShareAlt className="mr-3 text-2xl" />
                <span className="text-lg font-semibold">Сподели</span>
            </button>
            <button
                onClick={handleExchangeContact}
                className="flex items-center justify-center  bg-gradient-to-t from-gray-900 to-black text-white px-8 py-4 rounded-full shadow-lg hover:gray-950 ttransition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-50 w-full sm:w-auto"
            >
                <FaEnvelope className="mr-3 text-2xl" />
                <span className="text-lg font-semibold">Разменете Контакти</span>
            </button>

            <ExchangeContactModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSubmit={handleSubmitContact}
            />
        </div>
    );
};

export default ActionButtons2;
