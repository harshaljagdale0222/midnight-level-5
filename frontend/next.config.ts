import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: ['127.0.0.1', '127.0.0.2', 'localhost:3000'],
} as any;

export default nextConfig;
