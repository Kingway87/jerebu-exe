import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components + Partial Prefetching are the Next.js 16 defaults from
  // create-next-app. Together with `ensureStatic = "navigation"` in the root
  // layout, the build fails if any route starts rendering per request, which
  // keeps V0 a fully static site.
  cacheComponents: true,
  partialPrefetching: true,
  // Cache lifetimes for the live evidence page (Experiment 003), in seconds.
  // Each source is fetched at build time, then again in the background when
  // a request arrives after `revalidate`; after `expire` without requests the
  // next request waits for a fresh fetch. These timings bound how often the
  // site contacts each source. They are not freshness labels: those come from
  // the observation times (see src/lib/live/freshness.ts). Every profile keeps
  // `stale` at 30 s or more and `expire` at 5 min or more, which
  // `ensureStatic = "navigation"` requires for content to stay prerendered.
  cacheLife: {
    // data.gov.sg PSI and PM2.5: NEA updates these hourly.
    liveHourly: { stale: 300, revalidate: 900, expire: 7200 },
    // data.gov.sg wind and rainfall: readings every few minutes.
    liveWeather: { stale: 300, revalidate: 600, expire: 3600 },
    // NASA FIRMS: new detections arrive after each satellite overpass.
    liveSatellite: { stale: 300, revalidate: 1800, expire: 10800 },
    // data.gov.my MET Malaysia forecast: updated daily; 4 requests a minute allowed.
    liveForecast: { stale: 300, revalidate: 3600, expire: 21600 },
    // Any source that just failed: try again sooner.
    liveRetry: { stale: 60, revalidate: 120, expire: 600 },
  },
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
