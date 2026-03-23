"use client";

import React, { useState, useEffect, useRef } from "react";
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
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD; // ✅ Read from .env

// ✅ Validation Schema for Registration
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
});

const Register: React.FC = () => {
  // ✅ Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  // ✅ react-hook-form setup
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [alert, setAlert] = useState<Alert | null>(null);
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const { login } = useAuth();

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

  // ✅ Handle Admin Authentication
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      showAlert("Грешна парола. Опитайте отново!", "Грешка", "red");
    }
  };

  // Автоматично сваляне на QR кода като PNG
  const downloadQRCode = (dataUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = fileName;
    link.click();
  };

  // ✅ Handle Registration
  const onSubmit = async (data: any) => {
    try {
      console.log('base api url: ', BASE_API_URL);

      const res = await fetch(`${BASE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      await handleResponse(res);
    } catch (error) {
      showAlert("Възникна грешка при регистрацията", "Грешка", "red");
      console.error("Error:", error);
    }
  };

  const handleResponse = async (res: Response) => {
    if (res.ok) {
      setTimeout(() => {
        showAlert("Успешна регистрация!", "Успех", "green");
      }, SUCCESS_DELAY);

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
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  // ✅ Show Authentication Form if user is NOT authenticated
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
              className="mt-1 p-2 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Authenticate
          </button>
        </form>
      </div>
    );
  }

  return (
    <section className="bg-gray-950 min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center mx-auto">
        <div className="w-full rounded-lg shadow sm:max-w-lg bg-gray-800 border-gray-700">
          <div className="p-12 space-y-6 md:space-y-8 sm:p-14">
            <h1 className="text-2xl font-bold text-white md:text-3xl">
              Създаване на акаунт
            </h1>
            {alert && (
              <div className={`my-2 p-4 rounded text-white ${alert.color === "green" ? "bg-green-500" : "bg-red-500"}`}>
                <strong>{alert.title}:</strong> {alert.message}
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
              <div>
                <label htmlFor="name" className="block mb-3 text-base font-medium text-white">
                  Име
                </label>
                <input
                  type="text"
                  id="name"
                  className="bg-gray-700 border border-gray-600 text-white text-base rounded-lg block w-full p-3"
                  placeholder="Вашето име"
                  {...register("name")}
                />
              </div>

              <div>
                <label htmlFor="email" className="block mb-3 text-base font-medium text-white">
                  Имейл
                </label>
                <input
                  type="email"
                  id="email"
                  className="bg-gray-700 border border-gray-600 text-white text-base rounded-lg block w-full p-3"
                  placeholder="name@company.com"
                  {...register("email")}
                />
              </div>

              <div>
                <label htmlFor="slug" className="block mb-3 text-base font-medium text-white">
                  Персонален линк (slug) <span className="text-gray-400 font-normal text-sm">— незадължително</span>
                </label>
                <div className={`flex items-center gap-2 border rounded-lg px-3 transition-colors ${slugStatus === "available" ? "bg-gray-700 border-green-500/50" : slugStatus === "taken" ? "bg-gray-700 border-red-500/50" : "bg-gray-700 border-gray-600"}`}>
                  <span className="text-gray-400 text-sm whitespace-nowrap">ninjacardsnfc.com/bg/p/</span>
                  <input
                    type="text"
                    id="slug"
                    className="flex-1 bg-transparent text-white text-base py-3 focus:outline-none"
                    placeholder="ivan-petrov"
                    {...register("slug")}
                    onInput={(e) => {
                      (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.toLowerCase().replace(/[^a-z0-9-]/g, "");
                    }}
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
                <label htmlFor="password" className="block mb-3 text-base font-medium text-white">
                  Парола
                </label>
                <input
                  type="password"
                  id="password"
                  className="bg-gray-700 border border-gray-600 text-white text-base rounded-lg block w-full p-3"
                  placeholder="••••••••"
                  {...register("password")}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block mb-3 text-base font-medium text-white">
                  Потвърдете паролата
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="bg-gray-700 border border-gray-600 text-white text-base rounded-lg block w-full p-3"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                />
              </div>

              <button type="submit" className="w-full bg-orange text-white py-3 rounded-lg">
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
