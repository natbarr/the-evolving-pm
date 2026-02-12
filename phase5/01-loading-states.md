# Content-Shaped Loading Skeletons

## Overview
Replace generic pulse skeletons with content-shaped placeholders that match the actual layout of resource cards, giving users a better sense of what's loading.

## Problem
Current loading states show uniform gray rectangles that don't indicate what content is coming. Users see 6 identical `h-64` boxes with no visual hierarchy, making the loading experience feel disconnected from the actual content.

## Proposed Solution
Create skeleton components that mirror the structure of actual content:
- Resource cards with placeholder lines for title, metadata, and description
- Filter bar skeleton matching actual filter controls
- Category cards with icon placeholder and text lines

## User Stories
- As a user, I want loading states that show me the shape of content so I know what to expect
- As a user, I want a smooth transition from skeleton to content without jarring layout shifts

## Scope

### In Scope
- `ResourceCardSkeleton` component matching `ResourceCard` layout
- `CategoryCardSkeleton` component matching category card layout
- `FilterBarSkeleton` component matching filter controls
- Consistent pulse animation across all skeletons
- Proper sizing to prevent Cumulative Layout Shift (CLS)

### Out of Scope
- Shimmer/wave animation (using pulse for simplicity)
- Image lazy loading with blur-up effect
- Per-field loading states in forms

## Technical Approach

### Components to Create
```
src/components/skeletons/
├── ResourceCardSkeleton.tsx
├── CategoryCardSkeleton.tsx
├── FilterBarSkeleton.tsx
└── index.ts
```

### ResourceCardSkeleton Structure
```tsx
// Mirrors ResourceCard layout:
// - Badge placeholder (small rectangle)
// - Title placeholder (2 lines, different widths)
// - Metadata row (3 small items)
// - Description placeholder (3 lines)
```

### Integration Points
- `src/app/resources/page.tsx` - Replace current skeleton grid
- `src/app/categories/page.tsx` - Add category card skeletons
- `src/app/categories/[category]/page.tsx` - Replace current skeleton

### Animation
Use existing Tailwind `animate-pulse` for consistency:
```tsx
<div className="animate-pulse bg-primary-100 rounded" />
```

## Success Metrics
- Zero CLS (Cumulative Layout Shift) score on page load
- User perception of faster loading (qualitative)

## Dependencies
- None

## Estimated Effort
- Components: 1-2 hours
- Integration: 30 minutes
- Testing: 30 minutes

## Decisions
- Skeleton count: Fixed at 6 (simple, sufficient for curated library size)
