import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components + Partial Prefetching are the Next.js 16 defaults from
  // create-next-app. Together with `ensureStatic = "navigation"` in the root
  // layout, the build fails if any route starts rendering per request, so
  // every page of V0 is prerendered at build time. One exception: on the
  // dynamic timeline routes (/timeline/[id], /timeline/milestones/[group]),
  // an id that generateStaticParams did not return is rendered on the server
  // when requested under `next start`, and the page then returns 404.
  // (`dynamicParams = false` is not compatible with Cache Components; see
  // node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components.md.)
  // Whether a static export would avoid that server work has not been checked.
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
