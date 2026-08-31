import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const nextConfig: NextConfig = {
  output: 'export',
  // No basePath needed since site will be served from root (username.github.io)
  images: {
    unoptimized: true,
    qualities: [75, 85],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
