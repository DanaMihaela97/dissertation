import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   env: {
      GATEWAY_API_URL: process.env.GATEWAY_API_URL,
   },
   outputDir: "standalone",
};

export default nextConfig;
