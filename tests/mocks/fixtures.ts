// Valid resource for ingest testing
export const validResource = {
  title: "Test Resource",
  url: "https://example.com/test-resource",
  category: "ai-fundamentals",
  level: "beginner",
  format: "article",
  content_type: "conceptual",
  summary: "A test resource for unit testing",
  status: "active",
  access_type: "free",
  confidence: 4,
};

// Valid ingest payload (flat format)
export const validIngestPayloadFlat = {
  evaluated_at: "2026-02-04",
  resources: [validResource],
};

// Valid ingest payload (metadata wrapper format)
export const validIngestPayloadWrapper = {
  metadata: {
    schema_version: "1.0",
    assessment_date: "2026-02-04",
    notes: "Test batch",
  },
  resources: [validResource],
  rejected: [],
};

// Invalid resource (missing required fields)
export const invalidResource = {
  title: "Incomplete Resource",
  // missing url, category, level, etc.
};

// Valid submission
export const validSubmission = {
  url: "https://example.com/suggested-resource",
  email: "user@example.com",
  context: "This is a great resource about AI product management",
};

// Valid submission without email
export const validSubmissionNoEmail = {
  url: "https://example.com/suggested-resource",
  context: "This is a great resource",
};

// Invalid submission (bad URL)
export const invalidSubmissionBadUrl = {
  url: "not-a-valid-url",
  email: "user@example.com",
};

// Invalid submission (bad email)
export const invalidSubmissionBadEmail = {
  url: "https://example.com/resource",
  email: "not-an-email",
};

// Large payload for size limit testing
export function createLargePayload(sizeInBytes: number): string {
  const padding = "x".repeat(sizeInBytes);
  return JSON.stringify({
    evaluated_at: "2026-02-04",
    resources: [{ ...validResource, summary: padding }],
  });
}
