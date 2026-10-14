import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components + Partial Prefetching are the Next.js 16 defaults from
  // create-next-app. Together with `ensureStatic = "navigation"` in the root
  // layout, the build fails if any route starts rendering per request, which
  // keeps V0 a fully static site.
  cacheComponents: true,
  partialPrefetching: true,
  // Do not advertise the framework in response headers.
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
