import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["motion", "lucide-react", "radix-ui"],
  experimental: {
    optimizePackageImports: ["lucide-react", "radix-ui", "motion/react"],
  }
};

export default nextConfig;
