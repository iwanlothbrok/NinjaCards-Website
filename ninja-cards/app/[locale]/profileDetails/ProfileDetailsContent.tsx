"use client";

import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { Cropper } from "react-cropper";
import { useAuth } from '../context/AuthContext';
import ActionButtons2 from '../components/profileDetails/ActionButtons2';
import { BASE_API_URL } from '@/utils/constants';
import SocialMediaLinks from '../components/profileDetails/SocialMediaLinks';
import { User } from '@/types/user';
import BackgroundSelector from '../components/profileDetails/BackgroundSelector';
import ProfileHeader from '../components/profileDetails/ProfileHeader';
import generateVCF from "@/utils/generateVCF";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import "cropperjs/dist/cropper.css"; // Import cropper styles

interface Alert {
    message: string;
    title: string;
    color: string;
}

const cardBackgroundOptions = [
    {
        name: 'black',
        bgClass: "bg-black",
        textClass: "text-gray-200",
        borderClass: "border-orange",
        highlightClass: "text-orange",
        cardCoverBgClass: "from-black",
        opposite: 'bg-white'
    },
    {
        name: 'white',
        bgClass: "bg-white",
        textClass: "text-gray-900",
        borderClass: "border-blue-600",
        highlightClass: "text-blue-600",
        cardCoverBgClass: "from-white",
        opposite: 'bg-black'
    },
    {
        name: 'midnight-blue',
        bgClass: "bg-slate-900",
        textClass: "text-slate-100",
        borderClass: "border-cyan-400",
        highlightClass: "text-cyan-400",
        cardCoverBgClass: "from-slate-900",
        opposite: 'bg-white'
    },
    {
        name: 'royal-purple',
        bgClass: "bg-purple-900",
        textClass: "text-purple-50",
        borderClass: "border-fuchsia-400",
        highlightClass: "text-fuchsia-400",
        cardCoverBgClass: "from-purple-900",
        opposite: 'bg-white'
    },
    {
        name: 'emerald-forest',
        bgClass: "bg-emerald-950",
        textClass: "text-emerald-50",
        borderClass: "border-emerald-400",
        highlightClass: "text-emerald-300",
        cardCoverBgClass: "from-emerald-950",
        opposite: 'bg-white'
    },
    {
        name: 'golden-sunset',
        bgClass: "bg-amber-900",
        textClass: "text-amber-50",
        borderClass: "border-amber-400",
        highlightClass: "text-yellow-300",
        cardCoverBgClass: "from-amber-900",
        opposite: 'bg-white'
    },
    {
        name: 'rose-gold',
        bgClass: "bg-rose-950",
        textClass: "text-rose-50",
        borderClass: "border-rose-400",
        highlightClass: "text-pink-300",
        cardCoverBgClass: "from-rose-950",
        opposite: 'bg-white'
    },
    {
        name: 'ocean-depth',
        bgClass: "bg-blue-950",
        textClass: "text-blue-50",
        borderClass: "border-sky-400",
        highlightClass: "text-sky-300",
        cardCoverBgClass: "from-blue-950",
        opposite: 'bg-white'
    },
    {
        name: 'charcoal-premium',
        bgClass: "bg-zinc-900",
        textClass: "text-zinc-100",
        borderClass: "border-violet-400",
        highlightClass: "text-violet-300",
        cardCoverBgClass: "from-zinc-900",
        opposite: 'bg-white'
    },
    {
        name: 'burgundy-luxury',
        bgClass: "bg-red-950",
        textClass: "text-red-50",
        borderClass: "border-red-400",
        highlightClass: "text-orange-300",
        cardCoverBgClass: "from-red-950",
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
    const [alert, setAlert] = useState<Alert | null>(null);
    const [cardStyle, setCardStyle] = useState(cardBackgroundOptions[0]);
    const [, setIsPhone] = useState(false);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [fileForUpload, setFileForUpload] = useState<File | null>(null);
    const [cropper, setCropper] = useState<any>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [hasIncrementedVisit, setHasIncrementedVisit] = useState(false); // Guard state
    const [hasDownoadedVCF, sethasDownoadedVCF] = useState(false); // Guard state
    const router = useRouter();

    const t = useTranslations("cropModal");

    const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            const validFileTypes = ["image/jpeg", "image/png", "image/gif"];
            const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

            if (!validFileTypes.includes(file.type)) {
                console.log("Invalid file type. Please upload an image.");
                return;
            }

            if (file.size > maxSizeInBytes) {
                console.log("File size exceeds 5MB. Please upload a smaller image.");
                return;
            }

            // Set the file for cropping
            setCoverPreview(URL.createObjectURL(file));
            setFileForUpload(file);

            console.log("File uploaded successfully. Proceed to cropping.");
        }
    };

    const cropImage = () => {
        if (!cropper) {
            showAlert("Не е избрана снимка за изрязване.", "Грешка", "red");
            return;
        }

        const croppedCanvas = cropper.getCroppedCanvas();
        if (!croppedCanvas) {
            showAlert("Изрязването на изображението не бе успешно.", "Грешка", "red");
            return;
        }

        croppedCanvas.toBlob((blob: any) => {
            if (!blob) {
                showAlert("Неуспешно генериране на изображение от изрязания участък.", "Грешка", "red");
                return;
            }

            const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

            if (blob.size > maxSizeInBytes) {
                showAlert("Изрязаното изображение надвишава 5MB. Моля, изрежете по-малка област.", "Грешка", "red");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setCroppedImage(reader.result as string);
                setCoverPreview(null);
            };
            reader.readAsDataURL(blob);
        }, "image/jpeg");
    };

    const zoomIn = () => {
        if (cropper) cropper.zoom(0.1); // Zoom in by 10%
    };

    const zoomOut = () => {
        if (cropper) cropper.zoom(-0.1); // Zoom out by 10%
    };

    const resetZoom = () => {
        if (cropper) cropper.reset();
    };

    const saveCover = async () => {
        if (!croppedImage) {
            showAlert("Моля, изрежете изображение преди запазване.", "Грешка", "red");
            return;
        }

        if (!currentUser) {
            showAlert("Потребителят не е удостоверен.", "Грешка", "red");
            return;
        }

        try {
            const response = await fetch(`${BASE_API_URL}/api/profile/uploadCover`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: currentUser.id, coverImage: croppedImage }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Неуспешно запазване на корицата.");
            }

            const result = await response.json();
            setCurrentUser({ ...currentUser, coverImage: result.coverImage });

            showAlert("Изображението на корицата бе успешно запазено.", "Успех", "green");
            cancelCover();
        } catch (error) {
            console.error("Грешка при запазване на корицата:", error);
            showAlert("Възникна грешка при запазване на корицата.", "Грешка", "red");
        }
    };

    const cancelCover = () => {
        setCoverPreview(null);
        setFileForUpload(null);
        setCroppedImage(null);
    };

    const incrementProfileVisits = async (userId: string) => {
        try {
            await fetch(`${BASE_API_URL}/api/dashboard/increaseProfileVisits`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });
        } catch (error) {
            console.error('Error incrementing profile visits:', error);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUser(userId, setCurrentUser, setLoading, showAlert);
        }
    }, [userId]);

    useEffect(() => {
        const checkUserData = async () => {
            try {
                const res = await fetch(`${BASE_API_URL}/api/profile/check?userId=${userId}`);
                if (!res.ok) throw new Error("Неуспешна проверка");

                const data = await res.json();

                console.log(data);

                if (data.needsSetup) {
                    router.push(`/finishProfile/${userId}`);
                }
            } catch (error) {
                console.error("Грешка при проверка на акаунт:", error);
            }
        };

        checkUserData();

        if (currentUser && currentUser.selectedColor) {
            const selectedCardStyle = cardBackgroundOptions.find(option => option.name === currentUser.selectedColor);
            if (selectedCardStyle) {
                setCardStyle(selectedCardStyle);
            }
        }

        if (!hasIncrementedVisit && currentUser) {
            incrementProfileVisits(currentUser?.id); // Increment visits when the profile is visualized
            setHasIncrementedVisit(true); // Ensure this runs only once
        }

        if (!hasDownoadedVCF && currentUser?.isDirect) {
            console.log('isDirect ' + currentUser?.isDirect);
            sethasDownoadedVCF(true);
            // If isDirect is true, generate the VCF and then show the profile
            generateVCF(currentUser);
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
        setTimeout(() => {
            setAlert(null);
        }, 4000);
    };

    if (!currentUser) return <div className="flex justify-center items-center py-72"><img src="/load.gif" alt="Loading..." className="w-40 h-40" /></div>;
    if (loading) return <div className="flex justify-center items-center py-72"><img src="/load.gif" alt="Loading..." className="w-40 h-40" /></div>;
    return (
        <div className={`relative ${cardStyle.name} min-h-screen`}>

            {alert && (
                <div className={`p-4  text-white text-center font-medium transition-all duration-300 
                    ${alert.color === 'green' ? 'bg-green-500' : 'bg-red-500'} animate-fadeIn`}>
                    <strong>{alert.title}:</strong> {alert.message}
                </div>
            )}
            {/* /* Profile Header Section */}
            <ProfileHeader
                user={currentUser}
                cardStyle={cardStyle}
                coverPreview={croppedImage || coverPreview}
                handleCoverChange={handleCoverChange}
                saveCover={saveCover}
                cancelCover={cancelCover}
            />
            {coverPreview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
                    <div className="bg-white p-4 rounded w-11/12 max-w-3xl mx-auto">
                        <h2 className="text-lg text-orange font-bold mb-4">
                            {t("title")}
                        </h2>
                        <Cropper
                            style={{ height: "auto", width: "100%" }}
                            initialAspectRatio={16 / 9}
                            aspectRatio={16 / 9}
                            src={coverPreview}
                            viewMode={1}
                            guides={true}
                            zoomable={true}
                            background={false}
                            responsive={true}
                            autoCropArea={1}
                            checkOrientation={false}
                            onInitialized={(instance) => setCropper(instance)}
                        />

                        <div className="mt-4">
                            {/* Zoom Controls */}
                            <div className="flex justify-center space-x-2 mb-2">
                                <button
                                    onClick={zoomOut}
                                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition-colors duration-300"
                                >
                                    {t("zoomOut")}
                                </button>
                                <button
                                    onClick={zoomIn}
                                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition-colors duration-300"
                                >
                                    {t("zoomIn")}
                                </button>
                                <button
                                    onClick={resetZoom}
                                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition-colors duration-300"
                                >
                                    {t("reset")}
                                </button>
                            </div>

                            {/* Save and Cancel */}
                            <div className="flex justify-center space-x-2">
                                <button
                                    onClick={() => setCoverPreview(null)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300"
                                >
                                    {t("cancel")}
                                </button>
                                <button
                                    onClick={cropImage}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300"
                                >
                                    {t("crop")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Content Section with Background */}
            <div
                className={`relative z-0 flex items-center justify-center ${cardStyle.textClass}`}
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    // boxShadow: '0px 20px 0px rgba(0, 0, 0, 0.8)',
                }}
            >
                {/* Card Section with White Background */}
                <motion.div
                    className={`relative z-0 w-full  p-4 max-w-md bg-gradient-to-b ${cardStyle.cardCoverBgClass} to-black `} // Removed shadow
                >
                    {/* Action Buttons */}
                    <motion.div
                        className={`mt-2 z-50`}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <div className="flex flex-col space-y-4 mb-4 ">

                            <ActionButtons2 generateVCF={() => generateVCF(currentUser)} user={currentUser} />
                        </div>
                    </motion.div>

                    {/* Social Media Links */}
                    <motion.div
                        className="mt-6 z-50"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <SocialMediaLinks user={currentUser} />

                    </motion.div>

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
        </div >
    );
}

export default ProfileDetailsContent;