import { useTranslations } from 'next-intl';
import React from 'react'


export default function Footer() {

    const t = useTranslations("Footer");

    return (
        <footer className="bg-gradient-to-t from-gray-900 via-gray-950 to-black text-center py-8">

            <p className="text-gray-400 text-sm">
                © 2025 <span className="font-semibold text-white">Ninja Cards</span>.{" "}
                {t("rights")}
            </p>
        </footer>
    )
}