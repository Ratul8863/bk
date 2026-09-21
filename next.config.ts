import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow quality={100} for brand/critical assets (Next defaults to [75] only).
    qualities: [75, 100],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 640],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "blogger.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  redirects: async () => [
    {
      source: "/activities/awareness-campaign",
      destination: "/activities/awareness-campaigns",
      permanent: true,
    },
    {
      source: "/activities/research-talk",
      destination: "/activities/research-talks",
      permanent: true,
    },
    {
      source: "/activities/innovation-showcasing",
      destination: "/activities",
      permanent: false,
    },
    {
      source: "/publications/blogs",
      destination: "/publications/opinions",
      permanent: true,
    },
  ],
};

export default nextConfig;
