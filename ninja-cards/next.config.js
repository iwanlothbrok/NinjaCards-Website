/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true, // Optional: Use if needed and supported by your Next.js version
    },
    env: {
        NEXTAUTH_SECRET: 'your-secret-key',
    }
};

module.exports = nextConfig;
