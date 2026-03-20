"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { BASE_API_URL } from "@/utils/constants";
import { motion, AnimatePresence } from "framer-motion";

const T = {
  bg: {
    title: "Google Wallet",
    subtitle: "Настройки на профила",
    description:
      "Добави дигиталната си визитка в Google Wallet за бърз достъп.",
    preview: "Предварителен преглед",
    bgColor: "Цвят на фона",
    addBtn: "Добави в Google Wallet",
    adding: "Добавя се...",
    success: "Картата е отворена в нов таб!",
    cardTitle: "Ninja Card",
    preset: "Готови теми",
    custom: "Персонализирай",
    note: "Текстът винаги е бял — само фонът може да се промени.",
    viewProfile: "Виж профила",
  },
  en: {
    title: "Google Wallet",
    subtitle: "Profile Settings",
    description:
      "Add your digital business card to Google Wallet for quick access.",
    preview: "Live Preview",
    bgColor: "Background color",
    addBtn: "Add to Google Wallet",
    adding: "Adding...",
    success: "Card opened in a new tab!",
    cardTitle: "Ninja Card",
    preset: "Preset themes",
    custom: "Customize",
    note: "Text is always white — only the background color can be changed.",
    viewProfile: "View Profile",
  },
};

const PRESETS = [
  { name: "Ninja", bg: "#0a0a0f", accent: "#f59e0b" },
  { name: "Midnight", bg: "#0f172a", accent: "#60a5fa" },
  { name: "Forest", bg: "#052e16", accent: "#4ade80" },
  { name: "Royal", bg: "#1e1b4b", accent: "#a5b4fc" },
  { name: "Crimson", bg: "#1c0505", accent: "#f87171" },
  { name: "Slate", bg: "#1e293b", accent: "#94a3b8" },
];

export default function AddToGoogleWallet() {
  const { user } = useAuth();
  const isBg = user?.language === "bg";
  const t = isBg ? T.bg : T.en;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [bgColor, setBgColor] = useState("#0a0a0f");
  const [activeTab, setActiveTab] = useState<"preset" | "custom">("preset");

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/api/profile/${user.id}`);
        if (!res.ok) return;
        setUserDetails(await res.json());
      } catch {
        /* silent */
      }
    })();
  }, [user?.id]);

  const handleAddToWallet = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const formData = new FormData();
      formData.append("userId", user.id);
      formData.append("bgColor", bgColor);
      formData.append("language", user.language ?? "bg");
      const fullName = userDetails
        ? [userDetails.firstName, userDetails.lastName]
            .filter(Boolean)
            .join(" ") || t.cardTitle
        : t.cardTitle;
      formData.append("userName", fullName);
      if (userDetails?.email) formData.append("userEmail", userDetails.email);
      if (userDetails?.phone1) formData.append("userPhone", userDetails.phone1);
      if (userDetails?.company)
        formData.append("userCompany", userDetails.company);
      if (userDetails?.position)
        formData.append("userPosition", userDetails.position);
      if (userDetails?.image?.startsWith("https://"))
        formData.append("userLogoUrl", userDetails.image);

      const res = await fetch(`${BASE_API_URL}/api/parata`, {
        method: "POST",
        body: formData,
      });
      const text = await res.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Server error: ${text.slice(0, 200)}`);
      }
      if (!res.ok)
        throw new Error(data.details || data.error || `Error ${res.status}`);
      window.open(`https://pay.google.com/gp/v/save/${data.token}`, "_blank");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const displayName = userDetails
    ? [userDetails.firstName, userDetails.lastName].filter(Boolean).join(" ") ||
      t.cardTitle
    : t.cardTitle;
  const activePreset = PRESETS.find((p) => p.bg === bgColor) ?? PRESETS[0];
  const accentColor = activePreset.accent;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-32 sm:pt-36 pb-28 px-4 sm:px-6 lg:px-8"
      style={{
        background:
          "radial-gradient(ellipse 90% 60% at 50% -5%, rgba(245,158,11,0.06) 0%, transparent 55%), #080A0F",
      }}
    >
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          opacity: 0.018,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />

      <div className="max-w-2xl mx-auto space-y-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="space-y-1"
        >
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-amber-500/65">
            {t.subtitle}
          </p>
          <h1 className="text-4xl md:text-[2.8rem] font-bold text-white tracking-tight leading-none">
            {t.title}
          </h1>
          <p className="text-sm text-gray-500 pt-1">{t.description}</p>
        </motion.header>

        {/* Toasts */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400 text-sm font-medium"
            >
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {t.success}
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-red-500/[0.08] border border-red-500/20 text-red-400 text-sm font-medium"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Preview */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.13 }}
          className="rounded-2xl border border-white/[0.055] overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
          }}
        >
          <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
          <div className="px-7 py-4 border-b border-white/[0.05] bg-white/[0.025]">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.13em] text-gray-500">
              {t.preview}
            </p>
          </div>
          <div className="px-7 py-6 flex justify-center">
            <motion.div
              animate={{ backgroundColor: bgColor }}
              transition={{ duration: 0.3 }}
              className="w-72 rounded-2xl p-5 shadow-2xl"
              style={{
                boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)`,
              }}
            >
              {/* Logo row */}
              <div className="flex items-center gap-2.5 mb-4">
                {userDetails?.image?.startsWith("https://") ? (
                  <img
                    src={userDetails.image}
                    alt="logo"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
                    style={{
                      background: `${accentColor}22`,
                      color: accentColor,
                    }}
                  >
                    N
                  </div>
                )}
                <span className="text-[11px] font-black text-white uppercase tracking-[0.12em]">
                  {t.cardTitle}
                </span>
              </div>

              {/* Subheader */}
              {(userDetails?.company || userDetails?.position) && (
                <p className="text-[11px] text-white/60 mb-1">
                  {[userDetails?.company, userDetails?.position]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}

              {/* Name */}
              <p className="font-black text-xl text-white leading-tight mb-4">
                {displayName}
              </p>

              {/* QR placeholder */}
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-xl bg-white p-2 flex items-center justify-center">
                  <div className="w-full h-full rounded bg-gray-100 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.2}
                    >
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                      <path d="M14 14h3v3h-3zM17 17h3v3h-3z" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-center text-[10px] text-white/40 mt-3">
                {t.viewProfile}
              </p>
            </motion.div>
          </div>
          <div className="px-7 pb-5">
            <p className="text-[10.5px] text-gray-600 text-center">{t.note}</p>
          </div>
        </motion.div>

        {/* Color picker */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="rounded-2xl border border-white/[0.055] overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
          }}
        >
          <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
          <div className="px-7 py-4 border-b border-white/[0.05] bg-white/[0.025] flex items-center gap-3">
            {(["preset", "custom"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all"
                style={
                  activeTab === tab
                    ? { background: "#f59e0b", color: "#000" }
                    : { color: "rgba(255,255,255,0.3)" }
                }
              >
                {tab === "preset" ? t.preset : t.custom}
              </button>
            ))}
          </div>
          <div className="px-7 py-5">
            {activeTab === "preset" && (
              <div className="grid grid-cols-3 gap-3">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setBgColor(preset.bg)}
                    className="rounded-xl p-3 border transition-all text-left"
                    style={{
                      background: preset.bg,
                      border:
                        bgColor === preset.bg
                          ? `1px solid ${preset.accent}`
                          : "1px solid rgba(255,255,255,0.07)",
                      boxShadow:
                        bgColor === preset.bg
                          ? `0 0 14px ${preset.accent}30`
                          : "none",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full mb-2"
                      style={{ background: preset.accent }}
                    />
                    <p className="text-[11px] font-bold text-white">
                      {preset.name}
                    </p>
                  </button>
                ))}
              </div>
            )}
            {activeTab === "custom" && (
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-gray-400">
                  {t.bgColor}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-gray-600">
                    {bgColor}
                  </span>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 overflow-hidden"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <button
            onClick={handleAddToWallet}
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 transition-all disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, #f59e0b, #f59e0bcc)",
              color: "#000",
              boxShadow: loading ? "none" : "0 8px 28px rgba(245,158,11,0.35)",
            }}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />{" "}
                {t.adding}
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 7H3C1.9 7 1 7.9 1 9v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z"
                    fill="#000"
                    opacity="0.7"
                  />
                  <path
                    d="M3 7h18V5c0-1.1-.9-2-2-2H5C3.9 3 3 3.9 3 5v2z"
                    fill="#000"
                    opacity="0.5"
                  />
                </svg>
                {t.addBtn}
              </>
            )}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
