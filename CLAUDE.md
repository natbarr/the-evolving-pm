# The Evolving PM

A curated learning resource library for AI Product Managers.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Email**: Resend (for submission confirmations)
- **Error Tracking**: Sentry

## Development

```bash
npm run dev    # Start dev server at localhost:4000
```

## Project Structure

```
src/
  app/
    api/submit/          # Resource submission endpoint
    api/ingest/          # Batch resource ingestion endpoint
    resources/           # Resource list + [slug] detail pages
    categories/          # Category list + [category] detail pages
    submit/              # User submission form
    about/               # About page
    privacy/             # Privacy policy
    layout.tsx           # Root layout
    error.tsx            # Error boundary
    not-found.tsx        # 404 page
    loading.tsx          # Loading skeleton
  components/            # React components
  lib/
    supabase/            # Database client (client.ts, server.ts, types.ts)
    constants.ts         # Enums, review schedules
    utils.ts             # Helpers (slugify, etc.)
  middleware.ts          # Request middleware (security headers, redirects)

tests/
  unit/                  # Pure function tests (Vitest)
  integration/           # API route tests (Vitest)
  e2e/                   # Browser tests (Playwright)
  mocks/                 # Shared test fixtures and mocks

things_to_come/          # PRDs for post-launch features
submissions/             # User-submitted resources (dated JSON, gitignored)
```

## Testing

```bash
npm test           # Vitest watch mode
npm run test:run   # Vitest single run (155 tests)
npm run test:e2e   # Playwright E2E tests (31 tests)
```

- `tests/unit/` - Pure function and utility tests
- `tests/integration/` - API route tests with mocked Supabase
- `tests/e2e/` - Full browser tests with Playwright

**Note:** E2E tests run serially with a single worker to avoid rate limiting on `/api/submit` (5 req/min).

## Skills

- `/ingest <file>` - Ingest resources from a JSON file into the database

## Adding New Resources

Resources are added via the `/api/ingest` endpoint. See `.claude/skills/ingest/SKILL.md` for the daily workflow.

## Coding Conventions

- **Imports**: Use TypeScript path aliases (`@/*` maps to `src/`)
- **Styling**: Tailwind CSS utility classes only — no CSS modules or inline styles
- **Validation**: Zod schemas for all request body parsing and external data
- **Supabase clients**: Use `client.ts` for browser components, `server.ts` for server components and API routes
- **Formatting**: ESLint only — no Prettier configured
- **Tests**:
  - Unit tests (`tests/unit/`) for pure functions and utilities
  - Integration tests (`tests/integration/`) for API routes
  - E2E tests (`tests/e2e/`) for user flows via Playwright

## Environment Variables

Required in `.env.local`:

**Core:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `INGEST_API_KEY`
- `NEXT_PUBLIC_SITE_URL` - Canonical site URL

**Email:**
- `RESEND_API_KEY` - For sending confirmation emails
- `EMAIL_FROM` - Sender address (e.g., `The Evolving PM <noreply@theevolvingpm.com>`)

**Sentry (production):**
- `NEXT_PUBLIC_SENTRY_DSN` - Client-side error tracking
- `SENTRY_ORG`
- `SENTRY_PROJECT`
- `SENTRY_AUTH_TOKEN`

## Roadmap

See `soft_launch_plan.md` for the production launch plan.

The `things_to_come/` folder contains PRDs for planned features:
- `basic-search.md` - Full-text search across resources
- `affiliate-links.md` - Optional affiliate URLs for monetization
- `user-accounts.md` - Authentication, bookmarking, and progress tracking
- `submission-notifications.md` - Owner notifications via GitHub/Slack/Discord
- `accessibility-statement.md` - Accessibility statement page
- `automated-ingest.md` - Automated resource ingestion pipeline
