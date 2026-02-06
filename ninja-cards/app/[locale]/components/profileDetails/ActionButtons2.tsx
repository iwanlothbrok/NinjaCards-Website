import React, { useState } from 'react';
import { FaPhoneAlt, FaShareAlt, FaDownload, FaWpforms, FaRegAddressBook } from 'react-icons/fa';
import { User } from '@/types/user';
import { BASE_API_URL } from '@/utils/constants';
import LeadForm from './LeadForm';

const buttonStyles = "flex items-center justify-center bg-white text-gray-900 px-8 py-3 rounded-full shadow-xl hover:shadow-2xl hover:bg-gray-50 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 w-full sm:w-auto";

const ActionButtons2: React.FC<{ generateVCF: () => void; user: User | null }> = ({ generateVCF, user }) => {
    const [showLeadForm, setShowLeadForm] = useState(false);

    if (!user) return null;

    const handleButtonClick = () => {
        generateVCF();
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

    const closeModal = () => {
        console.log('Closing modal');
        setShowLeadForm(false);
    };

    return (
        <>

            {showLeadForm && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm transition-all"
                    aria-hidden="true"
                />
            )}

            <button
                onClick={() => window.location.href = `tel:${user.phone1}`}
                className={`${buttonStyles} focus:ring-gray-400 focus:ring-opacity-30 border border-gray-200`}
            >
                <FaPhoneAlt className="mr-3 text-xl text-gray-700" />
                <span className="text-xl font-medium tracking-wide">
                    {user.language === 'bg' ? 'Обади се' : 'Call'}
                </span>
            </button>

            <button
                onClick={handleContactShare}
                className={`${buttonStyles} focus:ring-gray-400 focus:ring-opacity-30 border border-gray-200 mt-4`}
            >
                <FaShareAlt className="mr-3 text-xl text-gray-700" />
                <span className="text-xl font-medium tracking-wide">
                    {user.language === 'bg' ? 'Сподели Контакт' : 'Share Contact'}
                </span>
            </button>

            <button
                onClick={handleButtonClick}
                className={`${buttonStyles} focus:ring-gray-400 focus:ring-opacity-30 border border-gray-200 mt-4`}
            >
                <FaDownload className="mr-3 text-xl text-gray-700" />
                <span className="text-xl font-medium tracking-wide">
                    {user.language === 'bg' ? 'Запази Контакт' : 'Save Contact'}
                </span>
            </button>

            <button
                onClick={() => setShowLeadForm(true)}
                className={`${buttonStyles} focus:ring-gray-400 focus:ring-opacity-30 border border-gray-200 mt-4`}
            >
                <FaRegAddressBook className="mr-3 text-xl text-gray-700" />
                <span className="text-xl font-medium tracking-wide">
                    {user.language === 'bg' ? 'Остави контакт' : 'Leave Contact'}
                </span>
            </button>

            <LeadForm
                userId={user.id}
                name={user.name ?? user.firstName}
                isVisible={showLeadForm}
                onClose={() => setShowLeadForm(false)}
            />

        </>
    );
};

export default ActionButtons2;
