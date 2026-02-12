# Enhanced Empty States

## Overview
Replace plain text empty states with visual treatments featuring icons, helpful messaging, and actionable CTAs.

## Problem
Current empty states are minimal text strings (e.g., "No resources match your filters") that:
- Don't provide visual feedback that draws attention
- Offer no guidance on what to do next
- Feel like an error rather than a natural state

## Proposed Solution
Create a reusable `EmptyState` component with:
- Contextual icon (search, filter, folder, etc.)
- Clear heading explaining the state
- Helpful description with suggestions
- Optional CTA button(s)

## User Stories
- As a user, I want to understand why there are no results and what I can do about it
- As a user, I want clear actions to recover from an empty state (clear filters, browse all, etc.)

## Scope

### In Scope
- Reusable `EmptyState` component with icon, title, description, and CTA props
- Empty states for:
  - Resources page with filters applied (no matches)
  - Category detail page (no resources in category)
  - Search results (future-proofing)
- Icon set using existing Heroicons or similar

### Out of Scope
- Custom illustrations (using icons instead)
- Animated empty states
- Error states (separate concern)

## Technical Approach

### EmptyState Component API
```tsx
interface EmptyStateProps {
  icon: 'search' | 'filter' | 'folder' | 'inbox';
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}
```

### Usage Examples

**Filtered resources (no matches):**
```tsx
<EmptyState
  icon="filter"
  title="No matching resources"
  description="Try adjusting your filters or browse all resources."
  action={{ label: "Clear filters", onClick: clearFilters }}
  secondaryAction={{ label: "Browse all", href: "/resources" }}
/>
```

**Empty category:**
```tsx
<EmptyState
  icon="folder"
  title="No resources yet"
  description="This category is waiting for content. Check back soon or suggest a resource!"
  action={{ label: "Submit a resource", href: "/submit" }}
/>
```

### File Location
```
src/components/EmptyState.tsx
```

### Icon Options (Heroicons outline)
- `MagnifyingGlassIcon` - search/no results
- `FunnelIcon` - filter/no matches
- `FolderOpenIcon` - empty category
- `InboxIcon` - generic empty

## Success Metrics
- Reduced bounce rate from empty states
- Increased use of suggested actions (clear filters, submit resource)

## Dependencies
- Heroicons (likely already installed) or similar icon library

## Estimated Effort
- Component: 1 hour
- Integration: 1 hour
- Testing: 30 minutes

## Decisions
- Empty category pages: Both - "Check back soon or suggest a resource!" with Submit CTA
