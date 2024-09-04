/** @type {import('next').NextConfig} */
const isCPanelBuild = process.env.CPANEL_BUILD === 'true'; // Check if you're building for CPanel

const nextConfig = {
    // Enable the static export feature for cPanel builds
    ...(isCPanelBuild ? { output: 'export' } : {}),

    // Optional: Enable experimental features if required
    experimental: {
        appDir: true, // Optional, depending on your setup
    },

    // Add any environment variables, including security-sensitive data
    env: {
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your-secret-key', // Ensure this is handled securely
    },

    // Optional: Add trailing slashes to all routes for compatibility with cPanel static hosting
    trailingSlash: true,
};

module.exports = nextConfig;
