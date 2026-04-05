const DEFAULT_PUBLIC_SITE_URL = 'https://www.ninjacardsnfc.com';
const DEFAULT_APP_SITE_URL = 'https://app.ninjacardsnfc.com';

const normalizeBaseUrl = (value) => String(value || '').replace(/\/+$/, '');

const ensureAbsoluteUrl = (value, fallback) => {
    if (!value) return fallback;

    try {
        const normalizedValue = value.startsWith('http') ? value : `https://${value}`;
        return normalizeBaseUrl(new URL(normalizedValue).origin);
    } catch {
        return fallback;
    }
};

const normalizePath = (path = '') => {
    if (!path) return '';
    return path.startsWith('/') ? path : `/${path}`;
};

const getBaseApiUrl = () => {
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }

    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return ensureAbsoluteUrl(process.env.NEXT_PUBLIC_SITE_URL, DEFAULT_PUBLIC_SITE_URL);
    }

    if (process.env.FRONTEND_URL) {
        return ensureAbsoluteUrl(process.env.FRONTEND_URL, DEFAULT_PUBLIC_SITE_URL);
    }

    if (process.env.VERCEL_URL) {
        return ensureAbsoluteUrl(`https://${process.env.VERCEL_URL}`, DEFAULT_PUBLIC_SITE_URL);
    }

    return 'http://localhost:3000';
};

export const BASE_API_URL = getBaseApiUrl();
export const PUBLIC_SITE_URL = ensureAbsoluteUrl(
    process.env.NEXT_PUBLIC_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL,
    DEFAULT_PUBLIC_SITE_URL,
);
export const APP_SITE_URL = ensureAbsoluteUrl(
    process.env.NEXT_PUBLIC_APP_SITE_URL || DEFAULT_APP_SITE_URL,
    DEFAULT_APP_SITE_URL,
);

export const buildPublicUrl = (path = '') => `${PUBLIC_SITE_URL}${normalizePath(path)}`;
export const buildAppUrl = (path = '') => `${APP_SITE_URL}${normalizePath(path)}`;
export const buildPublicAssetUrl = (assetPath = '') => buildPublicUrl(assetPath);

/**
 * @param {{ locale?: string, slug?: string | null, userId?: string | null }} [params]
 */
export const buildPublicProfileUrl = ({ locale = 'bg', slug, userId } = {}) => {
    if (slug) {
        return buildPublicUrl(`/${locale}/p/${slug}`);
    }

    return buildPublicUrl(`/${locale}/profileDetails/${userId}`);
};
