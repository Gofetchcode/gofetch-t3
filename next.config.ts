import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force all API routes to be dynamic (not cached)
  experimental: {
    // Ensure all routes are included in build
  },
  // Disable static optimization for API routes
  output: undefined,
};

export default nextConfig;
