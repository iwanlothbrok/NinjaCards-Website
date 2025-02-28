/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');
const isCPanelBuild = process.env.CPANEL_BUILD === 'true';

const nextConfig = {
    experimental: {
        appDir: true,
    },
    env: {
        NEXTAUTH_SECRET: 'your-secret-key',
    },
    images: {
        loader: 'default',
        domains: [], // No external domains needed
        unoptimized: isCPanelBuild, // Disable optimization for CPanel
    },
    assetPrefix: isCPanelBuild ? '' : undefined,
    ...(isCPanelBuild ? { output: 'export' } : {}),
    i18n,
};

module.exports = nextConfig;
