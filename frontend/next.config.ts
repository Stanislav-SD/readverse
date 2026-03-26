import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  eslint: {
    // Warning: This allows production builds to successfully complete 
    // even if your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Dangerously allow production builds to successfully complete 
    // even if your project has type errors.
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ebayimg.com',
        port: '', // Leave empty if no port is used
        pathname: '/images/g/**', // Matches images in the `/images/g/` path
      },
      {
        protocol: 'https',
        hostname: 'covers.openlibrary.org',
        port: '', // Leave empty if no port is used
        pathname: '**', // Matches images in the `/images/g/` path
      },
      {
        protocol: 'https',
        hostname: 'cdn.thestorygraph.com',
        port: '', // Leave empty if no port is used
        pathname: '**', // Matches images in the `/images/g/` path
      },
      {
        protocol: 'https',
        hostname: 'images-na.ssl-images-amazon.com',
        port: '', // Leave empty if no port is used
        pathname: '**', // Matches images in the `/images/g/` path
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '', // Leave empty if no port is used
        pathname: '**', // Matches images in the `/images/g/` path
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: "http://127.0.0.1:3004/:path*",
      },
    ];
  },
};

export default nextConfig;
