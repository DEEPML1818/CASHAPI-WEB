import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['mainnet-js'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Mock Node.js modules that mainnet-js or its dependencies (like pg-format) might try to use
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        path: false,
        http: false,
        https: false,
        zlib: false,
      };
    }
    return config;
  },
};

export default nextConfig;
