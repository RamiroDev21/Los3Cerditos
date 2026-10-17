import type { NextConfig } from "next";

/**
 * GitHub Pages serves the site from https://<user>.github.io/Los3Cerditos/, so the
 * deploy workflow builds a static export with PAGES_BASE_PATH=/Los3Cerditos.
 * Locally (npm run dev / build) it stays empty and the site lives at the root.
 */
const basePath = process.env.PAGES_BASE_PATH ?? "";
const isPagesBuild = basePath !== "" || process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  // A package-lock.json in the user's home folder would otherwise be picked as the workspace root.
  turbopack: { root: process.cwd() },
  basePath,
  // Files in /public referenced by hand (logo, video) need the same prefix; see lib/asset.ts.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  ...(isPagesBuild ? { output: "export" as const, trailingSlash: true } : {}),
  images: {
    // Unsplash resizes on its CDN; see lib/image-loader.ts.
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
  },
  // Custom headers only exist on a Node server; a static export has none.
  ...(isPagesBuild
    ? {}
    : {
        async headers() {
          return [
            {
              source: "/video/:path*",
              headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
            },
          ];
        },
      }),
};

export default nextConfig;
