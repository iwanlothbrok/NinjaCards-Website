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

type SocialProfileKeys = 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'github' | 'youtube' | 'tiktok' | 'googleReview' | 'revolut';
type ColorTheme = {
    name: string;
    background: string;
    text: string;
    border: string;
    highlight: string;
    button: string;
};

const colorThemes: ColorTheme[] = [
    {
        name: 'black',
        background: "bg-black",
        text: "text-gray-200",
        border: "border-gray-700",
        highlight: "text-yellow-400",
        button: "bg-gray-800",
    },
    {
        name: 'white',
        background: "bg-gray-100",
        text: "text-gray-800",
        border: "border-gray-300",
        highlight: "text-blue-600",
        button: "bg-blue-500",
    },
    {
        name: 'gray',
        background: "bg-gray-700",
        text: "text-gray-100",
        border: "border-gray-600",
        highlight: "text-green-400",
        button: "bg-green-500",
    },
    {
        name: 'orange',
        background: "bg-gray-900",
        text: "text-white",
        border: "border-orange-500",
        highlight: "text-orange-500",
        button: "bg-yellow-700",
    },
    {
        name: 'teal',
        background: "bg-teal-600",
        text: "text-white",
        border: "border-teal-700",
        highlight: "text-pink-400",
        button: "bg-pink-500",
    },
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
    const [cardStyle, setCardStyle] = useState<ColorTheme>(colorThemes[0]);
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
        if (currentUser?.selectedColor) {
            const selectedTheme = colorThemes.find(theme => theme.name === currentUser.selectedColor);
            if (selectedTheme) setCardStyle(selectedTheme);
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
        if (currentUser?.id) {
            const selectedTheme = colorThemes.find(theme => theme.name === colorName);
            if (selectedTheme) setCardStyle(selectedTheme);
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
        <div className={`relative ${cardStyle.background} pt-20`}>
            <ProfileHeader user={currentUser} cardStyle={cardStyle} />
            <motion.div
                className={`relative z-10 w-full max-w-md p-8 bg-gradient-to-b ${cardStyle.background} ${cardStyle.border}`}
                style={{
                    background: `linear-gradient(180deg, ${cardStyle.background}, transparent)`,
                    borderColor: `${cardStyle.border}`
                }}
            >
                <ActionButtons2 user={currentUser} />
                <SocialMediaLinks user={currentUser} />
                <FloatingButtons generateVCF={generateVCF} />
                {user?.id === currentUser?.id && (
                    <BackgroundSelector
                        themes={colorThemes}
                        onSelect={handleColorSelection}
                        currentTheme={cardStyle.name}
                    />
                )}
            </motion.div>
        </div>
    );

}

const ProfileHeader: React.FC<{ user: User; cardStyle: ColorTheme }> = ({ user, cardStyle }) => (
    <div className={`relative flex flex-col items-center ${cardStyle.background}`}>
        <div className={`absolute top-20 p-1 bg-${cardStyle.name}`}>
            <motion.div className={`w-40 h-40 rounded-full ${cardStyle.border}`}>
                {user?.image ? (
                    <img className="w-full h-full object-cover" src={user.image} alt="Profile" />
                ) : (
                    <FaUserCircle className="w-full h-full" />
                )}
            </motion.div>
        </div>
        <div className={`relative w-full max-w-md ${cardStyle.background}`}>
            <div className="text-center">
                <h1 className={`${cardStyle.highlight} text-2xl font-bold`}>{user?.name}</h1>
                <p className={`${cardStyle.text} text-lg`}>{user?.position}</p>
                <p className={`${cardStyle.text} text-lg`}>{user?.company}</p>
            </div>
        </div>
    </div>
);
const BackgroundSelector: React.FC<{ themes: ColorTheme[]; onSelect: (name: string) => void; currentTheme: string }> = ({ themes, onSelect, currentTheme }) => (
    <div className="mt-6 text-center">
        <h3 className="text-xl font-semibold">Customize Card Background</h3>
        <div className="flex justify-center space-x-4 mt-4">
            {themes.map(({ name, background }) => (
                <button
                    key={name}
                    onClick={() => onSelect(name)}
                    className={`w-10 h-10 rounded-full border-2 ${background} ${currentTheme === name ? 'ring-4 ring-offset-2 ring-blue-500' : ''}`}
                />
            ))}
        </div>
    </div>
);



export default ProfileDetailsContent;