"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    FaFacebook, FaInstagram, FaLinkedin, FaTwitter,
    FaGithub, FaYoutube, FaTiktok, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaShareAlt
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

interface Alert {
    message: string;
    title: string;
    color: string;
}

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
    const [alert, setAlert] = useState<Alert | null>(null);
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

    const ProfileImage = () => (
        <motion.div
            className="relative z-10 w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden border-4 border-teal-500 shadow-lg"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <img className="w-full h-full object-cover"
                src={user?.image ? `data:image/jpeg;base64,${user.image}` : 'default-image-url.jpg'}
                alt="Profile image"
            />
        </motion.div>
    );

    const SocialLinks = () => (
        <div className="flex justify-center mb-6 space-x-4">
            {user?.facebook && <a href={user.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-transform transform hover:scale-125"><FaFacebook size={32} /></a>}
            {user?.instagram && <a href={user.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-700 transition-transform transform hover:scale-125"><FaInstagram size={32} /></a>}
            {user?.linkedin && <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 transition-transform transform hover:scale-125"><FaLinkedin size={32} /></a>}
            {user?.twitter && <a href={user.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 transition-transform transform hover:scale-125"><FaTwitter size={32} /></a>}
            {user?.github && <a href={user.github} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 transition-transform transform hover:scale-125"><FaGithub size={32} /></a>}
            {user?.youtube && <a href={user.youtube} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 transition-transform transform hover:scale-125"><FaYoutube size={32} /></a>}
            {user?.tiktok && <a href={user.tiktok} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-800 transition-transform transform hover:scale-125"><FaTiktok size={32} /></a>}
        </div>
    );

    const Address = () => {
        if (!user?.street1 || !user.city || !user.country) return null;
        const address = `${user.street1}, ${user.city}, ${user.state}, ${user.country}`;
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

        return (
            <div className="my-6">
                <h3 className="text-teal-400 font-semibold">Address</h3>
                <p className="text-white mb-2">{address}</p>
                <iframe
                    title="User Address"
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCrPyVxRucGPRQDdxjwzz-S-yKTK59zsU4&q=${encodeURIComponent(address)}`}
                    width="100%"
                    height="200"
                    className="rounded-lg"
                    allowFullScreen
                ></iframe>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-lg text-teal-300 hover:text-orange-500 transition-transform transform hover:scale-105 inline-flex items-center mt-4">
                    <FaMapMarkerAlt className="mr-2" /> View Address on Map
                </a>
            </div>
        );
    };

    const ActionButtons = () => (
        <div className="flex justify-around mt-6 mb-8">
            <button
                onClick={generateVCF}
                className="bg-teal-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-teal-600 transition-transform transform hover:scale-105"
            >
                Save VCF
            </button>
            {user?.phone1 && (
                <a href={`tel:${user.phone1}`} className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105">
                    <FaPhoneAlt /> Call
                </a>
            )}
            {user?.email && (
                <a href={`mailto:${user.email}`} className="bg-orange text-white px-4 py-2 rounded-full shadow-lg hover:bg-orange-600 transition-transform transform hover:scale-105">
                    <FaEnvelope /> Email
                </a>
            )}
            <button
                onClick={() => navigator.share && navigator.share({
                    title: user?.name,
                    text: `Contact ${user?.name}`,
                    url: window.location.href
                })}
                className="bg-purple-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-purple-600 transition-transform transform hover:scale-105"
            >
                <FaShareAlt /> Share
            </button>
        </div>
    );

    if (loading) return <div className="text-center py-20 text-white">Loading...</div>;
    if (!user) return <div className="text-center py-20 text-white">No profile data available.</div>;

    return (
        <div className="container mt-20 w-full mx-auto max-w-2xl rounded-lg overflow-hidden shadow-lg bg-gradient-to-b from-gray-100 via-white to-gray-100 text-gray-900 relative">
            {alert && (
                <div className={`my-2 p-4 rounded ${alert.color === 'green' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                    <strong>{alert.title}: </strong> {alert.message}
                </div>
            )}
            <Suspense fallback={<div>Loading...</div>}>
                <ProfileImage />
            </Suspense>
            <Suspense fallback={<div>Loading...</div>}>
                <SocialLinks />
            </Suspense>
            <div className="px-6 py-4">
                <h2 className="text-2xl font-bold text-center mb-4">{user?.name}</h2>
                <p className="text-sm text-center mb-6">{user?.bio}</p>
                <div className="grid grid-cols-1 gap-4 mb-6">
                    {user?.company && (
                        <div>
                            <h3 className="text-teal-400 font-semibold">Company</h3>
                            <p className="text-teal-600">{user?.company}</p>
                        </div>
                    )}
                    {user?.position && (
                        <div>
                            <h3 className="text-teal-400 font-semibold">Position</h3>
                            <p className="text-teal-600">{user?.position}</p>
                        </div>
                    )}
                    {user?.phone1 && (
                        <div>
                            <h3 className="text-teal-400 font-semibold">Phone 1</h3>
                            <p className="text-teal-600">{user?.phone1}</p>
                        </div>
                    )}
                    {user?.phone2 && (
                        <div>
                            <h3 className="text-teal-400 font-semibold">Phone 2</h3>
                            <p className="text-teal-600">{user?.phone2}</p>
                        </div>
                    )}
                    {user?.email && (
                        <div>
                            <h3 className="text-teal-400 font-semibold">Email</h3>
                            <p className="text-teal-600">{user?.email}</p>
                        </div>
                    )}
                    {user?.email2 && (
                        <div>
                            <h3 className="text-teal-400 font-semibold">Email 2</h3>
                            <p className="text-teal-600">{user?.email2}</p>
                        </div>
                    )}
                    <Suspense fallback={<div>Loading...</div>}>
                        <Address />
                    </Suspense>
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                    <ActionButtons />
                </Suspense>
            </div>
        </div>
    );
};

export default ProfileDetails;
