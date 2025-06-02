import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "different-crab-73.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
