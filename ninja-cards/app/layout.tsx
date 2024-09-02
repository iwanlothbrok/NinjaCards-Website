import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from './components/Navigation';
import { AuthProvider } from './context/AuthContext';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Ninja Cards NFC | Умни визитни картички, Google рецензии и стикери',
  description: 'Ninja Cards предлага висококачествени NFC продукти, включително умни визитни картички, тагове за Google рецензии и NFC стикери. Повишете вашия бранд с иновативни технологии.',
  openGraph: {
    type: 'website',
    url: 'https://www.ninjacardsnfc.com/',
    title: 'Ninja Cards NFC | Умни визитни картички, Google рецензии и стикери',
    description: 'Ninja Cards предлага висококачествени NFC продукти, включително умни визитни картички, тагове за Google рецензии и NFC стикери. Повишете вашия бранд с иновативни технологии.',
    images: [
      {
        url: 'https://www.ninjacardsnfc.com/images/ninja-cards-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Ninja Cards NFC продукти',
      },
    ],
    siteName: 'Ninja Cards',
    locale: 'bg_BG',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ninjacards',
    title: 'Ninja Cards NFC | Умни визитни картички, Google рецензии и стикери',
    description: 'Ninja Cards предлага висококачествени NFC продукти, включително умни визитни картички, тагове за Google рецензии и NFC стикери. Повишете вашия бранд с иновативни технологии.',
    images: ['https://www.ninjacardsnfc.com/images/ninja-cards-og.jpg'],
  },
  keywords: [
    'NFC визитни картички',
    'умни визитни картички',
    'Google рецензии NFC',
    'NFC стикери',
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
      <body className={`${inter.className} text-gray-200 antialiased`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-950 to-black">
            <header className="sticky top-0 z-50 bg-gray-900 shadow-md transition-transform duration-300 ease-in-out">
              <Navbar />
            </header>
            <main className="flex-grow">{children}</main>
            <footer className="bg-gradient-to-t from-gray-900 via-gray-950 to-black text-center py-8">
              <p className="text-gray-200">
                © 2024 Ninja NFC Cards. All rights reserved.
              </p>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
