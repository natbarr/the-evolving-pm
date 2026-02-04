# Soft Launch Plan: The Evolving PM

## Overview

This document outlines the plan to take The Evolving PM from development to production, covering security, testing, operational readiness, and marketing.

---

## Phase 1: Rethink the Submission Flow

**Goal:** Align user submissions with the backend assessment process instead of storing directly in the frontend database.

**Status:** COMPLETE

### Implementation
- Submissions save to dated JSON files in `./submissions/` (e.g., `2026-02-04.json`)
- User receives confirmation email via Resend (if email provided)
- JSON files can be manually reviewed and fed into backend assessment process
- Database `submissions` table no longer used (can be removed later)

### Tasks
- [x] Set up email service (Resend)
- [x] Update `/api/submit` to write to JSON file
- [x] Add confirmation email to submitter
- [x] Add `submissions/` directory (gitignored except .gitkeep)
- [ ] Update submit page copy to set expectations (optional)
- [ ] Add owner notification (see `things_to_come/submission-notifications.md`)

### Environment Variables Required
```
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM=The Evolving PM <noreply@theevolvingpm.com>
```

---

## Phase 2: Security Hardening

**Goal:** Address security gaps before any public traffic.

### Tasks
| Task | Priority | Status |
|------|----------|--------|
| Restrict CORS to production domain only | Critical | [x] |
| Add rate limiting to submit endpoint (5/min per IP) | Critical | [x] |
| Add request body size limits to ingest endpoint | High | [x] |
| Rotate and strengthen `INGEST_API_KEY` | High | [x] |
| Sanitize resource summaries for XSS | High | [x] |
| Add Content Security Policy (CSP) headers | Medium | [ ] |
| Audit and lock down Supabase RLS policies | Medium | [ ] |

### Implemented via Middleware (`src/middleware.ts`)
- **CORS**: Only allows requests from `theevolvingpm.com`, `www.theevolvingpm.com`, and `localhost:4000-4010`
- **Rate Limiting**: 5 requests per minute per IP on `/api/submit`, returns 429 with `Retry-After` header when exceeded

### Implemented in API Routes
- **Body size limit**: 1MB max on `/api/ingest` (returns 413 if exceeded)
- **API key guidance**: Added `openssl rand -base64 32` hint in `.env.local.example`

### Implemented in Utils
- **URL sanitization**: `sanitizeUrl()` blocks `javascript:` and `data:` URLs
- **HTML stripping**: `stripHtml()` utility available for text sanitization

---

## Phase 3: Testing

**Goal:** Establish baseline test coverage for critical paths.

**Status:** IN PROGRESS

### Minimum Before Launch
- [x] Integration tests for `/api/ingest` endpoint (auth, validation, upsert)
- [x] Integration tests for `/api/submit` endpoint (validation, email sending)
- [x] E2E test for resource browsing flow
- [x] E2E test for submit form flow
- [ ] Accessibility audit (Lighthouse, axe-core)
- [ ] Performance audit (Core Web Vitals)

### Test Stack
- **Unit/Integration:** Vitest
- **E2E:** Playwright
- **Accessibility:** axe-core, Lighthouse

### Implemented Test Coverage

**Integration Tests (42 tests total):**
- `/api/ingest`: 22 tests covering authentication, payload validation, formats, upsert logic, error handling
- `/api/submit`: 18 tests covering validation, JSON file storage, email sending, response format
- Setup verification: 2 tests

**E2E Tests (21 tests total):**
- Resource browsing flow: 11 tests (homepage, navigation, categories, resources, empty states)
- Submit form flow: 7 tests (form rendering, validation, submission, reset)
- Accessibility basics: 3 tests (labels, keyboard navigation, required fields)

### Test Commands
```bash
npm test           # Vitest watch mode
npm run test:run   # Vitest single run
npm run test:e2e   # Playwright E2E tests
```

---

## Phase 4: Operational Readiness

**Goal:** Set up hosting, monitoring, and automation.

### Hosting (Vercel)
- [ ] Create Vercel project
- [ ] Configure environment variables (production)
- [ ] Set up custom domain with SSL
- [ ] Configure preview deployments for PRs

### Monitoring
- [ ] Add Sentry for error tracking
- [ ] Set up Vercel Analytics or Plausible for usage insights
- [ ] Configure alerts for API errors

### Automation
- [ ] Automate daily ingest with GitHub Actions (cron)
- [ ] Document manual ingest fallback procedure

### Environments
- [ ] Production environment configured
- [ ] Staging environment with production data snapshot (optional but recommended)

### Documentation
- [ ] Deployment runbook
- [ ] Rollback procedure
- [ ] Incident response basics

---

## Phase 5: Usability & Polish

**Goal:** Improve user experience before launch.

### Tasks
- [ ] Improve loading states (shimmer effects)
- [ ] Add helpful empty states when no results
- [ ] Verify mobile navigation and touch targets
- [ ] Improve form validation feedback (inline errors)
- [ ] Test keyboard navigation throughout
- [ ] Review and fix any accessibility issues found in Phase 3

---

## Phase 6: Monetization Setup

**Goal:** Set up minimal monetization to cover costs.

### Tasks
- [ ] Create Buy Me a Coffee account
- [ ] Add "Support this project" link in footer
- [ ] Add brief disclosure text for future affiliate links

### Deferred to Post-Launch
- Affiliate link implementation (see `things_to_come/affiliate-links.md`)

---

## Phase 7: Pre-Launch Checklist

### Technical
- [ ] Production environment variables configured
- [ ] Domain configured with SSL
- [ ] CORS restricted to production domain
- [ ] Rate limiting active
- [ ] Error tracking (Sentry) connected
- [ ] Analytics installed
- [ ] Sitemap.xml generating correctly
- [ ] robots.txt configured
- [ ] Open Graph images working
- [ ] Favicon and app icons set

### Content
- [ ] About page reviewed for accuracy
- [ ] Category descriptions finalized
- [ ] Initial resource set curated and ingested
- [ ] Submit page copy reviewed

### Legal
- [ ] Privacy policy page (for email collection)
- [ ] Affiliate disclosure text in footer (for future use)

---

## Phase 8: Soft Launch & Marketing

### Week 1: Soft Launch
- [ ] Share with 5-10 trusted colleagues/friends
- [ ] Collect feedback on usability issues
- [ ] Fix critical bugs
- [ ] Monitor error tracking for issues

### Week 2: Public Announcement
- [ ] LinkedIn post (personal network)
- [ ] Twitter/X thread explaining the "why"
- [ ] Submit to relevant newsletters:
  - Lenny's Newsletter
  - First Round Review
  - TLDR Newsletter
- [ ] Post in Slack/Discord communities:
  - Mind the Product
  - Product School
  - AI-focused communities
- [ ] Reddit posts:
  - r/ProductManagement
  - r/artificial
- [ ] Product Hunt launch (simple, not a big campaign)
- [ ] Hacker News "Show HN" post

### Ongoing
- [ ] Weekly LinkedIn posts highlighting curated resources
- [ ] Engage with comments and community feedback
- [ ] Track which categories get most traffic
- [ ] Collect feature requests for roadmap

---

## Post-Launch Roadmap

Features deferred to after soft launch (PRDs in `things_to_come/`):

1. **Basic Search** (`basic-search.md`) - Full-text search across resources
2. **Affiliate Links** (`affiliate-links.md`) - Monetization via affiliate URLs
3. **User Accounts** (`user-accounts.md`) - Authentication, bookmarks, progress tracking

---

## Cost Estimates

| Item | Free Tier Limit | Paid Cost (if exceeded) |
|------|-----------------|-------------------------|
| Vercel Hosting | 100GB bandwidth/mo | $20/mo Pro |
| Supabase | 500MB DB, 2GB bandwidth | $25/mo Pro |
| Domain | - | ~$12/year |
| Email Service (Resend) | 3,000 emails/mo | $20/mo |
| Sentry | 5K errors/mo | $26/mo Team |
| Plausible Analytics | - | $9/mo (or use free Vercel Analytics) |

**Target break-even:** ~$50-80/month

---

## Success Metrics

### Launch Goals (First 30 Days)
- 500+ unique visitors
- 50+ resources in library
- 10+ user submissions received
- Zero critical security incidents
- <1% error rate on API endpoints

### Growth Goals (First 90 Days)
- 2,000+ monthly visitors
- 100+ resources in library
- First Buy Me a Coffee supporter
- Featured in one newsletter or community

---

## Notes

- This plan prioritizes security and stability over features
- All post-launch features are documented in `things_to_come/`
- Adjust timeline based on feedback from soft launch
