"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { BASE_API_URL } from "@/utils/constants";
import { useTranslations } from "next-intl";

// Yup schema (email required, workEmail optional)
const schema = yup.object().shape({
    email: yup
        .string()
        .email(() => " ") // message from t below, we show RHF error text
        .required(() => " "),
    workEmail: yup.string().email(() => " ").nullable().notRequired(),
});

type EmailForm = {
    email: string;
    workEmail?: string | null;
};

interface Alert {
    message: string;
    title: string;
    color: "green" | "red";
}

export default function ChangeEmail() {
    const t = useTranslations("ChangeEmail");
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<Alert | null>(null);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<EmailForm>({
        resolver: yupResolver(schema),
        mode: "onTouched",
    });

    useEffect(() => {
        if (user) {
            setValue("email", user.email || "");
            setValue("workEmail", user.email2 || "");
        }
    }, [user, setValue]);

    const showAlert = (message: string, title: string, color: "green" | "red") => {
        setAlert({ message, title, color });
        setTimeout(() => setAlert(null), 4000);
    };

    const onSubmit = async (data: EmailForm) => {
        setLoading(true);

        if (!user) {
            showAlert(t("alerts.notAuthenticated"), t("alerts.warning"), "red");
            setLoading(false);
            return;
        }

        // No-op guard
        if ((data.email || "") === (user.email || "") && (data.workEmail || "") === (user.email2 || "")) {
            showAlert(t("alerts.noChanges"), t("alerts.warning"), "red");
            setLoading(false);
            return;
        }

        const updateData = new FormData();
        updateData.append("id", String(user.id));
        updateData.append("email", data.email);
        if (data.workEmail) updateData.append("workEmail", data.workEmail);

        try {
            const response = await fetch(`${BASE_API_URL}/api/profile/changeEmail`, {
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
        } catch (err) {
            console.error("Request error:", err);
            showAlert(t("alerts.updateFailed"), t("alerts.error"), "red");
        } finally {
            setLoading(false);
        }
    };

    const requiredEmailMsg =
        errors.email?.type === "required"
            ? t("errors.emailRequired")
            : errors.email?.type === "email"
                ? t("errors.emailInvalid")
                : undefined;

    const workEmailMsg =
        errors.workEmail?.type === "email" ? t("errors.emailInvalid") : undefined;

    return (
        <div className="p-4">
            <div
                className="w-full max-w-3xl mx-auto mt-36 p-10 bg-gradient-to-b from-gray-900 to-gray-800 
        rounded-2xl shadow-xl border border-gray-700 sm:mx-6 md:mx-10 lg:mx-auto"
            >
                <h2 className="text-4xl font-bold text-center text-white mb-6 tracking-wide">
                    ✉️ {t("title")}
                </h2>

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

                {loading ? (
                    <div className="flex justify-center items-center py-40">
                        <img src="/load.gif" alt={t("a11y.loading")} className="w-24 h-24 animate-spin" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fadeIn" noValidate>
                        {/* New email */}
                        <div className="relative">
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                                {t("labels.email")}
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...register("email")}
                                placeholder={t("placeholders.email")}
                                className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none 
                focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-400"
                                autoComplete="email"
                            />
                            {requiredEmailMsg && <p className="text-red-500 mt-2 text-sm">{requiredEmailMsg}</p>}
                        </div>

                        {/* Work email (optional) */}
                        <div className="relative">
                            <label htmlFor="workEmail" className="block text-sm font-semibold text-gray-300 mb-2">
                                {t("labels.workEmail")}
                            </label>
                            <input
                                id="workEmail"
                                type="email"
                                {...register("workEmail")}
                                placeholder={t("placeholders.workEmail")}
                                className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none 
                focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-400"
                                autoComplete="email"
                            />
                            {workEmailMsg && <p className="text-red-500 mt-2 text-sm">{workEmailMsg}</p>}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-between items-center mt-6">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="bg-blue-700 text-white py-3 md:py-4 px-6 rounded-lg hover:bg-blue-600 focus:outline-none 
                focus:ring-4 focus:ring-gray-400 transition-transform transform hover:scale-105"
                            >
                                {t("buttons.back")}
                            </button>
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-teal-600 to-orange text-white py-3 md:py-4 px-6 rounded-lg 
                hover:from-teal-600 hover:to-orange hover:opacity-80 focus:outline-none focus:ring-4 focus:ring-teal-400 
                transition-transform transform hover:scale-105 shadow-lg tracking-wide"
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
}
