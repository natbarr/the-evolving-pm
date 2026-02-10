import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { promises as fs } from "fs";
import path from "path";

const SubmissionSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  context: z.string().max(1000, "Context must be 1000 characters or less").optional(),
});

interface Submission {
  url: string;
  email: string | null;
  context: string | null;
  submitted_at: string;
}

async function appendToJsonFile(submission: Submission): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  const submissionsDir = path.join(process.cwd(), "submissions");
  const filePath = path.join(submissionsDir, `${today}.json`);

  // Ensure directory exists
  await fs.mkdir(submissionsDir, { recursive: true });

  let submissions: Submission[] = [];

  // Read existing file if it exists
  try {
    const existingContent = await fs.readFile(filePath, "utf-8");
    submissions = JSON.parse(existingContent);
  } catch {
    // File doesn't exist yet, start with empty array
  }

  // Append new submission
  submissions.push(submission);

  // Write back to file
  await fs.writeFile(filePath, JSON.stringify(submissions, null, 2), "utf-8");
}

function isTestDomain(urlOrEmail: string): boolean {
  try {
    const host = urlOrEmail.includes("@")
      ? urlOrEmail.split("@")[1]
      : new URL(urlOrEmail).hostname;
    return host === "example.com" || host.endsWith(".example.com");
  } catch {
    return false;
  }
}

async function sendConfirmationEmail(email: string, url: string): Promise<void> {
  // Skip sending emails to test domains (RFC 2606 reserved)
  if (isTestDomain(email) || isTestDomain(url)) {
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY not configured");
  }

  const resend = new Resend(apiKey);
  const fromAddress = process.env.EMAIL_FROM || "The Evolving PM <noreply@theevolvingpm.com>";

  await resend.emails.send({
    from: fromAddress,
    to: email,
    subject: "We received your resource submission",
    html: `
      <p>Thank you for submitting a resource to The Evolving PM!</p>
      <p><strong>URL submitted:</strong> <a href="${url}">${url}</a></p>
      <p>We review every submission and will add it to the library if it's a good fit for Product Managers learning about AI.</p>
      <p>You don't need to do anything else - we'll take it from here.</p>
      <br>
      <p>Best,<br>The Evolving PM Team</p>
    `,
  });
}

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

  const submission: Submission = {
    url,
    email: email || null,
    context: context || null,
    submitted_at: new Date().toISOString(),
  };

  try {
    // Save to local JSON file
    await appendToJsonFile(submission);

    // Send confirmation email if email was provided
    if (email) {
      try {
        await sendConfirmationEmail(email, url);
      } catch (emailError) {
        // Log but don't fail the submission if email fails
        console.error("Failed to send confirmation email:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your submission! We'll review it soon.",
    });
  } catch (error) {
    console.error("Error saving submission:", error);
    return NextResponse.json(
      { error: "Server Error", message: "Failed to save submission" },
      { status: 500 }
    );
  }
}
