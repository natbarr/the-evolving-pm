# Accessibility Statement Page

## Overview
Add a dedicated page describing the site's commitment to accessibility and how users can report issues.

## Problem
Users with disabilities may want to know what accessibility standards the site targets and how to get help if they encounter barriers.

## Proposed Solution
Create a simple `/accessibility` page with:
- Statement of commitment to accessibility
- Target standard (WCAG 2.1 AA)
- Known limitations (if any)
- How to report issues (contact method)
- Date of last review

## User Stories
- As a user with a disability, I want to know the site takes accessibility seriously
- As a user who encounters a barrier, I want to know how to report it

## Scope

### In Scope
- Static page at `/accessibility`
- Link in footer
- Basic content covering commitment, standards, and contact

### Out of Scope
- Detailed conformance report
- Third-party accessibility audit certification
- Multiple language versions

## Content Template
```markdown
# Accessibility

The Evolving PM is committed to making this site accessible to everyone.

## Our Standards
We aim to meet WCAG 2.1 Level AA guidelines.

## Reporting Issues
If you encounter an accessibility barrier, please reach out via [LinkedIn].
We take all feedback seriously and will work to address issues promptly.

## Ongoing Efforts
We regularly review and improve the site's accessibility.
Last reviewed: [Date]
```

## Estimated Effort
- Content + page: 1 hour

## Dependencies
- None (can be added anytime)
