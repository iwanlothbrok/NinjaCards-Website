/** @type {import('next').NextConfig} */
const isCPanelBuild = process.env.CPANEL_BUILD === 'true'; // Check if you're building for CPanel

const nextConfig = {
    experimental: {
        appDir: true, // Optional, depending on your setup
    },
    env: {
        NEXTAUTH_SECRET: 'your-secret-key', // Ensure this is handled securely
    },
    images: {
        // Ensure the default image loader is being used, no external domains are needed for local images
        loader: 'default',
        domains: [], // Ensure this is empty unless you're serving images from external sources
        unoptimized: isCPanelBuild, // Disable image optimization for CPanel builds (static exports)
    },
    assetPrefix: isCPanelBuild ? '' : undefined, // For CPanel builds, ensure no assetPrefix
    ...(isCPanelBuild ? { output: 'export' } : {}) // Only enable static export for CPanel
};

module.exports = nextConfig;
