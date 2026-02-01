import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const SubmissionSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  context: z.string().max(1000, "Context must be 1000 characters or less").optional(),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Bad Request", message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parseResult = SubmissionSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json(
      {
        error: "Validation Error",
        message: "Invalid submission",
        details: parseResult.error.flatten(),
      },
      { status: 400 }
    );
  }

  const { url, email, context } = parseResult.data;
  const supabase = await createClient();

  const { error } = await supabase.from("submissions").insert({
    url,
    submitted_by_email: email || null,
    context: context || null,
    status: "pending",
  } as never);

  if (error) {
    console.error("Error saving submission:", error);
    return NextResponse.json(
      { error: "Server Error", message: "Failed to save submission" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Thank you for your submission! We'll review it soon.",
  });
}
