"use client";

import React, { useEffect, useState } from "react";
import { BASE_API_URL } from "@/utils/constants";
import { FaCheckCircle, FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";
import { RiSettings3Line } from "react-icons/ri";
import { useAuth } from "@/app/context/AuthContext";

const FeaturesComponent: React.FC = () => {
    const { user, setUser } = useAuth();
    const [isDirect, setIsDirect] = useState<boolean | null>(null); // Start as null to indicate loading
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

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

            if (!response.ok) {
                throw new Error("Неуспешно актуализиране на настройката.");
            }

            const result = await response.json();
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

    const handleCheckboxChange = (checked: boolean) => {
        if (checked !== isDirect) {
            updateIsDirect(checked);
        }
    };

    if (isDirect === null) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-400 animate-pulse">Зареждане на настройките...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto mt-10 p-8 bg-black text-white rounded-xl shadow-2xl">
            <h2 className="text-3xl font-extrabold mb-6 text-center flex items-center justify-center">
                <RiSettings3Line className="mr-2 text-3xl" />
                Настройки на картата
            </h2>
            <div className="mb-6">
                <label htmlFor="isDirect" className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        id="isDirect"
                        checked={isDirect}
                        onChange={(e) => handleCheckboxChange(e.target.checked)}
                        disabled={loading}
                        className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="ml-3 text-lg font-semibold">
                        Директно изтегляне на контакти
                    </span>
                </label>
                <p className="text-gray-400 mt-2">
                    {isDirect
                        ? "Контактите ще се изтеглят автоматично, след което профилът ви ще бъде визуализиран."
                        : "Вашият профил ще бъде показан, като контактите могат да се изтеглят ръчно."}
                </p>
            </div>

            <div className="bg-gray-800 text-gray-300 text-sm p-4 rounded-lg mb-6">
                <FaInfoCircle className="inline-block text-blue-400 mr-2" />
                <strong>Какво ще се случи:</strong>
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

            {message && (
                <div
                    className={`text-sm p-3 rounded-lg flex items-center ${message.includes("успешно")
                        ? "bg-green-700 text-green-100"
                        : "bg-red-700 text-red-100"
                        }`}
                >
                    {message.includes("успешно") ? (
                        <FaCheckCircle className="mr-2" />
                    ) : (
                        <FaExclamationTriangle className="mr-2" />
                    )}
                    {message}
                </div>
            )}

            {loading && (
                <div className="text-gray-400 text-sm mt-4 animate-pulse">
                    Обновяване на настройката...
                </div>
            )}
        </div>
    );
};

export default FeaturesComponent;
