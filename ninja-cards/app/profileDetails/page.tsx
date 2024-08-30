"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ExchangeContact from '../components/profileDetails/ExchangeContact'
import { useRouter, useSearchParams } from 'next/navigation';
import {
    FaUserCircle, FaExchangeAlt, FaDownload, FaClipboard
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ActionButtons2 from '../components/profileDetails/ActionButtons2'

interface User {
    id: string;
    name: string;
    email: string;
    firstName: string;
    lastName: string;
    company: string;
    position: string;
    phone1: string;
    phone2: string;
    email2: string;
    street1: string;
    street2: string;
    zipCode: string;
    city: string;
    state: string;
    country: string;
    bio: string;
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    github: string;
    youtube: string;
    image: string;
    tiktok: string;
    googleReview: string;
    revolut: string;
    qrCode: string;
    selectedColor: string;
    cv: string;
    behance: string;
    paypal: string;
    trustpilot: string;
    viber: string;
    whatsapp: string;
    website: string;
}


const cardBackgroundOptions = [
    {
        name: 'orange',
        bgClass: "bg-orange",
        textClass: "text-gray-200",
        borderClass: "border-orange",
        highlightClass: "text-orange",
        buttonBgClass: "bg-gray-700",
        cardCoverBgClass: "from-bgOrange"
    },
    {
        name: 'blue',
        bgClass: "bg-blue-500",
        textClass: "text-white",
        borderClass: "border-blue-500",
        highlightClass: "text-blue-500",
        buttonBgClass: "bg-gray-700",
        cardCoverBgClass: "from-bgBlue"
    },
    {
        name: 'purple',
        bgClass: "bg-purple-500",
        textClass: "text-white",
        borderClass: "border-purple-500",
        highlightClass: "text-purple-500",
        buttonBgClass: "bg-gray-700",
        cardCoverBgClass: "from-bgViolet"
    },
    {
        name: 'green',
        bgClass: "bg-green-500",
        textClass: "text-white",
        borderClass: "border-green-500",
        highlightClass: "text-green-500",
        buttonBgClass: "bg-gray-700",
        cardCoverBgClass: "from-bgGreen "
    },
    {
        name: 'yellow',
        bgClass: "bg-yellow-400",
        textClass: "text-white",
        borderClass: "border-yellow-400",
        highlightClass: "text-yellow-400",
        buttonBgClass: "bg-gray-700",
        cardCoverBgClass: "from-bgYellow"

    },
    {
        name: 'teal',
        bgClass: "bg-teal-400",
        textClass: "text-white",
        borderClass: "border-teal-400",
        highlightClass: "text-teal-400",
        buttonBgClass: "bg-gray-700",
        cardCoverBgClass: "from-bgTeal"
    }
];


const saveSelectedColor = async (userId: string, color: string, showAlert: (message: string, title: string, color: string) => void) => {
    try {
        const response = await fetch(`/api/profile/saveColor`, {
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
        const response = await fetch(`/api/profile/${userId}`);
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

const ProfileDetails: React.FC = () => {
    const { user } = useAuth();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ message: string; title: string; color: string } | null>(null);
    const [cardStyle, setCardStyle] = useState(cardBackgroundOptions[0]);
    const [showTooltip, setShowTooltip] = useState<string | null>(null);
    const [isPhone, setIsPhone] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams?.get('id');

    const handleExchangeContact = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleSubmitContact = async (vCard: string) => {
        try {
            await fetch('/api/profile/exchangeContact', {
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
        Object.keys(socialProfiles).forEach((key) => {
            const url = currentUser[key as keyof User];
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

    if (!currentUser) return <div className="text-center text-3xl py-72 text-red-600 ">Няма подобен профил наличен.</div>;
    if (loading) return <div className="flex justify-center items-center py-72"><img src="/load.gif" alt="Loading..." className="w-40 h-40" /></div>;
    return (
        <div
            className={`min-h-screen flex items-center justify-center ${cardStyle.textClass}`}
            style={{
                backgroundImage: `
                    linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
                    url('/profile01.png')
                `,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.8)',
            }}
        >
            <motion.div
                className={`relative z-10 w-full pt-24 max-w-md p-8 rounded-lg bg-gradient-to-b ${cardStyle.cardCoverBgClass} to-black   bg-opacity-5 shadow-2xl`}
                style={{
                    borderRadius: 'inherit',
                }}
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
                    </motion.div>)}

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.8 }}
                >
                    <ActionButtons
                        user={currentUser}
                        showTooltip={showTooltip}
                        handleTouchStart={handleTouchStart}
                        handleTouchEnd={handleTouchEnd}
                        generateVCF={generateVCF}
                        shareContact={shareContact}
                    />
                </motion.div>
            </motion.div>
        </div>
    );
}

const ProfileHeader: React.FC<{ user: User; cardStyle: any }> = ({ user, cardStyle }) =>
(
    <div className={`relative flex items-center p-4 bg-gradient-to-b ${cardStyle.cardCoverBgClass} to-black rounded-lg shadow-lg`}>
        {/* Profile Image on the Left */}
        <motion.div
            className={`relative z-10 w-80 h-52 rounded-full overflow-hidden border-4 ${cardStyle.borderClass} shadow-xl`}

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

        {/* User Information on the Right */}
        <div className="ml-4 z-10">
            <h1 className="text-3xl font-bold text-white leading-tight">
                {user?.name}
            </h1>
            <p className={`text-md mt-2 ${cardStyle.highlightClass}`}>
                {user?.position}
            </p>
            <p className={`text-md mt-0 ${cardStyle.highlightClass}`}>
                {user?.company}
            </p>
            {user?.bio && (
                <p className="text-sm mt-3 text-gray-300 max-w-xs leading-relaxed">
                    {user.bio.length > 120 ? `${user.bio.substring(0, 117)}...` : user.bio}
                </p>
            )}
        </div>
    </div>
);

const SocialMediaLinks: React.FC<{ user: User | null, cardStyle: any }> = ({ user, cardStyle }) => (
    <div className="mt-10 text-center">
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-6">
            {user?.facebook && (
                <a
                    href={user.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="relative group"
                >
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 filter grayscale group-hover:filter-none p-3 rounded-full shadow-lg transition-transform transform group-hover:scale-110 flex items-center justify-center">
                        <Image
                            src="/logos/fb.png"
                            alt="Facebook"
                            width={48}
                            height={48}
                            className="object-contain transition-all duration-300"
                        />
                    </div>
                </a>
            )}
            {user?.instagram && (
                <a
                    href={user.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="relative group"
                >
                    <div className="bg-gradient-to-r from-yellow-500 to-red-700 filter grayscale group-hover:filter-none p-3 rounded-full shadow-lg transition-transform transform group-hover:scale-110 flex items-center justify-center">
                        <Image
                            src="/logos/ig.png"
                            alt="Instagram"
                            width={48}
                            height={48}
                            className="object-contain transition-all duration-300"
                        />
                    </div>

                </a>
            )}
            {user?.linkedin && (
                <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="relative group"
                >
                    <div className="bg-gradient-to-r from-blue-700 to-blue-900 filter grayscale group-hover:filter-none p-3 rounded-full shadow-lg transition-transform transform group-hover:scale-110 flex items-center justify-center">
                        <Image
                            src="/logos/lk.png"
                            alt="LinkedIn"
                            width={48}
                            height={48}
                            className="object-contain transition-all duration-300"
                        />
                    </div>
                </a>
            )}
            {user?.twitter && (
                <a
                    href={user.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                    className="relative group"
                >
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 filter grayscale group-hover:filter-none p-3 rounded-full shadow-lg transition-transform transform group-hover:scale-110 flex items-center justify-center">
                        <Image
                            src="/logos/x.png"
                            alt="Twitter"
                            width={48}
                            height={48}
                            className="object-contain transition-all duration-300"
                        />
                    </div>
                </a>
            )}
            {user?.github && (
                <a
                    href={user.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="relative group"
                >
                    <div className="bg-gradient-to-r from-gray-900 to-gray-600 filter grayscale group-hover:filter-none p-3 rounded-full shadow-lg transition-transform transform group-hover:scale-110 flex items-center justify-center">
                        <Image
                            src="/logos/git.png"
                            alt="GitHub"
                            width={48}
                            height={48}
                            className="object-contain transition-all duration-300"
                        />
                    </div>
                </a>
            )}
            {user?.youtube && (
                <a
                    href={user.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="relative group"
                >
                    <div className="bg-gradient-to-r from-red-600 to-red-400 filter grayscale group-hover:filter-none p-3 rounded-full shadow-lg transition-transform transform group-hover:scale-110 flex items-center justify-center">
                        <Image
                            src="/logos/youtube.png"
                            alt="YouTube"
                            width={48}
                            height={48}
                            className="object-contain transition-all duration-300"
                        />
                    </div>
                </a>
            )}
            {user?.tiktok && (
                <a
                    href={user.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="relative group"
                >
                    <div className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 filter grayscale group-hover:filter-none p-3 rounded-full shadow-lg transition-transform transform group-hover:scale-110 flex items-center justify-center">
                        <Image
                            src="/logos/tiktok.png"
                            alt="TikTok"
                            width={48}
                            height={48}
                            className="object-contain transition-all duration-300"
                        />
                    </div>
                </a>
            )}
            {user?.behance && (
                <a
                    href={user.behance}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Behance"
                    className="relative group"
                >
                    <div className="bg-gradient-to-r from-blue-600 to-blue-400 filter grayscale group-hover:filter-none p-3 rounded-full shadow-lg transition-transform transform group-hover:scale-110 flex items-center justify-center">
                        <Image
                            src="/logos/be.png"
                            alt="Behance"
                            width={40}
                            height={40}
                            className="object-contain transition-all duration-300"
                        />
                    </div>
                </a>
            )}
            {user?.paypal && (
                <a
                    href={user.paypal}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="PayPal"
                    className="relative group"
                >
                    <div className="bg-gradient-to-r from-blue-500 to-blue-300 filter grayscale group-hover:filter-none p-3 rounded-full shadow-lg transition-transform transform group-hover:scale-110 flex items-center justify-center">
                        <Image
                            src="/logos/icons8-paypal-48.png"
                            alt="PayPal"
                            width={40}
                            height={48}
                            className="object-contain transition-all duration-300"
                        />
                    </div>
                </a>
            )}
            {user?.trustpilot && (
                <a
                    href={user.trustpilot}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TrustPilot"
                    className="relative group"
                >
                    <div className="bg-gradient-to-r from-black to-gray-800 filter grayscale group-hover:filter-none p-3 rounded-full shadow-lg transition-transform transform group-hover:scale-110 flex items-center justify-center">
                        <Image
                            src="/logos/tp.png"
                            alt="TrustPilot"
                            width={48}
                            height={48}
                            className="object-contain transition-all duration-300"
                        />
                    </div>
                </a>
            )}
            {user?.viber && (
                <a
                    href={`viber://chat?number=${user.viber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Viber"
                    className="relative group"
                >
                    <div className="bg-gradient-to-r from-purple-500 to-purple-700 filter grayscale group-hover:filter-none p-3 rounded-full shadow-lg transition-transform transform group-hover:scale-110 flex items-center justify-center">
                        <Image
                            src="/logos/viber.png"
                            alt="Viber"
                            width={48}
                            height={48}
                            className="object-contain transition-all duration-300"
                        />
                    </div>
                </a>
            )}
            {user?.whatsapp && (
                <a
                    href={`https://wa.me/${user.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="relative group"
                >
                    <div className="bg-gradient-to-r from-green-600 to-green-700 filter grayscale group-hover:filter-none p-3 rounded-full shadow-lg transition-transform transform group-hover:scale-110 flex items-center justify-center">
                        <Image
                            src="/logos/wa.png"
                            alt="WhatsApp"
                            width={48}
                            height={48}
                            className="object-contain transition-all duration-300"
                        />
                    </div>
                </a>
            )}
            {user?.website && (
                <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Website"
                    className="relative group"
                >
                    <div className="bg-gradient-to-r from-cyan-600 to-cyan-800 filter grayscale group-hover:filter-none p-3 rounded-full shadow-lg transition-transform transform group-hover:scale-110 flex items-center justify-center">
                        <Image
                            src="/logos/gr.png"
                            alt="Website"
                            width={48}
                            height={48}
                            className="object-contain transition-all duration-300"
                        />
                    </div>
                </a>
            )}
            {user?.revolut && (
                <a
                    href={`https://revolut.me/${user.revolut}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Revolut"
                    className="relative group"
                >
                    <div className="bg-gradient-to-r from-blue-800 to-blue-900 filter grayscale group-hover:filter-none p-3 rounded-full shadow-lg transition-transform transform group-hover:scale-110 flex items-center justify-center">
                        <Image
                            src="/logos/rev.png"
                            alt="Revolut"
                            width={48}
                            height={48}
                            className="object-contain transition-all duration-300"
                        />
                    </div>
                </a>
            )}
        </div>
    </div>
);

const ActionButtons: React.FC<{
    user: User | null;
    showTooltip: string | null;
    handleTouchStart: (action: string) => void;
    handleTouchEnd: () => void;
    generateVCF: () => void;
    shareContact: () => void;
}> = ({ user, showTooltip, handleTouchStart, handleTouchEnd, generateVCF, shareContact }) => (
    <div className="fixed bottom-4 left-5 right-5 flex justify-center items-center space-x-8 z-20">
        {/* <ActionButton
            label="Share"
            icon={FaShareAlt}
            colorClass="bg-gradient-to-r from-blue-400 to-blue-600"
            hoverColor="text-blue-200"
            tooltip={showTooltip === 'Share Contact'}
            onClick={shareContact}
            handleTouchStart={() => handleTouchStart('Share Contact')}
            handleTouchEnd={handleTouchEnd}
        /> */}
        {/* <FloatingSaveButton generateVCF={generateVCF} /> */}
        {/* <ActionButton
            label={`Call ${user?.phone1}`}
            icon={FaPhoneAlt}
            colorClass="bg-gradient-to-r from-green-400 to-green-600"
            hoverColor="text-green-200"
            tooltip={showTooltip === 'Call'}
            onClick={() => window.location.href = `tel:${user?.phone1}`}
            handleTouchStart={() => handleTouchStart('Call')}
            handleTouchEnd={handleTouchEnd}
        /> */}
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


export default ProfileDetails;
