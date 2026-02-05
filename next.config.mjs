import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // CORS is handled in middleware.ts for dynamic origin checking
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // Upload source maps for better stack traces
  // Requires SENTRY_AUTH_TOKEN environment variable
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  bundleSizeOptimizations: {
    excludeDebugStatements: true,
  },

  // Hides source maps from generated client bundles
  hideSourceMaps: true,
});
