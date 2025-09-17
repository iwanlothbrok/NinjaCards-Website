"use client";

import React from 'react';
import { FaDownload, FaExchangeAlt } from 'react-icons/fa';
import ExchangeContact from './ExchangeContact';

const FloatingButtons: React.FC<{
    generateVCF: () => void;
    handleExchangeContact: () => void;
    isModalOpen: boolean;
    handleModalClose: () => void;
    handleSubmitContact: (vCard: string) => Promise<void>;
}> = ({ generateVCF, handleExchangeContact, isModalOpen, handleModalClose, handleSubmitContact }) => (
    <div className="fixed bottom-6 left-0 right-0 px-4 z-20 flex justify-center space-x-4 max-w-screen-md mx-auto">
        {/* Save Contact Button */}
        <button
            onClick={generateVCF}
            className="flex-grow flex items-center justify-center bg-white text-black py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-300 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
            <FaDownload className="mr-2 text-3xl" />
            <span className="text-lg font-semibold">Download Contact</span>
        </button>

        {/* Exchange Contact Button */}
        <button
            onClick={handleExchangeContact}
            className="w-16 flex items-center justify-center bg-gray-800 text-white py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-950 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
            <FaExchangeAlt className="text-3xl" />
        </button>

        <ExchangeContact
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSubmit={handleSubmitContact}
        />
    </div>
);

export default FloatingButtons;
