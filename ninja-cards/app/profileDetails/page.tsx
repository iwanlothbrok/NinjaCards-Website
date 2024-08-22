"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import { useRouter, useSearchParams } from 'next/navigation';
import {
    FaUser, FaBuilding, FaPlus, FaPhone, FaEnvelope, FaFileDownload, FaUserCircle, FaInfo, FaRegIdBadge,
    FaPhoneAlt, FaShareAlt, FaDownload, FaClipboard
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import classNames from 'classnames';

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

interface GradientStop {
    offset: string;
    color: string;
}

const googleApiKey = process.env.GOOGLE_API_KEY;

const cardBackgroundOptions = [
    {
        name: 'gray',
        bgClass: "bg-orange",
        textClass: "text-gray-200",
        borderClass: "border-orange",
        highlightClass: "text-orange",
        buttonBgClass: "bg-gray-700"
    },
    {
        name: 'blue',
        bgClass: "bg-blue-500",
        textClass: "text-white",
        borderClass: "border-blue-500",
        highlightClass: "text-blue-500",
        buttonBgClass: "bg-gray-700"
    },
    {
        name: 'purple',
        bgClass: "bg-purple-500",
        textClass: "text-white",
        borderClass: "border-purple-500",
        highlightClass: "text-purple-500",
        buttonBgClass: "bg-gray-700"
    },
    {
        name: 'green',
        bgClass: "bg-green-500",
        textClass: "text-white",
        borderClass: "border-green-500",
        highlightClass: "text-green-500",
        buttonBgClass: "bg-gray-700"
    },
    {
        name: 'yellow',
        bgClass: "bg-yellow-400",
        textClass: "text-white",
        borderClass: "border-yellow-400",
        highlightClass: "text-yellow-400",
        buttonBgClass: "bg-gray-700"
    },
    {
        name: 'teil',
        bgClass: "bg-teal-400",
        textClass: "text-white",
        borderClass: "border-teal-400",
        highlightClass: "text-teal-400",
        buttonBgClass: "bg-gray-700"
    }
];

const bgClassToGradientStops: Record<string, GradientStop[]> = {
    'bg-gradient-to-r from-blue-500 via-teal-600 to-teal-800': [
        { offset: '0%', color: '#3B82F6' },
        { offset: '50%', color: '#0D9488' },
        { offset: '100%', color: '#115E59' }
    ],
    'bg-gradient-to-r from-purple-500 via-indigo-600 to-indigo-700': [
        { offset: '0%', color: '#A855F7' },
        { offset: '50%', color: '#6366F1' },
        { offset: '100%', color: '#4F46E5' }
    ],
    'bg-gradient-to-r from-green-500 via-blue-500 to-blue-700': [
        { offset: '0%', color: '#10B981' },
        { offset: '50%', color: '#3B82F6' },
        { offset: '100%', color: '#1D4ED8' }
    ],
    'bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500': [
        { offset: '0%', color: '#FCD34D' },
        { offset: '50%', color: '#F97316' },
        { offset: '100%', color: '#EF4444' }
    ]
};

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
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ message: string; title: string; color: string } | null>(null);
    const [cardStyle, setCardStyle] = useState(cardBackgroundOptions[0]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState<string | null>(null);
    const [isPhone, setIsPhone] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams?.get('id');

    const handleTouchStart = (action: string) => {
        setTimeout(() => setShowTooltip(action), 500);
    };

    const handleTouchEnd = () => {
        setShowTooltip(null);
    };

    useEffect(() => {
        if (userId) {
            fetchUser(userId, setUser, setLoading, showAlert);
        }
    }, [userId]);

    useEffect(() => {
        if (user && user.selectedColor) {
            const selectedCardStyle = cardBackgroundOptions.find(option => option.name === user.selectedColor);
            if (selectedCardStyle) {
                setCardStyle(selectedCardStyle);
            }
        }
    }, [user]);

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
        if (user && user.id) {
            saveSelectedColor(user.id, colorName, showAlert);
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

    const generateVCF = () => {
        if (!user) return;

        const vCard = ["BEGIN:VCARD", "VERSION:3.0"];

        if (user.name) vCard.push(`FN:${user.name}`);
        if (user.lastName && user.firstName) vCard.push(`N:${user.lastName};${user.firstName};;;`);
        if (user.email) vCard.push(`EMAIL:${user.email}`);
        if (user.email2) vCard.push(`EMAIL;TYPE=WORK:${user.email2}`);
        if (user.phone1) vCard.push(`TEL;TYPE=CELL:${user.phone1}`);
        if (user.phone2) vCard.push(`TEL;TYPE=CELL:${user.phone2}`);
        if (user.company) vCard.push(`ORG:${user.company}`);
        if (user.position) vCard.push(`TITLE:${user.position}`);

        const address = [
            user.street1 || '',
            user.city || '',
            user.state || '',
            user.zipCode || '',
            user.country || ''
        ].filter(Boolean).join(';');
        if (address) vCard.push(`ADR;TYPE=WORK:;;${address}`);

        if (user.bio) vCard.push(`NOTE:${user.bio}`);

        ['facebook', 'twitter', 'instagram', 'linkedin', 'github', 'youtube', 'tiktok', 'googleReview', 'revolut', 'qrCode'].forEach((key) => {
            const url = user[key as keyof User];
            if (url) vCard.push(`URL:${url}`);
        });

        if (user.image) {
            vCard.push(`PHOTO;ENCODING=b;TYPE=JPEG:${user.image}`);
        }

        vCard.push("END:VCARD");

        const blob = new Blob([vCard.join("\r\n")], { type: 'text/vcard' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${user.firstName}_${user.lastName}.vcf`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const shareContact = () => {
        if (navigator.share) {
            navigator.share({
                title: user?.name ? `Контакт ${user.name}` : 'Контакт',
                text: user?.name ? `Вижте контактните данни на ${user.name}` : 'Вижте контактните данни',
                url: window.location.href,
            });
        } else {
            generateVCF(); // Фалбек към изтегляне на VCF, ако споделянето не се поддържа
        }
    };

    const downloadCv = () => {
        if (!user) return;

        const link = document.createElement('a');
        link.href = `/api/profile/downloadCv?id=${user.id}`;
        link.download = `${user.firstName}_${user.lastName}_CV.pdf`;
        link.click();
    };

    const copyContactDetails = () => {
        if (!user) return;

        const contactInfoParts = [
            user.name && `Име: ${user.name}`,
            user.email && `Имейл: ${user.email}`,
            user.phone1 && `Телефон: ${user.phone1}`,
            user.company && `Компания: ${user.company}`,
            user.position && `Позиция: ${user.position}`,
            (user.street1 || user.city || user.state || user.zipCode || user.country) &&
            `Адрес: ${[
                user.street1,
                user.city,
                user.state,
                user.zipCode,
                user.country
            ].filter(Boolean).join(', ')}`
        ].filter(Boolean);

        const contactInfo = contactInfoParts.join('\n');

        navigator.clipboard.writeText(contactInfo).then(() => {
            showAlert('Контактните данни са копирани в клипборда', 'Успех', 'green');
        }, () => {
            showAlert('Неуспешно копиране на контактните данни', 'Грешка', 'red');
        });
    };

    if (loading) return <div className="text-center text-2xl py-72 text-red-600 ">Зарежда...</div>;
    if (!user) return <div className="text-center text-2xl py-72 text-red-600 ">Няма подобен профил наличен.</div>;
    return (
        <div
            className={`min-h-screen flex items-center justify-center ${cardStyle.textClass}`}
            style={{
                backgroundImage: `
                    linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
                    url('/profile01.png')
                `,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.8)',
            }}
        >
            <motion.div
                className={`relative z-10 w-full pt-50 pb-30 max-w-md p-8 rounded-lg ${cardStyle.bgClass} bg-opacity-5 shadow-2xl`}
                style={{
                    borderRadius: 'inherit',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <ProfileHeader user={user} cardStyle={cardStyle} />
                <motion.div
                    className="mt-6"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <SocialMediaLinks user={user} cardStyle={cardStyle} />
                </motion.div>
                {/* <motion.div
                    className="mt-6"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                >
                    <UserInfoSection user={user} cardStyle={cardStyle} />
                </motion.div> */}
                <motion.div
                    className="mt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
                >
                    <LocationSection user={user} googleApiKey={googleApiKey || ''} cardStyle={cardStyle} />
                </motion.div>
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
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.8 }}
                >
                    <ActionButtons
                        user={user}
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

const ProfileHeader: React.FC<{ user: User; cardStyle: any }> = ({ user, cardStyle }) => (
    <div className="text-center relative -mt-16">
        <motion.div
            className={`relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 ${cardStyle.borderClass} shadow-xl`}
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
        <h1 className={`text-3xl font-bold mt-2 text-white shadow-md`}>
            {user?.name}
        </h1>
        <p className={`text-sm mt-1 ${cardStyle.highlightClass}`}>
            {user?.position}
        </p>
        <p className={`text-sm ${cardStyle.highlightClass}`}>
            {user?.company}
        </p>
        {user?.bio && (
            <p className="text-xs mt-4 text-gray-300 px-4">
                {user.bio.length > 100 ? `${user.bio.substring(0, 97)}...` : user.bio}
            </p>
        )}
    </div>
);

const SocialMediaLinks: React.FC<{ user: User | null, cardStyle: any }> = ({ user, cardStyle }) => (
    <div className="mt-10 text-center">
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-6">
            {user?.facebook && (
                <a
                    href={user.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="relative group"
                >
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500  p-2 rounded-full shadow-lg transition-transform transform group-hover:scale-110 flex items-center justify-center">
                        <Image
                            src="/logos/fb.png"
                            alt="Facebook"
                            width={40}
                            height={40}
                            className="object-contain filter grayscale group-hover:filter-none transition-all duration-300"
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
                    <Image
                        src="/logos/ig.png"
                        alt="Instagram"
                        width={40}
                        height={40}
                        className="object-contain filter grayscale group-hover:filter-none transition-all duration-300"
                    />
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
                    <div className="bg-gradient-to-r from-blue-700 to-blue-300 p-3 rounded-full shadow-lg transition-transform transform group-hover:scale-110 flex items-center justify-center">
                        <Image
                            src="/logos/lk.png"
                            alt="LinkedIn"
                            width={40}
                            height={40}
                            className="object-contain filter grayscale group-hover:filter-none transition-all duration-300"
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
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-full shadow-lg transition-transform transform group-hover:scale-110 flex items-center justify-center">
                        <Image
                            src="/logos/x.png"
                            alt="Twitter"
                            width={40}
                            height={40}
                            className="object-contain filter grayscale group-hover:filter-none transition-all duration-300"
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
                    <div className="bg-gradient-to-r from-gray-800 to-gray-600 p-3 rounded-full shadow-lg transition-transform transform group-hover:scale-110 flex items-center justify-center">
                        <Image
                            src="/logos/git.png"
                            alt="GitHub"
                            width={40}
                            height={40}
                            className="object-contain filter grayscale group-hover:filter-none transition-all duration-300"
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
                    <div className="bg-gradient-to-r from-red-600 to-red-400 p-3 rounded-full shadow-lg transition-transform transform group-hover:scale-110 flex items-center justify-center">
                        <Image
                            src="/logos/youtube.png"
                            alt="YouTube"
                            width={40}
                            height={40}
                            className="object-contain filter grayscale group-hover:filter-none transition-all duration-300"
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
                    <div className="bg-gradient-to-r from-black to-gray-800 p-3 rounded-full shadow-lg transition-transform transform group-hover:scale-110 flex items-center justify-center">
                        <Image
                            src="/logos/tiktok.png"
                            alt="TikTok"
                            width={40}
                            height={40}
                            className="object-contain filter grayscale group-hover:filter-none transition-all duration-300"
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
                    <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-3 rounded-full shadow-lg transition-transform transform group-hover:scale-110 flex items-center justify-center">
                        <Image
                            src="/logos/be.png"
                            alt="Behance"
                            width={40}
                            height={40}
                            className="object-contain filter grayscale group-hover:filter-none transition-all duration-300"
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
                    <div className="bg-gradient-to-r from-blue-500 to-blue-300 p-3 rounded-full shadow-lg transition-transform transform group-hover:scale-110 flex items-center justify-center">
                        <Image
                            src="/logos/icons8-paypal-48.png"
                            alt="PayPal"
                            width={40}
                            height={40}
                            className="object-contain filter grayscale group-hover:filter-none transition-all duration-300"
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
                    <div className="bg-gradient-to-r from-green-500 to-teal-400 p-3 rounded-full shadow-lg transition-transform transform group-hover:scale-110 flex items-center justify-center">
                        <Image
                            src="/logos/tp.png"
                            alt="TrustPilot"
                            width={40}
                            height={40}
                            className="object-contain filter grayscale group-hover:filter-none transition-all duration-300"
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
                    <div className="bg-gradient-to-r from-purple-600 to-purple-400 p-3 rounded-full shadow-lg transition-transform transform group-hover:scale-110 flex items-center justify-center">
                        <Image
                            src="/logos/viber.png"
                            alt="Viber"
                            width={40}
                            height={40}
                            className="object-contain filter grayscale group-hover:filter-none transition-all duration-300"
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
                    <div className="bg-gradient-to-r from-green-500 to-green-300 p-3 rounded-full shadow-lg transition-transform transform group-hover:scale-110 flex items-center justify-center">
                        <Image
                            src="/logos/wa.png"
                            alt="WhatsApp"
                            width={40}
                            height={40}
                            className="object-contain filter grayscale group-hover:filter-none transition-all duration-300"
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
                    <div className="bg-gradient-to-r from-gray-500 to-gray-300 p-3 rounded-full shadow-lg transition-transform transform group-hover:scale-110 flex items-center justify-center">
                        <Image
                            src="/logos/gr.png"
                            alt="Website"
                            width={40}
                            height={40}
                            className="object-contain filter grayscale group-hover:filter-none transition-all duration-300"
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
                    <div className="bg-gradient-to-r from-gray-500 to-gray-200 p-3 rounded-full shadow-lg transition-transform transform group-hover:scale-110 flex items-center justify-center">
                        <Image
                            src="/logos/rev.png"
                            alt="Revolut"
                            width={40}
                            height={40}
                            className="object-contain filter grayscale group-hover:filter-none transition-all duration-300"
                        />
                    </div>
                </a>
            )}
        </div>
    </div>
);


const AboutSection: React.FC<{ user: User | null; cardStyle: any }> = ({ user, cardStyle }) => (
    <div className="mt-6 text-center">
        <h3 className={`text-xl font-semibold ${cardStyle.highlightClass}`}>About {user?.firstName}</h3>
        <p className="mt-2">{user?.bio}</p>
    </div>
);

const LocationSection: React.FC<{ user: User | null; googleApiKey: string; cardStyle: any }> = ({ user, googleApiKey, cardStyle }) => (
    <div className="mt-6 text-center">
        <iframe
            className="w-full h-48 mt-1 rounded"
            title="User Location"
            src={`https://www.google.com/maps/embed/v1/place?key=${googleApiKey}&q=${encodeURIComponent(user?.street1 + ', ' + user?.city + ', ' + user?.state + ', ' + user?.zipCode + ', ' + user?.country)}`}
            allowFullScreen
        ></iframe>
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
        <ActionButton
            label="Share"
            icon={FaShareAlt}
            colorClass="bg-gradient-to-r from-blue-400 to-blue-600"
            hoverColor="text-blue-200"
            tooltip={showTooltip === 'Share Contact'}
            onClick={shareContact}
            handleTouchStart={() => handleTouchStart('Share Contact')}
            handleTouchEnd={handleTouchEnd}
        />
        <FloatingSaveButton generateVCF={generateVCF} />
        <ActionButton
            label={`Call ${user?.phone1}`}
            icon={FaPhoneAlt}
            colorClass="bg-gradient-to-r from-green-400 to-green-600"
            hoverColor="text-green-200"
            tooltip={showTooltip === 'Call'}
            onClick={() => window.location.href = `tel:${user?.phone1}`}
            handleTouchStart={() => handleTouchStart('Call')}
            handleTouchEnd={handleTouchEnd}
        />
    </div>
);

const ActionButton: React.FC<{
    label: string;
    icon: React.ElementType;
    colorClass: string;
    hoverColor: string;
    tooltip: boolean;
    onClick: () => void;
    handleTouchStart: () => void;
    handleTouchEnd: () => void;
}> = ({ label, icon: Icon, colorClass, hoverColor, tooltip, onClick, handleTouchStart, handleTouchEnd }) => (
    <div
        className="relative group"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        tabIndex={0}
        role="button"
        aria-label={label}
        onClick={onClick}
    >
        <div className={`p-4 ${colorClass} rounded-full shadow-lg cursor-pointer transition-transform duration-300 ease-in-out transform group-hover:scale-110`}>
            <Icon className={`text-2xl text-white transition-colors duration-300 ease-in-out group-hover:${hoverColor}`} />
        </div>
        {tooltip && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md">
                {label}
            </div>
        )}
    </div>
);

const FloatingSaveButton: React.FC<{ generateVCF: () => void }> = ({ generateVCF }) => (
    <div className="transform translate-y-0">
        <button
            onClick={generateVCF}
            className="relative flex items-center px-8 py-4 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 ease-in-out transform hover:scale-110"
        >
            <FaDownload className="mr-3 text-2xl" />
            <span className="text-lg font-semibold">ЗАПАЗИ КОНТАКТ</span>
            <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity rounded-full"></div>
        </button>
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


const UserInfoSection: React.FC<{ user: User; cardStyle: any }> = ({ user, cardStyle }) => (
    <div className={`p-6 ${cardStyle.bgClass} bg-opacity-40 rounded-lg shadow-lg mb-6`}>
        <div className="grid grid-cols-2 gap-4 text-white sm:grid-cols-2">
            {user.firstName && user.lastName && (
                <div className="flex items-center">
                    <FaUser className="w-6 h-6 mr-3 text-gray-300" />
                    <span>{user.firstName} {user.lastName}</span>
                </div>
            )}
            {user.phone1 && (
                <div className="flex items-center">
                    <FaPhone className="w-6 h-6 mr-3 text-gray-300" aria-hidden="true" />
                    <a
                        href={`tel:${user.phone1}`}
                        className="text-blue-400 hover:text-blue-500 hover:underline focus:text-blue-500 focus:underline focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors duration-200"
                        aria-label={`Call ${user.phone1}`}
                    >
                        {user.phone1}
                    </a>
                </div>
            )}
            {user.email && (
                <div className="flex items-center">
                    <FaEnvelope className="w-6 h-6 mr-3 text-gray-300" aria-hidden="true" />
                    <a
                        href={`mailto:${user.email}`}
                        className="text-blue-400 hover:text-blue-500 hover:underline focus:text-blue-500 focus:underline focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors duration-200"
                        aria-label={`Email ${user.email}`}
                    >
                        {user.email}
                    </a>
                </div>
            )}

        </div>

        {/* About Section */}
        {user.bio && (
            // <div className="mt-6 p-4 bg-gray-800 bg-opacity-60 rounded-lg shadow-md text-center">
            //     <h3 className={`text-2xl font-semibold ${cardStyle.highlightClass} text-white`}>
            //         About {user.firstName}
            //     </h3>
            //     <p className="mt-4 text-gray-300 text-lg">
            //         {user.bio}
            //     </p>
            // </div>
            <div className="flex items-center">
                <FaRegIdBadge className="w-6 h-6 mr-3 text-gray-300" />
                <span>{user.bio}</span>
            </div>
        )}
    </div>
);


export default ProfileDetails;
