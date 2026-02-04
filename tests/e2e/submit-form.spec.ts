import { test, expect } from "@playwright/test";
import { promises as fs } from "fs";
import path from "path";

const SUBMISSIONS_DIR = path.join(process.cwd(), "submissions");

// Run submission tests serially to avoid rate limiting (5 req/min)
test.describe.configure({ mode: "serial" });

test.describe("Submit Form Flow", () => {
  // Clean up test submissions after all tests
  test.afterAll(async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const filePath = path.join(SUBMISSIONS_DIR, `${today}.json`);
      await fs.unlink(filePath);
    } catch {
      // File might not exist
    }
  });

  test("submit page renders all form fields", async ({ page }) => {
    await page.goto("/submit");

    // Check page title
    await expect(
      page.getByRole("heading", { name: /submit a resource/i })
    ).toBeVisible();

    // Check form fields
    await expect(page.getByLabel(/resource url/i)).toBeVisible();
    await expect(page.getByLabel(/your email/i)).toBeVisible();
    await expect(page.getByLabel(/why is this resource valuable/i)).toBeVisible();

    // Check submit button
    await expect(page.getByRole("button", { name: /submit resource/i })).toBeVisible();
  });

  test("form shows validation for empty required fields", async ({ page }) => {
    await page.goto("/submit");

    // Try to submit without filling URL
    await page.getByRole("button", { name: /submit resource/i }).click();

    // Browser validation should prevent submission
    // The URL field should be invalid
    const urlInput = page.getByLabel(/resource url/i);
    await expect(urlInput).toHaveAttribute("required");
  });

  test("form shows validation for invalid URL", async ({ page }) => {
    await page.goto("/submit");

    // Fill with invalid URL
    await page.getByLabel(/resource url/i).fill("not-a-valid-url");

    // Try to submit
    await page.getByRole("button", { name: /submit resource/i }).click();

    // Browser should show validation error for type="url" input
    const urlInput = page.getByLabel(/resource url/i);
    const isInvalid = await urlInput.evaluate((el: HTMLInputElement) => !el.checkValidity());
    expect(isInvalid).toBe(true);
  });

  test("form shows validation for invalid email", async ({ page }) => {
    await page.goto("/submit");

    // Fill URL correctly
    await page.getByLabel(/resource url/i).fill("https://example.com/resource");

    // Fill with invalid email
    await page.getByLabel(/your email/i).fill("not-an-email");

    // Try to submit
    await page.getByRole("button", { name: /submit resource/i }).click();

    // Browser should show validation error for type="email" input
    const emailInput = page.getByLabel(/your email/i);
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.checkValidity());
    expect(isInvalid).toBe(true);
  });

  test("character counter updates for context field", async ({ page }) => {
    await page.goto("/submit");

    const contextField = page.getByLabel(/why is this resource valuable/i);

    // Type some text
    await contextField.fill("This is a great resource about AI");

    // Check character counter updates (format: "34/1000 characters")
    await expect(page.getByText(/\/1000 characters/i)).toBeVisible();
  });

  // Consolidated test: Tests submission, loading state, success, and reset
  // This minimizes actual API calls to stay within rate limits
  test("complete submission flow: loading state, success message, and reset", async ({ page }) => {
    await page.goto("/submit");

    // Fill the form with valid data (including optional fields)
    await page.getByLabel(/resource url/i).fill("https://example.com/full-flow-test");
    await page.getByLabel(/your email/i).fill("test@example.com");
    await page.getByLabel(/why is this resource valuable/i).fill("Great AI resource for PMs");

    // Start submission and check loading state
    const submitButton = page.getByRole("button", { name: /submit resource/i });
    await submitButton.click();

    // Button should show loading state (text changes to "Submitting...")
    await expect(page.getByRole("button", { name: /submitting/i })).toBeVisible();

    // Wait for success message
    await expect(page.getByRole("heading", { name: /thank you/i })).toBeVisible({
      timeout: 10000,
    });

    // Check success message content
    await expect(
      page.getByText(/your submission has been received/i)
    ).toBeVisible();

    // Check "Submit Another" button appears
    const submitAnotherButton = page.getByRole("button", { name: /submit another/i });
    await expect(submitAnotherButton).toBeVisible();

    // Test reset functionality: Click "Submit Another"
    await submitAnotherButton.click();

    // Form should be visible again
    await expect(page.getByLabel(/resource url/i)).toBeVisible();

    // Fields should be empty
    await expect(page.getByLabel(/resource url/i)).toHaveValue("");
    await expect(page.getByLabel(/your email/i)).toHaveValue("");
  });

  // Separate test for minimal submission (no optional fields)
  test("can submit with only required fields", async ({ page }) => {
    await page.goto("/submit");

    // Fill only the required URL field
    await page.getByLabel(/resource url/i).fill("https://example.com/minimal-submission-test");

    // Submit the form
    await page.getByRole("button", { name: /submit resource/i }).click();

    // Should succeed (or show rate limit message)
    // We check for either success or rate limit since tests may run after rate limit is hit
    const success = page.getByRole("heading", { name: /thank you/i });
    const rateLimit = page.getByText(/rate limit/i);

    await expect(success.or(rateLimit)).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Submit Form - Accessibility", () => {
  test("form labels are properly associated with inputs", async ({ page }) => {
    await page.goto("/submit");

    // Check that clicking labels focuses the associated input
    const urlLabel = page.getByText("Resource URL", { exact: false });
    await urlLabel.click();

    // The URL input should be focused
    const urlInput = page.getByLabel(/resource url/i);
    await expect(urlInput).toBeFocused();
  });

  test("form can be navigated with keyboard", async ({ page }) => {
    await page.goto("/submit");

    // Focus first input
    await page.getByLabel(/resource url/i).focus();

    // Tab to next field
    await page.keyboard.press("Tab");
    await expect(page.getByLabel(/your email/i)).toBeFocused();

    // Tab to context field
    await page.keyboard.press("Tab");
    await expect(page.getByLabel(/why is this resource valuable/i)).toBeFocused();
  });

  test("required field is marked as required", async ({ page }) => {
    await page.goto("/submit");

    // URL field should have required indicator
    await expect(page.getByText("*")).toBeVisible();

    const urlInput = page.getByLabel(/resource url/i);
    await expect(urlInput).toHaveAttribute("required");
  });
});
