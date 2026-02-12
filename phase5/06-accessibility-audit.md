# Accessibility Audit & Fixes

## Overview
Conduct a comprehensive accessibility audit using automated tools and manual testing, then fix identified issues.

## Problem
While the site has a solid accessibility foundation (semantic HTML, aria labels, focus styles), we need to:
- Run automated accessibility scans
- Verify screen reader compatibility
- Add missing ARIA attributes
- Ensure color contrast compliance
- Add live regions for dynamic content

## Proposed Solution
Use axe-core and Lighthouse for automated testing, supplement with manual screen reader testing, and fix all critical/serious issues.

## User Stories
- As a screen reader user, I want content announced clearly and in logical order
- As a low-vision user, I want sufficient color contrast
- As any user, I want error messages announced when they appear

## Scope

### In Scope
- Automated scan with axe-core (via browser extension or Playwright)
- Lighthouse accessibility audit
- Manual screen reader testing (VoiceOver)
- Color contrast verification
- ARIA improvements for:
  - Form validation errors (aria-invalid, aria-describedby)
  - Live regions for dynamic content (aria-live)
  - Better landmark structure
- Fix all critical and serious issues

### Out of Scope
- WCAG AAA compliance (targeting AA)
- Cognitive accessibility features
- Multi-language support

## Technical Approach

### Automated Testing

**axe-core via Playwright:**
```typescript
// tests/e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage has no accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

**Lighthouse CI:**
```bash
npx lighthouse http://localhost:4000 --only-categories=accessibility --output=json
```

### Known Improvements Needed

**1. Form Error Associations:**
```tsx
<input
  aria-invalid={hasError}
  aria-describedby={hasError ? 'field-error' : undefined}
/>
{hasError && (
  <p id="field-error" role="alert">{errorMessage}</p>
)}
```

**2. Live Regions for Dynamic Content:**
```tsx
// Submission success/error messages
<div role="status" aria-live="polite">
  {status === 'success' && 'Submission received!'}
</div>

<div role="alert" aria-live="assertive">
  {status === 'error' && errorMessage}
</div>
```

**3. Landmark Improvements:**
```tsx
// Ensure main content has proper landmark
<main role="main" aria-label="Page content">

// Footer should have contentinfo role (implicit with <footer>)
<footer role="contentinfo">

// Navigation should be labeled if multiple
<nav aria-label="Main navigation">
<nav aria-label="Pagination">
```

**4. Image Alt Text:**
```tsx
// Decorative icons should be hidden
<svg aria-hidden="true" />

// Meaningful images need alt
<img alt="Description of image" />
```

**5. Color Contrast:**
Verify these color combinations meet 4.5:1 ratio:
- `text-primary-500` on white background
- `text-primary-400` on white background (footer copyright)
- `text-accent-600` on white background

### Testing Checklist

| Test | Tool | Target | Status |
|------|------|--------|--------|
| Automated violations | axe-core | 0 critical/serious | TBD |
| Lighthouse a11y score | Lighthouse | 90+ | TBD |
| Color contrast | WebAIM checker | 4.5:1 AA | TBD |
| Screen reader nav | VoiceOver | Logical flow | TBD |
| Screen reader forms | VoiceOver | Errors announced | TBD |
| Heading hierarchy | Manual | No skipped levels | TBD |

### Fix Priority
1. **Critical**: Anything preventing access (keyboard traps, missing labels)
2. **Serious**: Major usability issues (poor contrast, missing error associations)
3. **Moderate**: Improvements (better landmarks, live regions)
4. **Minor**: Polish (redundant ARIA, minor contrast)

## Success Metrics
- Lighthouse accessibility score: 90+
- Zero critical/serious axe-core violations
- Screen reader users can complete all tasks

## Dependencies
- axe-core/playwright package (for automated testing)

## Estimated Effort
- Automated testing setup: 1 hour
- Running audits: 1 hour
- Fixes: 2-4 hours (depending on findings)
- Verification: 1 hour

## Decisions
- Accessibility statement page: Deferred to post-launch (see `things_to_come/accessibility-statement.md`)

## Open Questions
- What assistive technologies should we officially support?
