import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A package-lock.json in the user's home folder would otherwise be picked as the workspace root.
  turbopack: { root: process.cwd() },
  images: {
    // Unsplash resizes on its CDN; see lib/image-loader.ts.
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
  },
  async headers() {
    return [
      {
        source: "/video/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
