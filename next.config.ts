import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  env: {
    MAIL_ID: process.env.MAIL_ID,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  },
};

export default nextConfig;
