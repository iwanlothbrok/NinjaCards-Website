'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_API_URL } from '@/utils/constants';
import { useTranslations } from 'next-intl';
import { clearCart } from '@/lib/cart';
export default function SuccessPage() {
    const router = useRouter();
    const params = useSearchParams();
    const sessionId = params?.get('session_id');
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const t = useTranslations("SuccessPage");


    useEffect(() => {
        clearCart(); // Clear the cart on successful payment
    }, []);
    useEffect(() => {
        if (!sessionId) return;

        (async () => {
            try {
                const { data } = await axios.get(`${BASE_API_URL}/api/payments/session-user?session_id=${encodeURIComponent(sessionId)}`);
                const id = data?.userId;
                if (!id) throw new Error("Missing userId");
                setUserId(id);
            } catch (e: any) {
                setError(e?.message ?? t('failedToContinue'));
                // setTimeout(() => router.replace('/'), 5000);
            }
        })();
    }, [sessionId, router, t]);

    const handleFinishProfile = () => {
        if (userId) {
            router.push(`/finishProfile/${userId}`);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20 px-4">
            {/* Animated background gradient */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange/15 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-500" />
            </div>

            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12 space-y-6">
                    <div className="inline-block">
                        <div className="text-5xl md:text-7xl font-black bg-gradient-to-r from-amber-200 via-amber-400 to-orange bg-clip-text text-transparent mb-6 tracking-tighter leading-tight">
                            {t('title')}
                        </div>
                    </div>

                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                        {t('description')}
                    </p>
                </div>

                {/* Information Section */}
                <div className="mb-12 relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-orange/20 rounded-2xl blur-2xl opacity-50" />
                    <div className="relative bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-2xl border border-amber-500/30 rounded-2xl p-8 space-y-4">
                        <div className="text-gray-200 text-base md:text-lg whitespace-pre-line font-light leading-relaxed">
                            {t('informationText')}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/30 via-orange/20 to-amber-600/30 rounded-2xl blur-3xl opacity-60" />
                    <div className="relative bg-gradient-to-br from-gray-900/70 to-black/70 backdrop-blur-2xl border border-amber-500/40 rounded-2xl p-10 text-center space-y-8">
                        {error ? (
                            <div className="space-y-6 py-6">
                                <p className="text-xl text-red-400/90 font-semibold">{error}</p>
                                <button
                                    onClick={() => router.push('/')}
                                    className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 text-base"
                                >
                                    {t('errorMessage')}
                                </button>
                            </div>
                        ) : (
                            <>
                                <p className="text-xl text-gray-100 font-light leading-relaxed">
                                    {t('subtitle')}
                                </p>
                                {userId && (
                                    <button
                                        onClick={handleFinishProfile}
                                        className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-amber-300 via-amber-400 to-orange text-gray-950 font-black rounded-xl shadow-2xl hover:shadow-amber-400/60 hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-3 text-lg group fixed bottom-0 left-0 right-0 md:relative md:bottom-auto md:left-auto md:right-auto md:rounded-xl"
                                    >
                                        <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        {t('finishButton')}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
                {userId && <div className="md:hidden h-20" />}
            </div>
        </div>
    );
}
