"use client";

import * as Sentry from "@sentry/nextjs";

export default function SentryExamplePage() {
  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Sentry Example Page</h1>
      <p>Click the button below to trigger a test error.</p>
      <button
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#7c3aed",
          color: "white",
          border: "none",
          borderRadius: "0.375rem",
          cursor: "pointer",
          marginTop: "1rem",
        }}
        onClick={() => {
          Sentry.startSpan(
            { name: "Example Frontend Span", op: "test" },
            () => {
              throw new Error("Sentry Example Frontend Error");
            }
          );
        }}
      >
        Throw Error
      </button>
    </div>
  );
}
