// components/JoinNowButton.tsx
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function JoinNowButton() {
    const t = useTranslations("BtnJoinNow");

    return (
        <div className="fixed bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 z-50 w-full px-4 md:px-0 md:w-auto">
            <Link
                href="/lp-1"
                className="group relative block w-full md:w-auto text-center px-6 md:px-8 py-3 md:py-4 rounded-full bg-gradient-to-r from-yellow-600 via-orange to-yellow-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-bold text-base md:text-lg shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 ease-out hover:scale-105 active:scale-95 overflow-hidden"
            >
                <span className="relative z-10 tracking-wide">{t("text")}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange via-yellow-600 to-orange opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
            </Link>
        </div>
    );
}
