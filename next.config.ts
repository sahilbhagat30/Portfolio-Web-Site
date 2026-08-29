import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = "Portfolio-Web-Site";

const nextConfig: NextConfig = {
  output: 'export',
  // Required for GitHub Pages: site is served from /Portfolio-Web-Site/
  basePath: isProd ? `/${repoName}` : "",
  assetPrefix: isProd ? `/${repoName}/` : "",
  images: {
    unoptimized: true,
    qualities: [75, 85],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
