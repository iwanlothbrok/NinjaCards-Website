import '../globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from './components/Navigation';
import { AuthProvider } from './context/AuthContext';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Script from 'next/script';
import CookieBanner from './components/layout/CookieBanner';
import ClientLayoutWrapper from './components/layout/ClientLayoutWrapper';
import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
import { notFound } from 'next/navigation';
import { locales, defaultLocale, type Locale } from '@/config';
import { getMessages, setRequestLocale } from 'next-intl/server';
import Footer from './components/layout/Footer';


const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: 'Ninja Cards NFC | Смарт NFC Визитки за Модерен Бизнес',
  description: 'Ninja Cards създава иновативни смарт NFC визитки за професионалисти и бизнеси. Споделяйте контактите си с едно докосване – стилно, бързо и екологично.',
  openGraph: {
    type: 'website',
    url: 'https://www.ninjacardsnfc.com/',
    title: 'Ninja Cards NFC | Смарт NFC Визитки за Модерен Бизнес',
    description: 'Открийте новото поколение смарт NFC визитки от Ninja Cards – дигитално споделяне на контакти, персонализиран дизайн и устойчивост. Бъдещето на визитките е тук.',
    siteName: 'Ninja Cards',
    locale: 'bg_BG',
  },
  keywords: [
    'NFC визитка',
    'Смарт визитка',
    'Дигитална визитка',
    'Електронна визитка',
    'Безконтактна визитка',
    'Виртуална визитка',
    'NFC карта за бизнес',
    'Професионална визитка',
    'Smart vizitki',
    'Digitalna vizitka',
    'NFC vizitka',
    'умни визитни картички',
    'Ninja Cards',
    'Модерна визитка',
    'Еко визитка',
    'Визитки за бизнес'
  ],
  alternates: {
    canonical: 'https://www.ninjacardsnfc.com/',
    languages: {
      'bg-BG': 'https://www.ninjacardsnfc.com/',
    },
  },
};

export function generateStaticParams() {
  return (locales as readonly string[]).map((l) => ({ locale: l }));
}

export default async function LocaleLayout({
  children,
  params: { locale: paramLocale }
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(paramLocale as Locale);

  const isSupported = (locales as readonly string[]).includes(paramLocale);
  if (!isSupported) {
    notFound(); // will render the 404 page for /fr/...
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
      </head>
      <body className={`${inter.className} text-gray-200 antialiased`}>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=AW-11395955170"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-11395955170');
          `}
        </Script>

        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-950 to-black">
              <header className="sticky top-0 z-50 bg-gray-900 shadow-md">
                <Navbar />
              </header>
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
            <CookieBanner />
            <ClientLayoutWrapper />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}