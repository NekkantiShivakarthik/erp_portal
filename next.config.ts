import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  generateBuildId: async () => {
    // Generate a unique build ID to force cache invalidation
    return `build-${Date.now()}`;
  },
};

export default nextConfig;
