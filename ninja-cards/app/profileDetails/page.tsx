"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    FaFacebook, FaInstagram, FaLinkedin, FaTwitter,
    FaGithub, FaYoutube, FaTiktok, FaChevronDown, FaFileDownload,
    FaPhoneAlt, FaShareAlt, FaDownload, FaClipboard
} from 'react-icons/fa';
import { motion } from 'framer-motion';

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
    selectedColor: string; // New field for selected color
    cv: string;
}

interface GradientStop {
    offset: string;
    color: string;
}

const googleApiKey = process.env.GOOGLE_API_KEY;
const cardBackgroundOptions = [
    {
        name: 'white',
        bgClass: "bg-white",
        textClass: "text-gray-900",
        borderClass: "border-orange",
        highlightClass: "text-orange",
        buttonBgClass: "bg-gray-800" // Bright yellow button for strong visibility
    },
    {
        name: 'gray',
        bgClass: "bg-gray-800",
        textClass: "text-gray-100",
        borderClass: "border-orange",
        highlightClass: "text-orange",
        buttonBgClass: "bg-white" // Bright orange button to stand out against gray
    },
    {
        name: 'blue-teal-gradient',
        bgClass: "bg-gradient-to-r from-blue-600 via-teal-600 to-teal-800",
        textClass: "text-white", // Bright yellow for high contrast
        borderClass: "border-white", // White border for maximum contrast
        highlightClass: "text-yellow-400", // Strong yellow for highlighted elements
        buttonBgClass: "bg-gray-800" // Bright yellow button for strong visibility
    },
    {
        name: 'purple-indigo-gradient',
        bgClass: "bg-gradient-to-r from-purple-600 via-indigo-700 to-indigo-800",
        textClass: "text-white", // Bright cyan for clear visibility against the dark gradient
        borderClass: "border-white", // White border for strong contrast
        highlightClass: "text-cyan-300", // Bold cyan to make highlights pop
        buttonBgClass: "bg-gray-800" // Bright yellow button for strong visibility
    },
    {
        name: 'green-blue-gradient',
        bgClass: "bg-gradient-to-r from-green-600 via-blue-600 to-blue-700",
        textClass: "text-white", // Bright orange for clear visibility
        borderClass: "border-white", // White border for contrast
        highlightClass: "text-orange", // Strong orange to make important elements stand out
        buttonBgClass: "bg-gray-800" // Bright yellow button for strong visibility
    },
    {
        name: 'yellow-orange-red-gradient',
        bgClass: "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500",
        textClass: "text-gray-800", // Black for maximum contrast
        borderClass: "border-white", // White border for clarity
        highlightClass: "text-gray-800", // Strong black for high contrast highlights
        buttonBgClass: "bg-gray-800" // Bright yellow button for strong visibility
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

interface DynamicSvgProps {
    bgClass: string;
}

const DynamicSvg: React.FC<DynamicSvgProps> = ({ bgClass }) => {
    let gradientStops: GradientStop[] = [];

    if (bgClass === "bg-white") {
        gradientStops = [
            { offset: '0%', color: '#FFFFFF' },
            { offset: '100%', color: '#FFFFFF' }
        ];
    } else if (bgClass === "bg-gray-800") {
        gradientStops = [
            { offset: '0%', color: '#1F2937' }, // The color corresponding to gray-800
            { offset: '100%', color: '#1F2937' }
        ];
    } else {
        gradientStops = bgClassToGradientStops[bgClass] || [];
    }
    return (
        <svg className="absolute bottom-0 left-0 w-full h-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 300">
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    {gradientStops.map((stop, index) => (
                        <stop
                            key={index}
                            offset={stop.offset}
                            style={{ stopColor: stop.color, stopOpacity: 1 }}
                        />
                    ))}
                </linearGradient>
            </defs>
            <path
                fill="url(#grad1)"
                d="M0,256L48,224C96,192,192,128,288,122.7C384,117,480,171,576,197.3C672,224,768,224,864,186.7C960,149,1056,75,1152,80C1248,85,1344,171,1392,213.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            >

            </path>
        </svg>);
};

const ProfileDetails: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ message: string; title: string; color: string } | null>(null);
    const [cardStyle, setCardStyle] = useState(cardBackgroundOptions[0]); // Default to first option
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
                {/* <div className={`w-full h-44 ${cardStyle.bgClass} relative overflow-hidden`}>
                    <div
                        className="absolute inset-0 bg-gradient-to-b from-black via-transparent opacity-60"
                        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 75% 95%, 50% 80%, 25% 95%, 0 80%)' }} // Matching the zigzag shape
                    >

                    </div>

                    <img
                        className="object-cover w-full h-full"
                        src="/profileCover.png"
                        alt="Cover"
                        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 75% 95%, 50% 80%, 25% 95%, 0 80%)' }} // Zigzag shape
                    />
                </div> */}

                {/* Profile Picture and Name/Position */}
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
                    <h1 className={`text-2xl font-bold mt-2 text-white`}>{user?.name}</h1>
                    <p className={`text-sm text-gray-200`}>{user?.position}</p>
                    <p className={`text-sm text-gray-200`}>{user?.company}</p>
                </div>

                {/* Social Media Links */}
                <div className="mt-4 text-center">
                    <h3 className="text-xl font-semibold">Connect with me</h3>
                    <div className="flex justify-center space-x-6 mt-4">
                        {user?.facebook && <a href={user.facebook} target="_blank" rel="noopener noreferrer"><FaFacebook size={36} className="hover:text-blue-600" /></a>}
                        {user?.instagram && <a href={user.instagram} target="_blank" rel="noopener noreferrer"><FaInstagram size={36} className="hover:text-pink-500" /></a>}
                        {user?.linkedin && <a href={user.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin size={36} className="hover:text-blue-700" /></a>}
                        {user?.twitter && <a href={user.twitter} target="_blank" rel="noopener noreferrer"><FaTwitter size={36} className="hover:text-blue-400" /></a>}
                        {user?.github && <a href={user.github} target="_blank" rel="noopener noreferrer"><FaGithub size={36} className="hover:text-gray-900" /></a>}
                        {user?.youtube && <a href={user.youtube} target="_blank" rel="noopener noreferrer"><FaYoutube size={36} className="hover:text-red-600" /></a>}
                        {user?.tiktok && <a href={user.tiktok} target="_blank" rel="noopener noreferrer"><FaTiktok size={36} className="hover:text-black" /></a>}
                    </div>
                </div>

                {/* About Section */}
                <div className="mt-6 text-center">
                    <h3 className={`text-xl font-semibold ${cardStyle.highlightClass}`}>About {user?.firstName}</h3>
                    <p className="mt-2">{user?.bio}</p>
                </div>

                {/* Location Section */}
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

                {/* Action Buttons */}
                <div className="flex justify-center space-x-6 mt-4">
                    <div
                        className="relative group"
                        onTouchStart={() => handleTouchStart('Call')}
                        onTouchEnd={handleTouchEnd}
                        tabIndex={0}
                        role="button"
                        aria-label={`Call ${user?.phone1}`}
                    >
                        <div
                            onClick={() => window.location.href = `tel:${user?.phone1}`}
                            className={`p-4 ${cardStyle.buttonBgClass} rounded-full shadow-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-green-100`}
                        >
                            <FaPhoneAlt className="text-green-500 text-2xl group-hover:text-green-700 transition-colors duration-300 ease-in-out" />
                        </div>
                        {(showTooltip === 'Call') && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md">
                                Call {user?.phone1}
                            </div>
                        )}
                    </div>

                    <div
                        className="relative group"
                        onTouchStart={() => handleTouchStart('Share Contact')}
                        onTouchEnd={handleTouchEnd}
                        tabIndex={0}
                        role="button"
                        aria-label="Share Contact"
                    >
                        <div
                            onClick={shareContact}
                            className={`p-4 ${cardStyle.buttonBgClass} rounded-full shadow-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-blue-100`}
                        >
                            <FaShareAlt className="text-blue-500 text-2xl group-hover:text-blue-700 transition-colors duration-300 ease-in-out" />
                        </div>
                        {(showTooltip === 'Share Contact') && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md">
                                Share Contact
                            </div>
                        )}
                    </div>

                    <div
                        className="relative group"
                        onTouchStart={() => handleTouchStart('Copy Contact Details')}
                        onTouchEnd={handleTouchEnd}
                        tabIndex={0}
                        role="button"
                        aria-label="Copy Contact Details"
                    >
                        <div
                            onClick={copyContactDetails}
                            className={`p-4 ${cardStyle.buttonBgClass} rounded-full shadow-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-yellow-100`}
                        >
                            <FaClipboard className="text-yellow-500 text-2xl group-hover:text-yellow-700 transition-colors duration-300 ease-in-out" />
                        </div>
                        {(showTooltip === 'Copy Contact Details') && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md">
                                Copy Contact Details
                            </div>
                        )}
                    </div>

                    <div
                        className="relative group"
                        onTouchStart={() => handleTouchStart('Download CV')}
                        onTouchEnd={handleTouchEnd}
                        tabIndex={0}
                        role="button"
                        aria-label="Download CV"
                    >
                        <div
                            onClick={downloadCv}
                            className={`p-4 ${cardStyle.buttonBgClass} rounded-full shadow-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-red-100`}
                        >
                            <FaFileDownload className="text-red-500 text-2xl group-hover:text-red-700 transition-colors duration-300 ease-in-out" />
                        </div>
                        {(showTooltip === 'Download CV') && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md">
                                Download CV
                            </div>
                        )}
                    </div>
                </div>

                {/* Floating Save VCF Button */}
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                    <button
                        onClick={generateVCF}
                        className={`flex items-center px-8 py-6 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 ease-in-out transform hover:scale-105`}
                    >
                        <FaDownload className="mr-3 text-2xl" />
                        <span className="text-lg font-semibold">ЗАПАЗИ КОНТАКТ</span>
                    </button>
                </div>

                {/* Background Selector */}
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

            </div>
        </div>
    );
}
export default ProfileDetails;
