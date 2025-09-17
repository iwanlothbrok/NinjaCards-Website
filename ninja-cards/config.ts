// config.ts
import { defineRouting } from 'next-intl/routing';

export const locales = ['bg', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'bg';

export const routing = defineRouting({
    locales,
    defaultLocale: 'bg',
    localePrefix: 'always',
    pathnames: {
        '/': '/',
        '/features': '/features',
        '/analyse': '/analyse',
        '/contact': '/contact',
        '/askedQuestions': '/askedQuestions',
        '/login': '/login',

        '/profile': '/profile',
        '/profile/settings': '/profile/settings',
        '/profile/changeEmail': '/profile/changeEmail',
        '/profile/changeAddress': '/profile/changeAddress',
        '/profile/changeImage': '/profile/changeImage',
        '/profile/information': '/profile/information',
        '/profile/links': '/profile/links',
        '/profile/preview': '/profile/preview',
        '/profile/profileQr': '/profile/profileQr',
        '/profile/video': '/profile/video',
        '/profile/changeLanguage': '/profile/changeLanguage',
        '/profile/help': '/profile/help',
        '/profile/subscribed': '/profile/subscribed',
        '/profile/features': '/profile/features',
        // '/profileDetails/[id]': '/profileDetails/[id]',

        '/products/cards': '/products/cards',
        '/products/reviews': '/products/reviews',
        '/products/all': '/products/all',
        '/privacy/PrivacyPolicy': '/privacy/PrivacyPolicy',
        // '/products/[type]/[id]': '/products/[type]/[id]',
        '/products/[type]/[id]': '/products/[type]/[id]',
        '/profileDetails/[id]': '/profileDetails/[id]',
    }
});
