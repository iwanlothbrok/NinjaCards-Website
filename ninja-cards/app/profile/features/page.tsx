"use client";

import React, { useEffect, useState } from "react";
import { BASE_API_URL } from "@/utils/constants";
import { FaCheckCircle, FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";
import { RiSettings3Line } from "react-icons/ri";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from 'next/navigation';
interface Alert {
    message: string;
    title: string;
    color: string;
}
const FeaturesComponent: React.FC = () => {
    const { user, setUser } = useAuth();
    const [isDirect, setIsDirect] = useState<boolean | null>(null); // Start as null to indicate loading
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<Alert | null>(null);

    const [message, setMessage] = useState("");
    const router = useRouter();

    // Fetch the user data on mount to ensure `isDirect` is up-to-date
    useEffect(() => {
        if (user?.id) {
            fetchUserDetails(user.id);
        }
    }, [user?.id]);

    const fetchUserDetails = async (userId: string) => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_API_URL}/api/profile/${userId}`);
            if (!response.ok) throw new Error("Неуспешно зареждане на данните на потребителя.");

            const userData = await response.json();
            setIsDirect(userData.isDirect); // Set the isDirect state from fetched data
        } catch (error) {
            console.error("Error fetching user details:", error);
            setMessage("Грешка при зареждане на данните на потребителя.");
        } finally {
            setLoading(false);
        }
    };

    const updateIsDirect = async (newIsDirect: boolean) => {
        if (!user?.id) {
            setMessage("Неуспешно: Потребителят не е намерен.");
            return;
        }

        setLoading(true);
        setMessage(""); // Clear any existing messages
        try {
            const response = await fetch(`${BASE_API_URL}/api/profile/updateIsDirect`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: user.id, isDirect: newIsDirect }),
            });

            const result = await response.json().catch(() => null); // fallback if not JSON

            if (!response.ok) {
                const errorMessage =
                    result?.error || 'Неуспешно актуализиране на профила';
                const errorDetails = result?.details;

                console.error('Грешка при актуализацията:', errorMessage, errorDetails);
                showAlert(errorMessage, 'Грешка', 'red');
                return;
            }
            
            setMessage(result.message || "Настройката е успешно актуализирана.");
            setIsDirect(newIsDirect); // Update local state


            if (setUser) setUser(result.user); // Update global user state
        } catch (error) {
            setMessage("Грешка при актуализиране на настройката.");
            console.error(error);
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

    const handleCheckboxChange = (checked: boolean) => {
        if (checked !== isDirect) {
            updateIsDirect(checked);
        }
    };

    if (isDirect === null) {
        return (
            <div className="flex items-center justify-center h-screen">
                <img src="/load.gif" alt="Зареждане..." className="w-24 h-24 animate-spin" />
            </div>
        );
    }

    return (
        <div className='p-4'>

            <div className="w-full max-w-3xl mx-auto mt-28 p-10 bg-gradient-to-b from-gray-900 to-gray-800 
            rounded-2xl shadow-xl border border-gray-700 sm:mx-6 md:mx-10 lg:mx-auto">

                <h2 className="text-4xl font-bold text-center text-white mb-6 tracking-wide flex items-center justify-center">
                    ⚙️ Настройки на картата
                </h2>
                {/* Alert Message */}
                {alert && (
                    <div className={`p-4 rounded-lg mb-6 text-white text-center font-medium transition-all duration-300 
                    ${alert.color === 'green' ? 'bg-green-500' : 'bg-red-500'} animate-fadeIn`}>
                        <strong>{alert.title}:</strong> {alert.message}
                    </div>
                )}

                {/* Checkbox Option */}
                <div className="mb-6">
                    <label htmlFor="isDirect" className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            id="isDirect"
                            checked={isDirect}
                            onChange={(e) => handleCheckboxChange(e.target.checked)}
                            disabled={loading}
                            className="w-5 h-5 text-teal-500 border-gray-500 rounded focus:ring-teal-400 cursor-pointer"
                        />
                        <span className="ml-3 text-lg font-semibold text-gray-200">
                            🚀 Директно изтегляне на контакти
                        </span>
                    </label>
                    <p className="text-gray-400 mt-2">
                        {isDirect
                            ? "Контактите ще се изтеглят автоматично, след което профилът ви ще бъде визуализиран."
                            : "Вашият профил ще бъде показан, като контактите могат да се изтеглят ръчно."}
                    </p>
                </div>

                {/* Info Box */}
                <div className="bg-gray-800 text-gray-300 text-sm p-4 rounded-lg mb-6">
                    <FaInfoCircle className="inline-block text-blue-400 mr-2" />
                    <strong>ℹ️ Какво ще се случи:</strong>
                    {isDirect ? (
                        <ul className="mt-2 list-disc list-inside text-gray-400">
                            <li>Контактите ви ще се изтеглят автоматично при сканиране.</li>
                            <li>След изтеглянето профилът ви ще се покаже на екрана.</li>
                            <li>Тази настройка е подходяща за бързо споделяне на контакти.</li>
                        </ul>
                    ) : (
                        <ul className="mt-2 list-disc list-inside text-gray-400">
                            <li>Вашият профил ще бъде визуализиран при сканиране.</li>
                            <li>Контактите могат да бъдат изтеглени ръчно от профила.</li>
                            <li>Подходящо за по-интерактивни ситуации.</li>
                        </ul>
                    )}
                </div>

                {/* Message Alert */}
                {message && (
                    <div
                        className={`text-sm p-3 rounded-lg flex items-center ${message.includes("успешно")
                            ? "bg-green-700 text-green-100"
                            : "bg-red-700 text-red-100"
                            }`}
                    >
                        {message.includes("успешно") ? (
                            <FaCheckCircle className="mr-2 text-green-300" />
                        ) : (
                            <FaExclamationTriangle className="mr-2 text-red-300" />
                        )}
                        {message}
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-gray-400 text-sm mt-4 animate-pulse">
                        ⏳ Обновяване на настройката...
                    </div>
                )}

                {/* Back Button */}
                <div className="flex justify-center mt-6">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-blue-700 text-white py-3 md:py-4 px-6 rounded-lg hover:bg-blue-600 
                    focus:outline-none focus:ring-4 focus:ring-gray-400 transition-transform transform hover:scale-105"
                    >
                        Назад
                    </button>
                </div>
            </div>
        </div>

    );

};

export default FeaturesComponent;
