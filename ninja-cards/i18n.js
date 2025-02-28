// File: i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
const i18n = createInstance();
i18n
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: false,
        fallbackLng: 'en',
        supportedLngs: ['en', 'bg', 'de'],
        interpolation: {
            escapeValue: false, // React already safes from XSS
        },
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
        react: {
            useSuspense: false, // Disable suspense to prevent loading issues
        },
    });

// Set as default instance
i18next.default = i18n;

export default i18n;
// i18n
//     .use(HttpApi)
//     .use(LanguageDetector)
//     .use(initReactI18next)
//     .init({
//         debug: false,
//         fallbackLng: 'en',
//         supportedLngs: ['en', 'bg', 'de'],
//         interpolation: {
//             escapeValue: false, // React already safes from XSS
//         },
//         backend: {
//             loadPath: '/locales/{{lng}}/{{ns}}.json',
//         },
//         react: {
//             useSuspense: false, // Disable suspense to prevent loading issues
//         },
//     });

// export default i18n;