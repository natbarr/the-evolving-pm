import * as Sentry from "@sentry/nextjs";

// Temporary route to test Sentry - DELETE after verification
export const dynamic = "force-dynamic";

export async function GET() {
  const client = Sentry.getClient();
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

  const error = new Error("Sentry test error from API route");
  const eventId = Sentry.captureException(error);
  await Sentry.flush(5000);

  return new Response(
    JSON.stringify({
      message: "Error sent to Sentry",
      eventId,
      dsnSet: !!dsn,
      dsnPreview: dsn ? dsn.substring(0, 30) + "..." : "not set",
      clientInitialized: !!client,
      nodeEnv: process.env.NODE_ENV,
    }, null, 2),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
