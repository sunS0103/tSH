import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  // Static export = zero serverless functions (stays under Vercel Hobby 12 limit)
  output: "export",
};

export default nextConfig;
