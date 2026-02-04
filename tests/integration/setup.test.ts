import { describe, it, expect } from "vitest";

describe("Test Setup", () => {
  it("should have test environment variables configured", () => {
    expect(process.env.INGEST_API_KEY).toBe("test-ingest-api-key");
    expect(process.env.RESEND_API_KEY).toBe("re_test_api_key");
  });

  it("should be able to import fixtures", async () => {
    const { validResource, validSubmission } = await import("../mocks/fixtures");
    expect(validResource.title).toBe("Test Resource");
    expect(validSubmission.url).toBe("https://example.com/suggested-resource");
  });
});
