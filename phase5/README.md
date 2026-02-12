# Phase 5: Usability & Polish

Pre-launch UX improvements for The Evolving PM.

## Work Items

| # | Item | Effort | Dependencies |
|---|------|--------|--------------|
| 01 | [Loading States](01-loading-states.md) | 2-3 hrs | None |
| 02 | [Empty States](02-empty-states.md) | 2-3 hrs | None |
| 03 | [Mobile Navigation](03-mobile-navigation.md) | 3-4 hrs | None |
| 04 | [Form Validation](04-form-validation.md) | 3 hrs | None |
| 05 | [Keyboard Navigation](05-keyboard-navigation.md) | 3-4 hrs | None |
| 06 | [Accessibility Audit](06-accessibility-audit.md) | 4-6 hrs | 04, 05 |

**Total Estimated Effort:** 17-23 hours

## Suggested Implementation Order

### Batch 1: Foundation (can be parallelized)
1. **Loading States** - Quick win, improves perceived performance
2. **Empty States** - Quick win, improves user guidance
3. **Form Validation** - Improves form UX independent of other work

### Batch 2: Audit & Fix
4. **Mobile Navigation** - Audit touch targets, add backdrop
5. **Keyboard Navigation** - Audit tab order, add skip link

### Batch 3: Final Verification
6. **Accessibility Audit** - Run after other changes are complete to catch any regressions

## Key Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Loading animation | Content-shaped pulse | Simpler than shimmer, matches existing patterns |
| Empty state visuals | Icon + text + CTA | Good balance of visual appeal and simplicity |
| Validation timing | Hybrid (blur + change) | Best UX: not too aggressive, not too passive |
| Priority | All items required | Complete polish before launch |

## Open Questions (Cross-Cutting)

1. ~~Should skeleton count match expected content or stay fixed?~~ **Decided: Fixed at 6**
2. ~~Should empty category pages encourage submissions?~~ **Decided: Both - check back + submit CTA**
3. ~~Show success state (green) when form fields are valid?~~ **Decided: Yes**
4. ~~Should resource cards be single or multiple tab stops?~~ **Decided: Single (whole card)**
5. ~~Add accessibility statement page?~~ **Decided: Deferred to post-launch**

## Definition of Done

- [ ] All 6 work items implemented
- [ ] Tests passing (existing + new)
- [ ] Lighthouse accessibility score 90+
- [ ] Manual keyboard navigation verified
- [ ] Mobile tested on real device
- [ ] soft_launch_plan.md Phase 5 tasks marked complete
