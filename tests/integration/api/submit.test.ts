import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import {
  validSubmission,
  validSubmissionNoEmail,
  invalidSubmissionBadUrl,
  invalidSubmissionBadEmail,
} from "../../mocks/fixtures";

// Mock Resend
const mockSend = vi.fn();
vi.mock("resend", () => ({
  Resend: class MockResend {
    emails = {
      send: mockSend,
    };
  },
}));

// Import after mocking
import { POST } from "@/app/api/submit/route";

const TEST_SUBMISSIONS_DIR = path.join(process.cwd(), "submissions");

function createRequest(body: unknown): NextRequest {
  const bodyString = typeof body === "string" ? body : JSON.stringify(body);

  return new NextRequest("http://localhost:4000/api/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": String(bodyString.length),
    },
    body: bodyString,
  });
}

describe("/api/submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSend.mockResolvedValue({ data: { id: "mock-email-id" }, error: null });
  });

  afterEach(async () => {
    // Clean up test submission files
    try {
      const files = await fs.readdir(TEST_SUBMISSIONS_DIR);
      for (const file of files) {
        if (file.endsWith(".json") && file !== ".gitkeep") {
          await fs.unlink(path.join(TEST_SUBMISSIONS_DIR, file));
        }
      }
    } catch {
      // Directory might not exist
    }
  });

  describe("Validation", () => {
    it("rejects invalid JSON body", async () => {
      const request = createRequest("not valid json");
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Bad Request");
      expect(data.message).toBe("Invalid JSON body");
    });

    it("rejects submission with invalid URL", async () => {
      const request = createRequest(invalidSubmissionBadUrl);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Validation Error");
      expect(data.details.fieldErrors.url).toBeDefined();
    });

    it("rejects submission with invalid email", async () => {
      const request = createRequest(invalidSubmissionBadEmail);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Validation Error");
      expect(data.details.fieldErrors.email).toBeDefined();
    });

    it("rejects submission with missing URL", async () => {
      const request = createRequest({ email: "test@example.com" });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Validation Error");
    });

    it("rejects context exceeding 1000 characters", async () => {
      const request = createRequest({
        url: "https://example.com/resource",
        context: "x".repeat(1001),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Validation Error");
      expect(data.details.fieldErrors.context).toBeDefined();
    });

    it("accepts submission without email", async () => {
      const request = createRequest(validSubmissionNoEmail);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it("accepts submission with empty email string", async () => {
      const request = createRequest({
        url: "https://example.com/resource",
        email: "",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  describe("JSON File Storage", () => {
    it("creates submission file with correct date", async () => {
      const request = createRequest(validSubmission);
      await POST(request);

      const today = new Date().toISOString().split("T")[0];
      const filePath = path.join(TEST_SUBMISSIONS_DIR, `${today}.json`);

      const fileExists = await fs
        .access(filePath)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).toBe(true);
    });

    it("stores submission with correct structure", async () => {
      const request = createRequest(validSubmission);
      await POST(request);

      const today = new Date().toISOString().split("T")[0];
      const filePath = path.join(TEST_SUBMISSIONS_DIR, `${today}.json`);
      const content = JSON.parse(await fs.readFile(filePath, "utf-8"));

      expect(content).toHaveLength(1);
      expect(content[0]).toMatchObject({
        url: validSubmission.url,
        email: validSubmission.email,
        context: validSubmission.context,
        submitted_at: expect.any(String),
      });
    });

    it("appends to existing file for same day", async () => {
      const request1 = createRequest(validSubmission);
      const request2 = createRequest({
        url: "https://example.com/another-resource",
        email: "another@example.com",
      });

      await POST(request1);
      await POST(request2);

      const today = new Date().toISOString().split("T")[0];
      const filePath = path.join(TEST_SUBMISSIONS_DIR, `${today}.json`);
      const content = JSON.parse(await fs.readFile(filePath, "utf-8"));

      expect(content).toHaveLength(2);
      expect(content[0].url).toBe(validSubmission.url);
      expect(content[1].url).toBe("https://example.com/another-resource");
    });

    it("stores null for missing optional fields", async () => {
      const request = createRequest({ url: "https://example.com/minimal" });
      await POST(request);

      const today = new Date().toISOString().split("T")[0];
      const filePath = path.join(TEST_SUBMISSIONS_DIR, `${today}.json`);
      const content = JSON.parse(await fs.readFile(filePath, "utf-8"));

      expect(content[0].email).toBeNull();
      expect(content[0].context).toBeNull();
    });
  });

  describe("Email Sending", () => {
    it("sends confirmation email when email is provided", async () => {
      const request = createRequest(validSubmission);
      await POST(request);

      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          to: validSubmission.email,
          subject: "We received your resource submission",
        })
      );
    });

    it("includes submitted URL in email body", async () => {
      const request = createRequest(validSubmission);
      await POST(request);

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining(validSubmission.url),
        })
      );
    });

    it("does not send email when no email provided", async () => {
      const request = createRequest(validSubmissionNoEmail);
      await POST(request);

      expect(mockSend).not.toHaveBeenCalled();
    });

    it("does not send email when email is empty string", async () => {
      const request = createRequest({
        url: "https://example.com/resource",
        email: "",
      });
      await POST(request);

      expect(mockSend).not.toHaveBeenCalled();
    });

    it("succeeds even if email sending fails", async () => {
      mockSend.mockRejectedValueOnce(new Error("Email service down"));

      const request = createRequest(validSubmission);
      const response = await POST(request);
      const data = await response.json();

      // Should still succeed - email failure is logged but doesn't fail the request
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it("uses configured FROM address", async () => {
      const request = createRequest(validSubmission);
      await POST(request);

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: process.env.EMAIL_FROM,
        })
      );
    });
  });

  describe("Response Format", () => {
    it("returns success response with message", async () => {
      const request = createRequest(validSubmission);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toMatchObject({
        success: true,
        message: expect.stringContaining("Thank you"),
      });
    });
  });
});
