"use client";

import React, { useMemo, useState } from "react";
import { useForm, UseFormRegister, FieldValues, FieldErrors } from "react-hook-form";
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

interface EmailFieldProps {
    register: UseFormRegister<LoginForm>;
    errors: FieldErrors<LoginForm>;
    t: ReturnType<typeof useTranslations>;
}

interface PasswordFieldProps {
    register: UseFormRegister<LoginForm>;
    errors: FieldErrors<LoginForm>;
    showPassword: boolean;
    onTogglePassword: () => void;
    t: ReturnType<typeof useTranslations>;
}

const EmailField: React.FC<EmailFieldProps> = ({ register, errors, t }) => (
    <div>
        <label htmlFor="email" className="block mb-3 text-base font-semibold text-white">
            {t("login.email")}
        </label>
        <input
            type="email"
            id="email"
            className={`border text-base rounded-lg block w-full p-3 bg-gray-700/50 backdrop-blur-sm border-gray-600/50 placeholder-gray-500 text-white focus:ring-2 focus:ring-orange focus:border-orange transition-all ${errors.email ? "border-red-500 ring-2 ring-red-500/50" : ""
                }`}
            placeholder={t("placeholders.email")}
            {...register("email")}
            required
            autoComplete="email"
        />
        {errors.email && (
            <p className="text-red-400 text-sm mt-2">{errors.email.message}</p>
        )}
    </div>
);

const PasswordField: React.FC<PasswordFieldProps> = ({ register, errors, showPassword, onTogglePassword, t }) => (
    <div className="relative">
        <label htmlFor="password" className="block mb-3 text-base font-semibold text-white">
            {t("login.password")}
        </label>
        <input
            type={showPassword ? "text" : "password"}
            id="password"
            className={`border text-base rounded-lg block w-full p-3 pr-10 bg-gray-700/50 backdrop-blur-sm border-gray-600/50 placeholder-gray-500 text-white focus:ring-2 focus:ring-orange focus:border-orange transition-all ${errors.password ? "border-red-500 ring-2 ring-red-500/50" : ""
                }`}
            placeholder={t("placeholders.password")}
            {...register("password")}
            required
            autoComplete="current-password"
        />
        <button
            type="button"
            aria-label={showPassword ? t("a11y.hidePassword") : t("a11y.showPassword")}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-orange transition-colors"
            onClick={onTogglePassword}
        >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
        {errors.password && (
            <p className="text-red-400 text-sm mt-2">{errors.password.message}</p>
        )}
    </div>
);

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
    const [isLoading, setIsLoading] = useState(false);

    const showAlert = (message: string, title: string, color: "green" | "red") => {
        setAlert({ message, title, color });
        setTimeout(() => setAlert(null), 4000);
    };

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true);

        const res = await fetch(`${BASE_API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            const { token, user } = await res.json();
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            // showAlert(t("alerts.successMessage"), t("alerts.successTitle"), "green");

            window.location.href = "/profile";

        } else {
            setIsLoading(false);
            showAlert(t("alerts.errorMessage"), t("alerts.errorTitle"), "red");
        }
    };

    return (
        <section className="bg-gradient-to-br from-gray-950 via-gray-900 to-black min-h-screen flex items-center py-32 justify-center relative overflow-hidden">
            {/* Premium animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange/15 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500" />
            </div>

            {isLoading && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50">
                    <div className="flex flex-col items-center gap-4">
                        <img src="/load.gif" className="w-24 h-24 animate-spin" alt="Loading" />
                    </div>
                </div>
            )}

            <div className="flex flex-col items-center justify-center mx-auto relative z-10 w-full px-4">


                <div className="w-full rounded-2xl shadow-2xl border sm:max-w-lg bg-gradient-to-b from-gray-800/60 to-gray-900/60 backdrop-blur-2xl border-gray-700/50 hover:border-orange/50 transition-all duration-300 hover:shadow-orange/20">
                    <div className="p-12 space-y-6 md:space-y-8 sm:p-14">
                        <div>
                            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl bg-gradient-to-r from-white via-orange to-orange/80 bg-clip-text text-transparent">
                                {t("login.title")}
                            </h1>
                        </div>

                        {alert && (
                            <div
                                className={`my-2 w-full p-4 rounded-lg backdrop-blur-sm border transition-all ${alert.color === "green"
                                    ? "bg-green-500/20 border-green-500/50 text-green-100 shadow-green-500/20"
                                    : "bg-red-500/20 border-red-500/50 text-red-100 shadow-red-500/20"
                                    } animate-fadeIn shadow-lg`}
                                role="status"
                                aria-live="polite"
                            >
                                <strong>{alert.title}: </strong> {alert.message}
                            </div>
                        )}

                        <form className="space-y-6 md:space-y-8" onSubmit={handleSubmit(onSubmit)} noValidate>
                            <EmailField register={register} errors={errors} t={t} />

                            <PasswordField
                                register={register}
                                errors={errors}
                                showPassword={showPassword}
                                onTogglePassword={() => setShowPassword((v) => !v)}
                                t={t}
                            />

                            {/* Premium Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full text-white bg-gradient-to-r from-orange via-orange to-orange/80 hover:from-orange/95 hover:via-orange/90 hover:to-orange/75 focus:ring-4 focus:outline-none focus:ring-orange/50 font-bold rounded-lg text-base px-6 py-3 text-center transition-all duration-200 shadow-xl hover:shadow-2xl hover:shadow-orange/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none uppercase tracking-wider"
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
