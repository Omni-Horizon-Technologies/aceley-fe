import type { NextConfig } from "next";

const RAW_ADMIN_API =
  process.env.NEXT_PUBLIC_ADMIN_API_BASE ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://api.tryaceley.com";
const ADMIN_API_BASE = `${RAW_ADMIN_API.replace(/\/+$/, "")}/api/v1`;

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async rewrites() {
    return [
      {
        source: "/api/admin-proxy/:path*",
        destination: `${ADMIN_API_BASE}/:path*`,
      },
    ];
  },
};

export default nextConfig;
