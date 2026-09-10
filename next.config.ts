import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
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
      source: "/news-events",
      destination: "/news",
      permanent: true,
    },
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
  ],
};

export default nextConfig;
