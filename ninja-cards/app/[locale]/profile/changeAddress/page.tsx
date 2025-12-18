"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { BASE_API_URL } from "@/utils/constants";
import { useTranslations } from "next-intl";

const schema = yup.object({
    street1: yup.string(),
    street2: yup.string(),
    zipCode: yup.string(),
    city: yup.string(),
    state: yup.string(),
    country: yup.string(),
});

type AddressForm = yup.InferType<typeof schema>;

interface Alert {
    message: string;
    title: string;
    color: "green" | "red";
}

export default function ChangeAddress() {
    const t = useTranslations("ChangeAddress");
    const { user, setUser } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<Alert | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<AddressForm>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (!user) return;
        setValue("street1", user.street1 || "");
        setValue("street2", user.street2 || "");
        setValue("zipCode", user.zipCode || "");
        setValue("city", user.city || "");
        setValue("state", user.state || "");
        setValue("country", user.country || "");
    }, [user, setValue]);

    const showAlert = (message: string, title: string, color: Alert["color"]) => {
        setAlert({ message, title, color });
        setTimeout(() => setAlert(null), 4000);
    };

    const onSubmit = async (data: AddressForm) => {
        if (!user) return;

        setLoading(true);

        const formData = new FormData();
        Object.entries(data).forEach(([k, v]) => formData.append(k, v || ""));
        formData.append("id", String(user.id));

        try {
            const res = await fetch(`${BASE_API_URL}/api/profile/changeAddress`, {
                method: "PUT",
                body: formData,
            });

            const result = await res.json();

            if (!res.ok) {
                showAlert(result?.error || t("alerts.updateFailed"), t("alerts.error"), "red");
                return;
            }

            localStorage.setItem("user", JSON.stringify(result));
            setUser(result);
            showAlert(t("alerts.updateSuccess"), t("alerts.success"), "green");
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch {
            showAlert(t("alerts.updateFailed"), t("alerts.error"), "red");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <img src="/load.gif" className="w-24 h-24 animate-spin" />
                </div>
            )}

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen pt-32 sm:pt-36 px-4 bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-200"
            >
                <div className="max-w-5xl mx-auto space-y-10">
                    {/* Header */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent mb-4">
                            {t("title")}
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            {t("subtitle")}
                        </p>
                    </motion.div>

                    {/* Alert */}
                    {alert && (
                        <motion.div
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className={`rounded-xl p-4 text-center font-medium ${alert.color === "green"
                                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                                }`}
                        >
                            <strong>{alert.title}:</strong> {alert.message}
                        </motion.div>
                    )}

                    {/* Form */}
                    <motion.form
                        onSubmit={handleSubmit(onSubmit)}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="rounded-2xl bg-gray-800/50 border border-gray-700/50 p-6 space-y-6"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {["street1", "street2"].map((field) => (
                                <Input key={field} field={field} register={register} errors={errors} t={t} />
                            ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {["zipCode", "city", "state"].map((field) => (
                                <Input key={field} field={field} register={register} errors={errors} t={t} />
                            ))}
                        </div>

                        <Input field="country" register={register} errors={errors} t={t} />

                        <div className="flex justify-between gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition"
                            >
                                {t("buttons.back")}
                            </button>

                            <button
                                type="submit"
                                className="px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-semibold transition"
                            >
                                {t("buttons.save")}
                            </button>
                        </div>
                    </motion.form>
                </div>
            </motion.div>
        </>
    );
}

function Input({ field, register, errors, t }: any) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                {t(`labels.${field}`)}
            </label>
            <input
                {...register(field)}
                placeholder={t(`placeholders.${field}`)}
                className="w-full rounded-lg bg-gray-900/60 border border-gray-700 px-4 py-3 text-gray-200
        focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
            {errors[field] && (
                <p className="text-xs text-red-400 mt-1">{String(errors[field]?.message)}</p>
            )}
        </div>
    );
}
