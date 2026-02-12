import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Run accessibility audits on key pages
const pagesToAudit = [
  { name: "Homepage", path: "/" },
  { name: "Resources", path: "/resources" },
  { name: "Categories", path: "/categories" },
  { name: "Submit", path: "/submit" },
  { name: "About", path: "/about" },
  { name: "Privacy", path: "/privacy" },
];

test.describe("Accessibility Audit", () => {
  for (const page of pagesToAudit) {
    test(`${page.name} page has no critical accessibility violations`, async ({
      page: browserPage,
    }) => {
      await browserPage.goto(page.path);

      // Wait for page to be fully loaded
      await browserPage.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page: browserPage })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      // Log violations for debugging
      if (accessibilityScanResults.violations.length > 0) {
        console.log(`\n=== ${page.name} Violations ===`);
        for (const violation of accessibilityScanResults.violations) {
          console.log(`\n[${violation.impact?.toUpperCase()}] ${violation.id}: ${violation.description}`);
          console.log(`  Help: ${violation.helpUrl}`);
          for (const node of violation.nodes.slice(0, 3)) {
            console.log(`  - ${node.html.substring(0, 100)}...`);
          }
          if (violation.nodes.length > 3) {
            console.log(`  ... and ${violation.nodes.length - 3} more`);
          }
        }
      }

      // Filter to only critical and serious violations for the assertion
      const criticalViolations = accessibilityScanResults.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious"
      );

      expect(criticalViolations).toEqual([]);
    });
  }
});
