import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts'); // ✅ correct

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
    },
    env: {
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    },
    images: {
        loader: 'default',
        domains: [],
        unoptimized: false,
    },

};

export default withNextIntl(nextConfig);
