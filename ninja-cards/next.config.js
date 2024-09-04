/** @type {import('next').NextConfig} */
const isCPanelBuild = process.env.CPANEL_BUILD === 'true'; // Check if you're building for CPanel

const nextConfig = {
    experimental: {
        appDir: true, // Optional, depending on your setup
    },
    env: {
        NEXTAUTH_SECRET: 'your-secret-key', // Ensure this is handled securely
    },
    ...(isCPanelBuild ? { output: 'export' } : {}) // Only enable static export for CPanel
};

module.exports = nextConfig;
