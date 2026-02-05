import { NextResponse } from "next/server";

// Temporary route to test Sentry - DELETE after verification
export async function GET() {
  throw new Error("Sentry test error from API route");
  return NextResponse.json({ ok: true });
}
