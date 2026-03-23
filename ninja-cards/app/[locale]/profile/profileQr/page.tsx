"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useState, useRef } from "react";
import { BASE_API_URL } from "@/utils/constants";

// ─── Icons ────────────────────────────────────────────────────────────────────
const DownloadIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
)
const ShareIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
)
const SparkleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
)
const CheckIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

export default function QRCodeDownload() {
    const { user, setUser } = useAuth();
    const router = useRouter();
    const t = useTranslations("ProfileQR");

    const [loading, setLoading] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const [shared, setShared] = useState(false);
    const [slug, setSlug] = useState(user?.slug ?? "");
    const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
    const [slugSaving, setSlugSaving] = useState(false);
    const [slugAlert, setSlugAlert] = useState<string | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => {
        if (user?.slug) setSlug(user.slug);
    }, [user?.slug]);

    React.useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (slug.length < 3) { setSlugStatus("idle"); return; }
        if (slug === user?.slug) { setSlugStatus("available"); return; }

        setSlugStatus("checking");
        debounceRef.current = setTimeout(async () => {
            try {
                const params = new URLSearchParams({ slug });
                if (user?.id) params.set("excludeId", user.id);
                const res = await fetch(`${BASE_API_URL}/api/profile/checkSlug?${params}`);
                const data = await res.json();
                setSlugStatus(data.available ? "available" : "taken");
            } catch { setSlugStatus("idle"); }
        }, 450);

        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [slug, user?.id, user?.slug]);

    const saveSlugAndRegenerate = async () => {
        if (!user) return;
        setSlugSaving(true);
        setSlugAlert(null);
        try {
            // 1. Save slug
            const slugRes = await fetch(`${BASE_API_URL}/api/profile/updateSlug`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ slug: slug.trim().toLowerCase() }),
            });
            const slugData = await slugRes.json();
            if (!slugRes.ok) {
                setSlugAlert(slugData?.message ?? "Грешка при запис на slug");
                return;
            }

            // 2. Regenerate QR with new slug URL
            await generateQRCode();

            const updated = { ...user, slug: slugData.slug ?? null };
            localStorage.setItem("user", JSON.stringify(updated));
            setUser(updated as any);
            setSlugAlert("✓ Slug и QR кодът са обновени!");
        } catch {
            setSlugAlert("Грешка при запис");
        } finally {
            setSlugSaving(false);
        }
    };

    const generateQRCode = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await fetch(`${BASE_API_URL}/api/profile/generateQrCode`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id }),
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            const updated = { ...data.user };
            setUser(updated);
            localStorage.setItem("user", JSON.stringify(updated));
        } catch {
            alert(t("error.generation"));
        } finally {
            setLoading(false);
        }
    };

    const downloadQRCode = () => {
        const link = document.createElement("a");
        link.href = user!.qrCode;
        link.download = `${user!.name}_QRCode.png`;
        link.click();
        setDownloaded(true);
        setTimeout(() => setDownloaded(false), 2500);
    };

    const dataURLtoBlob = (dataurl: string) => {
        const arr = dataurl.split(",");
        const mime = arr[0].match(/:(.*?);/)?.[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        return new Blob([u8arr], { type: mime });
    };

    const handleShare = () => {
        const blob = dataURLtoBlob(user!.qrCode);
        const file = new File([blob], `${user!.name}_QRCode.png`, { type: "image/png" });
        if (navigator.canShare?.({ files: [file] })) {
            navigator.share({ files: [file], title: t("share.title"), text: t("share.text", { name: user!.name }) });
            setShared(true);
            setTimeout(() => setShared(false), 2500);
        } else {
            alert(t("share.unsupported"));
        }
    };

    const bgStyle = {
        background: 'radial-gradient(ellipse 90% 60% at 50% -5%, rgba(245,158,11,0.07) 0%, transparent 55%), #080A0F',
    };
    const gridStyle = {
        opacity: 0.015,
        backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
        backgroundSize: '52px 52px',
    };

    // ── No user ───────────────────────────────────────────────────────────────
    if (!user) return (
        <div className="min-h-screen flex items-center justify-center" style={bgStyle}>
            <p className="text-gray-600 text-sm">{t("noQr")}</p>
        </div>
    );

    // ── No QR yet ─────────────────────────────────────────────────────────────
    if (!user.qrCode) return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="min-h-screen pt-32 sm:pt-36 pb-28 px-4 sm:px-6" style={bgStyle}>
            <div className="fixed inset-0 -z-10 pointer-events-none" style={gridStyle} />
            <div className="max-w-lg mx-auto space-y-10">

                <motion.header initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="space-y-1">
                    <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-amber-500/65">{t("subtitle")}</p>
                    <h1 className="text-4xl font-bold text-white tracking-tight leading-none">{t("noQr")}</h1>
                </motion.header>

                {/* Empty state illustration */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
                    className="flex flex-col items-center gap-6 py-12 rounded-2xl border border-white/[0.055]"
                    style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="w-24 h-24 rounded-2xl flex items-center justify-center border border-white/[0.08]"
                        style={{ background: 'rgba(245,158,11,0.06)' }}>
                        <svg className="w-12 h-12 text-amber-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" /><path strokeLinecap="round" d="M14 14h3v3h-3zM17 17h3v3h-3z" />
                        </svg>
                    </div>
                    <div className="text-center px-8">
                        <p className="text-white font-semibold mb-1">{t("noQr")}</p>
                        <p className="text-gray-600 text-sm">{t("subtitle")}</p>
                    </div>
                    <button onClick={generateQRCode} disabled={loading}
                        className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm disabled:opacity-60 transition-all"
                        style={{
                            background: 'linear-gradient(135deg, #f59e0b, #f59e0bcc)',
                            color: '#000',
                            boxShadow: loading ? 'none' : '0 8px 28px rgba(245,158,11,0.35)',
                        }}>
                        {loading
                            ? <><div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" /> {t("generating")}</>
                            : <><SparkleIcon /> {t("actions.generate")}</>
                        }
                    </button>
                </motion.div>

                <div className="flex justify-center">
                    <button onClick={() => router.back()}
                        className="text-sm text-gray-600 hover:text-gray-400 transition-colors font-medium">
                        ← {t("actions.back")}
                    </button>
                </div>
            </div>
        </motion.div>
    );

    // ── Has QR ────────────────────────────────────────────────────────────────
    const profileImg = user.image
        ? (user.image.startsWith('data:') || user.image.startsWith('http')
            ? user.image
            : `data:image/jpeg;base64,${user.image}`)
        : null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
            className="min-h-screen pt-32 sm:pt-36 pb-28 px-4 sm:px-6" style={bgStyle}>
            <div className="fixed inset-0 -z-10 pointer-events-none" style={gridStyle} />
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-amber-500/[0.04] rounded-full blur-[80px] pointer-events-none -z-10" />

            <div className="max-w-lg mx-auto space-y-10">

                {/* Header */}
                <motion.header initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="space-y-1">
                    <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-amber-500/65">
                        {t("subtitle")}
                    </p>
                    <h1 className="text-4xl font-bold text-white tracking-tight leading-none">
                        {t("heading")}
                    </h1>
                </motion.header>

                {/* ── Main QR card ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="rounded-2xl border border-white/[0.055] overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}
                >
                    <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

                    <div className="p-8 flex flex-col items-center gap-6">

                        {/* Profile info */}
                        <div className="flex flex-col items-center gap-3 text-center">
                            {profileImg ? (
                                <div className="relative">
                                    <img src={profileImg} alt={user.name ?? ''}
                                        className="w-16 h-16 rounded-full object-cover"
                                        style={{ outline: '2px solid rgba(245,158,11,0.3)', outlineOffset: '3px' }} />
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0e0e14] flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-white" />
                                    </div>
                                </div>
                            ) : (
                                <div className="w-16 h-16 rounded-full flex items-center justify-center font-black text-xl"
                                    style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}>
                                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <p className="font-bold text-white text-lg leading-tight">{user.name}</p>
                                {user.position && <p className="text-sm text-amber-500/70 mt-0.5">{user.position}</p>}
                                {user.company && <p className="text-xs text-gray-600 mt-0.5">{user.company}</p>}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-white/[0.05]" />

                        {/* QR Code */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.25, type: 'spring', stiffness: 200 }}
                            className="relative"
                        >
                            {/* Glow */}
                            <div className="absolute inset-0 rounded-2xl blur-xl opacity-20"
                                style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />

                            <div className="relative rounded-2xl p-4 bg-white shadow-2xl"
                                style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.1), 0 20px 60px rgba(0,0,0,0.5)' }}>
                                <Image src={user.qrCode} alt={t("alt.qr")} width={200} height={200}
                                    className="w-48 h-48 rounded-lg" unoptimized />
                            </div>
                        </motion.div>

                        {/* Scan hint */}
                        <p className="text-[11px] text-gray-700 uppercase tracking-[0.15em] font-semibold">
                            {t("scanHint") ?? "Scan to open profile"}
                        </p>
                    </div>
                </motion.div>

                {/* ── Action buttons ── */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="grid grid-cols-2 gap-3">

                    {/* Download */}
                    <button onClick={downloadQRCode}
                        className="flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-sm transition-all"
                        style={{
                            background: 'linear-gradient(135deg, #f59e0b, #f59e0bcc)',
                            color: '#000',
                            boxShadow: '0 6px 20px rgba(245,158,11,0.30)',
                        }}>
                        <AnimatePresence mode="wait">
                            {downloaded
                                ? <motion.span key="c" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><CheckIcon /></motion.span>
                                : <motion.span key="d" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><DownloadIcon /></motion.span>
                            }
                        </AnimatePresence>
                        {downloaded ? (t("downloaded") ?? "Downloaded!") : t("actions.download")}
                    </button>

                    {/* Share */}
                    <button onClick={handleShare}
                        className="flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-sm border transition-all hover:bg-white/[0.06]"
                        style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#e0e0e0' }}>
                        <AnimatePresence mode="wait">
                            {shared
                                ? <motion.span key="c" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-emerald-400"><CheckIcon /></motion.span>
                                : <motion.span key="s" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><ShareIcon /></motion.span>
                            }
                        </AnimatePresence>
                        {shared ? (t("shared") ?? "Shared!") : t("actions.share")}
                    </button>
                </motion.div>

                {/* ── Slug field ── */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    className="rounded-2xl border border-white/[0.055] p-5 space-y-3"
                    style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-600">Персонален линк</p>
                    <div className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-colors ${slugStatus === "available" ? "border-green-500/40 bg-green-500/5" : slugStatus === "taken" ? "border-red-500/40 bg-red-500/5" : "border-white/[0.07] bg-black/30"}`}>
                        <span className="text-gray-600 text-xs whitespace-nowrap">ninjacardsnfc.com/bg/p/</span>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                            placeholder="ivan-petrov"
                            className="flex-1 bg-transparent text-white text-sm focus:outline-none min-w-0"
                        />
                        {slugStatus === "checking" && <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-500 border-t-amber-400 animate-spin flex-shrink-0" />}
                        {slugStatus === "available" && <span className="text-green-400 text-xs flex-shrink-0">✓</span>}
                        {slugStatus === "taken" && <span className="text-red-400 text-xs flex-shrink-0">✗</span>}
                    </div>
                    {slugStatus === "taken" && <p className="text-xs text-red-400">Вече се използва. Избери друг.</p>}
                    {slugStatus === "available" && slug !== user?.slug && <p className="text-xs text-green-500">Свободен!</p>}
                    {slugAlert && (
                        <p className={`text-xs ${slugAlert.startsWith("✓") ? "text-emerald-400" : "text-red-400"}`}>
                            {slugAlert}
                        </p>
                    )}
                    <button
                        onClick={saveSlugAndRegenerate}
                        disabled={slugSaving || slugStatus !== "available"}
                        className="w-full py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}>
                        {slugSaving ? "Запазване..." : "Запази slug и обнови QR"}
                    </button>
                </motion.div>

                {/* Regenerate + Back */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                    className="flex items-center justify-between">
                    <button onClick={() => router.back()}
                        className="text-sm text-gray-600 hover:text-gray-400 transition-colors font-medium">
                        ← {t("actions.back")}
                    </button>
                    <button onClick={generateQRCode} disabled={loading}
                        className="text-sm text-amber-500/60 hover:text-amber-500 transition-colors font-semibold disabled:opacity-40 flex items-center gap-1.5">
                        {loading
                            ? <><div className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin" /> {t("generating")}</>
                            : t("actions.generate")
                        }
                    </button>
                </motion.div>

            </div>
        </motion.div>
    );
}