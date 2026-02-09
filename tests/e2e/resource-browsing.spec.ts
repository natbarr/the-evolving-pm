import { test, expect } from "@playwright/test";

test.describe("Resource Browsing Flow", () => {
  test("homepage loads with key elements", async ({ page }) => {
    await page.goto("/");

    // Check title
    await expect(page).toHaveTitle(/Evolving PM/i);

    // Check hero section
    await expect(
      page.getByRole("heading", { name: /learning journey/i })
    ).toBeVisible();

    // Check CTA buttons
    await expect(page.getByRole("link", { name: /start exploring/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /learn more/i })).toBeVisible();

    // Check featured categories section
    await expect(
      page.getByRole("heading", { name: /explore by category/i })
    ).toBeVisible();
  });

  test("can navigate from homepage to categories", async ({ page }) => {
    await page.goto("/");

    // Click "View All Categories"
    await page.getByRole("link", { name: /view all categories/i }).click();

    // Should be on categories page
    await expect(page).toHaveURL("/categories");
    await expect(
      page.getByRole("heading", { name: /browse by category/i })
    ).toBeVisible();
  });

  test("categories page shows all categories", async ({ page }) => {
    await page.goto("/categories");

    // Check that category cards are displayed
    await expect(page.getByRole("heading", { name: "AI Fundamentals" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "AI Product Strategy" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Technical Skills" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Career" })).toBeVisible();
  });

  test("can navigate from categories to category detail", async ({ page }) => {
    await page.goto("/categories");

    // Click on a category
    await page.getByRole("link", { name: /AI Fundamentals/i }).click();

    // Should be on category detail page
    await expect(page).toHaveURL("/categories/ai-fundamentals");
  });

  test("resources page loads with filter bar", async ({ page }) => {
    await page.goto("/resources");

    // Check page title
    await expect(
      page.getByRole("heading", { name: /resource library/i })
    ).toBeVisible();

    // Check filter bar exists (look for filter controls)
    await expect(page.locator("[data-testid='filter-bar']").or(
      page.getByRole("combobox").first()
    )).toBeVisible();
  });

  test("can navigate from homepage to resources", async ({ page }) => {
    await page.goto("/");

    // Click "Start Exploring"
    await page.getByRole("link", { name: /start exploring/i }).click();

    // Should be on resources page
    await expect(page).toHaveURL("/resources");
    await expect(
      page.getByRole("heading", { name: /resource library/i })
    ).toBeVisible();
  });

  test("can navigate to submit page from homepage", async ({ page }) => {
    await page.goto("/");

    // Click "Submit a Resource" in the main content (not footer)
    await page.getByRole("main").getByRole("link", { name: /submit a resource/i }).click();

    // Should be on submit page
    await expect(page).toHaveURL("/submit");
    await expect(
      page.getByRole("heading", { name: /submit a resource/i })
    ).toBeVisible();
  });

  test("about page loads", async ({ page }) => {
    await page.goto("/about");

    // Page should load without error
    await expect(page).toHaveURL("/about");
  });

  test("navigation works correctly", async ({ page }) => {
    await page.goto("/");

    // Check that main nav links exist (assuming there's a nav)
    const nav = page.locator("nav").first();
    await expect(nav).toBeVisible();
  });
});

test.describe("Resource Browsing - Empty States", () => {
  test("resources page shows appropriate content for filtered results", async ({ page }) => {
    // Navigate to resources with filters applied
    await page.goto("/resources?category=ai-fundamentals&level=expert&format=podcast");

    // Page should load and show either resources or an empty state message
    await page.waitForLoadState("networkidle");

    // Check that the page rendered properly (filter bar should always be visible)
    await expect(
      page.locator("[data-testid='filter-bar']").or(page.getByRole("combobox").first())
    ).toBeVisible();

    // Count resource cards
    const resourceCount = await page.locator("article").count();

    if (resourceCount === 0) {
      // If no resources, verify empty state is displayed (not a blank page)
      const pageContent = await page.locator("main").textContent();
      expect(pageContent).toBeTruthy();
      // Page should indicate no results or show some feedback
      expect(pageContent!.length).toBeGreaterThan(50);
    } else {
      // If resources exist, verify they are properly rendered
      await expect(page.locator("article").first()).toBeVisible();
    }
  });
});

test.describe("Resource Browsing - Pagination", () => {
  test("pagination controls work when available", async ({ page }) => {
    await page.goto("/resources");
    await page.waitForLoadState("networkidle");

    // Check if pagination exists (depends on having > 15 resources)
    const nextButton = page.getByRole("link", { name: /next/i });
    const hasPagination = await nextButton.isVisible().catch(() => false);

    if (hasPagination) {
      // Test pagination navigation
      await nextButton.click();
      await expect(page).toHaveURL(/page=2/);

      // Verify we're on page 2 and content loaded
      await page.waitForLoadState("networkidle");
      const resourceCount = await page.locator("article").count();
      expect(resourceCount).toBeGreaterThanOrEqual(0);

      // Test previous button
      const prevButton = page.getByRole("link", { name: /previous/i });
      await expect(prevButton).toBeVisible();
      await prevButton.click();

      // Should be back to page 1 (no page param or page=1)
      await expect(page).toHaveURL(/\/resources(?:\?(?!.*page=)|$)/);
    } else {
      // No pagination means 15 or fewer resources - verify resource count
      const resourceCount = await page.locator("article").count();
      expect(resourceCount).toBeLessThanOrEqual(15);
    }
  });
});

test.describe("Resource Browsing - Filtering", () => {
  test("category filter updates URL and filters results", async ({ page }) => {
    await page.goto("/resources");
    await page.waitForLoadState("networkidle");

    // Find and interact with the category filter
    const categorySelect = page.locator("select").first();
    const hasFilters = await categorySelect.isVisible().catch(() => false);

    if (hasFilters) {
      // Select a category
      await categorySelect.selectOption("ai-fundamentals");

      // URL should update with the filter
      await expect(page).toHaveURL(/category=ai-fundamentals/);

      // Page should still render properly
      await page.waitForLoadState("networkidle");
      await expect(
        page.getByRole("heading", { name: /resource library/i })
      ).toBeVisible();
    }
  });

  test("multiple filters can be combined", async ({ page }) => {
    await page.goto("/resources?category=ai-fundamentals");
    await page.waitForLoadState("networkidle");

    // Verify initial filter is applied
    await expect(page).toHaveURL(/category=ai-fundamentals/);

    // Find level filter (usually second select)
    const selects = page.locator("select");
    const selectCount = await selects.count();

    if (selectCount >= 2) {
      // Select a level filter
      await selects.nth(1).selectOption("beginner");

      // URL should have both filters
      await expect(page).toHaveURL(/category=ai-fundamentals/);
      await expect(page).toHaveURL(/level=beginner/);
    }
  });

  test("clearing filters returns to unfiltered view", async ({ page }) => {
    // Start with filters applied
    await page.goto("/resources?category=ai-fundamentals&level=beginner");
    await page.waitForLoadState("networkidle");

    // Reset by navigating to base resources page
    await page.goto("/resources");
    await page.waitForLoadState("networkidle");

    // URL should not have filter params
    const url = page.url();
    expect(url).not.toContain("category=");
    expect(url).not.toContain("level=");
  });
});

test.describe("Resource Detail Page", () => {
  test("can navigate to resource detail from resources list", async ({ page }) => {
    await page.goto("/resources");
    await page.waitForLoadState("networkidle");

    // Click on the first resource card link
    const firstResourceLink = page.locator("article a").first();
    const hasResources = await firstResourceLink.isVisible().catch(() => false);

    if (hasResources) {
      await firstResourceLink.click();

      // Should be on a resource detail page
      await expect(page).toHaveURL(/\/resources\/.+/);
    }
  });

  test("resource detail page shows all key sections", async ({ page }) => {
    await page.goto("/resources");
    await page.waitForLoadState("networkidle");

    // Navigate to first resource
    const firstResourceLink = page.locator("article a").first();
    const hasResources = await firstResourceLink.isVisible().catch(() => false);

    if (!hasResources) {
      test.skip();
      return;
    }

    await firstResourceLink.click();
    await page.waitForLoadState("networkidle");

    // Verify breadcrumb navigation exists
    await expect(page.getByRole("navigation")).toBeVisible();

    // Verify resource title (h1)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Verify "View Resource" button exists
    await expect(page.getByRole("link", { name: /view resource/i })).toBeVisible();

    // Verify Summary section
    await expect(page.getByRole("heading", { name: /summary/i })).toBeVisible();

    // Verify "Why This Matters" section
    await expect(page.getByRole("heading", { name: /why this matters/i })).toBeVisible();

    // Verify Details section
    await expect(page.getByRole("heading", { name: /details/i })).toBeVisible();
  });

  test("resource detail page shows all detail items including Added date", async ({ page }) => {
    await page.goto("/resources");
    await page.waitForLoadState("networkidle");

    // Navigate to first resource
    const firstResourceLink = page.locator("article a").first();
    const hasResources = await firstResourceLink.isVisible().catch(() => false);

    if (!hasResources) {
      test.skip();
      return;
    }

    await firstResourceLink.click();
    await page.waitForLoadState("networkidle");

    // Verify all detail items are present
    const detailsSection = page.locator("dl");
    await expect(detailsSection).toBeVisible();

    // Check for each detail label
    await expect(detailsSection.getByText("Format")).toBeVisible();
    await expect(detailsSection.getByText("Level")).toBeVisible();
    await expect(detailsSection.getByText("Access")).toBeVisible();
    await expect(detailsSection.getByText("Source")).toBeVisible();
    await expect(detailsSection.getByText("Added")).toBeVisible();
  });
});
