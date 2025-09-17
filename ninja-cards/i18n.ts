// i18n.ts
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from './config';

export default getRequestConfig(async ({ locale, requestLocale }) => {
    // Old forced-locale kept for reference:
    // const forcedLocale: Locale = 'bg';

    // Prefer the path param; fall back to negotiated requestLocale only if missing
    const fromPath = typeof locale === 'string' ? locale : undefined;
    const negotiated = await requestLocale; // may be undefined or a best-guess (e.g. 'en')
    const candidate = fromPath ?? negotiated;

    // If the URL provided a locale (fromPath) and it's unsupported → 404
    if (fromPath && !(locales as readonly string[]).includes(fromPath)) {
        notFound();
    }

    // Otherwise validate the candidate (fromPath or negotiated)
    if (!candidate || !(locales as readonly string[]).includes(candidate)) {
        notFound();
    }

    const current = candidate as Locale;

    try {
        const messages = (await import(`./messages/${current}.json`)).default;
        return { locale: current, messages } as const;
    } catch (err) {
        console.error(`Missing messages for locale: ${current}`, err);
        notFound();
    }
});
