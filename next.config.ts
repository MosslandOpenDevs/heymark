import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    sassOptions: {
        includePaths: ["./src"],
    },
};

export default nextConfig;
