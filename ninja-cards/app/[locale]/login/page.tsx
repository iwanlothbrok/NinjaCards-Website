"use client";

import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BASE_API_URL } from "@/utils/constants";
import { useTranslations } from "next-intl";

interface Alert {
    message: string;
    title: string;
    color: "green" | "red";
}

type LoginForm = {
    email: string;
    password: string;
};

const Login: React.FC = () => {
    const t = useTranslations("LoginPage");

    // Build Yup schema with localized messages
    const schema = useMemo(
        () =>
            yup.object({
                email: yup
                    .string()
                    .email(t("errors.emailInvalid"))
                    .required(t("errors.emailRequired")),
                password: yup
                    .string()
                    .min(6, t("errors.passwordMin"))
                    .required(t("errors.passwordRequired")),
            }),
        [t]
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: yupResolver(schema),
        mode: "onTouched",
    });

    const [alert, setAlert] = useState<Alert | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const showAlert = (message: string, title: string, color: "green" | "red") => {
        setAlert({ message, title, color });
        setTimeout(() => setAlert(null), 4000);
    };

    const onSubmit = async (data: LoginForm) => {
        const res = await fetch(`${BASE_API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            const { token, user } = await res.json();
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            showAlert(t("alerts.successMessage"), t("alerts.successTitle"), "green");

            setTimeout(() => {
                window.location.href = "/profile/help";
            }, 1000);
        } else {
            showAlert(t("alerts.errorMessage"), t("alerts.errorTitle"), "red");
        }
    };

    return (
        <section className="bg-gray-950 min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center justify-center mx-auto">
                <a href="/" className="flex items-center mb-6 text-3xl font-semibold text-white">
                    <Image
                        className="w-24 h-24 filter grayscale"
                        src="/navlogo.png"
                        alt={t("login.logoAlt")}
                        width={96}
                        height={96}
                    />
                </a>

                <div className="w-full rounded-lg shadow border sm:max-w-lg bg-gray-800 border-gray-700">
                    <div className="p-12 space-y-6 md:space-y-8 sm:p-14">
                        <h1 className="text-2xl font-bold leading-tight tracking-tight md:text-3xl text-white">
                            {t("login.title")}
                        </h1>

                        {alert && (
                            <div
                                className={`my-2 w-full p-4 rounded ${alert.color === "green" ? "bg-green-500" : "bg-red-500"
                                    } text-white animate-fadeIn`}
                                role="status"
                                aria-live="polite"
                            >
                                <strong>{alert.title}: </strong> {alert.message}
                            </div>
                        )}

                        <form className="space-y-6 md:space-y-8" onSubmit={handleSubmit(onSubmit)} noValidate>
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block mb-3 text-base font-medium text-white">
                                    {t("login.email")}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className={`border text-base rounded-lg block w-full p-3 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 ${errors.email ? "border-red-500" : ""
                                        }`}
                                    placeholder={t("placeholders.email")}
                                    {...register("email")}
                                    required
                                    autoComplete="email"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm italic mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <label htmlFor="password" className="block mb-3 text-base font-medium text-white">
                                    {t("login.password")}
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className={`border text-base rounded-lg block w-full p-3 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 ${errors.password ? "border-red-500" : ""
                                        }`}
                                    placeholder={t("placeholders.password")}
                                    {...register("password")}
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    aria-label={showPassword ? t("a11y.hidePassword") : t("a11y.showPassword")}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-300"
                                    onClick={() => setShowPassword((v) => !v)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                                {errors.password && (
                                    <p className="text-red-500 text-sm italic mt-1">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="w-full text-white bg-orange hover:bg-opacity-80 focus:ring-4 focus:outline-none focus:ring-orange/40 font-medium rounded-lg text-base px-6 py-3 text-center transition"
                            >
                                {t("login.submit")}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
