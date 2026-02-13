# Affiliate Links

## Overview
Add support for affiliate links to generate passive revenue from resource recommendations, starting with books and paid courses.

## Problem
The site has ongoing costs (hosting, database, domain) but no revenue stream. Many resources link to purchasable content (books, courses, tools) that offer affiliate programs.

## Proposed Solution
Add an optional `affiliate_url` field to resources. When present, external links use the affiliate URL instead of the regular URL. Include appropriate disclosure for transparency.

## User Stories
- As a site owner, I want to earn commission when users purchase resources I recommend
- As a user, I want to know when links are affiliate links (transparency)
- As a site owner, I want to easily manage which resources have affiliate links

## Scope

### In Scope
- Add `affiliate_url` field to resource schema
- Update resource detail page to use affiliate URL when present
- Update resource card external link to use affiliate URL when present
- Add disclosure text in footer ("Some links may earn us a commission")
- Add disclosure badge/indicator on individual affiliate links
- Document process for adding affiliate URLs

### Out of Scope (for now)
- Automatic affiliate link generation
- Click tracking / analytics
- A/B testing affiliate vs non-affiliate
- Multiple affiliate programs per resource

## Technical Approach

### Database
```sql
ALTER TABLE resources ADD COLUMN affiliate_url TEXT;
```

### Ingest Schema Update
Add optional `affiliate_url` to the Zod schema in `/api/ingest/route.ts`.

### Frontend Changes
- Update `ResourceCard.tsx` - use `affiliate_url || url` for external link
- Update `[slug]/page.tsx` - use `affiliate_url || url` for CTA button
- Add `rel="sponsored noopener"` to affiliate links (SEO best practice)
- Add small "Affiliate" badge or icon next to affiliate links
- Add disclosure text to Footer component

### Workflow
1. Sign up for affiliate programs (Amazon Associates, Udemy, etc.)
2. When assessing resources, add affiliate URL to JSON if applicable
3. Ingest as normal - affiliate URLs flow through

## Affiliate Programs to Target

| Platform | Commission | Approval |
|----------|------------|----------|
| Amazon Associates | 4-5% | Easy, instant |
| Udemy | 10-15% | Application required |
| Coursera | 10-45% | Via Impact |
| LinkedIn Learning | Varies | Via Impact |
| O'Reilly | 10% | Application required |

## Success Metrics
- Number of resources with affiliate links
- Click-through rate on affiliate links
- Monthly affiliate revenue

## Legal / Compliance
- FTC requires clear disclosure of affiliate relationships
- Links should have `rel="sponsored"` attribute
- Disclosure should be visible (footer + near links)

### Implementation Checklist
- [ ] Add affiliate disclosure text in footer ("Some links may earn us a commission")
- [ ] Add disclosure badge/indicator on individual affiliate links
- [ ] Update privacy policy to mention affiliate relationships

## Estimated Effort
- Database migration: 15 minutes
- Schema update: 15 minutes
- Frontend changes: 1-2 hours
- Disclosure text: 30 minutes
- Documentation: 30 minutes

## Open Questions
- Should affiliate links open in new tab? (Currently external links do)
- How prominent should the affiliate indicator be?
- Should we track affiliate clicks internally before redirecting?
