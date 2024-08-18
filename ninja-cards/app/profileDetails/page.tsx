"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaGithub, FaYoutube, FaTiktok, FaEnvelope, FaShareAlt, FaDownload } from 'react-icons/fa';
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
    const [bgColor, setBgColor] = useState("#ffffff");  // Default background color

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

    if (loading) return <div className="text-center py-20 text-white">Loading...</div>;
    if (!user) return <div className="text-center py-20 text-white">No profile data available.</div>;

    return (
        <div className="min-h-screen flex items-center justify-center" >
            <div style={{ backgroundColor: bgColor }} className="relative z-10  text-gray-900 w-full max-w-md p-6 rounded-lg shadow-xl">
                <div className="text-center">
                    <motion.div
                        className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-teal-500 shadow-lg"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <img className="w-full h-full object-cover"
                            src={user?.image ? `data:image/jpeg;base64,${user.image}` : 'https://via.placeholder.com/150'}
                            alt="Profile image"
                        />
                    </motion.div>
                    <h1 className="text-2xl font-bold">{user?.name}</h1>
                    <p className="text-teal-400">{user?.position} at {user?.company}</p>
                </div>

                <div className="mt-6 text-center">
                    <h3 className="text-lg font-semibold">About {user?.firstName}</h3>
                    <p className="text-gray-600 mt-2">{user?.bio}</p>
                </div>

                <div className="mt-6 text-center">
                    <h3 className="text-lg font-semibold">Location</h3>
                    <p className="text-gray-600 mt-2">{`${user?.street1}, ${user?.city}, ${user?.state}, ${user?.zipCode}, ${user?.country}`}</p>
                    <iframe
                        className="w-full h-48 mt-4 rounded"
                        title="User Location"
                        src={`https://www.google.com/maps/embed/v1/place?key=${googleApiKey}&q=${encodeURIComponent(user?.street1 + ', ' + user?.city + ', ' + user?.state + ', ' + user?.zipCode + ', ' + user?.country)}`}
                        allowFullScreen
                    ></iframe>
                </div>

                <div className="mt-6 flex justify-between">
                    <button
                        onClick={generateVCF}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
                    >
                        <FaDownload className="mr-2" /> Download VCF
                    </button>
                    <button
                        onClick={shareContact}
                        className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition-transform transform hover:scale-105"
                    >
                        <FaShareAlt className="mr-2" /> Share Contact
                    </button>
                    <a
                        href={`mailto:${user?.email}`}
                        className="flex items-center px-4 py-2 bg-orange text-white rounded-full shadow-lg hover:bg-orange transition-transform transform hover:scale-105"
                    >
                        <FaEnvelope className="mr-2" /> Send Email
                    </a>
                </div>

                {/* Background Color Picker */}
                <div className="mt-6 text-center">
                    <h3 className="text-lg font-semibold">Customize Background</h3>
                    <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="mt-2 p-1 border rounded"
                    />
                </div>
            </div>
        </div>
    );
};

export default ProfileDetails;
