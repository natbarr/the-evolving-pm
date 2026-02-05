import * as Sentry from "@sentry/nextjs";

// Temporary route to test Sentry - DELETE after verification
export const dynamic = "force-dynamic";

export async function GET() {
  const error = new Error("Sentry test error from API route");
  Sentry.captureException(error);
  await Sentry.flush(2000); // Wait for Sentry to send
  return new Response(
    JSON.stringify({
      message: "Error sent to Sentry",
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN ? "DSN is set" : "DSN is NOT set"
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
