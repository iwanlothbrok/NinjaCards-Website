import React, { useCallback } from 'react';
import { FaCamera, FaDownload, FaPhoneAlt, FaShareAlt } from 'react-icons/fa';
import { User } from '@/types/user';
import { BASE_API_URL } from '@/utils/constants';
import html2canvas from 'html2canvas';


const buttonStyles = "flex items-center justify-center bg-white text-gray-900 px-8 py-3 rounded-full shadow-xl hover:shadow-2xl hover:bg-gray-50 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 w-full sm:w-auto";

const ActionButtons2: React.FC<{ generateVCF: () => void; user: User | null }> = ({ generateVCF, user }) => {



    if (!user) return null;

    const handleButtonClick = () => {
        console.log('isDirect ' + user.isDirect);

        // If isDirect is true, generate the VCF and then show the profile
        generateVCF();
        // Showing the profile happens automatically as it's part of the UI
    };

    const handleContactShare = () => {
        if (user.id) {
            fetch(`${BASE_API_URL}/api/dashboard/incrementProfileShares`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id }),
            }).catch((error) => console.error('Failed to increment profile shares:', error));
        }

        if (navigator.share) {
            navigator
                .share({
                    title: user.name || "Share Contact",
                    text: `Contact ${user.name || "User"}`,
                    url: window.location.href,
                })
                .catch((error) => console.error('Error with navigator.share:', error));
        } else {
            console.log('Share API is not supported in this browser.');
        }
    };

    return (
        <>
            <button
                onClick={() => window.location.href = `tel:${user.phone1}`}
                className={`${buttonStyles} focus:ring-teal-500 focus:ring-opacity-50`}
            >
                <FaPhoneAlt className="mr-3 text-xl text-teal-600" />
                <span className="text-xl font-semibold">
                    {user.language === 'bg' ? 'Обади се' : 'Call'}
                </span>
            </button>

            <button
                onClick={handleContactShare}
                className={`${buttonStyles} focus:ring-blue-600 focus:ring-opacity-50 mt-4`}
            >
                <FaShareAlt className="mr-3 text-xl text-blue-600" />
                <span className="text-xl font-semibold">
                    {user.language === 'bg' ? 'Сподели Контакт' : 'Share Contact'}
                </span>
            </button>

            <button
                onClick={handleButtonClick}
                className={`${buttonStyles} focus:ring-yellow-500 focus:ring-opacity-50 mt-4`}
            >
                <FaDownload className="mr-3 text-xl text-yellow-500" />
                <span className="text-xl font-semibold">
                    {user.language === 'bg' ? 'Запази Контакт' : 'Save Contact'}
                </span>
            </button>
        </>
    );
};

export default ActionButtons2;
