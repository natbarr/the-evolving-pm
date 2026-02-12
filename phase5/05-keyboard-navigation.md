# Keyboard Navigation Audit

## Overview
Test and ensure all interactive elements are keyboard accessible with visible focus states and logical tab order.

## Problem
While basic keyboard navigation works (all elements are focusable), we need to verify:
- Tab order follows visual layout
- Focus is clearly visible on all elements
- No keyboard traps exist
- Custom components are fully keyboard accessible

## Proposed Solution
Conduct a systematic keyboard navigation audit and fix any issues found.

## User Stories
- As a keyboard user, I want to navigate the entire site without a mouse
- As a keyboard user, I want to clearly see which element is focused
- As a keyboard user, I want a logical tab order that matches visual layout

## Scope

### In Scope
- Tab order audit on all pages
- Focus visibility audit
- Skip link implementation
- Keyboard trap detection
- Filter dropdown keyboard support
- Pagination keyboard support

### Out of Scope
- Custom keyboard shortcuts
- Arrow key navigation within components
- Focus management for dynamic content (covered in accessibility PRD)

## Technical Approach

### Audit Checklist

**Global Elements:**
| Element | Tab Order | Focus Visible | Keyboard Operable | Status |
|---------|-----------|---------------|-------------------|--------|
| Skip to content link | First | Yes | Yes | TBD |
| Logo/home link | After skip | Yes | Yes | TBD |
| Nav links | Sequential | Yes | Yes | TBD |
| Mobile menu button | Yes | Yes | Enter/Space | TBD |

**Resources Page:**
| Element | Tab Order | Focus Visible | Keyboard Operable | Status |
|---------|-----------|---------------|-------------------|--------|
| Category filter | Yes | Yes | Enter opens | TBD |
| Level filter | Yes | Yes | Enter opens | TBD |
| Format filter | Yes | Yes | Enter opens | TBD |
| Resource cards | Yes | Yes | Enter follows link | TBD |
| Pagination prev | Yes | Yes | Enter/Space | TBD |
| Pagination numbers | Yes | Yes | Enter/Space | TBD |
| Pagination next | Yes | Yes | Enter/Space | TBD |

**Submit Page:**
| Element | Tab Order | Focus Visible | Keyboard Operable | Status |
|---------|-----------|---------------|-------------------|--------|
| URL input | Yes | Yes | Type | TBD |
| Email input | Yes | Yes | Type | TBD |
| Context textarea | Yes | Yes | Type | TBD |
| Submit button | Yes | Yes | Enter/Space | TBD |

### Skip Link Implementation
```tsx
// In layout.tsx or Header component
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-primary-900 focus:rounded focus:shadow-lg"
>
  Skip to main content
</a>

// Main content target
<main id="main-content" tabIndex={-1}>
```

### Focus Style Audit
Ensure all interactive elements have visible focus:
```css
/* Check these are applied consistently */
focus-visible:ring-2
focus-visible:ring-offset-2
focus-visible:ring-accent-500
```

### Testing Process
1. Start at browser address bar
2. Press Tab repeatedly through entire page
3. Verify each element:
   - Is focusable when expected
   - Shows visible focus indicator
   - Responds to Enter/Space appropriately
   - Tab order matches visual order (left-to-right, top-to-bottom)
4. Press Shift+Tab to verify reverse order
5. Test with screen reader (VoiceOver/NVDA) for announcements

### Common Fixes
```tsx
// Ensure buttons have type
<button type="button">...</button>

// Ensure links have href or are buttons
<Link href="/path">...</Link>  // Good
<span onClick={...}>...</span> // Bad - use button

// Ensure disabled states are properly handled
<button disabled aria-disabled="true">...</button>
```

## Success Metrics
- 100% of interactive elements are keyboard accessible
- All elements have visible focus states
- Tab order matches visual layout
- Skip link functions correctly

## Dependencies
- None

## Estimated Effort
- Audit: 1-2 hours
- Fixes: 1-2 hours (depending on findings)
- Testing: 1 hour

## Decisions
- Resource cards: Single tab stop (whole card clickable to detail page)
