"use client";

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    FaFacebook, FaInstagram, FaLinkedin,
    FaTwitter, FaTiktok, FaGoogle, FaCashRegister
} from 'react-icons/fa';
import { AiOutlineGlobal } from 'react-icons/ai';

const socialMediaIcons = {
    facebook: FaFacebook,
    instagram: FaInstagram,
    linkedin: FaLinkedin,
    twitter: FaTwitter,
    tiktok: FaTiktok,
    googleReview: FaGoogle,
    revolut: FaCashRegister,
    website: AiOutlineGlobal,
};

const Preview: React.FC = () => {
    const { user } = useAuth();

    const sectionClass = "border border-gray-700 rounded-lg p-4 mb-6 bg-gray-800";
    const titleClass = "text-2xl font-bold mb-4 text-teal-400";
    const textClass = "text-lg text-gray-300";
    const linkClass = "flex items-center space-x-3 text-lg text-teal-400 hover:text-orange-500 transition-colors duration-300";

    return (
        <div className="w-full max-w-4xl mx-auto mt-10 p-8 bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800 rounded-xl shadow-2xl">
            <h2 className="text-4xl font-extrabold mb-8 text-center text-white">Profile Preview</h2>

            {user?.image && (
                <div className="flex justify-center mb-6">
                    <img
                        src={user?.image ? `data:image/jpeg;base64,${user.image}` : 'default-image-url.jpg'}
                        alt={`${user?.firstName} ${user?.lastName}`}
                        className="w-40 h-40 rounded-full border-4 border-teal-400 shadow-lg"
                    />
                </div>
            )}

            <div className={sectionClass}>
                <h3 className={titleClass}>Card Information</h3>
                <p className={textClass}><strong>Card Name:</strong> {user?.name}</p>
                <p className={textClass}><strong>First Name:</strong> {user?.firstName}</p>
                <p className={textClass}><strong>Last Name:</strong> {user?.lastName}</p>
            </div>

            <div className={sectionClass}>
                <h3 className={titleClass}>Contacts</h3>
                <p className={textClass}><strong>Phone 1:</strong> {user?.phone1}</p>
                <p className={textClass}><strong>Phone 2:</strong> {user?.phone2}</p>
                <p className={textClass}><strong>Email 1:</strong> {user?.email}</p>
                <p className={textClass}><strong>Email 2:</strong> {user?.email2}</p>
            </div>
            <div className={sectionClass}>
                <h3 className={titleClass}>Social Media</h3>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-4 ml-4 sm:ml-10">
                    {Object.keys(socialMediaIcons).map((key) => {
                        const IconComponent = socialMediaIcons[key as keyof typeof socialMediaIcons];
                        const url = user?.[key as keyof typeof user] as string;
                        if (!url) return null;
                        return (
                            <a
                                key={key}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-2xl sm:text-3xl text-teal-400 hover:text-orange transition-transform transform hover:scale-110 sm:hover:scale-125"
                            >
                                <IconComponent />
                            </a>
                        );
                    })}
                </div>
            </div>

            <div className={sectionClass}>
                <h3 className={titleClass}>Address</h3>
                <p className={textClass}><strong>Street 1:</strong> {user?.street1}</p>
                <p className={textClass}><strong>Street 2:</strong> {user?.street2}</p>
                <p className={textClass}><strong>Zip Code:</strong> {user?.zipCode}</p>
                <p className={textClass}><strong>City:</strong> {user?.city}</p>
                <p className={textClass}><strong>State:</strong> {user?.state}</p>
                <p className={textClass}><strong>Country:</strong> {user?.country}</p>
            </div>

            <div className={sectionClass}>
                <h3 className={titleClass}>Bio</h3>
                <p className={textClass}>{user?.bio}</p>
            </div>

            {user?.qrCode && (
                <div className={sectionClass}>
                    <h3 className={titleClass}>QR Code</h3>
                    <img src={user.qrCode} alt="QR Code" className="w-40 h-40 mx-auto mt-2" />
                </div>
            )}
        </div>
    );
};

export default Preview;
