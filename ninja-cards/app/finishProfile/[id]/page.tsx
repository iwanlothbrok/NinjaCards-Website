"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/utils/constants";
import Image from "next/image";

interface Alert {
    message: string;
    title: string;
    color: string;
}

const SUCCESS_DELAY = 1000;

const schema = yup.object().shape({
    email: yup.string().email("Въведете коректен имейл").required("Имейлът е задължителен"),
    password: yup.string().min(6, "Паролата трябва да е с поне 6 символа").required("Паролата е задължителна"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), ""], "Паролите не съвпадат")
        .required("Потвърдете паролата"),
});

const RegisterPage = ({ params }: { params?: { id?: string } }) => {
    const userId = params?.id;
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const [alert, setAlert] = useState<Alert | null>(null);
    const [loading, setLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const checkUserData = async () => {
            if (!userId) return;
            try {
                const res = await fetch(`${BASE_API_URL}/api/profile/check?userId=${userId}`);
                if (!res.ok) throw new Error("Грешка при проверката");

                const data = await res.json();
                if (data.needsSetup) {
                    setIsUpdating(true);
                } else {
                    router.push(`/profile/${userId}`);
                }
            } catch (error) {
                console.error("Грешка при проверка на акаунта:", error);
            }
        };

        checkUserData();
    }, [userId, router]);

    const onSubmit = async (data: any) => {
        setLoading(true);
        setAlert(null);

        try {
            const res = await fetch(`${BASE_API_URL}/api/profile/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    email: data.email,
                    password: data.password,
                    confirmPassword: data.confirmPassword
                }),
            });

            const response = await res.json();
            if (res.ok) {
                showAlert("Успешно запазване!", "Успех", "green");
                router.push(`/profileDetails/${userId}`);
            } else {
                showAlert(response.error || "Грешка при регистрация", "Грешка", "red");
            }
        } catch (error) {
            showAlert("Възникна грешка. Опитайте отново.", "Грешка", "red");
            console.error("Грешка при обработка на заявката:", error);
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (message: string, title: string, color: string) => {
        setAlert({ message, title, color });
        setTimeout(() => setAlert(null), 4000);
    };

    return (
        <section className="bg-black min-h-screen flex items-center justify-center px-6">
            <div className="w-full max-w-lg bg-gray-900 p-10 rounded-xl shadow-lg border border-gray-800">
                <a href="#" className="flex items-center mb-6 text-3xl justify-center  font-semibold text-white">
                    <Image className="w-28 h-28 filter grayscale" src="/navlogo.png" alt="лого" width={122} height={122} />
                </a>
                <h1 className="text-3xl font-bold text-white text-center mb-6">Добавяне на имейл и парола</h1>

                {alert && (
                    <div className={`my-4 p-3 text-white text-center font-semibold rounded ${alert.color === "green" ? "bg-green-500" : "bg-red-500"}`}>
                        {alert.title}: {alert.message}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="block text-gray-300 mb-2">Имейл</label>
                        <input
                            type="email"
                            className={`w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange ${errors.email ? "border-red-500" : ""
                                }`}
                            placeholder="example@email.com"
                            {...register("email")}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Парола</label>
                        <input
                            type="password"
                            className={`w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange ${errors.password ? "border-red-500" : ""
                                }`}
                            placeholder="••••••••"
                            {...register("password")}
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Потвърдете паролата</label>
                        <input
                            type="password"
                            className={`w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange  ${errors.confirmPassword ? "border-red-500" : ""
                                }`}
                            placeholder="••••••••"
                            {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full text-white bg-orange hover:bg-orange focus:ring-4 focus:ring-orange font-semibold rounded-lg text-lg px-6 py-3 transition"
                        disabled={loading}
                    >
                        {loading ? "Запазване..." : "Запази"}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default RegisterPage;
