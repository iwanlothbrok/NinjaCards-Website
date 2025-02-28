// File: utils/i18n.ts
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

i18next.use(initReactI18next).init({
    fallbackLng: 'bg',
    lng: 'bg', // Default language
    supportedLngs: ['bg', 'en', 'de'],
    interpolation: {
        escapeValue: false,
    },
    react: {
        useSuspense: false,
    },
});

export default i18next;
