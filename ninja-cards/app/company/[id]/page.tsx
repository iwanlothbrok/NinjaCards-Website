// /app/company/[id]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { BASE_API_URL } from '@/utils/constants';
import { useRouter } from 'next/navigation';

export default function CompanyReviewPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [googleReviewLink, setGoogleReviewLink] = useState<string | null>(null);
    const { id } = params;

    useEffect(() => {
        if (!id) return;
        setTimeout(() => console.log("Third"), 12000)
        const fetchCompanyData = async () => {
            try {
                const response = await fetch(`${BASE_API_URL}/api/company/${id}`);
                if (!response.ok) throw new Error("Failed to fetch company data");

                const company = await response.json();
                setGoogleReviewLink(company.googleReviewLink);
            } catch (error) {
                console.error("Error fetching company data:", error);
            }
        };

        fetchCompanyData();
    }, [id]);

    useEffect(() => {
        if (googleReviewLink) {
            router.push(googleReviewLink);
        }
    }, [googleReviewLink, router]);

    return (
        <div className="flex items-center justify-center px-5 min-h-screen bg-gradient-to-b from-black to-darkOrange">
            <motion.div
                className="text-center space-y-6 p-8 px-5 bg-white rounded-lg shadow-lg "
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <Image
                    src="/navlogo.png"
                    alt="Company Logo"
                    width={96}
                    height={96}
                    className="mx-auto mb-4"
                />
                <motion.h1
                    className="text-3xl font-bold text-gray-800"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    Ninja Cards Google Отзиви
                </motion.h1>
                <motion.p
                    className="text-lg text-gray-600"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    Пренасочване към Google Отзиви...
                </motion.p>
                <motion.div
                    className="flex justify-center mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                </motion.div>
            </motion.div>
        </div>
    );
}
