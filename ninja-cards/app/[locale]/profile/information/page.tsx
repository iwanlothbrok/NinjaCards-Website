"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { BASE_API_URL } from "@/utils/constants";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

/* ---------------- schemas ---------------- */

const profileSchema = yup.object({
    firstName: yup.string(),
    lastName: yup.string(),
    name: yup.string(),
    company: yup.string(),
    position: yup.string(),
    phone1: yup.string(),
    phone2: yup.string(),
    bio: yup.string(),
});

const addressSchema = yup.object({
    street1: yup.string(),
    street2: yup.string(),
    zipCode: yup.string(),
    city: yup.string(),
    state: yup.string(),
    country: yup.string(),
});

type ProfileForm = yup.InferType<typeof profileSchema>;
type AddressForm = yup.InferType<typeof addressSchema>;

interface Alert {
    message: string;
    title: string;
    color: "green" | "red";
}

/* ---------------- component ---------------- */

export default function ProfileInformationPage() {
    const t = useTranslations("ProfileInformation");
    const { user, setUser } = useAuth();
    const router = useRouter();

    const [profileLoading, setProfileLoading] = useState(false);
    const [addressLoading, setAddressLoading] = useState(false);
    const [alert, setAlert] = useState<Alert | null>(null);

    /* -------- profile form -------- */

    const profileForm = useForm<ProfileForm>({
        resolver: yupResolver(profileSchema),
    });

    const addressForm = useForm<AddressForm>({
        resolver: yupResolver(addressSchema),
    });

    useEffect(() => {
        if (!user) return;

        profileForm.reset({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            name: user.name || "",
            company: user.company || "",
            position: user.position || "",
            phone1: user.phone1 || "",
            phone2: user.phone2 || "",
            bio: user.bio || "",
        });

        addressForm.reset({
            street1: user.street1 || "",
            street2: user.street2 || "",
            zipCode: user.zipCode || "",
            city: user.city || "",
            state: user.state || "",
            country: user.country || "",
        });
    }, [user]);

    const showAlert = (message: string, title: string, color: Alert["color"]) => {
        setAlert({ message, title, color });
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => setAlert(null), 4000);
    };

    /* -------- submit handlers -------- */

    const saveProfileInfo = async (data: ProfileForm) => {
        if (!user) return;

        setProfileLoading(true);

        const fd = new FormData();
        fd.append("id", String(user.id));
        Object.entries(data).forEach(([k, v]) => v && fd.append(k, v));

        // Preserve address data
        const addressData = addressForm.getValues();
        Object.entries(addressData).forEach(([k, v]) => v && fd.append(k, v));

        try {
            const res = await fetch(`${BASE_API_URL}/api/profile/updateInformation`, {
                method: "PUT",
                body: fd,
            });

            const result = await res.json();
            if (!res.ok) {
                showAlert(result?.error || t("alerts.errorUpdate"), t("alerts.error"), "red");
                return;
            }

            localStorage.setItem("user", JSON.stringify(result));
            setUser(result);
            showAlert(t("alerts.successUpdate"), t("alerts.success"), "green");
        } catch {
            showAlert(t("alerts.errorUpdate"), t("alerts.error"), "red");
        } finally {
            setProfileLoading(false);
        }
    };

    const saveAddress = async (data: AddressForm) => {
        if (!user) return;

        setAddressLoading(true);

        const fd = new FormData();
        fd.append("id", String(user.id));
        Object.entries(data).forEach(([k, v]) => v && fd.append(k, v));

        try {
            const res = await fetch(`${BASE_API_URL}/api/profile/changeAddress`, {
                method: "PUT",
                body: fd,
            });

            const result = await res.json();
            if (!res.ok) {
                showAlert(result?.error || t("alerts.errorUpdate"), t("alerts.error"), "red");
                return;
            }

            localStorage.setItem("user", JSON.stringify(result));
            setUser(result);
            showAlert(t("alerts.addressSaved"), t("alerts.success"), "green");
        } catch {
            showAlert(t("alerts.errorUpdate"), t("alerts.error"), "red");
        } finally {
            setAddressLoading(false);
        }
    };

    /* ---------------- UI ---------------- */

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen pt-32 sm:pt-36 px-4 bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-200"
        >
            <div className="max-w-5xl mx-auto space-y-10">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent mb-4">
                        {t("title")}
                    </h1>
                    <p className="text-gray-400 text-lg">{t("subtitle")}</p>
                </div>

                {alert && (
                    <div
                        className={`rounded-xl p-4 text-center font-medium ${alert.color === "green"
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}
                    >
                        <strong>{alert.title}:</strong> {alert.message}
                    </div>
                )}

                {/* -------- Profile info -------- */}
                <Section title={t("sections.profile")}>
                    <form
                        onSubmit={profileForm.handleSubmit(saveProfileInfo)}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                        <Input field="firstName" form={profileForm} t={t} />
                        <Input field="lastName" form={profileForm} t={t} />
                        <Input field="company" form={profileForm} t={t} />
                        <Input field="position" form={profileForm} t={t} />
                        <Input field="phone1" form={profileForm} t={t} />
                        <Input field="phone2" form={profileForm} t={t} />

                        <div className="sm:col-span-2">
                            <textarea
                                {...profileForm.register("bio")}
                                placeholder={t("placeholders.bio")}
                                rows={4}
                                className="w-full rounded-lg bg-gray-900/60 border border-gray-700 px-4 py-3"
                            />
                        </div>

                        <div className="sm:col-span-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={profileLoading}
                                className="px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-semibold"
                            >
                                {profileLoading ? t("buttons.saving") : t("buttons.saveInfo")}
                            </button>
                        </div>
                    </form>
                </Section>

                {/* -------- Address -------- */}
                <Section title={t("sections.address")}>
                    <form
                        onSubmit={addressForm.handleSubmit(saveAddress)}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                        <Input field="street1" form={addressForm} t={t} />
                        <Input field="street2" form={addressForm} t={t} />
                        <Input field="zipCode" form={addressForm} t={t} />
                        <Input field="city" form={addressForm} t={t} />
                        <Input field="state" form={addressForm} t={t} />
                        <Input field="country" form={addressForm} t={t} />

                        <div className="sm:col-span-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={addressLoading}
                                className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                                {addressLoading ? t("buttons.saving") : t("buttons.saveAddress")}
                            </button>
                        </div>
                    </form>
                </Section>
                <div className="flex justify-between gap-4 mt-3">
                    <button
                        onClick={() => router.push("/profile")}
                        className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                        {t("buttons.back")}
                    </button>


                </div>
            </div>
        </motion.div>
    );
}

/* ---------------- helpers ---------------- */

function Section({ title, children }: any) {
    return (
        <div className="rounded-2xl bg-gray-800/50 border border-gray-700/50 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-amber-400">{title}</h2>
            {children}
        </div>
    );
}

function Input({ field, form, t }: any) {
    return (
        <input
            {...form.register(field)}
            placeholder={t(`placeholders.${field}`)}
            className="w-full rounded-lg bg-gray-900/60 border border-gray-700 px-4 py-3"
        />
    );
}
