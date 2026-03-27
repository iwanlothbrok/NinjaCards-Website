"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/utils/constants";
import { useAuth } from "../../context/AuthContext";

interface Alert {
  message: string;
  title: string;
  color: string;
}

const SUCCESS_DELAY = 1000;
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
const MAX_BYTES = 2.5 * 1024 * 1024;

const schema = yup.object().shape({
  name: yup.string().required("Името е задължително"),
  email: yup.string().email("Невалиден имейл").required("Имейлът е задължителен"),
  slug: yup.string()
    .matches(/^[a-z0-9-]{3,40}$/, "Само малки букви, цифри и тирета (3-40 символа)")
    .optional(),
  password: yup.string().min(6, "Паролата трябва да е поне 6 символа").required("Паролата е задължителна"),
  confirmPassword: yup.string()
    .oneOf([yup.ref("password"), ""], "Паролите трябва да съвпадат")
    .required("Потвърждаването на паролата е задължително"),
  company: yup.string().optional(),
  position: yup.string().optional(),
  linkedin: yup.string().transform(v => v || undefined).url("Невалиден LinkedIn URL").optional(),
  website: yup.string().transform(v => v || undefined).url("Невалиден уебсайт URL").optional(),
});

// Strip "data:image/...;base64," prefix — DB stores only the base64 content
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

function ImageUploadField({
  label,
  preview,
  onFile,
  error,
  shape = "square",
}: {
  label: string;
  preview: string | null;
  onFile: (file: File) => void;
  error?: string;
  shape?: "round" | "square";
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_BYTES) { alert("Файлът е прекалено голям (макс 2.5MB)"); return; }
    onFile(file);
  };

  return (
    <div>
      <label className="block mb-3 text-base font-medium text-white">{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        className="relative cursor-pointer rounded-lg border-2 border-dashed border-gray-600 hover:border-amber-500/60 transition-colors bg-gray-700/50 overflow-hidden"
        style={{ minHeight: shape === "round" ? 120 : 100 }}
      >
        {preview ? (
          <div className="flex items-center justify-center p-4 gap-4">
            <img
              src={preview}
              alt="preview"
              className={`object-cover border-2 border-amber-500/40 ${shape === "round" ? "w-24 h-24 rounded-full" : "w-32 h-20 rounded-lg"}`}
            />
            <span className="text-sm text-gray-400">Натисни за смяна</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-8 text-gray-500">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2">
              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21,15 16,10 5,21" />
            </svg>
            <span className="text-sm">Избери снимка</span>
            <span className="text-xs mt-1">JPG, PNG, WEBP — макс 2.5MB</span>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}

const Register: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [alert, setAlert] = useState<Alert | null>(null);
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  // Image state — stored as data URLs for preview, stripped base64 for submission
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverBase64, setCoverBase64] = useState<string | null>(null);

  const watchedSlug = watch("slug") ?? "";

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const s = watchedSlug.trim().toLowerCase();
    if (s.length < 3 || !/^[a-z0-9-]+$/.test(s)) { setSlugStatus("idle"); return; }
    setSlugStatus("checking");
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/api/profile/checkSlug?slug=${s}`);
        const data = await res.json();
        setSlugStatus(data.available ? "available" : "taken");
      } catch { setSlugStatus("idle"); }
    }, 450);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [watchedSlug]);

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

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      showAlert("Грешна парола. Опитайте отново!", "Грешка", "red");
    }
  };

  const downloadQRCode = (dataUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = fileName;
    link.click();
  };

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        ...(imageBase64 ? { image: imageBase64 } : {}),
        ...(coverBase64 ? { coverImage: coverBase64 } : {}),
      };

      const res = await fetch(`${BASE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      await handleResponse(res);
    } catch (error) {
      showAlert("Възникна грешка при регистрацията", "Грешка", "red");
      console.error("Error:", error);
    }
  };

  const handleResponse = async (res: Response) => {
    if (res.ok) {
      setTimeout(() => showAlert("Успешна регистрация!", "Успех", "green"), SUCCESS_DELAY);
      const { token, user, qrImage } = await res.json();
      downloadQRCode(qrImage, `${user.name}-qrcode.png`);
      login(token, user);
      router.push("/login");
    } else {
      showAlert("Неуспешна регистрация", "Грешка", "red");
    }
  };

  const showAlert = (message: string, title: string, color: string) => {
    setAlert({ message, title, color });
    setTimeout(() => setAlert(null), 4000);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto p-6 shadow-lg mt-44 rounded-md bg-gray-700">
        <h1 className="text-2xl font-bold mb-4 text-center text-white">Admin Authentication</h1>
        {alert && (
          <div className={`my-2 p-4 rounded text-white ${alert.color === "green" ? "bg-green-500" : "bg-red-500"}`}>
            <strong>{alert.title}:</strong> {alert.message}
          </div>
        )}
        <form onSubmit={handleAuthSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-white">Enter Admin Password</label>
            <input
              type="password"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 text-black shadow-sm"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
            Authenticate
          </button>
        </form>
      </div>
    );
  }

  return (
    <section className="bg-gray-950 min-h-screen flex items-center justify-center py-16">
      <div className="w-full max-w-lg mx-auto px-4">
        <div className="rounded-lg shadow bg-gray-800 border border-gray-700">
          <div className="p-8 space-y-6">
            <h1 className="text-2xl font-bold text-white md:text-3xl">Създаване на акаунт</h1>

            {alert && (
              <div className={`p-4 rounded text-white ${alert.color === "green" ? "bg-green-500" : "bg-red-500"}`}>
                <strong>{alert.title}:</strong> {alert.message}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* Основни данни */}
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-white">Име</label>
                <input type="text" id="name" placeholder="Иван Петров"
                  className="bg-gray-700 border border-gray-600 text-white rounded-lg block w-full p-3"
                  {...register("name")} />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Имейл</label>
                <input type="email" id="email" placeholder="name@company.com"
                  className="bg-gray-700 border border-gray-600 text-white rounded-lg block w-full p-3"
                  {...register("email")} />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="slug" className="block mb-2 text-sm font-medium text-white">
                  Персонален линк <span className="text-gray-400 font-normal text-sm">— незадължително</span>
                </label>
                <div className={`flex items-center gap-2 border rounded-lg px-3 transition-colors ${slugStatus === "available" ? "bg-gray-700 border-green-500/50" : slugStatus === "taken" ? "bg-gray-700 border-red-500/50" : "bg-gray-700 border-gray-600"}`}>
                  <span className="text-gray-400 text-sm whitespace-nowrap">ninjacardsnfc.com/bg/p/</span>
                  <input type="text" id="slug" placeholder="ivan-petrov"
                    className="flex-1 bg-transparent text-white text-base py-3 focus:outline-none"
                    {...register("slug")}
                    onInput={(e) => { (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.toLowerCase().replace(/[^a-z0-9-]/g, ""); }}
                  />
                  {slugStatus === "checking" && <div className="w-4 h-4 rounded-full border-2 border-gray-500 border-t-white animate-spin flex-shrink-0" />}
                  {slugStatus === "available" && <span className="text-green-400 flex-shrink-0">✓</span>}
                  {slugStatus === "taken" && <span className="text-red-400 flex-shrink-0">✗</span>}
                </div>
                {slugStatus === "taken" && <p className="text-red-400 text-sm mt-1">Вече се използва. Избери друг.</p>}
                {slugStatus === "available" && <p className="text-green-400 text-sm mt-1">Свободен!</p>}
                {errors.slug && slugStatus === "idle" && <p className="text-red-400 text-sm mt-1">{errors.slug.message}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Парола</label>
                <input type="password" id="password" placeholder="••••••••"
                  className="bg-gray-700 border border-gray-600 text-white rounded-lg block w-full p-3"
                  {...register("password")} />
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-white">Потвърдете паролата</label>
                <input type="password" id="confirmPassword" placeholder="••••••••"
                  className="bg-gray-700 border border-gray-600 text-white rounded-lg block w-full p-3"
                  {...register("confirmPassword")} />
                {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>}
              </div>

              {/* ── Допълнителна информация ── */}
              <div className="pt-4 border-t border-gray-600 space-y-5">
                <p className="text-sm text-gray-400">Допълнителна информация <span className="text-gray-500">(незадължително)</span></p>

                <div>
                  <label htmlFor="company" className="block mb-2 text-sm font-medium text-white">Фирма</label>
                  <input type="text" id="company" placeholder="Ninja Cards Ltd."
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg block w-full p-3"
                    {...register("company")} />
                </div>

                <div>
                  <label htmlFor="position" className="block mb-2 text-sm font-medium text-white">Позиция</label>
                  <input type="text" id="position" placeholder="CEO / Sales Manager / ..."
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg block w-full p-3"
                    {...register("position")} />
                </div>

                <div>
                  <label htmlFor="linkedin" className="block mb-2 text-sm font-medium text-white">LinkedIn URL</label>
                  <input type="url" id="linkedin" placeholder="https://linkedin.com/in/username"
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg block w-full p-3"
                    {...register("linkedin")} />
                  {errors.linkedin && <p className="text-red-400 text-sm mt-1">{errors.linkedin.message}</p>}
                </div>

                <div>
                  <label htmlFor="website" className="block mb-2 text-sm font-medium text-white">Уебсайт</label>
                  <input type="url" id="website" placeholder="https://example.com"
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg block w-full p-3"
                    {...register("website")} />
                  {errors.website && <p className="text-red-400 text-sm mt-1">{errors.website.message}</p>}
                </div>

                {/* Профилна снимка — upload + preview */}
                <ImageUploadField
                  label="Профилна снимка"
                  preview={imagePreview}
                  onFile={handleImageFile}
                  shape="round"
                />

                {/* Корица — upload + preview */}
                <ImageUploadField
                  label="Корица"
                  preview={coverPreview}
                  onFile={handleCoverFile}
                  shape="square"
                />
              </div>

              <button type="submit" className="w-full bg-orange text-white py-3 rounded-lg font-semibold">
                Създай
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
