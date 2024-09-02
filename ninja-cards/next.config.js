/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    env: {
        NEXTAUTH_SECRET: 'your-secret-key', // Ensure this matches the secret used in your login API route
    },
    output: 'export',  // Add this line to enable static export
};

module.exports = nextConfig;
