# Test Strategy

This document outlines the testing approach for The Evolving PM, including what's tested, why, and future priorities.

## Overview

The test suite is designed around three principles:

1. **Security first** - XSS prevention and rate limiting are critical and thoroughly tested
2. **Confidence in deployments** - Tests catch regressions before they reach production
3. **Fast feedback** - Unit tests run in under 1 second; E2E tests are reserved for user workflows

## Test Architecture

```
tests/
├── unit/                    # Fast, isolated tests (~112 tests, <100ms)
│   ├── utils.test.ts        # Utility functions including security
│   └── middleware.test.ts   # Rate limiting, CORS, IP extraction
├── integration/             # API route tests (~40 tests, <50ms)
│   ├── setup.test.ts        # Test infrastructure verification
│   └── api/
│       ├── submit.test.ts   # User submission endpoint
│       └── ingest.test.ts   # Admin resource ingestion
├── e2e/                     # Browser tests (~24 tests, ~30s)
│   ├── resource-browsing.spec.ts
│   └── submit-form.spec.ts
└── mocks/
    ├── fixtures.ts          # Shared test data
    ├── supabase.ts          # Database mock
    └── resend.ts            # Email service mock
```

## What's Tested

### Unit Tests (154 tests)

**Utility Functions** (`tests/unit/utils.test.ts`)

| Function | Tests | Why It Matters |
|----------|-------|----------------|
| `sanitizeUrl` | 15 | **Security**: Prevents XSS via javascript:, data:, and other dangerous protocols |
| `stripHtml` | 11 | **Security**: Removes HTML tags to prevent stored XSS |
| `slugify` | 11 | URL generation - broken slugs break resource links |
| `calculateNextReview` | 9 | Content freshness scheduling for different content types |
| `getHostname` | 11 | Display formatting - shows clean domain names |
| `truncate` | 8 | UI consistency - prevents layout breaks |
| `formatDate` | 5 | User-facing date display |
| `cn` | 8 | Tailwind class composition |

**Middleware Logic** (`tests/unit/middleware.test.ts`)

| Component | Tests | Why It Matters |
|-----------|-------|----------------|
| Rate limiting | 14 | **Security**: Prevents abuse of submission endpoint |
| IP extraction | 7 | Correct client identification behind proxies |
| CORS validation | 8 | **Security**: Prevents unauthorized cross-origin requests |
| Path matching | 5 | Ensures middleware only applies to API routes |

### Integration Tests (40 tests)

**Submit API** (`/api/submit`)
- Payload validation (URL required, email optional, context max 1000 chars)
- File storage (dated JSON files in `submissions/`)
- Email confirmation (graceful degradation if Resend fails)
- Response format verification

**Ingest API** (`/api/ingest`)
- API key authentication
- Payload validation (all resource fields, 1MB limit)
- Database operations (insert, update, slug collision handling)
- Batch processing with partial failure handling

### E2E Tests (24 tests)

**Resource Browsing**
- Homepage loads with key elements
- Navigation between pages (categories, resources, submit, about)
- Filter functionality (category, level, format)
- Pagination when sufficient data exists
- Empty state handling

**Submit Form**
- Form rendering and validation
- Character counter functionality
- Complete submission flow (loading, success, reset)
- Accessibility (labels, keyboard navigation, required attributes)

## Testing Patterns

### Mocking Strategy

- **Supabase**: Factory pattern with chainable methods (`createMockSupabaseClient`)
- **Resend**: Simple mock with send tracking and error simulation
- **File system**: Real I/O in integration tests with cleanup hooks
- **Time**: Vitest fake timers for rate limiting window tests

### E2E Considerations

- Single worker to respect `/api/submit` rate limit (5 req/min)
- Serial execution prevents race conditions
- Conditional assertions for data-dependent features (pagination)
- Network idle waits before assertions

## What's NOT Tested (and Why)

| Area | Reason |
|------|--------|
| Supabase queries | Tested via integration tests; actual DB tested in staging |
| React component rendering | Server components are tested via E2E; UI is simple |
| CSS/styling | Visual regression testing not yet needed at current scale |
| Authentication | No user accounts yet (planned post-launch feature) |

## Future Priorities

### High Priority (Next Sprint)

1. **Component Unit Tests**
   - `Pagination.tsx` - Complex page calculation logic deserves isolated tests
   - `FilterBar.tsx` - URL parameter manipulation should be unit tested

2. **Resource Detail E2E Tests**
   - Currently no tests verify the resource detail page renders correctly
   - Should test: title display, external link, related resources section

3. **Error State E2E Tests**
   - What does the user see when the API returns 500?
   - Network failure handling in the submit form

### Medium Priority

4. **Sitemap Generation Tests**
   - Verify XML structure is valid
   - Ensure all resources appear in sitemap
   - Test error handling when database is unavailable

5. **Mobile/Responsive E2E Tests**
   - Current tests only run at desktop viewport
   - Mobile navigation (hamburger menu) is untested

6. **Performance Benchmarks**
   - Track test execution time over time
   - Alert if tests slow down significantly

### Lower Priority

7. **Visual Regression Testing**
   - Screenshot comparison for key pages
   - Useful once design stabilizes

8. **Load Testing**
   - Simulate concurrent users
   - Verify rate limiting under load

9. **Accessibility Audit**
   - Automated a11y scanning (axe-core)
   - WCAG compliance verification

## Running Tests

```bash
# Unit + Integration (fast feedback)
npm run test:run

# Watch mode during development
npm test

# E2E tests (requires dev server)
npm run test:e2e

# Coverage report
npm run test:run -- --coverage

# Run a specific test file
npm run test:run -- tests/unit/utils.test.ts
```

## When to Run Tests

### Local Development

**While coding** — Run unit tests in watch mode:
```bash
npm test
```
- Runs on file save
- Sub-second feedback
- Catches logic errors immediately

**Before committing** — Run full Vitest suite:
```bash
npm run test:run
```
- 154 tests in ~1 second
- Validates all unit + integration tests
- Fast enough to run every commit

**Before pushing / after significant changes** — Run E2E:
```bash
npm run test:e2e
```
- 24 tests in ~30 seconds
- Requires dev server (starts automatically)
- Validates actual user workflows

### By Scenario

| Scenario | Command |
|----------|---------|
| Changed a utility function | `npm test` (watch mode) |
| Changed an API route | `npm run test:run` |
| Changed a page/component | `npm run test:e2e` |
| Before creating a PR | `npm run test:run && npm run test:e2e` |
| Debugging a specific test | `npm run test:run -- tests/unit/utils.test.ts` |

### CI/CD Pipeline

| Stage | Tests | Trigger | Fail Behavior |
|-------|-------|---------|---------------|
| Pre-commit hook | `npm run test:run` | Every commit | Block commit |
| PR checks | `npm run test:run` | PR opened/updated | Block merge |
| PR checks | `npm run test:e2e` | PR opened/updated | Block merge |
| Post-deploy | E2E against staging | After deploy | Alert + rollback |

### Cost/Benefit

| Suite | Time | What It Catches |
|-------|------|-----------------|
| Unit | <1s | Logic bugs, security regressions, edge cases |
| Integration | <1s | API contract violations, validation errors |
| E2E | ~30s | Broken user flows, UI regressions, browser issues |

The unit tests are cheap enough to run constantly. Reserve E2E for validation checkpoints.

## Test Data

Test fixtures are centralized in `tests/mocks/fixtures.ts`:

- `validResource` - Complete resource for ingest testing
- `validSubmission` - Valid user submission
- `invalidSubmissionBadUrl` - Malformed URL for validation testing
- `createLargePayload(bytes)` - Generate oversized payloads

## Adding New Tests

1. **Unit tests**: Add to `tests/unit/` for pure functions and isolated logic
2. **Integration tests**: Add to `tests/integration/api/` for API route testing
3. **E2E tests**: Add to `tests/e2e/` for user workflow testing
4. **Fixtures**: Add shared test data to `tests/mocks/fixtures.ts`

When adding tests, consider:
- Is this testing behavior that could break silently?
- Is the test deterministic (no flakiness)?
- Does it run fast enough for the feedback loop it serves?

## Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Unit test count | 154 | 200+ |
| E2E test count | 24 | 40+ |
| Test execution (unit) | <1s | <2s |
| Test execution (E2E) | ~30s | <60s |
| Security function coverage | 100% | 100% |
