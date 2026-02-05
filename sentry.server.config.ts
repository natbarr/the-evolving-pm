import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust sample rate in production (1.0 = 100% of errors)
  tracesSampleRate: 1.0,

  // Enable in all environments for now (to debug)
  enabled: true,

  // Enable debug to see what's happening
  debug: true,
});
