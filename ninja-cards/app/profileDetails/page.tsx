"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    FaFacebook, FaInstagram, FaLinkedin, FaTwitter,
    FaGithub, FaYoutube, FaTiktok, FaEnvelope, FaPhoneAlt, FaShareAlt, FaDownload, FaClipboard
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
}
const googleApiKey = process.env.GOOGLE_API_KEY;

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
    const [cardStyle, setCardStyle] = useState({
        bgClass: "bg-white",
        textClass: "text-gray-900",
        borderClass: "border-orange",
        highlightClass: "text-orange",
    });

    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams?.get('id');

    useEffect(() => {
        if (userId) {
            fetchUser(userId, setUser, setLoading, showAlert);
        }
    }, [userId]);

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
        if (user.street1 || user.city || user.state || user.zipCode || user.country) {
            vCard.push(`ADR;TYPE=WORK:;;${user.street1 || ''};${user.city || ''};${user.state || ''};${user.zipCode || ''};${user.country || ''}`);
        }
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
                title: `Contact ${user?.name}`,
                text: `Check out the contact details of ${user?.name}`,
                url: window.location.href,
            });
        } else {
            generateVCF(); // Fallback to downloading the VCF if sharing isn't supported
        }
    };

    const copyContactDetails = () => {
        if (!user) return;
        const contactInfo = `
        Name: ${user.name}
        Email: ${user.email}
        Phone: ${user.phone1}
        Company: ${user.company}
        Position: ${user.position}
        Address: ${user.street1}, ${user.city}, ${user.state}, ${user.zipCode}, ${user.country}
        `;

        navigator.clipboard.writeText(contactInfo).then(() => {
            showAlert('Contact details copied to clipboard', 'Success', 'green');
        }, () => {
            showAlert('Failed to copy contact details', 'Error', 'red');
        });
    };

    if (loading) return <div className="text-center py-20 text-white">Loading...</div>;
    if (!user) return <div className="text-center py-20 text-white">No profile data available.</div>;

    const cardBackgroundOptions = [
        {
            bgClass: "bg-white",
            textClass: "text-gray-900",
            borderClass: "border-orange", // Made border more vibrant with teal for better visibility.
            highlightClass: "text-orange" // Darkened highlight color for stronger visibility against white.
        },
        {
            bgClass: "bg-gray-800",
            textClass: "text-gray-100",
            borderClass: "border-orange", // Made border more vibrant with teal for better visibility.
            highlightClass: "text-orange"
        },
        {
            bgClass: "bg-gradient-to-r from-blue-500 via-teal-600 to-teal-800",
            textClass: "text-white",
            borderClass: "border-yellow-400", // Switched to a brighter yellow for better visibility.
            highlightClass: "text-yellow-400" // Brightened yellow for more pop against the gradient.
        },
        {
            bgClass: "bg-gradient-to-r from-purple-500 via-indigo-500 to-indigo-700",
            textClass: "text-white",
            borderClass: "border-yellow-400", // Switched to a brighter yellow for better visibility.
            highlightClass: "text-yellow-400" // Brightened yellow for more pop against the gradient.
        },
        {
            bgClass: "bg-gradient-to-r from-green-500 via-blue-500 to-blue-700",
            textClass: "text-white",
            borderClass: "border-yellow-400", // Brightened the yellow border to stand out more.
            highlightClass: "text-yellow-400" // Stronger yellow highlight for better visibility.
        },
        {
            bgClass: "bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500",
            textClass: "text-gray-900",
            borderClass: "border-teal-900", // Darkened the teal border for more contrast.
            highlightClass: "text-teal-900" // Darkened teal for stronger visibility against the warm gradient.
        },
    ];


    return (
        <div className={`min-h-screen flex items-center justify-center ${cardStyle.bgClass}`}>
            <div
                className={`relative z-10 w-full max-w-md p-6 rounded-lg shadow-xl mt-20 mb-20 ${cardStyle.bgClass} ${cardStyle.textClass}`}
            >
                {/* Social Media Links */}
                <div className="mt-4 text-center">
                    <h3 className="text-xl font-semibold">Connect with Me</h3>
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

                {/* Profile Image */}
                <div className="text-center mt-6">
                    <motion.div
                        className={`relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-4 shadow-2xl shadow-cyan-600/50 ${cardStyle.borderClass}`}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <img className={`w-full h-full object-cover `}
                            src={user?.image ? `data:image/jpeg;base64,${user.image}` : 'https://via.placeholder.com/150'}
                            alt="Profile image"
                        />
                    </motion.div>
                    <h1 className={`text-4xl font-bold ${cardStyle.highlightClass}`}>{user?.name}</h1>
                    <p className={`${cardStyle.highlightClass}`}>{user?.position} at {user?.company}</p>
                    <p className="mt-2"><FaEnvelope className="inline mr-2" />{user?.email}</p>
                    <p className=""><FaPhoneAlt className="inline mr-2" />{user?.phone1}</p>
                </div>

                {/* About Section */}
                <div className="mt-6 text-center">
                    <h3 className="text-xl font-semibold">About {user?.firstName}</h3>
                    <p className="mt-2">{user?.bio}</p>
                </div>

                {/* Location Section */}
                <div className="mt-6 text-center">
                    <h3 className="text-xl font-semibold">Location</h3>
                    <p className="mt-2">{`${user?.street1}, ${user?.city}, ${user?.state}, ${user?.zipCode}, ${user?.country}`}</p>
                    <iframe
                        className="w-full h-48 mt-4 rounded"
                        title="User Location"
                        src={`https://www.google.com/maps/embed/v1/place?key=${googleApiKey}&q=${encodeURIComponent(user?.street1 + ', ' + user?.city + ', ' + user?.state + ', ' + user?.zipCode + ', ' + user?.country)}`}
                        allowFullScreen
                    ></iframe>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-between">
                    <button
                        onClick={shareContact}
                        className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition-transform transform hover:scale-105"
                    >
                        <FaShareAlt className="mr-2" /> Share Contact
                    </button>
                    <button
                        onClick={copyContactDetails}
                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105"
                    >
                        <FaClipboard className="mr-2" /> Copy Details
                    </button>
                </div>

                {/* Fixed Save to VCF Button */}
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                    <button
                        onClick={generateVCF}
                        className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 transition-transform transform hover:scale-110"
                    >
                        <FaDownload className="mr-2" /> Save to VCF
                    </button>
                </div>

                {/* Background Animation Selector */}
                <div className="mt-6 text-center">
                    <h3 className="text-xl font-semibold">Customize Card Background</h3>
                    <div className="flex justify-center space-x-2 mt-2">
                        {cardBackgroundOptions.map(({ bgClass, textClass, borderClass, highlightClass }) => (
                            <button
                                key={bgClass}
                                onClick={() => setCardStyle({ bgClass, textClass, borderClass, highlightClass })}
                                className={`w-8 h-8 rounded-full border border-gray-300 focus:outline-none ${bgClass}`}
                                style={{ borderColor: borderClass.split("-")[1] }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileDetails;
