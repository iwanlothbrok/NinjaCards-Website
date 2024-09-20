"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import ExchangeContact from '../components/profileDetails/ExchangeContact';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaUserCircle, FaExchangeAlt, FaDownload, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ActionButtons2 from '../components/profileDetails/ActionButtons2';
import { BASE_API_URL } from '@/utils/constants';
import SocialMediaLinks from '../components/profileDetails/SocialMediaLinks';
import { User } from '@/types/user';

type SocialProfileKeys = 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'github' | 'youtube' | 'tiktok' | 'googleReview' | 'revolut';

const cardBackgroundOptions = [
    {
        name: 'black',
        bgClass: "bg-black",
        textClass: "text-gray-200",      // Softer white for less harsh contrast
        borderClass: "border-orange",  // Dark gray to soften the black borders
        highlightClass: "text-orange", // Yellow for a bright and visible highlight
        cardCoverBgClass: "from-black",
        opposite: 'bg-white'
    },
    {
        name: 'white',
        bgClass: "bg-white",          // Softer off-white to reduce strain on the eyes
        textClass: "text-gray-900",      // Dark gray for better contrast than black
        borderClass: "border-blue-600",  // Light gray to keep borders subtle
        highlightClass: "text-blue-600", // Blue highlight for a clean contrast
        cardCoverBgClass: "from-white",
        opposite: 'bg-black'
    },
    {
        name: 'gray-600',
        bgClass: "bg-gray-800",          // Darker gray for a sleek modern look
        textClass: "text-gray-100",      // Light gray text to contrast well
        borderClass: "border-green-600",  // Slightly lighter border than background
        highlightClass: "text-green-400", // Bright green for a pop of color
        cardCoverBgClass: "from-gray-800",
        opposite: 'bg-black'
    },
    {
        name: 'orange',
        bgClass: "bg-gray-900",          // Darker gray for a sleek modern look
        textClass: "text-white",         // White text for clear contrast
        borderClass: "border-orange",// Slightly darker orange border
        highlightClass: "text-orange", // Lighter yellow for soft, visible highlight
        cardCoverBgClass: "from-gray-900",
        opposite: 'bg-orange'
    },
    {
        name: 'teal-700',
        bgClass: "bg-teal-700",          // Bold teal background
        textClass: "text-white",         // White text for contrast
        borderClass: "border-teal-500",  // Darker teal border
        highlightClass: "text-orange", // Bright pink highlight for contrast
        cardCoverBgClass: "from-teal-700",
        opposite: 'bg-white'
    }
];

const saveSelectedColor = async (userId: string, color: string, showAlert: (message: string, title: string, color: string) => void) => {
    try {
        const response = await fetch(`${BASE_API_URL}/api/profile/saveColor`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, selectedColor: color }),
        });
        if (!response.ok) throw new Error('Failed to save selected color');
        showAlert('Color saved successfully', 'Success', 'green');
    } catch (error) {
        console.error(error);
        showAlert('Failed to save color', 'Error', 'red');
    }
};


const fetchUser = async (userId: string, setUser: React.Dispatch<React.SetStateAction<User | null>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>, showAlert: (message: string, title: string, color: string) => void) => {
    setLoading(true);
    try {
        const response = await fetch(`${BASE_API_URL}/api/profile/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        const userData: User = await response.json();
        setUser(userData);
    } catch (error) {
        console.error(error);
        showAlert('Failed to load profile', 'Error', 'red');
    } finally {
        setLoading(false);
    }
};

const ProfileDetailsContent: React.FC<{ userId: string }> = ({ userId }) => {
    const { user } = useAuth();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ message: string; title: string; color: string } | null>(null);
    const [cardStyle, setCardStyle] = useState(cardBackgroundOptions[0]);
    const [isPhone, setIsPhone] = useState(false);
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
                    vCard,
                }),
            });
            // alert('Contact information sent successfully');
        } catch (error) {
            console.error('Error sending contact information:', error);
            // alert('Failed to send contact information. Please try again.');
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUser(userId, setCurrentUser, setLoading, showAlert);
        }
    }, [userId]);

    useEffect(() => {
        if (currentUser && currentUser.selectedColor) {
            const selectedCardStyle = cardBackgroundOptions.find(option => option.name === currentUser.selectedColor);
            if (selectedCardStyle) {
                setCardStyle(selectedCardStyle);
            }
        }
    }, [currentUser]);

    useEffect(() => {
        const checkIfPhone = () => {
            setIsPhone(window.innerWidth <= 768);
        };

        // Initial check
        checkIfPhone();

        // Listen for window resize
        window.addEventListener('resize', checkIfPhone);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', checkIfPhone);
        };
    }, []);

    const handleColorSelection = (colorName: string) => {
        if (currentUser && currentUser.id) {
            saveSelectedColor(currentUser.id, colorName, showAlert);
            const selectedCardStyle = cardBackgroundOptions.find(option => option.name === colorName);
            if (selectedCardStyle) {
                setCardStyle(selectedCardStyle);
            }
        }
    };

    const showAlert = (message: string, title: string, color: string) => {
        setAlert({ message, title, color });
        setTimeout(() => setAlert(null), 4000);
    };

    const FloatingButtons: React.FC<{ generateVCF: () => void; }> = ({ generateVCF }) => (
        <div className="fixed bottom-6 left-0 right-0 px-4 z-20 flex justify-center space-x-4 max-w-screen-md mx-auto">
            {/* Save Contact Button */}
            <button
                onClick={generateVCF}
                className="flex-grow flex items-center justify-center bg-white text-black py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-300 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
                <FaDownload className="mr-2 text-3xl" />
                <span className="text-lg font-semibold">СВАЛИ КОНТАКТ</span>
            </button>

            {/* Exchange Contact Button */}
            <button
                onClick={handleExchangeContact}
                className="w-16 flex items-center justify-center bg-gray-800 text-white py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-950 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
                <FaExchangeAlt className="text-3xl" />
            </button>
            <div className="z-50"  >

                <ExchangeContact
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    onSubmit={handleSubmitContact}
                />
            </div>

        </div >
    );

    const generateVCF = () => {
        if (!currentUser) return;

        const vCard = [
            "BEGIN:VCARD",
            "VERSION:3.0",
            "CLASS:PUBLIC", // Added CLASS
            "PRODID:-//class_vcard //NONSGML Version 1//EN" // Added PRODID
        ];

        if (currentUser.lastName && currentUser.firstName) {
            vCard.push(`N:${currentUser.lastName};${currentUser.firstName};;;`);
        }
        if (currentUser.name) {
            vCard.push(`FN:${currentUser.name}`);
        }

        // PHOTO with flexible format support
        if (currentUser.image) {
            vCard.push(`PHOTO;ENCODING=b;TYPE=JPEG|PNG:${currentUser.image}`);
        }

        if (currentUser.position) {
            vCard.push(`TITLE:${currentUser.position}`);
            vCard.push(`ORG:${currentUser.company}`);
        } else {
            vCard.push("TITLE:;");
        }

        // Detailed phone number types
        if (currentUser.phone1) {
            vCard.push(`TEL;TYPE=Phone,type=VOICE;type=pref:${currentUser.phone1}`);
        }
        if (currentUser.phone2) {
            vCard.push(`TEL;type=Phone;type=VOICE:${currentUser.phone2}`);
        }

        // Email with detailed type
        if (currentUser.email) {
            vCard.push(`EMAIL;type=INTERNET;type=Email;type=pref:${currentUser.email}`);
        }
        if (currentUser.email2) {
            vCard.push(`EMAIL;type=INTERNET;type=Email 2:${currentUser.email2}`);
        }

        // Address, ensure it's always included
        const address = [
            currentUser.street1 || '',
            currentUser.city || '',
            currentUser.state || '',
            currentUser.zipCode || '',
            currentUser.country || ''
        ].filter(Boolean).join(';');
        vCard.push(`ADR;type=WORK;type=pref:;;${address}`);

        // URLs with specific labels
        if (currentUser.website) {
            vCard.push(`URL;type=Website;type=pref:${currentUser.website}`);
        }
        const socialProfiles: Record<SocialProfileKeys, string> = {
            facebook: 'Facebook',
            twitter: 'Twitter',
            instagram: 'Instagram',
            linkedin: 'LinkedIn',
            github: 'GitHub',
            youtube: 'YouTube',
            tiktok: 'TikTok',
            googleReview: 'Google Review',
            revolut: 'Revolut',
        };

        (Object.keys(socialProfiles) as SocialProfileKeys[]).forEach((key) => {
            // Assuming `url` is derived or checked elsewhere based on `key`
            const url = currentUser[key as keyof typeof currentUser];
            if (url) vCard.push(`URL;type=${socialProfiles[key]};:${url}`);
        });


        // Adding a NOTE field
        if (currentUser.bio) {
            vCard.push(`NOTE;CHARSET=UTF-8:${currentUser.bio}`);
        }

        // Add a REV field for revision date
        vCard.push(`REV:${new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15)}Z`);

        vCard.push("END:VCARD");

        const blob = new Blob([vCard.join("\r\n")], { type: 'text/vcard' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${currentUser.firstName}_${currentUser.lastName}.vcf`;
        link.click();
        URL.revokeObjectURL(url);
    };


    if (!currentUser) return <div className="flex justify-center items-center py-72"><img src="/load.gif" alt="Loading..." className="w-40 h-40" /></div>;
    if (loading) return <div className="flex justify-center items-center py-72"><img src="/load.gif" alt="Loading..." className="w-40 h-40" /></div>;
    return (
        <div className={`relative ${cardStyle.opposite} pt-20`}>
            {/* Profile Header Section */}
            <ProfileHeader user={currentUser} cardStyle={cardStyle} isModalOpen={isModalOpen} />

            {/* Content Section with Background */}
            <div
                className={`relative flex items-center justify-center ${cardStyle.textClass}`}
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.8)',
                }}
            >
                {/* Card Section with White Background */}
                <motion.div
                    className={`relative z-10 w-full  p-8 max-w-md bg-gradient-to-b ${cardStyle.cardCoverBgClass} to-black shadow-none`} // Removed shadow
                >
                    {/* Action Buttons */}
                    <motion.div
                        className={`mt-6 z-50`}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <div className="flex flex-col space-y-4 mb-4 z-10001">

                            <ActionButtons2 user={currentUser} />
                            <button
                                onClick={handleExchangeContact}
                                className="flex items-center justify-center bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 w-full sm:w-auto"
                            >
                                <FaEnvelope className="mr-3 text-2xl" />
                                <span className="text-lg font-semibold">Разменете Контакти</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* Social Media Links */}
                    <motion.div
                        className="mt-6"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <SocialMediaLinks user={currentUser} />
                    </motion.div>

                    {/* Floating Buttons */}
                    <FloatingButtons generateVCF={generateVCF} />

                    {/* Background Selector (visible only for the current user) */}
                    {user?.id === currentUser.id && (
                        <motion.div
                            className="mt-8"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                duration: 0.6,
                                ease: 'easeOut',
                                delay: 0.6,
                            }}
                        >
                            <BackgroundSelector
                                cardBackgroundOptions={cardBackgroundOptions}
                                handleColorSelection={handleColorSelection}
                                cardStyle={cardStyle}
                            />
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );



}

const ProfileHeader: React.FC<{ user: User; cardStyle: any; isModalOpen: boolean }> = ({ user, cardStyle, isModalOpen }) => (

    <div
        className={`relative flex flex-col items-center bg-cover bg-center bg-no-repeat sm:bg-none ${cardStyle.opposite} pt-72 overflow-hidden`}
        style={{ backgroundImage: `url(${cardStyle.opposite === 'bg-black' ? '/cover02.png' : '/cover.png'})` }} // Background only for mobile
    >
        {/* Circular profile image with white background */}
        <div
            className={`absolute top-20 rounded-full  mt-32 bg-${cardStyle.name} shadow-lg`}
            style={{ zIndex: isModalOpen ? 0 : 20 }} // Lower z-index if modal is open
        >
            <motion.div
                className={`w-44 h-44 rounded-full overflow-hidden border-2 ${cardStyle.borderClass}`}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
            >
                {user?.image ? (
                    <img
                        className="w-full h-full object-cover"
                        src={`data:image/jpeg;base64,${user.image}`}
                        alt="Profile"
                    />
                ) : (
                    <FaUserCircle className="w-full h-full text-gray-300" />
                )}
            </motion.div>
        </div>

        {/* White Background Section aligned with the card */}
        <div className={`relative w-full max-w-md ${cardStyle.bgClass} z-10 pt-24 -mt-17 mx-auto rounded-none`}>
            <div className="text-center mt-8">
                <h1 className={`text-3xl font-bold ${cardStyle.highlightClass}`}>
                    {user?.name}
                </h1>
                <p className={`text-lg mt-1 ${cardStyle.textClass}`}>
                    {user?.position}
                </p>
                <p className={`text-lg ${cardStyle.textClass}`}>
                    {user?.company}
                </p>
            </div>
        </div>
    </div>
);

const BackgroundSelector: React.FC<{
    cardBackgroundOptions: typeof cardBackgroundOptions;
    handleColorSelection: (colorName: string) => void;
    cardStyle: any;
}> = ({ cardBackgroundOptions, handleColorSelection, cardStyle }) => (
    <div className="mt-6 text-center">
        <h3 className={`text-xl font-semibold ${cardStyle.highlightClass}`}>Промени цветовете</h3>
        <div className="flex justify-center space-x-4 mt-4">
            {cardBackgroundOptions.map(({ name, bgClass }) => (
                <button
                    key={name}
                    onClick={() => handleColorSelection(name)}
                    aria-label={`Select ${name} background`}
                    className={`w-10 h-10 rounded-full border-2 transition-transform transform hover:scale-110 bg-${name} ${cardStyle.name === name ? 'ring-4 ring-offset-2 ring-blue-500' : ''}`}
                >
                    {cardStyle.name === name && (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4 text-white mx-auto"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </button>
            ))}
        </div>
    </div>
);


export default ProfileDetailsContent;