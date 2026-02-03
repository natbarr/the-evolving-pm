# The Evolving PM

A curated learning resource library for AI Product Managers. This is the consumer-facing frontend that displays content from a separate backend assessment process.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Validation**: Zod

## Development

```bash
npm run dev    # Start dev server at localhost:3000
```

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
```

## Skills

- `/ingest <file>` - Ingest resources from a JSON file into the database

## Adding New Resources

Resources are added via the `/api/ingest` endpoint. See `.claude/skills/ingest.md` for the daily workflow.

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `INGEST_API_KEY`
