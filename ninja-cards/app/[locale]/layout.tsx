import "../globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { locales, type Locale } from "@/config";
import AppChrome from "./components/layout/AppChrome";
import { AuthProvider } from "./context/AuthContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const localeSlug = locale === "en" ? "en" : "bg";
  const t = await getTranslations({
    locale: localeSlug,
    namespace: "Metadata.layout",
  });
  const keywords = t.raw("keywords") as string[];

  return {
    title: t("title"),
    description: t("description"),
    keywords,
    openGraph: {
      type: "website",
      url: `https://www.ninjacardsnfc.com/${localeSlug}`,
      title: t("title"),
      description: t("description"),
      siteName: "Ninja Card",
      locale: localeSlug === "bg" ? "bg_BG" : "en_US",
    },
    alternates: {
      canonical: `https://www.ninjacardsnfc.com/${localeSlug}`,
      languages: {
        "bg-BG": "https://www.ninjacardsnfc.com/bg",
        "en-US": "https://www.ninjacardsnfc.com/en",
      },
    },
  };
}

export function generateStaticParams() {
  return (locales as readonly string[]).map((l) => ({ locale: l }));
}

export default async function LocaleLayout({
  children,
  params: { locale: paramLocale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(paramLocale as Locale);

  const isSupported = (locales as readonly string[]).includes(paramLocale);
  if (!isSupported) {
    notFound();
  }

  const locale = paramLocale as Locale;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <meta
          name="google-site-verification"
          content="F0YLcxlz9-DNDYvBtQctoP9fkALenaCpKx-iiVhzx3c"
        />
        <Script id="apollo-tracker" strategy="beforeInteractive">
          {`function initApollo(){var n=Math.random().toString(36).substring(7),o=document.createElement("script");o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n,o.async=!0,o.defer=!0,o.onload=function(){window.trackingFunctions.onLoad({appId:"69d6ab7adde7e70019250105"})},document.head.appendChild(o)}initApollo();`}
        </Script>
      </head>
      <body className={`${inter.className} text-gray-200 antialiased`}>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-GGV8LQPL78"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GGV8LQPL78');
            gtag('config', 'AW-11395955170');
          `}
        </Script>

        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <AppChrome>{children}</AppChrome>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
