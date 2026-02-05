// Temporary route to test Sentry - DELETE after verification
export const dynamic = "force-dynamic";

export async function GET() {
  // This will be caught by Sentry
  throw new Error("Sentry test error from API route");
}
