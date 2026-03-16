import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@destination-future/core",
    "@destination-future/ui",
    "@destination-future/prompts",
    "@destination-future/config",
  ],
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "recharts",
      "@react-three/drei",
    ],
  },
};

export default nextConfig;
