/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    env: {
        NEXTAUTH_SECRET: 'your-secret-key', // Ensure this matches the secret used in your login API route
    },
};

module.exports = nextConfig;
