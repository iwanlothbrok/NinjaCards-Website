import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from './components/Navigation';
import { AuthProvider } from './context/AuthContext';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Head from 'next/head';
import Script from 'next/script'; // ✅ Import `next/script`
import ChatlingWidget from './components/ChatlingWidget';
import Link from 'next/link';
import CookieBanner from './components/layout/CookieBanner';
import ClientLayoutWrapper from './components/layout/ClientLayoutWrapper';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Ninja Cards NFC | Смарт Визитки, NFC ревюта и NFC стикери',
  description: 'Ninja Cards предлага висококачествени NFC продукти, включително смарт визитки, Google ревюта и NFC стикери. Споделяйте контакти със стил.',
  openGraph: {
    type: 'website',
    url: 'https://www.ninjacardsnfc.com/',
    title: 'Ninja Cards NFC | Смарт Визитки, NFC ревюта, Google ревюта, смарт визитки и стикери',
    description: 'Ninja Cards предлага висококачествени NFC продукти, включително умни визитни картички, смарт визитки, NFC тагове за Google ревюта, Tripavisor ревюта и NFC стикери. Споделяйте контакти със стил.',
    siteName: 'Ninja Cards',
    locale: 'bg_BG',
  },
  keywords: [
    'NFC визиткa',
    'Смарт визитка',
    'Визитка',
    'Дигитална визитка',
    'Eлектронна визитка',
    'Безконтактна визитка',
    'Виртуална визитка',
    'Безконтактна визитка',
    'NFC карта за бизнес',
    'Професионална визитка',
    'Smart vizitki',
    'Digitalna vizitka',
    'NFC vizitka',
    'NFC визитни картички',
    'умни визитни картички',
    'Google рецензии NFC',
    'NFC стикери',
    'Смарт визитки',
    'Гугъл ревюта',
    'NFC продукти',
    'Визитки',
    'Развий бизнеса си',
    'Ninja Cards'
  ],
  alternates: {
    canonical: 'https://www.ninjacardsnfc.com/',
    languages: {
      'bg-BG': 'https://www.ninjacardsnfc.com/',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="bg">
      <Head>
        <meta name="google-site-verification" content="F0YLcxlz9-DNDYvBtQctoP9fkALenaCpKx-iiVhzx3c" />
      </Head>

      {/* ✅ Google Analytics & Google Ads (gtag.js) */}
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

      <body className={`${inter.className} text-gray-200 antialiased`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-950 to-black">
            <header className="sticky top-0 z-50 bg-gray-900 shadow-md transition-transform duration-300 ease-in-out">
              <Navbar />
            </header>
            <main className="flex-grow">{children}</main>
            <footer className="bg-gradient-to-t from-gray-900 via-gray-950 to-black text-center py-8">
              <p className="text-gray-200">
                © 2024-2025 Ninja Cards. Всички права са запазени.
              </p>
              <div className="mt-4 space-x-4 p-3">
                <Link href="/privacy/CookiePolicy" className="text-gray-400 hover:text-gray-200">
                  Политика за бисквитки
                </Link>

                <Link href="/privacy/TermsOfUse" className="text-gray-400 hover:text-gray-200">
                  Общи условия
                </Link>

                <Link href="/privacy/PrivacyPolicy" className="text-gray-400 hover:text-gray-200">
                  Политика за поверителност
                </Link>
              </div>
            </footer>

          </div>
        </AuthProvider>
        <CookieBanner />
        <ClientLayoutWrapper />

      </body>
    </html>
  );
}
