# Manual Ingest Procedure

This document describes how to manually ingest resources when automated ingest is unavailable or for ad-hoc additions.

## Prerequisites

- Access to the production `INGEST_API_KEY`
- Resource data in the correct JSON format

## Resource JSON Format

```json
{
  "resources": [
    {
      "title": "Resource Title",
      "url": "https://example.com/resource",
      "format": "article",
      "category": "ai-fundamentals",
      "summary": "Brief description of the resource.",
      "author": "Author Name",
      "source": "Publication Name",
      "experience_level": "beginner",
      "content_type": "conceptual"
    }
  ]
}
```

### Required Fields
- `title` - Resource title
- `url` - Full URL to the resource
- `format` - One of: article, video, course, podcast, book, tool, repository, newsletter, community, reference
- `category` - One of: ai-fundamentals, prompt-engineering, ai-tools-platforms, ai-product-strategy, ai-ethics-tic, building-ai-products, ai-pm-career
- `summary` - Brief description (max 500 characters recommended)

### Optional Fields
- `author` - Author or creator name
- `source` - Publication or platform name
- `experience_level` - One of: beginner, intermediate, expert
- `content_type` - One of: conceptual, tool-specific, model-dependent, pricing, career, time-sensitive

## Ingest Methods

### Method 1: Using the /ingest Skill (Recommended)

If you have Claude Code access:

```bash
/ingest path/to/resources.json
```

### Method 2: Direct API Call

```bash
curl -X POST https://theevolvingpm.com/api/ingest \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_INGEST_API_KEY" \
  -d @resources.json
```

### Method 3: Local Development

1. Start the dev server: `npm run dev`
2. Use the local endpoint:

```bash
curl -X POST http://localhost:4000/api/ingest \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_INGEST_API_KEY" \
  -d @resources.json
```

## Verifying Ingest

After ingesting:

1. Check the API response for success/failure counts
2. Visit the resources page to verify new items appear
3. Check individual resource detail pages for correct data

## Troubleshooting

### 401 Unauthorized
- Verify the API key is correct
- Check the `x-api-key` header is set properly

### 400 Bad Request
- Validate JSON syntax
- Check all required fields are present
- Verify enum values are valid (format, category, etc.)

### 413 Payload Too Large
- Request body exceeds 1MB limit
- Split into smaller batches

### Duplicate Resources
- Resources with the same URL will be updated (upsert behavior)
- This is intentional - re-ingesting updates existing entries
