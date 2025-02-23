"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import Image from 'next/image';
import { BASE_API_URL } from '@/utils/constants';

interface Alert {
    message: string;
    title: string;
    color: string;
}

const socialMediaLinks = [
    { name: 'facebook', icon: '/logos/fb.png', alt: 'Facebook' },
    { name: 'instagram', icon: '/logos/ig.png', alt: 'Instagram' },
    { name: 'linkedin', icon: '/logos/lk.png', alt: 'LinkedIn' },
    { name: 'twitter', icon: '/logos/x.png', alt: 'Twitter' },
    { name: 'tiktok', icon: '/logos/tiktok.png', alt: 'TikTok' },
    { name: 'googleReview', icon: '/logos/gr.png', alt: 'Google Review' },
    { name: 'revolut', icon: '/logos/rev.png', alt: 'Revolut' },
    { name: 'website', icon: '/logos/website.png', alt: 'Website' },
];

const Preview: React.FC = () => {
    const { user, setUser } = useAuth();
    const [alert, setAlert] = useState<Alert | null>(null);
    const alertRef = useRef<HTMLDivElement>(null);

    const sectionClass = "border border-gray-700 rounded-lg p-4 mb-6 bg-gray-800";
    const titleClass = "text-2xl font-bold mb-4 text-teal-400";
    const textClass = "text-lg text-gray-300";

    const handleRemoveImage = async () => {
        if (!user || !user.id) return;
        window.scrollTo({ top: 0, behavior: 'smooth' });

        try {
            const response = await fetch(`${BASE_API_URL}/api/profile/removeUsersImage?id=${user.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Неуспешно премахване на изображение');
            }

            const updatedUser = await response.json();
            setUser(updatedUser);

            showAlert('Изображението е премахнато успешно', 'Успех', 'green');

        } catch (error) {
            showAlert('Възникна неочаквана грешка. Моля, опитайте отново.', 'Грешка', 'red');
        }
    };

    const handleCvRemove = async () => {
        if (!user || !user.id) return;
        window.scrollTo({ top: 0, behavior: 'smooth' });

        try {
            const response = await fetch(`${BASE_API_URL}/api/profile/removeCV?id=${user.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Неуспешно премахване на CV');
            }

            const updatedUser = await response.json();
            setUser(updatedUser);

            showAlert('CV е премахнато успешно', 'Успех', 'green');

        } catch (error) {
            showAlert('Възникна неочаквана грешка. Моля, опитайте отново.', 'Грешка', 'red');
        }
    };

    const downloadCv = () => {
        if (!user) return;

        const link = document.createElement('a');
        link.href = `${BASE_API_URL}/api/profile/downloadCv?id=${user.id}`;
        link.download = `${user.firstName}_${user.lastName}_CV.pdf`;
        link.click();
    };

    const showAlert = (message: string, title: string, color: string) => {
        setAlert({ message, title, color });
        setTimeout(() => {
            setAlert(null);
        }, 4000);
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-10 p-8 bg-gradient-to-b from-black via-gray-950 to-gray-950 rounded-xl shadow-2xl">
            <h2 className="text-4xl font-extrabold mb-8 text-center text-white">Преглед на профила</h2>
            {alert && (
                <div ref={alertRef} className={`p-4 rounded-lg text-white animate-fadeIn transition-all duration-300 ${alert.color === 'green' ? 'bg-green-500' : 'bg-red-500'} mb-6`}>
                    <strong>{alert.title}: </strong> {alert.message}
                </div>
            )}
            {user?.image && (
                <div className="flex flex-col items-center mb-6">
                    <img
                        loading="lazy"
                        src={user?.image ? `data:image/jpeg;base64,${user.image}` : 'default-image-url.jpg'}
                        alt={`${user?.firstName} ${user?.lastName}`}
                        className="w-40 h-40 rounded-full border-4 border-teal-400 shadow-lg mb-4"
                    />
                    <button
                        onClick={handleRemoveImage}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                    >
                        Премахване на изображение
                    </button>
                </div>
            )}

            <div className={sectionClass}>
                <h3 className={titleClass}>Информация за картата</h3>
                <p className={textClass}><strong>Име на картата:</strong> {user?.name}</p>
                <p className={textClass}><strong>Име:</strong> {user?.firstName}</p>
                <p className={textClass}><strong>Фамилия:</strong> {user?.lastName}</p>
            </div>

            <div className={sectionClass}>
                <h3 className={titleClass}>Контакти</h3>
                <p className={textClass}><strong>Телефон 1:</strong> {user?.phone1}</p>
                <p className={textClass}><strong>Телефон 2:</strong> {user?.phone2}</p>
                <p className={textClass}><strong>Email 1:</strong> {user?.email}</p>
                <p className={textClass}><strong>Email 2:</strong> {user?.email2}</p>
            </div>

            <div className={sectionClass}>
                <h3 className={titleClass}>Социални медии</h3>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 justify-center">
                    {socialMediaLinks.map(({ name, icon, alt }) => {
                        const url = user?.[name as keyof typeof user] as string;
                        if (!url) return null;
                        return (
                            <a
                                key={name}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-transform transform hover:scale-110"
                            >
                                <Image
                                    src={icon}
                                    alt={alt}
                                    width={52}
                                    height={52}
                                    className="rounded-full"
                                />
                            </a>
                        );
                    })}
                </div>
            </div>

            <div className={sectionClass}>
                <h3 className={titleClass}>Адрес</h3>
                <p className={textClass}><strong>Улица 1:</strong> {user?.street1}</p>
                <p className={textClass}><strong>Улица 2:</strong> {user?.street2}</p>
                <p className={textClass}><strong>Пощенски код:</strong> {user?.zipCode}</p>
                <p className={textClass}><strong>Град:</strong> {user?.city}</p>
                <p className={textClass}><strong>Област:</strong> {user?.state}</p>
                <p className={textClass}><strong>Държава:</strong> {user?.country}</p>
            </div>

            <div className={sectionClass}>
                <h3 className={titleClass}>Биография</h3>
                <p className={textClass}>{user?.bio}</p>
            </div>

            {user?.qrCode && (
                <div className={sectionClass}>
                    <h3 className={titleClass}>QR код</h3>
                    <img src={user.qrCode} alt="QR код" className="w-40 h-40 mx-auto mt-2" />
                </div>
            )}

        </div>
    );
};

export default Preview;
