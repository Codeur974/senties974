import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose"], // Au lieu de experimental.serverComponentsExternalPackages
};

export default nextConfig;
