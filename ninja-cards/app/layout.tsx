import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from './components/Navigation';
import { AuthProvider } from './context/AuthContext';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Head from 'next/head';
import { Analytics } from "@vercel/analytics/react"

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
    'NFC визитни картички',
    'умни визитни картички',
    'Google рецензии NFC',
    'NFC стикери',
    'Смарт визитки',
    'Гугъл ревюта',
    'NFC продукти',
    'Визитки',
    'Развий бизнеса си',
    'Tripavisor',
    'Ревю',
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
      <body className={`${inter.className} text-gray-200 antialiased`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-950 to-black">
            {/* Conditionally render the Navbar */}
            <header className="sticky top-0 z-50 bg-gray-900 shadow-md transition-transform duration-300 ease-in-out">
              <Navbar />
            </header>
            <main className="flex-grow">{children}</main>
            <footer className="bg-gradient-to-t from-gray-900 via-gray-950 to-black text-center py-8">
              <p className="text-gray-200">
                © 2024 Ninja Cards.  Всички права са запазени.
              </p>
            </footer>
          </div>
          <Analytics />

        </AuthProvider>
      </body>
    </html>
  );
}
