"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import { useRouter, useSearchParams } from 'next/navigation';
import {
    FaFacebook, FaInstagram, FaLinkedin, FaTwitter,
    FaGithub, FaYoutube, FaTiktok, FaFileDownload,
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
                linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
                url('/profile01.png')
            `,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: 1,
                boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.8)',
            }}
        >
            <div
                className={`relative z-10 w-full max-w-md p-6  mt-40 mb-20 rounded-lg ${cardStyle.textClass} shadow-2xl`}
                style={{
                    borderRadius: 'inherit',
                }}
            >
                <ProfileHeader user={user} cardStyle={cardStyle} />
                <SocialMediaLinks user={user} />
                <AboutSection user={user} cardStyle={cardStyle} />
                <LocationSection user={user} googleApiKey={googleApiKey || ''} cardStyle={cardStyle} />
                <ActionButtons
                    user={user}
                    showTooltip={showTooltip}
                    handleTouchStart={handleTouchStart}
                    handleTouchEnd={handleTouchEnd}
                    copyContactDetails={copyContactDetails}
                    downloadCv={downloadCv}
                    shareContact={shareContact}
                />
                <FloatingSaveButton generateVCF={generateVCF} />
                <BackgroundSelector
                    cardBackgroundOptions={cardBackgroundOptions}
                    handleColorSelection={handleColorSelection}
                    cardStyle={cardStyle}
                />
            </div>
        </div>
    );
}

const ProfileHeader: React.FC<{ user: User; cardStyle: any }> = ({ user, cardStyle }) => (
    <div className="text-center relative -mt-16">
        <motion.div
            className={`relative w-32 h-32 mx-auto mb-2 rounded-full overflow-hidden border-4 ${cardStyle.borderClass} shadow-lg`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <img
                className="w-full h-full object-cover"
                src={user?.image ? `data:image/jpeg;base64,${user.image}` : 'https://via.placeholder.com/150'}
                alt="Profile"
            />
        </motion.div>
        <h1 className={`text-2xl font-bold mt-2 ${cardStyle.highlightClass}`}>{user?.name}</h1>
        <p className={`text-sm text-gray-200 ${cardStyle.highlightClass}`}>{user?.position}</p>
        <p className={`text-sm text-gray-200 ${cardStyle.highlightClass}`}>{user?.company}</p>
    </div>
);
const SocialMediaLinks: React.FC<{ user: User | null }> = ({ user }) => (
    <div className="mt-6 text-center">
        <h3 className="text-2xl font-semibold mb-4">Connect with me</h3>
        <div className="grid grid-cols-3 gap-6">
            {user?.facebook && (
                <a
                    href={user.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                    <Image src="/logos/fb.png" alt="Facebook" width={64} height={64} className="mx-auto" />
                </a>
            )}
            {user?.instagram && (
                <a
                    href={user.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                    <Image src="/logos/ig.png" alt="Instagram" width={64} height={64} className="mx-auto" />
                </a>
            )}
            {user?.linkedin && (
                <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                    <Image src="/logos/lk.png" alt="LinkedIn" width={64} height={64} className="mx-auto" />
                </a>
            )}
            {user?.twitter && (
                <a
                    href={user.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                    <Image src="/logos/x.png" alt="Twitter" width={64} height={64} className="mx-auto" />
                </a>
            )}
            {user?.github && (
                <a
                    href={user.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                    <Image src="/logos/git.png" alt="GitHub" width={64} height={64} className="mx-auto" />
                </a>
            )}
            {user?.youtube && (
                <a
                    href={user.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                    <Image src="/logos/youtube.png" alt="YouTube" width={64} height={64} className="mx-auto" />
                </a>
            )}
            {user?.tiktok && (
                <a
                    href={user.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                    <Image src="/logos/tiktok.png" alt="TikTok" width={64} height={64} className="mx-auto" />
                </a>
            )}
            {user?.behance && (
                <a
                    href={user.behance}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                    <Image src="/logos/be.png" alt="Behance" width={64} height={64} className="mx-auto" />
                </a>
            )}
            {user?.paypal && (
                <a
                    href={user.paypal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                    <Image src="/logos/icons8-paypal-48.png" alt="PayPal" width={64} height={64} className="mx-auto" />
                </a>
            )}
            {user?.trustpilot && (
                <a
                    href={user.trustpilot}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                    <Image src="/logos/tp.png" alt="TrustPilot" width={64} height={64} className="mx-auto" />
                </a>
            )}
            {user?.viber && (
                <a
                    href={`viber://chat?number=${user.viber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                    <Image src="/logos/viber.png" alt="Viber" width={64} height={64} className="mx-auto" />
                </a>
            )}
            {user?.whatsapp && (
                <a
                    href={`https://wa.me/${user.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                    <Image src="/logos/wa.png" alt="WhatsApp" width={64} height={64} className="mx-auto" />
                </a>
            )}
            {user?.website && (
                <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                    <Image src="/logos/gr.png" alt="Website" width={64} height={64} className="mx-auto" />
                </a>
            )}
            {user?.revolut && (
                <a
                    href={`https://revolut.me/${user.revolut}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                    <Image src="/logos/rev.png" alt="Revolut" width={64} height={64} className="mx-auto" />
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
        <h3 className={`text-xl font-semibold ${cardStyle.highlightClass}`}>Location</h3>
        <p className="mt-2">{`${user?.street1}, ${user?.city}, ${user?.state}, ${user?.zipCode}, ${user?.country}`}</p>
        <iframe
            className="w-full h-48 mt-4 rounded"
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
    copyContactDetails: () => void;
    downloadCv: () => void;
    shareContact: () => void;
}> = ({ user, showTooltip, handleTouchStart, handleTouchEnd, copyContactDetails, downloadCv, shareContact }) => (
    <div className="flex justify-center space-x-6 mt-4">
        <ActionButton
            label={`Call ${user?.phone1}`}
            icon={FaPhoneAlt}
            colorClass="bg-green-200"
            hoverColor="text-green-500"
            tooltip={showTooltip === 'Call'}
            onClick={() => window.location.href = `tel:${user?.phone1}`}
            handleTouchStart={() => handleTouchStart('Call')}
            handleTouchEnd={handleTouchEnd}
        />
        <ActionButton
            label="Share Contact"
            icon={FaShareAlt}
            colorClass="bg-blue-200"
            hoverColor="text-blue-500"

            tooltip={showTooltip === 'Share Contact'}
            onClick={shareContact}
            handleTouchStart={() => handleTouchStart('Share Contact')}
            handleTouchEnd={handleTouchEnd}
        />
        <ActionButton
            label="Copy Contact Details"
            icon={FaClipboard}
            colorClass="bg-yellow-200"
            hoverColor="text-yellow-500"

            tooltip={showTooltip === 'Copy Contact Details'}
            onClick={copyContactDetails}
            handleTouchStart={() => handleTouchStart('Copy Contact Details')}
            handleTouchEnd={handleTouchEnd}
        />
        <ActionButton
            label="Download CV"
            icon={FaFileDownload}
            colorClass="bg-red-200"
            hoverColor="text-red-500"
            tooltip={showTooltip === 'Download CV'}
            onClick={downloadCv}
            handleTouchStart={() => handleTouchStart('Download CV')}
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
        <div className={`p-4 ${colorClass} rounded-full shadow-lg cursor-pointer transition-all duration-300 ease-in-out`}>
            <Icon className={classNames('text-2xl', 'text-gray-700', 'transition-colors', 'duration-300', 'ease-in-out', {
                [`group-hover:${hoverColor}`]: hoverColor,
            })} />
        </div>
        {tooltip && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md">
                {label}
            </div>
        )}
    </div>
);


const FloatingSaveButton: React.FC<{ generateVCF: () => void }> = ({ generateVCF }) => (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <button
            onClick={generateVCF}
            className="flex items-center px-8 py-6 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 ease-in-out transform hover:scale-105"
        >
            <FaDownload className="mr-3 text-2xl" />
            <span className="text-lg font-semibold">ЗАПАЗИ КОНТАКТ</span>
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
        <div className="flex justify-center space-x-2 mt-2">
            {cardBackgroundOptions.map(({ name, bgClass }) => (
                <button
                    key={name}
                    onClick={() => handleColorSelection(name)}
                    className={`w-8 h-8 rounded-full border ${bgClass}`}
                />
            ))}
        </div>
    </div>
);

export default ProfileDetails;
