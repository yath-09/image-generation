/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'v3.fal.media',
                port: '',
                pathname: '/files/**',
            },
        ],
    },
};

export default nextConfig;
