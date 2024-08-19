"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaUser,
    FaGithub, FaYoutube, FaTiktok, FaEnvelope, FaPhoneAlt, FaShareAlt, FaDownload, FaClipboard, FaPeopleCarry
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
}
const googleApiKey = process.env.GOOGLE_API_KEY;
const cardBackgroundOptions = [
    {
        name: 'white',
        bgClass: "bg-white",
        textClass: "text-gray-900",
        borderClass: "border-orange",
        highlightClass: "text-orange"
    },
    {
        name: 'gray',
        bgClass: "bg-gray-800",
        textClass: "text-gray-100",
        borderClass: "border-orange",
        highlightClass: "text-orange"
    },
    {
        name: 'blue-teal-gradient',
        bgClass: "bg-gradient-to-r from-blue-500 via-teal-600 to-teal-800",
        textClass: "text-white",
        borderClass: "border-yellow-400",
        highlightClass: "text-yellow-400"
    },
    {
        name: 'purple-indigo-gradient',
        bgClass: "bg-gradient-to-r from-purple-500 via-indigo-600 to-indigo-700",
        textClass: "text-white",
        borderClass: "border-yellow-400",
        highlightClass: "text-yellow-400"
    },
    {
        name: 'green-blue-gradient',
        bgClass: "bg-gradient-to-r from-green-500 via-blue-500 to-blue-700",
        textClass: "text-white",
        borderClass: "border-yellow-400",
        highlightClass: "text-yellow-400"
    },
    {
        name: 'yellow-orange-red-gradient',
        bgClass: "bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500",
        textClass: "text-gray-900",
        borderClass: "border-teal-900",
        highlightClass: "text-teal-900"
    },
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
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ message: string; title: string; color: string } | null>(null);
    const [cardStyle, setCardStyle] = useState(cardBackgroundOptions[0]); // Default to first option


    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams?.get('id');

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
        <div className={`min-h-screen flex items-center justify-center ${cardStyle.bgClass}`}>
            <div
                className={`relative z-10 w-full max-w-md p-6 rounded-lg mt-20 mb-20 ${cardStyle.bgClass} ${cardStyle.textClass} shadow-lg`}
            >

                {/* Социални медии */}
                <div className="mt-4 text-center">
                    <h3 className="text-xl font-semibold">Свържете се с мен</h3>
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

                {/* Профилна снимка */}
                <div className="text-center mt-6">
                    <motion.div
                        className={`relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-4 shadow-2xl shadow-cyan-600/50 ${cardStyle.borderClass}`}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <img className={`w-full h-full object-cover `}
                            src={user?.image ? `data:image/jpeg;base64,${user.image}` : 'https://via.placeholder.com/150'}
                            alt="Профилна снимка"
                        />
                    </motion.div>
                    <h1 className={`text-4xl font-bold ${cardStyle.highlightClass}`}>{user?.name}</h1>
                    <p className={`${cardStyle.highlightClass}`}>{user?.position} в {user?.company}</p>
                    <p className="mt-2"><FaUser className="inline mr-2" />{user?.firstName + ' ' + user?.lastName}</p>
                    <p className=""><FaEnvelope className="inline mr-2" />{user?.email}</p>
                    <p className=""><FaPhoneAlt className="inline mr-2" />{user?.phone1}</p>

                </div>

                {/* За секцията */}
                <div className="mt-6 text-center">
                    <h3 className={`text-xl font-semibold ${cardStyle.highlightClass}`}>За {user?.firstName}</h3>
                    <p className="mt-2">{user?.bio}</p>
                </div>

                {/* Секция за местоположение */}
                <div className="mt-6 text-center">
                    <h3 className={`text-xl font-semibold ${cardStyle.highlightClass}`}>Местоположение</h3>
                    <p className="mt-2">{`${user?.street1}, ${user?.city}, ${user?.state}, ${user?.zipCode}, ${user?.country}`}</p>
                    <iframe
                        className="w-full h-48 mt-4 rounded"
                        title="Местоположение на потребителя"
                        src={`https://www.google.com/maps/embed/v1/place?key=${googleApiKey}&q=${encodeURIComponent(user?.street1 + ', ' + user?.city + ', ' + user?.state + ', ' + user?.zipCode + ', ' + user?.country)}`}
                        allowFullScreen
                    ></iframe>
                </div>

                {/* Бутони за действия */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <button
                        onClick={shareContact}
                        className="flex flex-col items-center justify-center w-full py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg shadow-md hover:from-purple-700 hover:to-purple-900 hover:shadow-lg transition-all duration-300 ease-in-out"
                    >
                        <FaShareAlt className="text-xl mb-1" />
                        <span className="text-sm font-medium">Сподели контакт</span>
                    </button>

                    <button
                        onClick={copyContactDetails}
                        className="flex flex-col items-center justify-center w-full py-2 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg shadow-md hover:from-green-700 hover:to-green-900 hover:shadow-lg transition-all duration-300 ease-in-out"
                    >
                        <FaClipboard className="text-xl mb-1" />
                        <span className="text-sm font-medium">Копирай данни</span>
                    </button>

                    <button
                        onClick={() => window.location.href = `tel:${user?.phone1}`}
                        className="flex flex-col items-center justify-center w-full py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg shadow-md hover:from-red-700 hover:to-red-900 hover:shadow-lg transition-all duration-300 ease-in-out"
                    >
                        <FaPhoneAlt className="text-xl mb-1" />
                        <span className="text-sm font-medium">Обади се {user?.phone1}</span>
                    </button>

                    <button
                        onClick={() => window.location.href}// = //user?.portfolio}
                        className="flex flex-col items-center justify-center w-full py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-md hover:from-blue-700 hover:to-blue-900 hover:shadow-lg transition-all duration-300 ease-in-out"
                    >
                        <FaDownload className="text-xl mb-1" />
                        <span className="text-sm font-medium">Изтегли портфолио</span>
                    </button>
                </div>

                {/* Фиксиран бутон за запазване във VCF */}
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                    <button
                        onClick={generateVCF}
                        className="flex items-center px-8 py-6 bg-orange text-white rounded-full shadow-2xl hover:shadow-3xl hover:from-blue-600 hover:to-teal-600 transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                        <FaDownload className="mr-3 text-2xl" />
                        <span className="text-lg font-semibold">Запази контанти</span>
                    </button>
                </div>

                {/* Селектор за анимация на фона */}
                <div className="mt-6 text-center">
                    <h3 className={`text-xl font-semibold ${cardStyle.highlightClass}`}>Персонализирай фон на картата</h3>
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
};

export default ProfileDetails;
