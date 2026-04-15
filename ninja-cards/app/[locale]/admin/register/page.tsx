"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BASE_API_URL, buildPublicProfileUrl } from "@/utils/constants";

const MAX_BYTES = 2.5 * 1024 * 1024;

type FormState = {
    name: string;
    email: string;
    slug: string;
    password: string;
    confirmPassword: string;
    company: string;
    position: string;
    linkedin: string;
    website: string;
    firstName: string;
    lastName: string;
    bio: string;
    city: string;
    country: string;
};

type CreatedUser = {
    id: string;
    name: string;
    email: string;
    slug?: string | null;
    qrCode?: string | null;
};

function stripDataUrlPrefix(dataUrl: string) {
    const idx = dataUrl.indexOf(",");
    return idx === -1 ? dataUrl : dataUrl.slice(idx + 1);
}

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function Field({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    helper,
    error,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    helper?: string;
    error?: string;
}) {
    return (
        <label className="block space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">{label}</span>
            <input
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
                    error
                        ? "border-red-500/40 bg-red-500/5 text-white placeholder:text-red-200/40"
                        : "border-white/10 bg-white/[0.04] text-white placeholder:text-zinc-600 focus:border-amber-400/40 focus:bg-white/[0.06]"
                }`}
            />
            {error ? <p className="text-sm text-red-400">{error}</p> : helper ? <p className="text-xs text-zinc-500">{helper}</p> : null}
        </label>
    );
}

function Textarea({
    label,
    value,
    onChange,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    return (
        <label className="block space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">{label}</span>
            <textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                rows={4}
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-amber-400/40 focus:bg-white/[0.06]"
            />
        </label>
    );
}

function ImageUploadField({
    label,
    preview,
    onFile,
    shape = "square",
}: {
    label: string;
    preview: string | null;
    onFile: (file: File) => void;
    shape?: "round" | "square";
}) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.size > MAX_BYTES) {
            window.alert("Файлът е прекалено голям. Максимумът е 2.5MB.");
            return;
        }
        onFile(file);
    };

    return (
        <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">{label}</span>
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex w-full items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-amber-400/30 hover:bg-white/[0.05]"
            >
                {preview ? (
                    <div className="flex w-full items-center gap-4">
                        <img
                            src={preview}
                            alt={label}
                            className={`border border-white/10 object-cover ${shape === "round" ? "h-20 w-20 rounded-full" : "h-20 w-32 rounded-xl"}`}
                        />
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-white">Изображението е качено</p>
                            <p className="text-xs text-zinc-500">Натисни, ако искаш да го смениш.</p>
                        </div>
                    </div>
                ) : (
                    <div className="py-6 text-center">
                        <p className="text-sm font-medium text-white">Качи изображение</p>
                        <p className="mt-1 text-xs text-zinc-500">JPG, PNG или WEBP до 2.5MB</p>
                    </div>
                )}
            </button>
            <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
        </div>
    );
}

export default function AdminRegisterPage() {
    const params = useParams<{ locale: string }>();
    const locale = typeof params?.locale === "string" ? params.locale : "bg";

    const [form, setForm] = useState<FormState>({
        name: "",
        email: "",
        slug: "",
        password: "",
        confirmPassword: "",
        company: "",
        position: "",
        linkedin: "",
        website: "",
        firstName: "",
        lastName: "",
        bio: "",
        city: "",
        country: "България",
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [coverBase64, setCoverBase64] = useState<string | null>(null);
    const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");
    const [createdUser, setCreatedUser] = useState<CreatedUser | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const setField = useCallback((field: keyof FormState, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
    }, []);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        const slug = form.slug.trim().toLowerCase();
        if (!slug) {
            setSlugStatus("idle");
            return;
        }

        if (slug.length < 3 || !/^[a-z0-9-]+$/.test(slug)) {
            setSlugStatus("taken");
            return;
        }

        setSlugStatus("checking");
        debounceRef.current = setTimeout(async () => {
            try {
                const response = await fetch(`${BASE_API_URL}/api/profile/checkSlug?slug=${slug}`);
                const data = await response.json();
                setSlugStatus(data.available ? "available" : "taken");
            } catch {
                setSlugStatus("idle");
            }
        }, 450);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [form.slug]);

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

    const fieldErrors = useMemo(() => {
        const errors: Partial<Record<keyof FormState, string>> = {};

        if (!form.name.trim()) errors.name = "Името е задължително.";
        if (!form.email.trim()) errors.email = "Имейлът е задължителен.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Имейлът не е валиден.";
        if (!form.password) errors.password = "Паролата е задължителна.";
        else if (form.password.length < 6) errors.password = "Паролата трябва да е поне 6 символа.";
        if (!form.confirmPassword) errors.confirmPassword = "Потвърди паролата.";
        else if (form.password !== form.confirmPassword) errors.confirmPassword = "Паролите не съвпадат.";
        if (form.slug && !/^[a-z0-9-]{3,40}$/.test(form.slug)) errors.slug = "Само малки букви, цифри и тирета (3-40 символа).";
        if (form.linkedin && !/^https?:\/\/.+/i.test(form.linkedin)) errors.linkedin = "Въведи валиден LinkedIn URL.";
        if (form.website && !/^https?:\/\/.+/i.test(form.website)) errors.website = "Въведи валиден уебсайт URL.";

        return errors;
    }, [form]);

    const publicProfileUrl = createdUser
        ? buildPublicProfileUrl({
              locale,
              slug: createdUser.slug ?? undefined,
              userId: createdUser.id,
          })
        : "";

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitError("");
        setSubmitSuccess("");

        if (Object.keys(fieldErrors).length > 0) {
            setSubmitError("Попълни задължителните полета и провери дали няма грешки във формата.");
            return;
        }

        if (form.slug && slugStatus === "taken") {
            setSubmitError("Този slug вече е зает.");
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch(`${BASE_API_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    slug: form.slug.trim() || undefined,
                    password: form.password,
                    company: form.company.trim() || undefined,
                    position: form.position.trim() || undefined,
                    linkedin: form.linkedin.trim() || undefined,
                    website: form.website.trim() || undefined,
                    firstName: form.firstName.trim() || undefined,
                    lastName: form.lastName.trim() || undefined,
                    bio: form.bio.trim() || undefined,
                    city: form.city.trim() || undefined,
                    country: form.country.trim() || undefined,
                    ...(imageBase64 ? { image: imageBase64 } : {}),
                    ...(coverBase64 ? { coverImage: coverBase64 } : {}),
                }),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                setSubmitError(data?.error || "Регистрацията не беше успешна.");
                return;
            }

            const user = data as CreatedUser;
            setCreatedUser(user);
            setSubmitSuccess("Акаунтът е създаден успешно.");

            if (user.qrCode) {
                const link = document.createElement("a");
                link.href = user.qrCode;
                link.download = `${user.name || "user"}-qrcode.png`;
                link.click();
            }

            setForm({
                name: "",
                email: "",
                slug: "",
                password: "",
                confirmPassword: "",
                company: "",
                position: "",
                linkedin: "",
                website: "",
                firstName: "",
                lastName: "",
                bio: "",
                city: "",
                country: "България",
            });
            setImagePreview(null);
            setImageBase64(null);
            setCoverPreview(null);
            setCoverBase64(null);
            setSlugStatus("idle");
        } catch {
            setSubmitError("Възникна грешка при създаването на акаунта.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#080808] px-4 py-10 text-white">
            <div className="mx-auto max-w-5xl space-y-6">
                <div className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-[#101216] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.35)] lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-amber-400">Manual Registration</p>
                        <h1 className="text-3xl font-black tracking-tight">Ръчна регистрация на потребител</h1>
                        <p className="mt-3 max-w-2xl text-sm text-zinc-400">
                            Връщаме стария удобен flow на <span className="text-white">/admin/register</span>, за да можеш директно да
                            създаваш хора от admin-а, без да влизаш в users модула.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href={`/${locale}/admin?module=users`}
                            className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:text-white"
                        >
                            Към Users
                        </Link>
                        <Link
                            href={`/${locale}/admin/ai-register`}
                            className="rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-amber-400"
                        >
                            AI регистрация
                        </Link>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_360px]">
                    <form onSubmit={handleSubmit} className="space-y-6 rounded-[28px] border border-white/10 bg-[#101216] p-6">
                        <div className="grid gap-5 md:grid-cols-2">
                            <Field label="Име *" value={form.name} onChange={(value) => setField("name", value)} placeholder="Иван Петров" error={fieldErrors.name} />
                            <Field
                                label="Имейл *"
                                value={form.email}
                                onChange={(value) => setField("email", value)}
                                placeholder="ivan@company.com"
                                type="email"
                                error={fieldErrors.email}
                            />
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <Field
                                label="Парола *"
                                value={form.password}
                                onChange={(value) => setField("password", value)}
                                placeholder="Поне 6 символа"
                                type="password"
                                error={fieldErrors.password}
                            />
                            <Field
                                label="Потвърди паролата *"
                                value={form.confirmPassword}
                                onChange={(value) => setField("confirmPassword", value)}
                                placeholder="Повтори паролата"
                                type="password"
                                error={fieldErrors.confirmPassword}
                            />
                        </div>

                        <div className="space-y-2">
                            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Slug</span>
                            <div
                                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                                    fieldErrors.slug
                                        ? "border-red-500/40 bg-red-500/5"
                                        : slugStatus === "available"
                                          ? "border-emerald-500/30 bg-emerald-500/5"
                                          : slugStatus === "taken"
                                            ? "border-red-500/40 bg-red-500/5"
                                            : "border-white/10 bg-white/[0.04]"
                                }`}
                            >
                                <span className="hidden text-xs text-zinc-500 sm:inline">ninjacardsnfc.com/{locale}/p/</span>
                                <input
                                    type="text"
                                    value={form.slug}
                                    onChange={(event) => setField("slug", event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                                    placeholder="ivan-petrov"
                                    className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
                                />
                                {slugStatus === "checking" ? <span className="text-xs text-zinc-500">Проверка...</span> : null}
                                {slugStatus === "available" ? <span className="text-xs font-semibold text-emerald-400">Свободен</span> : null}
                                {slugStatus === "taken" && !fieldErrors.slug ? <span className="text-xs font-semibold text-red-400">Зает</span> : null}
                            </div>
                            {fieldErrors.slug ? <p className="text-sm text-red-400">{fieldErrors.slug}</p> : <p className="text-xs text-zinc-500">Незадължително, но е удобно за персонален линк.</p>}
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <Field label="Първо име" value={form.firstName} onChange={(value) => setField("firstName", value)} placeholder="Иван" />
                            <Field label="Фамилия" value={form.lastName} onChange={(value) => setField("lastName", value)} placeholder="Петров" />
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <Field label="Фирма" value={form.company} onChange={(value) => setField("company", value)} placeholder="Ninja Cards" />
                            <Field label="Позиция" value={form.position} onChange={(value) => setField("position", value)} placeholder="Sales Manager" />
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <Field
                                label="LinkedIn"
                                value={form.linkedin}
                                onChange={(value) => setField("linkedin", value)}
                                placeholder="https://linkedin.com/in/..."
                                error={fieldErrors.linkedin}
                            />
                            <Field
                                label="Уебсайт"
                                value={form.website}
                                onChange={(value) => setField("website", value)}
                                placeholder="https://example.com"
                                error={fieldErrors.website}
                            />
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <Field label="Град" value={form.city} onChange={(value) => setField("city", value)} placeholder="София" />
                            <Field label="Държава" value={form.country} onChange={(value) => setField("country", value)} placeholder="България" />
                        </div>

                        <Textarea label="Био" value={form.bio} onChange={(value) => setField("bio", value)} placeholder="Кратко описание за профила." />

                        <div className="grid gap-5 md:grid-cols-2">
                            <ImageUploadField label="Профилна снимка" preview={imagePreview} onFile={handleImageFile} shape="round" />
                            <ImageUploadField label="Корица" preview={coverPreview} onFile={handleCoverFile} shape="square" />
                        </div>

                        {submitError ? <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">{submitError}</div> : null}
                        {submitSuccess ? <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{submitSuccess}</div> : null}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex w-full items-center justify-center rounded-2xl bg-amber-500 px-5 py-4 text-sm font-semibold text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? "Създавам акаунта..." : "Създай акаунт"}
                        </button>
                    </form>

                    <aside className="space-y-6">
                        <div className="rounded-[28px] border border-white/10 bg-[#101216] p-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Какво прави тази страница</p>
                            <ul className="mt-4 space-y-3 text-sm text-zinc-400">
                                <li>Създава потребителя директно през `/api/auth/register`.</li>
                                <li>Проверява slug-а още при писане.</li>
                                <li>Качва профилна снимка и корица още при регистрацията.</li>
                                <li>Сваля QR кода автоматично веднага след създаването.</li>
                            </ul>
                        </div>

                        <div className="rounded-[28px] border border-white/10 bg-[#101216] p-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Последно създаден</p>
                            {createdUser ? (
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <p className="text-lg font-semibold text-white">{createdUser.name}</p>
                                        <p className="text-sm text-zinc-400">{createdUser.email}</p>
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Public profile</p>
                                        <a href={publicProfileUrl} target="_blank" rel="noreferrer" className="mt-2 block break-all text-sm text-amber-300 hover:text-amber-200">
                                            {publicProfileUrl}
                                        </a>
                                    </div>
                                    {createdUser.qrCode ? (
                                        <div className="rounded-2xl border border-white/10 bg-white p-4">
                                            <img src={createdUser.qrCode} alt={`${createdUser.name} QR code`} className="mx-auto w-44" />
                                        </div>
                                    ) : null}
                                </div>
                            ) : (
                                <p className="mt-4 text-sm text-zinc-500">След първата регистрация тук ще показваме линка и QR кода на човека.</p>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
