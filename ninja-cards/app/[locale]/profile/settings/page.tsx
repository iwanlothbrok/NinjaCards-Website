"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { BASE_API_URL } from "@/utils/constants";
import { useTranslations } from "next-intl";

type PasswordForm = {
    password: string;
    confirmPassword: string;
};

interface Alert {
    message: string;
    title: string;
    color: "green" | "red";
}

const ChangePassword: React.FC = () => {
    const t = useTranslations("ChangePassword");
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<Alert | null>(null);
    const router = useRouter();

    // Build the schema AFTER we have t()
    const schema = yup.object().shape({
        password: yup
            .string()
            .min(8, t("errors.min"))
            .matches(/[A-Z]/, t("errors.upper"))
            .matches(/[a-z]/, t("errors.lower"))
            .matches(/[0-9]/, t("errors.digit"))
            .matches(/[\W_]/, t("errors.special"))
            .required(t("errors.required")),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password"), ""], t("errors.match"))
            .required(t("errors.confirmRequired")),
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<PasswordForm>({
        resolver: yupResolver(schema),
        mode: "onTouched",
    });

    useEffect(() => {
        if (user) {
            setValue("password", "");
            setValue("confirmPassword", "");
        }
    }, [user, setValue]);

    const showAlert = (message: string, title: string, color: "green" | "red") => {
        setAlert({ message, title, color });
        setTimeout(() => setAlert(null), 4000);
    };

    const onSubmit = async (data: PasswordForm) => {
        setLoading(true);

        if (!user) {
            showAlert(t("alerts.notAuthenticated"), t("alerts.warning"), "red");
            setLoading(false);
            return;
        }

        const updateData = new FormData();
        updateData.append("id", String(user.id));
        updateData.append("password", data.password);

        try {
            const response = await fetch(`${BASE_API_URL}/api/profile/changePassword`, {
                method: "PUT",
                body: updateData,
            });

            const result = await response.json().catch(() => null);

            if (!response.ok) {
                const errorMessage = result?.error || t("alerts.updateFailed");
                console.error("Update error:", errorMessage, result?.details);
                showAlert(errorMessage, t("alerts.error"), "red");
                return;
            }

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
                className="w-full max-w-3xl mx-auto mt-36 p-10 bg-gradient-to-b from-gray-900 to-gray-800 
            rounded-2xl shadow-xl border border-gray-700 sm:mx-6 md:mx-10 lg:mx-auto"
            >
                <h2 className="text-4xl font-bold text-center text-white mb-6 tracking-wide">
                    🔒 {t("title")}
                </h2>

                {/* Alert */}
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

                {/* Loading */}
                {loading ? (
                    <div className="flex justify-center items-center py-40">
                        <img src="/load.gif" alt={t("a11y.loading")} className="w-24 h-24 animate-spin" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fadeIn" noValidate>
                        {/* New Password */}
                        <div className="relative">
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
                                {t("labels.password")}
                            </label>
                            <input
                                id="password"
                                type="password"
                                {...register("password")}
                                placeholder={t("placeholders.password")}
                                className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white 
                            focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-400"
                                autoComplete="new-password"
                            />
                            {errors.password && <div className="text-red-500 mt-2 text-sm">{String(errors.password.message)}</div>}
                        </div>

                        {/* Confirm Password */}
                        <div className="relative">
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-300 mb-2">
                                {t("labels.confirmPassword")}
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                {...register("confirmPassword")}
                                placeholder={t("placeholders.confirmPassword")}
                                className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white 
                            focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-400"
                                autoComplete="new-password"
                            />
                            {errors.confirmPassword && (
                                <div className="text-red-500 mt-2 text-sm">{String(errors.confirmPassword.message)}</div>
                            )}
                        </div>

                        {/* Buttons */}
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

export default ChangePassword;
