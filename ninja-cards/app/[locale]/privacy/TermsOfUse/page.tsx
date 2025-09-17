'use client';

import { useTranslations } from 'next-intl';

export default function TermsOfUsePage() {
    const t = useTranslations('TermsOfUse');

    return (
        <div className="max-w-3xl mx-auto p-6 pt-36">
            <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
            <ol className="list-decimal list-inside space-y-4 text-gray-300">
                {t.raw('sections').map((section: { title: string; content: string }, idx: number) => (
                    <li key={idx}>
                        <strong>{section.title}</strong>
                        <br />
                        {section.content}
                    </li>
                ))}
            </ol>
        </div>
    );
}
