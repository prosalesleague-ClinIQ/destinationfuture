import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@destination-future/core",
    "@destination-future/ui",
    "@destination-future/prompts",
    "@destination-future/config",
  ],
};

export default nextConfig;
