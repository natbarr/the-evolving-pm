# Mobile Navigation & Touch Targets

## Overview
Audit and improve mobile navigation experience, ensuring touch targets meet accessibility guidelines and the mobile menu is intuitive.

## Problem
While the current mobile navigation functions correctly, we need to verify:
- Touch targets are at least 44x44px (WCAG AAA) or 48x48px (Material Design)
- Tap areas don't overlap or sit too close together
- Mobile menu closing behavior is intuitive
- Navigation works well with varying text sizes

## Proposed Solution
Audit all interactive elements for mobile and fix any touch target issues. Consider adding a backdrop overlay for the mobile menu.

## User Stories
- As a mobile user, I want to easily tap navigation links without accidentally hitting the wrong one
- As a mobile user, I want the menu to close when I tap outside of it
- As a user with motor impairments, I want adequately sized touch targets

## Scope

### In Scope
- Audit all touch targets (links, buttons, form controls)
- Fix any targets below 44x44px minimum
- Add backdrop overlay to mobile menu
- Ensure adequate spacing between tappable elements
- Test with actual mobile devices or accurate emulation

### Out of Scope
- Gesture navigation (swipe to close)
- Bottom navigation bar pattern
- Pull-to-refresh

## Technical Approach

### Touch Target Audit Checklist
| Element | Location | Current Size | Target | Status |
|---------|----------|--------------|--------|--------|
| Nav links | Header | TBD | 44px min | TBD |
| Mobile menu button | Header | TBD | 44px min | TBD |
| Filter dropdowns | Resources | TBD | 44px min | TBD |
| Pagination links | Resources | TBD | 44px min | TBD |
| Form inputs | Submit | TBD | 44px min | TBD |
| Resource cards | List | TBD | N/A (large) | TBD |
| Footer links | Footer | TBD | 44px min | TBD |

### Mobile Menu Improvements
```tsx
// Add backdrop overlay
{mobileMenuOpen && (
  <div
    className="fixed inset-0 bg-black/20 z-40 md:hidden"
    onClick={() => setMobileMenuOpen(false)}
    aria-hidden="true"
  />
)}
```

### Touch Target Fixes
Ensure minimum padding/sizing:
```tsx
// Link with minimum touch target
<Link className="min-h-[44px] min-w-[44px] flex items-center px-3 py-2">
```

### Testing Approach
1. Chrome DevTools device emulation
2. Real device testing (iOS Safari, Android Chrome)
3. Test with browser zoom at 200%

## Success Metrics
- All interactive elements meet 44x44px minimum
- No overlapping touch targets
- Passes mobile usability audit

## Dependencies
- None

## Estimated Effort
- Audit: 1 hour
- Fixes: 1-2 hours
- Testing: 1 hour

## Open Questions
- Should footer links be larger on mobile or is current size acceptable?
- Add "close" button inside mobile menu or rely on backdrop/X button?
