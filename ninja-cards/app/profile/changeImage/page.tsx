"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { BASE_API_URL } from '@/utils/constants';

interface Alert {
    message: string;
    title: string;
    color: string;
}

const ProfileImageUploader: React.FC = () => {
    const { user, setUser } = useAuth();
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Crop>({ unit: '%', width: 30, height: 30, x: 0, y: 0 });
    const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
    const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const [alert, setAlert] = useState<Alert | null>(null);
    const [loading, setLoading] = useState(false);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const router = useRouter();

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.size <= 2500 * 1024) {  // Проверка дали размерът на изображението е в лимита (1MB)
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result as string);
                setImageError(null);
            };
            reader.readAsDataURL(file);
        } else {
            setImageError('Размерът на изображението надвишава лимита от 2,5 MB');
        }
    }, []);

    const onLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
        imageRef.current = event.currentTarget as HTMLImageElement;
    }, []);

    const getCroppedImg = useCallback((): Promise<File | null> => {
        if (!completedCrop || !imageRef.current) return Promise.resolve(null);

        const canvas = document.createElement('canvas');
        const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
        const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
        canvas.width = completedCrop.width * scaleX;
        canvas.height = completedCrop.height * scaleY;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            ctx.drawImage(
                imageRef.current,
                completedCrop.x * scaleX,
                completedCrop.y * scaleY,
                completedCrop.width * scaleX,
                completedCrop.height * scaleY,
                0,
                0,
                canvas.width,
                canvas.height
            );

            return new Promise<File | null>((resolve) => {
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], 'cropped_image.jpg', { type: 'image/jpeg' });
                        const previewUrl = URL.createObjectURL(blob);
                        setCroppedImageUrl(previewUrl);
                        resolve(file);
                    } else {
                        resolve(null);
                    }
                }, 'image/jpeg');
            });
        }
        return Promise.resolve(null);
    }, [completedCrop]);

    useEffect(() => {
        if (completedCrop) {
            getCroppedImg();
        }
    }, [completedCrop, getCroppedImg]);

    const handleUpload = async () => {
        const croppedFile = await getCroppedImg();
        if (!croppedFile) {
            showAlert("Моля, изберете и изрежете изображение преди качването.", 'Предупреждение', 'red');
            return;
        }

        setLoading(true);
        setImageError(null);

        try {
            if (!user) {
                showAlert("Потребителят не е удостоверен.", 'Предупреждение', 'red');

                setLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append('id', user?.id);
            formData.append('image', croppedFile);

            const response = await fetch(`${BASE_API_URL}/api/profile/changeImage`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Неуспешно качване на изображението');
            }

            const updatedUser = await response.json();
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            setImageSrc('');
            setImageError(null);
            showAlert('Изображението беше успешно качено', 'Успех', 'green');

            setTimeout(() => {
                router.push('/profile');
            }, 2000);  // Redirect after 2 seconds
        } catch (error) {
            console.error('Грешка при качването на изображението:', error);
            showAlert('Неуспешно качване на изображението', 'Предупреждение', 'red');

        } finally {
            setLoading(false);
        }
    };

    const showAlert = (message: string, title: string, color: string) => {
        setAlert({ message, title, color });
        setTimeout(() => {
            setAlert(null);
        }, 4000);
    };
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
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            showAlert('Изображението е премахнато успешно', 'Успех', 'green');

        } catch (error) {
            showAlert('Възникна неочаквана грешка. Моля, опитайте отново.', 'Грешка', 'red');
        }
    };

    return (
        <div className='p-4'>

            <div className="w-full max-w-3xl mx-auto mt-28 p-10 bg-gradient-to-b from-gray-900 to-gray-800 
            rounded-2xl shadow-xl border border-gray-700 sm:mx-6 md:mx-10 lg:mx-auto">

                <h2 className="text-4xl font-bold text-center text-white mb-6 tracking-wide">
                    📸 Смяна на профилната снимка
                </h2>

                {/* Alert Message */}
                {alert && (
                    <div className={`p-4 rounded-lg mb-6 text-white text-center font-medium transition-all duration-300 
                    ${alert.color === 'green' ? 'bg-green-500' : 'bg-red-500'} animate-fadeIn`}>
                        <strong>{alert.title}:</strong> {alert.message}
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
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-transform transform hover:scale-105 focus:ring-4 focus:ring-red-400"
                        >
                            🗑️ Премахване на профилна
                        </button>
                    </div>
                )}

                {/* File Upload */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Профилна снимка
                    </label>
                    {imageError && <div className="text-red-500 mb-2">{imageError}</div>}

                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-gray-500 font-medium text-lg bg-gray-100 file:cursor-pointer cursor-pointer 
                    file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-orange file:hover:bg-opacity-60 file:text-white 
                    rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>

                {/* Image Cropper */}
                {imageSrc && (
                    <>
                        <ReactCrop
                            crop={crop}
                            onChange={(newCrop: Crop) => setCrop(newCrop)}
                            onComplete={(c) => setCompletedCrop(c as PixelCrop)}
                            aspect={1}  // Square aspect ratio for profile picture
                        >
                            <img
                                src={imageSrc}
                                ref={imageRef}
                                onLoad={onLoad}
                                alt="Изрежи ме"
                                className="max-w-full rounded-lg shadow-md"
                            />
                        </ReactCrop>

                        {croppedImageUrl && (
                            <div>
                                <h4 className="mt-4 text-gray-300">🔍 Преглед на изрязаното изображение:</h4>
                                <img
                                    alt="Преглед на изрязването"
                                    className="max-w-full mt-4 rounded-lg shadow-lg"
                                    src={croppedImageUrl}
                                />
                            </div>
                        )}
                    </>
                )}

                {/* Buttons */}
                <div className="flex justify-between items-center mt-6">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-blue-700 text-white py-3 md:py-4 px-6 rounded-lg hover:bg-blue-600 
                    focus:outline-none focus:ring-4 focus:ring-gray-400 transition-transform transform hover:scale-105"
                    >
                        Назад
                    </button>
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-teal-600 to-orange text-white py-3 md:py-4 px-6 rounded-lg 
                    hover:opacity-80 focus:outline-none focus:ring-4 focus:ring-teal-400 transition-transform 
                    transform hover:scale-105 shadow-lg tracking-wide"
                        disabled={loading}
                        onClick={handleUpload}
                    >
                        {loading ? "Запазване..." : "Запази"}
                    </button>
                </div>
            </div>
        </div>

    );

};

export default ProfileImageUploader;
