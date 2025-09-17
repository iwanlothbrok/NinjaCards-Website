"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { BASE_API_URL } from "@/utils/constants";
import { useTranslations } from "next-intl";

// Validation schema (all optional as requested)
const schema = yup.object().shape({
    street1: yup.string(),
    street2: yup.string(),
    zipCode: yup.string(),
    city: yup.string(),
    state: yup.string(),
    country: yup.string(),
});

type AddressForm = {
    street1?: string;
    street2?: string;
    zipCode?: string;
    city?: string;
    state?: string;
    country?: string;
};

interface Alert {
    message: string;
    title: string;
    color: "green" | "red";
}

const ChangeAddress: React.FC = () => {
    const t = useTranslations("ChangeAddress");
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<Alert | null>(null);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<AddressForm>({
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        if (user) {
            setValue("street1", user?.street1 || "");
            setValue("street2", user?.street2 || "");
            setValue("zipCode", user?.zipCode || "");
            setValue("city", user?.city || "");
            setValue("state", user?.state || "");
            setValue("country", user?.country || "");
        }
    }, [user, setValue]);

    const showAlert = (message: string, title: string, color: "green" | "red") => {
        setAlert({ message, title, color });
        setTimeout(() => setAlert(null), 4000);
    };

    const onSubmit = async (data: AddressForm) => {
        setLoading(true);

        if (!user) {
            showAlert(t("alerts.notAuthenticated"), t("alerts.warning"), "red");
            setLoading(false);
            return;
        }

        const updateData = new FormData();
        updateData.append("id", String(user.id));
        updateData.append("street1", data.street1 || "");
        updateData.append("street2", data.street2 || "");
        updateData.append("zipCode", data.zipCode || "");
        updateData.append("city", data.city || "");
        updateData.append("state", data.state || "");
        updateData.append("country", data.country || "");

        try {
            const response = await fetch(`${BASE_API_URL}/api/profile/changeAddress`, {
                method: "PUT",
                body: updateData
            });

            const result = await response.json().catch(() => null);

            if (!response.ok) {
                const errorMessage = result?.error || t("alerts.updateFailed");
                const errorDetails = result?.details;
                console.error("Update error:", errorMessage, errorDetails);
                showAlert(errorMessage, t("alerts.error"), "red");
                return;
            }

            // Scroll to top so the success alert is visible
            if (typeof window !== "undefined") {
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
            }

            localStorage.setItem("user", JSON.stringify(result));
            setUser(result);
            showAlert(t("alerts.updateSuccess"), t("alerts.success"), "green");
        } catch (error) {
            console.error("Request error:", error);
            showAlert(t("alerts.updateFailed"), t("alerts.error"), "red");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <div
                className="w-full max-w-3xl mx-auto mt-28 p-10 bg-gradient-to-b from-gray-900 to-gray-800 
            rounded-2xl shadow-xl border border-gray-700 sm:mx-6 md:mx-10 lg:mx-auto"
            >
                <h2 className="text-4xl font-bold text-center text-white mb-6 tracking-wide">
                    🏡 {t("title")}
                </h2>

                {/* Alert Message */}
                {alert && (
                    <div
                        className={`p-4 rounded-lg mb-6 text-white text-center font-medium transition-all duration-300 
                    ${alert.color === "green" ? "bg-green-500" : "bg-red-500"} animate-fadeIn`}
                        role="status"
                        aria-live="polite"
                    >
                        <strong>{alert.title}:</strong> {alert.message}
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-40">
                        <img src="/load.gif" alt={t("a11y.loading")} className="w-24 h-24 animate-spin" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fadeIn" noValidate>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    {t("labels.street1")}
                                </label>
                                <input
                                    type="text"
                                    {...register("street1")}
                                    placeholder={t("placeholders.street1")}
                                    className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white 
                                focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-400"
                                />
                                {errors.street1 && (
                                    <p className="text-red-500 text-sm mt-1">{String(errors.street1.message)}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    {t("labels.street2")}
                                </label>
                                <input
                                    type="text"
                                    {...register("street2")}
                                    placeholder={t("placeholders.street2")}
                                    className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white 
                                focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-400"
                                />
                                {errors.street2 && (
                                    <p className="text-red-500 text-sm mt-1">{String(errors.street2.message)}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    {t("labels.zipCode")}
                                </label>
                                <input
                                    type="text"
                                    {...register("zipCode")}
                                    placeholder={t("placeholders.zipCode")}
                                    className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white 
                                focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-400"
                                />
                                {errors.zipCode && (
                                    <p className="text-red-500 text-sm mt-1">{String(errors.zipCode.message)}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    {t("labels.city")}
                                </label>
                                <input
                                    type="text"
                                    {...register("city")}
                                    placeholder={t("placeholders.city")}
                                    className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white 
                                focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-400"
                                />
                                {errors.city && (
                                    <p className="text-red-500 text-sm mt-1">{String(errors.city.message)}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    {t("labels.state")}
                                </label>
                                <input
                                    type="text"
                                    {...register("state")}
                                    placeholder={t("placeholders.state")}
                                    className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white 
                                focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-400"
                                />
                                {errors.state && (
                                    <p className="text-red-500 text-sm mt-1">{String(errors.state.message)}</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                {t("labels.country")}
                            </label>
                            <input
                                type="text"
                                {...register("country")}
                                placeholder={t("placeholders.country")}
                                className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white 
                            focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-400"
                            />
                            {errors.country && (
                                <p className="text-red-500 text-sm mt-1">{String(errors.country.message)}</p>
                            )}
                        </div>

                        <div className="flex justify-between items-center mt-6">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="bg-blue-700 text-white py-3 md:py-4 px-6 rounded-lg hover:bg-blue-600 
                            focus:outline-none focus:ring-4 focus:ring-gray-400 transition-transform transform hover:scale-105"
                            >
                                {t("buttons.back")}
                            </button>
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-teal-600 to-orange text-white py-3 md:py-4 px-6 rounded-lg 
                            hover:opacity-80 focus:outline-none focus:ring-4 focus:ring-teal-400 transition-transform 
                            transform hover:scale-105 shadow-lg tracking-wide"
                                disabled={loading}
                            >
                                {loading ? t("buttons.saving") : t("buttons.save")}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ChangeAddress;
