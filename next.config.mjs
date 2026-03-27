/** @type {import('next').NextConfig} */
// Force rebuild v15.2
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ggtmfotwkbjtquuwhjhl.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
    // If the user wants to avoid strict domain list for dev, we can set unoptimized: true
    // but whitelisting is the professional production way
  },
};

export default nextConfig;
