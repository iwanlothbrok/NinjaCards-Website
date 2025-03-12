"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BASE_API_URL } from "@/utils/constants";

const schema = yup.object().shape({
    email: yup.string().email("Невалиден формат на имейл").required("Имейлът е задължителен"),
    password: yup.string().min(6, "Паролата трябва да бъде поне 6 символа").required("Паролата е задължителна"),
});

interface Alert {
    message: string;
    title: string;
    color: string;
}

const Login: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const router = useRouter();
    const [alert, setAlert] = useState<Alert | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data: any) => {
        const res = await fetch(`${BASE_API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            const { token, user } = await res.json();
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            showAlert("Входът беше успешен", "Успех", "green");

            setTimeout(() => {
                window.location.href = "/profile";
            }, 1000);
        } else {
            showAlert("Неуспешен вход", "Грешка", "red");
        }
    };

    const showAlert = (message: string, title: string, color: string) => {
        setAlert({ message, title, color });
        setTimeout(() => {
            setAlert(null);
        }, 4000);
    };

    return (
        <section className="bg-gray-950 min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center justify-center mx-auto">
                <a href="#" className="flex items-center mb-6 text-3xl font-semibold text-white">
                    <Image className="w-24 h-24 filter grayscale" src="/navlogo.png" alt="лого" width={96} height={96} />
                </a>
                <div className="w-full rounded-lg shadow border sm:max-w-lg bg-gray-800 border-gray-700">
                    <div className="p-12 space-y-6 md:space-y-8 sm:p-14">
                        <h1 className="text-2xl font-bold leading-tight tracking-tight md:text-3xl text-white">
                            Влезте в профила си
                        </h1>
                        {alert && (
                            <div className={`my-2 w-full p-4 rounded ${alert.color === "green" ? "bg-green-500" : "bg-red-500"} text-white animate-fadeIn`}>
                                <strong>{alert.title}: </strong> {alert.message}
                            </div>
                        )}
                        <form className="space-y-6 md:space-y-8" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label htmlFor="email" className="block mb-3 text-base font-medium text-white">Имейл</label>
                                <input
                                    type="email"
                                    id="email"
                                    className={`border border-gray-300 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-3 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 ${errors.email ? "border-red-500" : ""}`}
                                    placeholder="вашият@имейл.com"
                                    {...register("email")}
                                    required
                                />
                                {errors.email && <p className="text-red-500 text-sm italic">{errors.email.message}</p>}
                            </div>
                            <div className="relative">
                                <label htmlFor="password" className="block mb-3 text-base font-medium text-white">Парола</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className={`border text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-3 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 ${errors.password ? "border-red-500" : ""}`}
                                    placeholder="••••••••"
                                    {...register("password")}
                                    required
                                />
                                <div
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-300 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </div>
                                {errors.password && <p className="text-red-500 text-sm italic">{errors.password.message}</p>}
                                <div className="mt-2 text-sm text-right">
                                    <a href="/changePassword" className="text-red-600 hover:underline">Забравена парола?</a>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full text-white bg-orange hover:bg-opacity-60 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-base px-6 py-3 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
                            >
                                Влез
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
