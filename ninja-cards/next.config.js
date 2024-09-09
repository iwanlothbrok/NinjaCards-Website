/** @type {import('next').NextConfig} */
const isCPanelBuild = process.env.CPANEL_BUILD === 'true';

const nextConfig = {
    experimental: {
        appDir: true,
    },
    images: {
        loader: 'default',
        domains: [], // No external domains needed
        unoptimized: isCPanelBuild, // Disable optimization for CPanel
    },
    assetPrefix: isCPanelBuild ? '' : undefined,
    ...(isCPanelBuild ? { output: 'export' } : {}),
};

module.exports = nextConfig;
