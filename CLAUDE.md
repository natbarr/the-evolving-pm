# The Evolving PM

A curated learning resource library for AI Product Managers. This is the consumer-facing frontend that displays content from a separate backend assessment process.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Email**: Resend (for submission confirmations)

## Development

```bash
npm run dev    # Start dev server at localhost:4000
```

## Testing

```bash
npm test           # Vitest watch mode
npm run test:run   # Vitest single run (42 tests)
npm run test:e2e   # Playwright E2E tests (21 tests)
```

**Test structure:**
- `tests/integration/` - API route tests (Vitest)
- `tests/e2e/` - Browser tests (Playwright)
- `tests/mocks/` - Shared test fixtures and mocks

**Note:** E2E tests run serially with a single worker to avoid rate limiting on `/api/submit` (5 req/min).

## Project Structure

```
src/
├── app/                 # Next.js pages
│   ├── api/            # API routes (submit, ingest)
│   ├── resources/      # Resource list + detail pages
│   ├── categories/     # Category list + detail pages
│   └── submit/         # User submission form
├── components/         # React components
└── lib/
    ├── supabase/       # Database client + types
    ├── constants.ts    # Enums, review schedules
    └── utils.ts        # Helpers (slugify, etc.)

submissions/             # User-submitted resources (dated JSON files, gitignored)
things_to_come/          # PRDs for post-launch features
```

## Skills

- `/ingest <file>` - Ingest resources from a JSON file into the database

## Adding New Resources

Resources are added via the `/api/ingest` endpoint. See `.claude/skills/ingest.md` for the daily workflow.

## Launch Plan

See `soft_launch_plan.md` for the full production launch plan covering security, testing, operations, and marketing.

## Post-Launch Roadmap

The `things_to_come/` folder contains PRDs for features planned after soft launch:

- `basic-search.md` - Full-text search across resources using Supabase
- `affiliate-links.md` - Optional affiliate URLs for monetization
- `user-accounts.md` - Authentication, bookmarking, and progress tracking
- `submission-notifications.md` - Owner notifications via GitHub/Slack/Discord

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `INGEST_API_KEY`
- `RESEND_API_KEY` - For sending confirmation emails
- `EMAIL_FROM` - Sender address (e.g., `The Evolving PM <noreply@theevolvingpm.com>`)
