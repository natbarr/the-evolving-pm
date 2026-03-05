# Design Refactor Plan — The Evolving PM

A step-by-step implementation plan for the full visual redesign. Each phase builds on the last, with logical commit and deploy checkpoints.

---

## Dependency Order

```
Phase 1: Token Foundation
    ↓
Phase 2: Core UI Components
    ↓
Phase 3: Header + Footer
    ↓
Phase 4: Icon System
    ↓
Phase 5: Resource Card + Filter Components
    ↓
Phase 6: Homepage
    ↓
Phase 7: Remaining Pages
    ↓
Phase 8: Cleanup
```

---

## Phase 1 — Token Foundation, Typography & Color System

**Goal:** Establish the design token layer and font system. Everything else builds on this.

### Changes
- `src/app/globals.css` — Add CSS custom property token layer (canvas, surface, accent, text, border tokens). Remove dark mode media query.
- `tailwind.config.ts` — Replace cold slate `primary` palette with warm stone values. Replace amber `accent` with forest green. Add `display` to `fontFamily`. Add semantic color aliases (`canvas`, `surface`).
- `src/app/layout.tsx` — Replace `localFont` (Geist) with `next/font/google`: Fraunces (display), DM Sans (body), JetBrains Mono (mono). Inject as CSS variables.

### Token Reference

| Token | Value | Usage |
|---|---|---|
| `--canvas` | `#FAF9F6` | Page background |
| `--surface` | `#F4F1EB` | Section backgrounds, footer |
| `--surface-raised` | `#FFFFFF` | Cards |
| `--text-primary` | `#1C1917` | Headings |
| `--text-body` | `#44403C` | Body copy |
| `--text-muted` | `#78716C` | Secondary text |
| `--border` | `#E7E2D9` | Default borders |
| `--border-strong` | `#C4BEB5` | Emphasized borders |
| `--accent` | `#2D5A4A` | Forest green — CTAs, links |
| `--accent-hover` | `#214237` | Hover state |
| `--accent-subtle` | `#E4EDE9` | Badge backgrounds |
| `--accent-text` | `#1A3D31` | Text on accent-subtle |

### Fonts

| Variable | Font | Usage |
|---|---|---|
| `--font-display` | Fraunces | Headings, wordmark, card titles |
| `--font-body` | DM Sans | All body text |
| `--font-mono` | JetBrains Mono | Overlines, badges, metadata labels |

**Commit:** `design: token foundation, typography, and color system`

---

## Phase 2 — Core UI Components

**Goal:** Update Badge, Button, and Card primitives to use new tokens and typography.

### Changes
- `src/components/ui/Badge.tsx` — `font-mono text-[0.625rem]`, square `rounded` corners (from `rounded-full`). Level/format variants use border outlines.
- `src/components/ui/Button.tsx` — Primary uses `bg-accent-600` (forest green). Outline hover refined. Focus rings use `ring-accent-600`.
- `src/components/ui/Card.tsx` — Remove `shadow-sm`/`hover:shadow-md`. `CardTitle` uses `font-display font-medium tracking-tight`. `CardDescription` uses `text-primary-500 leading-relaxed`.

**Commit:** `design: update core UI components`
**Checkpoint:** Verify Storybook or component usage looks correct before proceeding.

---

## Phase 3 — Header & Footer

**Goal:** Update global nav and footer to match new aesthetic.

### Changes
- `src/components/Header.tsx`
  - Wordmark: `font-display font-medium tracking-tight` with `<span className="text-accent-600">PM</span>`
  - "Submit" nav item becomes a filled green pill button
  - Focus rings: `ring-accent-600`
- `src/components/Footer.tsx`
  - Background: `bg-surface` (`#F4F1EB`)
  - Two-column layout: brand + tagline left, grouped nav right
  - Nav group headings: `font-mono text-[0.625rem] uppercase tracking-widest`
  - Slim bottom bar with copyright + personal links

**Commit:** `design: update header and footer`

---

## Phase 4 — Icon System Migration

**Goal:** Replace all emoji and ad-hoc Heroicons with a unified Phosphor icon system.

### Icon Map

| Old | New (Phosphor) | Location |
|---|---|---|
| 🧠 emoji | `Brain` | AI Fundamentals category |
| 📈 emoji | `TrendUp` | PM Strategy category |
| ⚙️ emoji | `Code` | Technical Skills category |
| 📊 emoji | `ChartLine` | Business & Economics category |
| Heroicon document | `Article` | Article format |
| Heroicon play | `Video` | Video format |
| Heroicon academic cap | `GraduationCap` | Course format |
| Heroicon microphone | `Microphone` | Podcast format |
| Heroicon book | `Books` | Book format |
| Heroicon mail | `EnvelopeSimple` | Newsletter format |

### Changes
- Install `@phosphor-icons/react`
- `src/lib/constants.ts` — Replace `icon: string` (emoji) in FORMATS with `Icon: Icon` (Phosphor component). Use `/dist/ssr` imports for server component safety.
- `src/components/EmptyState.tsx` — Replace 4 inline Heroicon SVGs with `Funnel`, `Folder`, `MagnifyingGlass`, `Tray` from Phosphor.
- `src/components/Pagination.tsx` — Replace chevron SVGs with `CaretLeft`, `CaretRight`.

> **Server component note:** All imports in `constants.ts` and server-rendered pages must use `@phosphor-icons/react/dist/ssr`. Client components (`"use client"`) can use the main package.

**Commit:** `design: migrate to Phosphor icon system`

---

## Phase 5 — Resource Card & Filter Components

**Goal:** Apply new design language to the core browsing experience.

### Changes
- `src/components/ResourceCard.tsx`
  - Card footer: `font-mono text-[0.625rem] uppercase tracking-wide`
  - Format icon: `{format?.Icon && <format.Icon size={13} />}`
  - Hover/focus: `accent-600`
- `src/components/FilterBar.tsx`
  - Focus ring: `focus:border-accent-600 focus:ring-accent-600`
- `src/components/CategoryNav.tsx`
  - Active state: `bg-accent-600 text-white`
  - Pill shape: `rounded-lg` (from `rounded-full`)
- `src/components/skeletons/ResourceCardSkeleton.tsx`
  - Remove `shadow-sm`
  - Badge placeholders: `rounded` (from `rounded-full`)

**Commit:** `design: update resource card and filter components`

---

## Phase 6 — Homepage

**Goal:** Redesign the homepage hero, categories section, and CTA to match the editorial aesthetic.

### Changes
- `src/app/page.tsx`
  - **Hero:** Remove gradient. Left-aligned. Mono eyebrow label with horizontal rule. Large Fraunces h1 with italic `text-accent-600` "curated."
  - **Categories:** Add section overline. Phosphor icons per category.
  - **Why section:** `bg-surface`, left-aligned, `font-display` subheadings.
  - **CTA:** Bordered callout card, button right-aligned on desktop.

**Commit:** `design: redesign homepage`
**Deploy checkpoint:** Good moment to preview on staging/Vercel preview URL.

---

## Phase 7 — Remaining Pages

**Goal:** Apply consistent design language across all remaining pages.

### Changes
- `src/app/resources/page.tsx` — Mono overline, `font-display` h1, `accent-600` card hover borders.
- `src/app/resources/[slug]/page.tsx` — Fix `format?.icon` → `format?.name` / `<format.Icon />`. Apply typography updates.
- `src/app/categories/page.tsx` — Mono overline, `font-display` h1.
- `src/app/categories/[category]/page.tsx` — Breadcrumb in `font-mono text-[0.625rem] uppercase`. Card hover borders `accent-600`.
- `src/app/about/page.tsx` — All headings `font-display font-normal tracking-tight`. Philosophy/creator cards `bg-surface`. Body text `text-primary-600`.
- `src/app/submit/page.tsx` — Phosphor `CheckCircle` for success state and checklist. Focus rings `accent-600`. H1 `font-display font-normal tracking-tight`.
- `src/app/not-found.tsx` — 404: `font-display text-8xl font-light text-primary-200`. H1: `font-display text-2xl font-normal tracking-tight`.
- `src/app/loading.tsx` — Spinner: `border-t-accent-600`.

**Commit:** `design: polish and finalize remaining pages`
**Deploy checkpoint:** Full site review before cleanup.

---

## Phase 8 — Cleanup

**Goal:** Remove temporary files and unused assets.

### Changes
- Move `design-preview.html` → `archive/design-preview.html`
- Move `design-refactor.md` → `archive/design-refactor.md`
- Delete `src/app/fonts/GeistVF.woff` and `GeistMonoVF.woff` (replaced by Google Fonts)
- Remove empty `src/app/fonts/` directory

**Commit:** `design: cleanup temporary files and unused assets`

---

## Completed Commits

```
7e26a57  design: polish and finalize remaining pages
b08f955  design: redesign homepage
b99c329  design: update resource card and filter components
e85df30  design: migrate to Phosphor icon system
e49dfeb  design: update header and footer
b557c13  design: update core UI components
b880459  design: token foundation, typography, and color system
```
