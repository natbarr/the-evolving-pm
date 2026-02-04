import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import {
  validIngestPayloadFlat,
  validIngestPayloadWrapper,
  validResource,
  createLargePayload,
} from "../../mocks/fixtures";

// Mock the Supabase client
const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createServiceClient: vi.fn(() => ({
    from: mockFrom,
  })),
}));

// Import after mocking
import { POST } from "@/app/api/ingest/route";

function createRequest(
  body: unknown,
  options: {
    apiKey?: string | null;
    contentLength?: number;
  } = {}
): NextRequest {
  const { apiKey = "test-ingest-api-key", contentLength } = options;
  const bodyString = typeof body === "string" ? body : JSON.stringify(body);

  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (apiKey !== null) {
    headers.set("X-API-Key", apiKey);
  }

  if (contentLength !== undefined) {
    headers.set("Content-Length", String(contentLength));
  } else {
    headers.set("Content-Length", String(bodyString.length));
  }

  return new NextRequest("http://localhost:4000/api/ingest", {
    method: "POST",
    headers,
    body: bodyString,
  });
}

describe("/api/ingest", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock chain setup
    mockFrom.mockReturnValue({
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
    });

    mockSelect.mockReturnValue({
      eq: mockEq,
    });

    mockEq.mockReturnValue({
      single: mockSingle,
    });

    mockUpdate.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: null, error: null }),
    });

    mockInsert.mockResolvedValue({ data: null, error: null });
    mockSingle.mockResolvedValue({ data: null, error: null });
  });

  describe("Authentication", () => {
    it("rejects requests without API key", async () => {
      const request = createRequest(validIngestPayloadFlat, { apiKey: null });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("rejects requests with invalid API key", async () => {
      const request = createRequest(validIngestPayloadFlat, {
        apiKey: "wrong-key",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("accepts requests with valid API key", async () => {
      const request = createRequest(validIngestPayloadFlat);
      const response = await POST(request);

      expect(response.status).toBe(200);
    });
  });

  describe("Payload Validation", () => {
    it("rejects invalid JSON", async () => {
      const request = createRequest("not valid json {{{");
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Bad Request");
      expect(data.message).toBe("Invalid JSON body");
    });

    it("rejects payload exceeding 1MB via content-length header", async () => {
      const request = createRequest(validIngestPayloadFlat, {
        contentLength: 2 * 1024 * 1024, // 2MB
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(413);
      expect(data.error).toBe("Payload Too Large");
    });

    it("rejects payload exceeding 1MB via actual body size", async () => {
      const largePayload = createLargePayload(1.5 * 1024 * 1024);
      const request = createRequest(largePayload);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(413);
      expect(data.error).toBe("Payload Too Large");
    });

    it("rejects empty resources array", async () => {
      const request = createRequest({
        evaluated_at: "2026-02-04",
        resources: [],
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Validation Error");
    });

    it("rejects resource with missing required fields", async () => {
      const request = createRequest({
        evaluated_at: "2026-02-04",
        resources: [{ title: "Incomplete" }],
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Validation Error");
      expect(data.details).toBeDefined();
    });

    it("rejects resource with invalid URL", async () => {
      const request = createRequest({
        evaluated_at: "2026-02-04",
        resources: [{ ...validResource, url: "not-a-url" }],
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Validation Error");
    });

    it("rejects resource with invalid category", async () => {
      const request = createRequest({
        evaluated_at: "2026-02-04",
        resources: [{ ...validResource, category: "invalid-category" }],
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Validation Error");
    });

    it("rejects resource with invalid level", async () => {
      const request = createRequest({
        evaluated_at: "2026-02-04",
        resources: [{ ...validResource, level: "master" }],
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Validation Error");
    });

    it("rejects confidence outside 1-5 range", async () => {
      const request = createRequest({
        evaluated_at: "2026-02-04",
        resources: [{ ...validResource, confidence: 10 }],
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Validation Error");
    });
  });

  describe("Payload Formats", () => {
    it("accepts flat format (evaluated_at)", async () => {
      const request = createRequest(validIngestPayloadFlat);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it("accepts wrapper format (metadata.assessment_date)", async () => {
      const request = createRequest(validIngestPayloadWrapper);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  describe("Resource Upsert", () => {
    it("inserts new resource when URL does not exist", async () => {
      mockSingle.mockResolvedValueOnce({ data: null, error: null });

      const request = createRequest(validIngestPayloadFlat);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.summary.inserted).toBe(1);
      expect(data.summary.updated).toBe(0);
      expect(mockInsert).toHaveBeenCalled();
    });

    it("updates existing resource when URL exists", async () => {
      mockSingle.mockResolvedValueOnce({ data: { id: "existing-id" }, error: null });
      const mockUpdateEq = vi.fn().mockResolvedValue({ data: null, error: null });
      mockUpdate.mockReturnValueOnce({ eq: mockUpdateEq });

      const request = createRequest(validIngestPayloadFlat);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.summary.updated).toBe(1);
      expect(data.summary.inserted).toBe(0);
      expect(mockUpdateEq).toHaveBeenCalledWith("id", "existing-id");
    });

    it("handles slug collision by appending timestamp", async () => {
      mockSingle.mockResolvedValueOnce({ data: null, error: null });
      mockInsert
        .mockResolvedValueOnce({
          data: null,
          error: { code: "23505", message: "duplicate key value violates unique constraint: slug" },
        })
        .mockResolvedValueOnce({ data: null, error: null });

      const request = createRequest(validIngestPayloadFlat);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.summary.inserted).toBe(1);
      expect(mockInsert).toHaveBeenCalledTimes(2);
    });

    it("processes multiple resources in a batch", async () => {
      const multiResourcePayload = {
        evaluated_at: "2026-02-04",
        resources: [
          { ...validResource, title: "Resource 1", url: "https://example.com/1" },
          { ...validResource, title: "Resource 2", url: "https://example.com/2" },
          { ...validResource, title: "Resource 3", url: "https://example.com/3" },
        ],
      };

      mockSingle.mockResolvedValue({ data: null, error: null });

      const request = createRequest(multiResourcePayload);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.summary.total).toBe(3);
      expect(data.summary.inserted).toBe(3);
    });
  });

  describe("Error Handling", () => {
    it("reports insert errors in results", async () => {
      mockSingle.mockResolvedValueOnce({ data: null, error: null });
      mockInsert.mockResolvedValueOnce({
        data: null,
        error: { message: "Database connection failed" },
      });

      const request = createRequest(validIngestPayloadFlat);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(false);
      expect(data.summary.errors).toBe(1);
      expect(data.results[0].status).toBe("error");
      expect(data.results[0].error).toBe("Database connection failed");
    });

    it("reports update errors in results", async () => {
      mockSingle.mockResolvedValueOnce({ data: { id: "existing-id" }, error: null });
      const mockUpdateEq = vi.fn().mockResolvedValue({
        data: null,
        error: { message: "Update failed" },
      });
      mockUpdate.mockReturnValueOnce({ eq: mockUpdateEq });

      const request = createRequest(validIngestPayloadFlat);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(false);
      expect(data.summary.errors).toBe(1);
      expect(data.results[0].status).toBe("error");
    });

    it("continues processing after individual resource errors", async () => {
      const multiResourcePayload = {
        evaluated_at: "2026-02-04",
        resources: [
          { ...validResource, title: "Resource 1", url: "https://example.com/1" },
          { ...validResource, title: "Resource 2", url: "https://example.com/2" },
        ],
      };

      mockSingle.mockResolvedValue({ data: null, error: null });
      mockInsert
        .mockResolvedValueOnce({ data: null, error: { message: "First failed" } })
        .mockResolvedValueOnce({ data: null, error: null });

      const request = createRequest(multiResourcePayload);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.summary.errors).toBe(1);
      expect(data.summary.inserted).toBe(1);
      expect(data.results).toHaveLength(2);
    });
  });

  describe("Response Format", () => {
    it("returns proper success response structure", async () => {
      mockSingle.mockResolvedValueOnce({ data: null, error: null });

      const request = createRequest(validIngestPayloadFlat);
      const response = await POST(request);
      const data = await response.json();

      expect(data).toMatchObject({
        success: true,
        summary: {
          total: 1,
          inserted: expect.any(Number),
          updated: expect.any(Number),
          errors: 0,
        },
        results: expect.arrayContaining([
          expect.objectContaining({
            url: validResource.url,
            status: expect.stringMatching(/inserted|updated/),
            slug: expect.any(String),
          }),
        ]),
      });
    });
  });
});
