"use client";

import React, { useState, useEffect, useRef } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { BASE_API_URL } from "@/utils/constants";
import { useAuth } from "../../context/AuthContext";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

const VideoUpload = () => {
    const { user } = useAuth();
    const t = useTranslations("VideoUpload");

    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [loading, setLoading]   = useState(false);
    const [success, setSuccess]   = useState('');
    const [error, setError]       = useState('');
    const [playing, setPlaying]   = useState(false);
    const videoRef                = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (user?.videoUrl) setVideoUrl(user.videoUrl);
    }, [user]);

    const showSuccess = (msg: string) => { setSuccess(msg); setError('');   setTimeout(() => setSuccess(''), 4000); };
    const showError   = (msg: string) => { setError(msg);   setSuccess(''); setTimeout(() => setError(''),   4000); };

    const handleUpload = async (result: any) => {
        if (result.event !== "success" || !result.info?.secure_url) {
            return showError(t("alerts.uploadError"));
        }

        // Изчакай user-а да се зареди
        if (!user?.id) {
            return showError(t("alerts.unexpected"));
        }

        const url = result.info.secure_url;
        setVideoUrl(url);
        setLoading(true);

        try {
            // ✅ Правилният endpoint — записва videoUrl в Prisma
            const res = await fetch(`${BASE_API_URL}/api/profile/updateVideo`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, videoUrl: url }),
            });
            res.ok ? showSuccess(t("alerts.uploadSuccess")) : showError(t("alerts.uploadFail"));
        } catch {
            showError(t("alerts.unexpected"));
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async () => {
        if (!user?.id) return showError(t("alerts.unexpected"));
        setLoading(true);
        try {
            const res = await fetch(`${BASE_API_URL}/api/profile/removeVideo`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id }),
            });
            if (res.ok) {
                setVideoUrl(null);
                setPlaying(false);
                showSuccess(t("alerts.removeSuccess"));
            } else {
                const data = await res.json().catch(() => ({}));
                showError(data.error || t("alerts.removeFail"));
            }
        } catch {
            showError(t("alerts.unexpected"));
        } finally {
            setLoading(false);
        }
    };

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (playing) { videoRef.current.pause(); setPlaying(false); }
        else         { videoRef.current.play();  setPlaying(true);  }
    };

    // Изчакай докато user се зареди
    if (!user) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#080A0F' }}>
            <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border border-amber-500/15" />
                <div className="absolute inset-0 rounded-full border border-transparent border-t-amber-500 animate-spin" />
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen pt-32 sm:pt-36 pb-28 px-4 sm:px-6 lg:px-8"
            style={{ background: 'radial-gradient(ellipse 90% 60% at 50% -5%, rgba(245,158,11,0.06) 0%, transparent 55%), #080A0F' }}
        >
            <div className="fixed inset-0 -z-10 pointer-events-none" style={{
                opacity: 0.018,
                backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                backgroundSize: '52px 52px',
            }} />

            <div className="max-w-2xl mx-auto space-y-10">

                {/* Header */}
                <motion.header initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.5 }} className="space-y-1">
                    <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-amber-500/65">{t("subtitle")}</p>
                    <h1 className="text-4xl md:text-[2.8rem] font-bold text-white tracking-tight leading-none">{t("title")}</h1>
                    <p className="text-sm text-gray-500 pt-1">{t("description")}</p>
                </motion.header>

                {/* Toasts */}
                <AnimatePresence>
                    {success && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                            className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            {success}
                        </motion.div>
                    )}
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                            className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-red-500/[0.08] border border-red-500/20 text-red-400 text-sm font-medium">
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Current video */}
                {videoUrl && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }}
                        className="rounded-2xl border border-white/[0.055] overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}>
                        <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
                        <div className="px-7 py-4 border-b border-white/[0.05] bg-white/[0.025]">
                            <p className="text-[10.5px] font-semibold uppercase tracking-[0.13em] text-gray-500">{t("currentVideo")}</p>
                        </div>
                        <div className="relative bg-black">
                            <video ref={videoRef} src={videoUrl} className="w-full max-h-72 object-cover"
                                playsInline preload="metadata"
                                onEnded={() => setPlaying(false)} onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)} />
                            <AnimatePresence>
                                {!playing && (
                                    <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                                        onClick={togglePlay} className="absolute inset-0 flex items-center justify-center"
                                        style={{ background: 'rgba(0,0,0,0.4)' }}>
                                        <div className="w-16 h-16 rounded-full flex items-center justify-center"
                                            style={{ background: 'linear-gradient(135deg, #f59e0b, #f59e0bcc)', boxShadow: '0 8px 32px rgba(245,158,11,0.5)' }}>
                                            <svg className="w-7 h-7 ml-1" fill="black" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                        </div>
                                    </motion.button>
                                )}
                            </AnimatePresence>
                            {playing && (
                                <button onClick={togglePlay} className="absolute bottom-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center"
                                    style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <div className="px-7 py-4">
                            <button onClick={handleRemove} disabled={loading}
                                className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 border border-red-500/20 bg-red-500/[0.07] hover:bg-red-500/[0.15] text-red-400">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                {loading ? t("buttons.removing") : t("buttons.remove")}
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Upload button */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <CldUploadWidget
                        options={{
                            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
                            uploadPreset: "uploads",
                            resourceType: "video",
                            maxFileSize: 100000000,
                        }}
                        onSuccess={handleUpload}
                    >
                        {({ open }) => (
                            <button onClick={() => open()} disabled={loading || !user}
                                className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2.5 transition-all disabled:opacity-60"
                                style={{
                                    background: 'linear-gradient(135deg, #f59e0b, #f59e0bcc)',
                                    color: '#000',
                                    boxShadow: loading ? 'none' : '0 8px 28px rgba(245,158,11,0.35)',
                                }}>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                {loading ? t("buttons.uploading") : (videoUrl ? t("buttons.replace") : t("buttons.upload"))}
                            </button>
                        )}
                    </CldUploadWidget>
                    <p className="text-center text-[11px] text-gray-600 mt-3">{t("hint")}</p>
                </motion.div>

            </div>
        </motion.div>
    );
};

export default VideoUpload;