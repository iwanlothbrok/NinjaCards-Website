"use client";

import React, { useState, useEffect, useCallback, use } from "react";
import ExchangeContact from '../components/profileDetails/ExchangeContact';
import { FaUserCircle, FaExchangeAlt, FaDownload, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ActionButtons2 from '../components/profileDetails/ActionButtons2';
import { BASE_API_URL } from '@/utils/constants';
import SocialMediaLinks from '../components/profileDetails/SocialMediaLinks';
import { User } from '@/types/user';
import BackgroundSelector from '../components/profileDetails/BackgroundSelector';
import ProfileHeader from '../components/profileDetails/ProfileHeader';
import generateVCF from "@/utils/generateVCF";
const cardBackgroundOptions = [
    {
        name: 'black',
        bgClass: "bg-black",
        textClass: "text-gray-200",      // Softer white for less harsh contrast
        borderClass: "border-orange",  // Dark gray to soften the black borders
        highlightClass: "text-orange", // Yellow for a bright and visible highlight
        cardCoverBgClass: "from-black",
        opposite: 'bg-white'
    },
    {
        name: 'white',
        bgClass: "bg-white",          // Softer off-white to reduce strain on the eyes
        textClass: "text-gray-900",      // Dark gray for better contrast than black
        borderClass: "border-blue-600",  // Light gray to keep borders subtle
        highlightClass: "text-blue-600", // Blue highlight for a clean contrast
        cardCoverBgClass: "from-white",
        opposite: 'bg-black'
    },
    {
        name: 'gray-600',
        bgClass: "bg-gray-800",          // Darker gray for a sleek modern look
        textClass: "text-gray-100",      // Light gray text to contrast well
        borderClass: "border-green-600",  // Slightly lighter border than background
        highlightClass: "text-green-400", // Bright green for a pop of color
        cardCoverBgClass: "from-gray-800",
        opposite: 'bg-black'
    },
    {
        name: 'orange',
        bgClass: "bg-gray-900",          // Darker gray for a sleek modern look
        textClass: "text-white",         // White text for clear contrast
        borderClass: "border-orange",// Slightly darker orange border
        highlightClass: "text-orange", // Lighter yellow for soft, visible highlight
        cardCoverBgClass: "from-gray-900",
        opposite: 'bg-orange'
    },
    {
        name: 'teal-700',
        bgClass: "bg-teal-700",          // Bold teal background
        textClass: "text-white",         // White text for contrast
        borderClass: "border-teal-500",  // Darker teal border
        highlightClass: "text-orange", // Bright pink highlight for contrast
        cardCoverBgClass: "from-teal-700",
        opposite: 'bg-white'
    }
];

const saveSelectedColor = async (userId: string, color: string, showAlert: (message: string, title: string, color: string) => void) => {
    try {
        const response = await fetch(`${BASE_API_URL}/api/profile/saveColor`, {
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
        const response = await fetch(`${BASE_API_URL}/api/profile/${userId}`);
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

const ProfileDetailsContent: React.FC<{ userId: string }> = ({ userId }) => {
    const { user } = useAuth();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ message: string; title: string; color: string } | null>(null);
    const [cardStyle, setCardStyle] = useState(cardBackgroundOptions[0]);
    const [isPhone, setIsPhone] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [fileForUpload, setFileForUpload] = useState<File | null>(null)
    // Handle uploading the file and creating a base64 string
    const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const validFileTypes = ["image/jpeg", "image/png", "image/gif"];
            const maxSizeInBytes = 5 * 1024 * 1024;

            if (!validFileTypes.includes(file.type)) {
                // alert("Invalid file type. Please upload an image.");
                return;
            }

            if (file.size > maxSizeInBytes) {
                // alert("File size exceeds 5MB. Please upload a smaller image.");
                return;
            }

            setCoverPreview(URL.createObjectURL(file));
            setFileForUpload(file);
        }
    };

    const saveCover = async () => {
        if (!fileForUpload || !currentUser) return;
        try {
            const base64File = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(fileForUpload);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = (error) => reject(error);
            });

            const response = await fetch(`${BASE_API_URL}/api/profile/uploadCover`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: currentUser.id, coverImage: base64File }),
            });

            if (!response.ok) throw new Error(await response.text());

            const result = await response.json();
            setCurrentUser({ ...currentUser, coverImage: result.coverImage });
            console.log("Cover image saved successfully!");
            cancelCover();
        } catch (error) {
            console.error("Error saving cover image:", error);
            console.log("Failed to save cover image. Please try again.");
        }
    };
    const cancelCover = () => {
        setCoverPreview(null); // Clear the preview
        setFileForUpload(null); // Clear the selected file
    };



    const handleExchangeContact = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleSubmitContact = async (vCard: string) => {
        try {
            await fetch(`${BASE_API_URL}/api/profile/exchangeContact`, {
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
                className="flex-grow flex items-center justify-center bg-white text-black py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-300 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
                <FaDownload className="mr-2 text-3xl" />
                <span className="text-lg font-semibold">СВАЛИ КОНТАКТ</span>
            </button>

            {/* Exchange Contact Button */}
            <button
                onClick={handleExchangeContact}
                className="w-16 flex items-center justify-center bg-gray-800 text-white py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-950 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
                <FaExchangeAlt className="text-3xl" />
            </button>
            <div className="z-50"  >

                <ExchangeContact
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    onSubmit={handleSubmitContact}
                />
            </div>

        </div >
    );


    if (!currentUser) return <div className="flex justify-center items-center py-72"><img src="/load.gif" alt="Loading..." className="w-40 h-40" /></div>;
    if (loading) return <div className="flex justify-center items-center py-72"><img src="/load.gif" alt="Loading..." className="w-40 h-40" /></div>;
    return (
        <div className={`relative ${cardStyle.opposite} pt-20`}>
            {/* Profile Header Section */}
            <ProfileHeader
                user={currentUser}
                cardStyle={cardStyle}
                coverPreview={coverPreview}
                handleCoverChange={handleCoverChange}
                saveCover={saveCover}
                cancelCover={cancelCover}
            />

            {/* Content Section with Background */}
            <div
                className={`relative flex items-center justify-center ${cardStyle.textClass}`}
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.8)',
                }}
            >
                {/* Card Section with White Background */}
                <motion.div
                    className={`relative z-10 w-full  p-8 max-w-md bg-gradient-to-b ${cardStyle.cardCoverBgClass} to-black shadow-none`} // Removed shadow
                >
                    {/* Action Buttons */}
                    <motion.div
                        className={`mt-6 z-50`}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <div className="flex flex-col space-y-4 mb-4 z-10001">

                            <ActionButtons2 user={currentUser} />
                            <button
                                onClick={handleExchangeContact}
                                className="flex items-center justify-center bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 w-full sm:w-auto"
                            >
                                <FaEnvelope className="mr-3 text-2xl" />
                                <span className="text-lg font-semibold">Разменете Контакти</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* Social Media Links */}
                    <motion.div
                        className="mt-6"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <SocialMediaLinks user={currentUser} />
                    </motion.div>

                    {/* Floating Buttons */}
                    <FloatingButtons generateVCF={() => generateVCF(currentUser)} />

                    {/* Background Selector (visible only for the current user) */}
                    {user?.id === currentUser?.id && (
                        <BackgroundSelector
                            cardBackgroundOptions={cardBackgroundOptions}
                            handleColorSelection={handleColorSelection}
                            cardStyle={cardStyle}
                        />
                    )}
                </motion.div>
            </div>
        </div>
    );
}

export default ProfileDetailsContent;