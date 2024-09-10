"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import ExchangeContact from '../components/profileDetails/ExchangeContact';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaUserCircle, FaExchangeAlt, FaDownload } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ActionButtons2 from '../components/profileDetails/ActionButtons2';
import { BASE_API_URL } from '@/utils/constants';
import SocialMediaLinks from '../components/profileDetails/SocialMediaLinks';
import { User } from '@/types/user';

const cardBackgroundOptions = [
    {
        name: 'black',
        bgClass: "bg-black",
        textClass: "text-white",
        borderClass: "border-black",
        highlightClass: "text-white",
        buttonBgClass: "bg-white",
        cardCoverBgClass: "from-black"
    },
    {
        name: 'white',
        bgClass: "bg-white",
        textClass: "text-black",
        borderClass: "border-white",
        highlightClass: "text-black",
        buttonBgClass: "bg-black",
        cardCoverBgClass: "from-white"
    },
    {
        name: 'gray',
        bgClass: "bg-gray-500",
        textClass: "text-black",
        borderClass: "border-gray-500",
        highlightClass: "text-black",
        buttonBgClass: "bg-black",
        cardCoverBgClass: "from-gray"
    },
    {
        name: 'orange',
        bgClass: "bg-black",
        textClass: "text-orange-500",
        borderClass: "border-black",
        highlightClass: "text-orange-500",
        buttonBgClass: "bg-orange-500",
        cardCoverBgClass: "from-black"
    },
    {
        name: 'teal',
        bgClass: "bg-black",
        textClass: "text-teal-400",
        borderClass: "border-black",
        highlightClass: "text-teal-400",
        buttonBgClass: "bg-teal-400",
        cardCoverBgClass: "from-black"
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
        console.log(userData);

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
    const [showTooltip, setShowTooltip] = useState<string | null>(null);
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
    const handleTouchStart = (action: string) => {
        setTimeout(() => setShowTooltip(action), 500);
    };

    const handleTouchEnd = () => {
        setShowTooltip(null);
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
                className="flex-grow flex items-center justify-center bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-red-900 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
                <FaDownload className="mr-2 text-3xl" />
                <span className="text-lg font-semibold">СВАЛИ КОНТАКТ</span>
            </button>

            {/* Exchange Contact Button */}
            <button
                onClick={handleExchangeContact}
                className="w-16 flex items-center justify-center bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-green-600 transition-all duration-300 ease-in-out transform hover:scale-105"
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

        // // Include empty ORG and TITLE fields if not provided
        // vCard.push("ORG:;");
        // vCard.push("TITLE:;");

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
        const socialProfiles = {
            'facebook': 'Facebook',
            'twitter': 'Twitter',
            'instagram': 'Instagram',
            'linkedin': 'LinkedIn',
            'github': 'GitHub',
            'youtube': 'YouTube',
            'tiktok': 'TikTok',
            'googleReview': 'Google Review',
            'revolut': 'Revolut',
            'qrCode': 'QR Code'
        };
        // Object.keys(socialProfiles).forEach((key) => {
        //     const url = currentUser[key as keyof typeof currentUser];
        //     if (url) vCard.push(`URL;type=${socialProfiles[key]};:${url}`);
        // });


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

    const shareContact = () => {
        if (navigator.share) {
            navigator.share({
                title: currentUser?.name ? `Контакт ${currentUser.name}` : 'Контакт',
                text: currentUser?.name ? `Вижте контактните данни на ${currentUser.name}` : 'Вижте контактните данни',
                url: window.location.href,
            });
        } else {
            generateVCF(); // Фалбек към изтегляне на VCF, ако споделянето не се поддържа
        }
    };

    if (!currentUser) return <div className="flex justify-center items-center py-72"><img src="/load.gif" alt="Loading..." className="w-40 h-40" /></div>;
    if (loading) return <div className="flex justify-center items-center py-72"><img src="/load.gif" alt="Loading..." className="w-40 h-40" /></div>;
    return (
        <div
            className={`min-h-screen flex items-center justify-center ${cardStyle.textClass}`}
            style={{
                backgroundImage: `
                    linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.8)',
            }}
        >
            <motion.div
                className={`relative z-10 w-full pt-40 max-w-md p-8 rounded-lg bg-gradient-to-b ${cardStyle.cardCoverBgClass} to-black   bg-opacity-5 shadow-2xl`}
                style={{ borderRadius: 'inherit' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <ProfileHeader user={currentUser} cardStyle={cardStyle} />
                <motion.div
                    className="mt-6"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <ActionButtons2 user={currentUser} />
                </motion.div>
                <motion.div
                    className="mt-6"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <SocialMediaLinks user={currentUser} cardStyle={cardStyle} />
                </motion.div>

                <FloatingButtons generateVCF={generateVCF} />

                {user?.id === currentUser.id && (
                    <motion.div
                        className="mt-8"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.6 }}
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
    );
}

const ProfileHeader: React.FC<{ user: User; cardStyle: any }> = ({ user, cardStyle }) => (
    <div className={`relative flex flex-col items-center p-4 bg-gradient-to-b ${cardStyle.cardCoverBgClass} to-black rounded-lg shadow-lg`}>
        {/* Centered Profile Image with White Background */}
        <div className="relative z-10 rounded-full p-2 bg-white shadow-xl">
            <motion.div
                className={`w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 ${cardStyle.borderClass}`} // Increased size
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
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

        {/* User Information below the image */}
        <div className="mt-4 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">  {/* Increased text size */}
                {user?.name}
            </h1>
            <p className={`text-lg sm:text-xl md:text-2xl mt-2 ${cardStyle.highlightClass}`}> {/* Increased text size */}
                {user?.position}
            </p>
            <p className={`text-lg sm:text-xl md:text-2xl ${cardStyle.highlightClass}`}>  {/* Increased text size */}
                {user?.company}
            </p>
            {/* {user?.bio && (
                <p className="text-md sm:text-lg mt-3 text-gray-300 max-w-xs leading-relaxed">
                    {user.bio.length > 120 ? `${user.bio.substring(0, 117)}...` : user.bio}
                </p>
            )} */}
        </div>
    </div>
);


const BackgroundSelector: React.FC<{
    cardBackgroundOptions: typeof cardBackgroundOptions;
    handleColorSelection: (colorName: string) => void;
    cardStyle: any;
}> = ({ cardBackgroundOptions, handleColorSelection, cardStyle }) => (
    <div className="mt-6 text-center">
        <h3 className={`text-xl font-semibold ${cardStyle.highlightClass}`}>Customize Card Background</h3>
        <div className="flex justify-center space-x-4 mt-4">
            {cardBackgroundOptions.map(({ name, bgClass }) => (
                <button
                    key={name}
                    onClick={() => handleColorSelection(name)}
                    aria-label={`Select ${name} background`}
                    className={`w-10 h-10 rounded-full border-2 transition-transform transform hover:scale-110 ${bgClass} ${cardStyle.name === name ? 'ring-4 ring-offset-2 ring-blue-500' : ''}`}
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