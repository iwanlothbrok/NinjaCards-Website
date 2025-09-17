'use client';

import { useTranslations } from 'next-intl';

export default function PrivacyPolicyPage() {
    const t = useTranslations('PrivacyPolicy');

    return (
        <div className="max-w-3xl mx-auto p-6 pt-36">
            <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
            <p className="mb-4">{t('lastUpdated')}</p>
            <p className="mb-6">{t('intro')}</p>

            <ol className="list-decimal list-inside space-y-4 text-gray-300">
                <li>
                    <strong>{t('sections.admin.title')}</strong>
                    <br />
                    {t('sections.admin.content')}
                </li>

                <li>
                    <strong>{t('sections.dataCollected.title')}</strong>
                    <ul className="list-disc list-inside mt-2">
                        {t.raw('sections.dataCollected.items').map((item: string, idx: number) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </li>

                <li>
                    <strong>{t('sections.legalBasis.title')}</strong>
                    <br />
                    {t('sections.legalBasis.content')}
                </li>

                <li>
                    <strong>{t('sections.purpose.title')}</strong>
                    <ul className="list-disc list-inside mt-2">
                        {t.raw('sections.purpose.items').map((item: string, idx: number) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </li>

                <li>
                    <strong>{t('sections.storage.title')}</strong>
                    <br />
                    {t('sections.storage.content')}
                </li>

                <li>
                    <strong>{t('sections.recipients.title')}</strong>
                    <br />
                    {t('sections.recipients.content')}
                </li>

                <li>
                    <strong>{t('sections.rights.title')}</strong>
                    <ul className="list-disc list-inside mt-2">
                        {t.raw('sections.rights.items').map((item: string, idx: number) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </li>

                <li>
                    <strong>{t('sections.contact.title')}</strong>
                    <br />
                    {t('sections.contact.content')}
                </li>
            </ol>
        </div>
    );
}
