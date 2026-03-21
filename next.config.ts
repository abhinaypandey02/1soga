import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents:true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "qikink-assets.s3.ap-south-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
