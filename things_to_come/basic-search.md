# Basic Search

## Overview
Add search functionality to help users find resources by keyword across titles, summaries, authors, and sources.

## Problem
Users currently rely on category browsing and filters to find resources. As the library grows, this becomes inefficient for users who know what they're looking for or want to explore a specific topic that spans multiple categories.

## Proposed Solution
Implement a search bar in the header that queries resources using Supabase full-text search.

## User Stories
- As a user, I want to search for resources by keyword so I can quickly find relevant content
- As a user, I want to see search results ranked by relevance
- As a user, I want to search from any page without navigating away first

## Scope

### In Scope
- Search input in header (all pages)
- Full-text search across: title, summary, author, source
- Dedicated search results page with resource cards
- Basic relevance ranking
- "No results" state with suggestions
- Search query preserved in URL (shareable links)

### Out of Scope (for now)
- Filters on search results page
- Search suggestions/autocomplete
- Search analytics
- Fuzzy matching / typo tolerance
- Advanced query syntax

## Technical Approach

### Database
Add a tsvector column for full-text search:
```sql
ALTER TABLE resources ADD COLUMN search_vector tsvector;
CREATE INDEX idx_resources_search ON resources USING gin(search_vector);

-- Trigger to auto-update on insert/update
CREATE TRIGGER resources_search_update
  BEFORE INSERT OR UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION
  tsvector_update_trigger(search_vector, 'pg_catalog.english', title, summary, author, source);
```

### API
- `GET /api/search?q={query}` or use Supabase client directly
- Return paginated results ordered by relevance

### Frontend
- Search input component in Header
- `/search?q={query}` results page
- Debounced input (300ms) before searching

## Success Metrics
- Search usage rate (% of sessions that use search)
- Search-to-click rate (% of searches that result in resource click)
- Zero-result rate (should be low)

## Dependencies
- None (Supabase supports full-text search natively)

## Estimated Effort
- Backend: 2-3 hours
- Frontend: 3-4 hours
- Testing: 1-2 hours

## Open Questions
- Should search include archived/inactive resources?
- Minimum query length (2 chars? 3 chars?)
