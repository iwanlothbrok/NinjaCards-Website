"use client";

import React, { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/utils/constants";
import { useAuth } from "../../context/AuthContext";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
const MAX_BYTES = 2.5 * 1024 * 1024;

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExtractedProfile {
    firstName: string;
    lastName: string;
    name: string;
    position: string;
    company: string;
    bio: string;
    website: string;
    linkedin: string;
    city: string;
    country: string;
    slug: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stripDataUrlPrefix(dataUrl: string): string {
    const idx = dataUrl.indexOf(",");
    return idx !== -1 ? dataUrl.slice(idx + 1) : dataUrl;
}

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({ label, value, onChange, placeholder, type = "text", mono = false }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; mono?: boolean;
}) {
    return (
        <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{label}</span>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-amber-400/50 focus:bg-white/[0.06] ${mono ? "font-mono" : ""}`}
            />
        </label>
    );
}

function Textarea({ label, value, onChange, rows = 3 }: {
    label: string; value: string; onChange: (v: string) => void; rows?: number;
}) {
    return (
        <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{label}</span>
            <textarea
                value={value}
                onChange={e => onChange(e.target.value)}
                rows={rows}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-amber-400/50 focus:bg-white/[0.06] resize-none"
            />
        </label>
    );
}

function ImageUploadField({ label, preview, onFile, shape = "square" }: {
    label: string; preview: string | null; onFile: (f: File) => void; shape?: "round" | "square";
}) {
    const ref = useRef<HTMLInputElement>(null);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > MAX_BYTES) { alert("Макс 2.5MB"); return; }
        onFile(file);
    };
    return (
        <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{label}</span>
            <div
                onClick={() => ref.current?.click()}
                className="cursor-pointer rounded-xl border-2 border-dashed border-white/10 hover:border-amber-500/40 transition-colors bg-white/[0.02] overflow-hidden"
            >
                {preview ? (
                    <div className="flex items-center gap-4 p-4">
                        <img src={preview} alt="" className={`object-cover border-2 border-amber-500/30 ${shape === "round" ? "w-20 h-20 rounded-full" : "w-28 h-16 rounded-lg"}`} />
                        <span className="text-xs text-zinc-500">Натисни за смяна</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-7 text-zinc-600">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2">
                            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21,15 16,10 5,21" />
                        </svg>
                        <span className="text-sm">Избери снимка</span>
                        <span className="text-xs mt-0.5">JPG / PNG — макс 2.5MB</span>
                    </div>
                )}
            </div>
            <input ref={ref} type="file" accept="image/*" onChange={handleChange} className="hidden" />
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Step = "auth" | "input" | "loading" | "review";

export default function AiRegisterPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [step, setStep] = useState<Step>("auth");
    const [adminPwd, setAdminPwd] = useState("");
    const [authError, setAuthError] = useState("");

    // Input step
    const [inputName, setInputName] = useState("");
    const [inputLinkedin, setInputLinkedin] = useState("");
    const [inputCompany, setInputCompany] = useState("");
    const [inputPosition, setInputPosition] = useState("");
    const [aiError, setAiError] = useState("");

    // Review step — editable fields
    const [profile, setProfile] = useState<ExtractedProfile>({
        firstName: "", lastName: "", name: "", position: "", company: "",
        bio: "", website: "", linkedin: "", city: "", country: "България", slug: "",
    });
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Images
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [coverBase64, setCoverBase64] = useState<string | null>(null);

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [success, setSuccess] = useState(false);

    // ── Auth ──
    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();
        if (adminPwd === ADMIN_PASSWORD) { setStep("input"); setAuthError(""); }
        else setAuthError("Грешна парола");
    };

    // ── AI Extract ──
    const handleExtract = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputName.trim()) { setAiError("Въведи поне името"); return; }
        setAiError("");
        setStep("loading");

        try {
            const res = await fetch(`${BASE_API_URL}/api/admin/ai-profile-extract`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: inputName.trim(),
                    linkedinUrl: inputLinkedin.trim() || undefined,
                    companyHint: inputCompany.trim() || undefined,
                    positionHint: inputPosition.trim() || undefined,
                }),
            });

            if (!res.ok) throw new Error("AI extraction failed");
            const data: ExtractedProfile & { imageBase64?: string; imageMime?: string; coverBase64?: string; coverMime?: string } = await res.json();
            setProfile(data);
            if (data.imageBase64) {
                setImageBase64(data.imageBase64);
                setImagePreview(`data:${data.imageMime ?? 'image/jpeg'};base64,${data.imageBase64}`);
            }
            if (data.coverBase64) {
                setCoverBase64(data.coverBase64);
                setCoverPreview(`data:${data.coverMime ?? 'image/png'};base64,${data.coverBase64}`);
            }
            setStep("review");
        } catch {
            setAiError("AI грешка — опитай отново");
            setStep("input");
        }
    };

    // ── Images ──
    const handleImageFile = useCallback(async (file: File) => {
        const dataUrl = await fileToBase64(file);
        setImagePreview(dataUrl);
        setImageBase64(stripDataUrlPrefix(dataUrl));
    }, []);

    const handleCoverFile = useCallback(async (file: File) => {
        const dataUrl = await fileToBase64(file);
        setCoverPreview(dataUrl);
        setCoverBase64(stripDataUrlPrefix(dataUrl));
    }, []);

    const setP = (field: keyof ExtractedProfile) => (v: string) => setProfile(p => ({ ...p, [field]: v }));

    // ── Submit registration ──
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) { setSubmitError("Имейлът е задължителен"); return; }
        if (password.length < 6) { setSubmitError("Паролата трябва да е поне 6 символа"); return; }
        if (password !== confirmPassword) { setSubmitError("Паролите не съвпадат"); return; }
        if (profile.slug && !/^[a-z0-9-]{3,40}$/.test(profile.slug)) { setSubmitError("Невалиден slug"); return; }

        setSubmitError("");
        setSubmitting(true);

        try {
            const payload = {
                name: profile.name,
                email,
                password,
                confirmPassword,
                slug: profile.slug || undefined,
                firstName: profile.firstName,
                lastName: profile.lastName,
                position: profile.position,
                company: profile.company,
                bio: profile.bio,
                website: profile.website,
                linkedin: profile.linkedin,
                city: profile.city,
                country: profile.country,
                ...(imageBase64 ? { image: imageBase64 } : {}),
                ...(coverBase64 ? { coverImage: coverBase64 } : {}),
            };

            const res = await fetch(`${BASE_API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) { setSubmitError("Регистрацията неуспешна — провери данните"); return; }

            const { token, user, qrImage } = await res.json();

            // Download QR
            if (qrImage) {
                const link = document.createElement("a");
                link.href = qrImage;
                link.download = `${profile.name}-qrcode.png`;
                link.click();
            }

            login(token, user);
            setSuccess(true);
            setTimeout(() => router.push("/login"), 1800);
        } catch {
            setSubmitError("Грешка при регистрацията");
        } finally {
            setSubmitting(false);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────

    if (step === "auth") return (
        <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111] p-8">
                <h1 className="text-xl font-bold text-white mb-6">Admin парола</h1>
                {authError && <p className="text-red-400 text-sm mb-4">{authError}</p>}
                <form onSubmit={handleAuth} className="space-y-4">
                    <input type="password" value={adminPwd} onChange={e => setAdminPwd(e.target.value)}
                        placeholder="••••••••" required
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-amber-400/50" />
                    <button type="submit" className="w-full rounded-xl bg-amber-500 py-3 text-sm font-semibold text-black hover:bg-amber-400 transition">
                        Влез
                    </button>
                </form>
            </div>
        </div>
    );

    if (step === "loading") return (
        <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center gap-5 text-white">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-amber-500/20" />
                <div className="absolute inset-0 rounded-full border-2 border-t-amber-500 animate-spin" />
            </div>
            <div className="text-center">
                <p className="font-semibold text-lg">AI анализира профила</p>
                <p className="text-zinc-500 text-sm mt-1">Извличаме данните от LinkedIn и генерираме профила…</p>
            </div>
        </div>
    );

    if (step === "input") return (
        <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4 py-16">
            {/* Ambient glow */}
            <div className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.15),transparent_55%)]" />

            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-amber-300 mb-4">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L14.2 8.8L20 11L14.2 13.2L12 19L9.8 13.2L4 11L9.8 8.8L12 3Z" /></svg>
                        AI Регистрация
                    </div>
                    <h1 className="text-3xl font-black text-white">Добави клиент с AI</h1>
                    <p className="mt-2 text-sm text-zinc-500">Въведи само името и/или LinkedIn — AI попълва останалото</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#111] p-6">
                    {aiError && <p className="text-red-400 text-sm mb-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">{aiError}</p>}
                    <form onSubmit={handleExtract} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Пълно име *</label>
                            <input
                                type="text"
                                value={inputName}
                                onChange={e => setInputName(e.target.value)}
                                placeholder="Иван Иванов"
                                required
                                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-amber-400/50"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">LinkedIn URL <span className="text-zinc-600 normal-case">(незадължително)</span></label>
                            <input
                                type="url"
                                value={inputLinkedin}
                                onChange={e => setInputLinkedin(e.target.value)}
                                placeholder="https://linkedin.com/in/ivan-ivanov"
                                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-amber-400/50"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Фирма</label>
                                <input
                                    type="text"
                                    value={inputCompany}
                                    onChange={e => setInputCompany(e.target.value)}
                                    placeholder="Ninja Cards"
                                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-amber-400/50"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Позиция</label>
                                <input
                                    type="text"
                                    value={inputPosition}
                                    onChange={e => setInputPosition(e.target.value)}
                                    placeholder="CEO"
                                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-amber-400/50"
                                />
                            </div>
                        </div>

                        <button type="submit" className="w-full rounded-xl bg-amber-500 py-3.5 text-sm font-semibold text-black hover:bg-amber-400 transition active:scale-[0.98] flex items-center justify-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L14.2 8.8L20 11L14.2 13.2L12 19L9.8 13.2L4 11L9.8 8.8L12 3Z" /></svg>
                            Анализирай с AI
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );

    // ── Review & Submit ──────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#080808] px-4 py-16">
            <div className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.12),transparent_55%)]" />
            <div className="mx-auto max-w-2xl">

                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-1">AI извлечени данни</p>
                        <h1 className="text-2xl font-black text-white">Прегледай и потвърди</h1>
                    </div>
                    <button onClick={() => setStep("input")} className="text-sm text-zinc-500 hover:text-zinc-300 transition underline underline-offset-2">
                        ← Обратно
                    </button>
                </div>

                {success && (
                    <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-5 py-4 text-emerald-300 text-sm font-medium">
                        Акаунтът е създаден успешно! Пренасочване…
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* AI данни (редактируеми) */}
                    <div className="rounded-2xl border border-white/10 bg-[#111] p-5 space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Профилни данни</p>

                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Първо Ime" value={profile.firstName} onChange={setP("firstName")} />
                            <Field label="Фамилия" value={profile.lastName} onChange={setP("lastName")} />
                        </div>
                        <Field label="Пълно Иметo (на картата)" value={profile.name} onChange={setP("name")} />
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Позиция" value={profile.position} onChange={setP("position")} placeholder="CEO" />
                            <Field label="Фирма" value={profile.company} onChange={setP("company")} placeholder="Ninja Cards" />
                        </div>
                        <Textarea label="Биография (BG)" value={profile.bio} onChange={setP("bio")} rows={3} />
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Уебсайт" value={profile.website} onChange={setP("website")} placeholder="https://example.com" type="url" />
                            <Field label="LinkedIn" value={profile.linkedin} onChange={setP("linkedin")} placeholder="https://linkedin.com/in/..." type="url" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Град" value={profile.city} onChange={setP("city")} placeholder="София" />
                            <Field label="Държава" value={profile.country} onChange={setP("country")} placeholder="България" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Персонален линк (slug)</label>
                            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                                <span className="text-zinc-500 text-xs whitespace-nowrap">ninjacardsnfc.com/bg/p/</span>
                                <input
                                    type="text"
                                    value={profile.slug}
                                    onChange={e => setP("slug")(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                                    placeholder="ivan-ivanov"
                                    className="flex-1 bg-transparent text-sm text-white outline-none font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Снимки */}
                    <div className="rounded-2xl border border-white/10 bg-[#111] p-5 space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Снимки</p>
                        <div className="grid grid-cols-2 gap-4">
                            <ImageUploadField label="Профилна снимка" preview={imagePreview} onFile={handleImageFile} shape="round" />
                            <ImageUploadField label="Корица" preview={coverPreview} onFile={handleCoverFile} shape="square" />
                        </div>
                    </div>

                    {/* Акаунт данни */}
                    <div className="rounded-2xl border border-white/10 bg-[#111] p-5 space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Данни за акаунта</p>
                        <Field label="Имейл *" value={email} onChange={setEmail} placeholder="ivan@example.com" type="email" />
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Парола *" value={password} onChange={setPassword} placeholder="••••••••" type="password" />
                            <Field label="Потвърди паролата *" value={confirmPassword} onChange={setConfirmPassword} placeholder="••••••••" type="password" />
                        </div>
                    </div>

                    {submitError && (
                        <p className="text-red-400 text-sm rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">{submitError}</p>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-xl bg-amber-500 py-4 text-sm font-semibold text-black hover:bg-amber-400 transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            <><div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />Създаване…</>
                        ) : "Създай акаунта"}
                    </button>
                </form>
            </div>
        </div>
    );
}
