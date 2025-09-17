'use client';

import { useTranslations } from 'next-intl';

export default function CookiePolicyPage() {
    const t = useTranslations('CookiePolicy');

    return (
        <div className="max-w-3xl mx-auto p-6 pt-36">
            <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
            <p className="mb-4">{t('intro')}</p>

            <h2 className="text-xl font-semibold mt-6 mb-2">{t('cookiesUsed.title')}</h2>
            <ul className="list-disc list-inside mb-4">
                <li>{t('cookiesUsed.session')}</li>
                <li>{t('cookiesUsed.analytics')}</li>
                <li>{t('cookiesUsed.marketing')}</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">{t('legalBasis.title')}</h2>
            <p className="mb-4">{t('legalBasis.text')}</p>

            <h2 className="text-xl font-semibold mt-6 mb-2">{t('control.title')}</h2>
            <p>{t('control.text')}</p>
        </div>
    );
}
