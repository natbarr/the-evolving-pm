# Automated Ingest via GitHub Actions

## Overview
Automate the daily resource ingest process using GitHub Actions cron scheduling.

## Problem
Currently, ingesting new resources requires manual execution of the `/ingest` skill. This is fine during development but creates operational overhead once the site is live.

## Proposed Solution
Create a GitHub Actions workflow that runs on a schedule (daily) to ingest any pending resources from the backend assessment process.

## Scope

### In Scope
- GitHub Actions workflow with cron trigger
- Secure handling of `INGEST_API_KEY` via GitHub Secrets
- Workflow dispatch for manual triggers
- Basic success/failure notifications
- Fallback documentation for manual ingest

### Out of Scope
- Automatic resource discovery/scraping
- Integration with backend assessment process (assumes files are ready)
- Slack/Discord notifications (see `submission-notifications.md`)

## Technical Approach

### Workflow File
`.github/workflows/daily-ingest.yml`:
- Trigger: `schedule` (cron) + `workflow_dispatch` (manual)
- Steps: Checkout, setup Node, run ingest script
- Secrets: `INGEST_API_KEY`, `PRODUCTION_URL`

### Schedule
- Run daily at a low-traffic time (e.g., 6:00 AM UTC)
- Consider timezone of primary maintainer

### Error Handling
- Workflow fails if ingest returns non-2xx
- GitHub sends email notification on failure (default behavior)
- Optional: Add Slack webhook for alerts

## Dependencies
- Production deployment (needs live `/api/ingest` endpoint)
- Stable ingest file format/location

## Open Questions
- Where will ingest files live? (separate repo, S3, manual commit?)
- Should the workflow commit a log of ingested resources?
- Retry logic on transient failures?
