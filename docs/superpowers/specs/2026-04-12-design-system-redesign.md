# Design System Redesign — AI CRE Tools
**Date:** 2026-04-12
**Status:** Approved — ready for implementation

---

## Overview

A full redesign of aicretools.com using openalternative.co as the primary design reference (80% foundation) with a CRE-specific identity layer (20%). The result is a polished, minimal directory site that reads as grounded in commercial real estate rather than open-source software.

**Reference:** `src/app/clone/` — working pixel-perfect clone of openalternative.co built as part of this project. Use it as a live reference during implementation.

**Reusability note:** This design system is intentionally generic enough to apply to any vertical directory (proptech, legaltech, healthtech). The token system below can be forked with only accent color and hero texture changes.

---

## Design Principles

1. **Content first** — tools are the product, UI is the shelf
2. **Flat over dimensional** — no heavy shadows, no translateY on hover, 100ms transitions only
3. **One accent color** — moss green used sparingly as a signal, not decoration
4. **Openalternative spacing discipline** — exact px values, not Tailwind scale guesses
5. **Inter only** — no display/serif fonts, tight letter-spacing carries the personality

---

## Token System

### Colors

| Token | Value | Usage |
|---|---|---|
| Background | `#ffffff` | Page background |
| Card bg | `#fafafa` | All card surfaces |
| Border | `#e0e0e0` | Cards, inputs, dividers |
| Border width | `1.25px` | All borders |
| Text primary | `#1f1f1f` | Headings, body |
| Text muted | `#737373` | Subtitles, meta, placeholders |
| Primary accent | `#629649` | Buttons, active chips, links |
| Primary hover | `#4a7238` | Hover state for primary |
| Primary subtle | `#f0f9f0` | Chip backgrounds, icon wells |
| Primary border | `#b9e5b9` | Chip borders, focus rings |

> **Forking this system:** Swap `#629649` / `#4a7238` / `#f0f9f0` / `#b9e5b9` for any accent color family. Everything else stays the same.

### Typography

| Role | Size | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|
| Hero heading | 48px | 600 | -1.2px | 1.0 |
| Page heading | 32px | 600 | -0.5px | 1.1 |
| Section heading | 24px | 600 | -0.3px | 1.2 |
| Body | 16px | 400 | 0 | 1.6 |
| Small / meta | 14px | 400 | 0 | 1.4 |
| Tiny / caption | 12px | 400 | 0 | 1.4 |

**Font:** Inter via `next/font/google` — already loaded as `var(--font-inter)`.
No serif, no display font, no mixed type. Inter's letter-spacing at negative values carries all the personality needed.

### Spacing & Shape

| Token | Value |
|---|---|
| Container max-width | `1088px` |
| Container padding | `32px` horizontal |
| Section padding | `80px` vertical |
| Card padding | `20px` |
| Card gap | `16px` |
| Card border-radius | `8px` |
| Button border-radius | `6px` |
| Chip border-radius | `6px` |
| Input border-radius | `8px` |
| Nav height | `50px` |

### Transitions

```css
transition: all 100ms cubic-bezier(0, 0, 0.2, 1);
```

All interactive elements use this single transition. No exceptions.

---

## Components

### Navigation

- **Height:** 50px, fixed, `background: #ffffff`
- **Bottom fade mask:** 32px gradient `linear-gradient(to bottom, #ffffff, transparent)` rendered below the nav bar to softly separate it from content
- **Left:** Logo (SVG or text wordmark)
- **Center:** Browse, Categories links — 14px, `#737373`, hover `#1f1f1f`
- **Right:** Global search trigger pill + "Get Updates" button
- **Search trigger:** Pill shape, `border: 1.25px solid #e0e0e0`, magnifier icon + "Search tools..." in muted text, opens full search on click
- **CTA button:** "Get Updates" — `#629649` bg, white text, `6px` radius, `8px 16px` padding, 14px weight 500

### Hero

- **Layout:** Centered, full-width, `80px` vertical padding
- **Background:**
  - Layer 1 (bottom): Architectural grid texture — thin `#e8e8e8` lines at 20px intervals, `opacity: 0.08`, `background-size: 20px 20px`
  - Layer 2 (top): `linear-gradient(to top, #ffffff 0%, transparent 60%)` fade mask
  - Implementation: Two absolute `<div>` elements, same pattern as openalternative's `graph.webp` approach
- **Grid texture CSS:**
  ```css
  background-image: 
    linear-gradient(#e8e8e8 1px, transparent 1px),
    linear-gradient(90deg, #e8e8e8 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.08;
  ```
- **Headline:** "Find the Best AI Tools for Commercial Real Estate" — 48px, weight 600, letter-spacing -1.2px, `#1f1f1f`
- **Subtitle:** 16px, `#737373`, max-width 512px, centered
- **Search bar:** Full-width, max-w-2xl, 48px tall, `8px` radius, `1.25px solid #e0e0e0`, magnifier icon left, "Search 100+ CRE AI tools..." placeholder
- **Category chips:** Below search, 12px gap — All, Valuation, Leasing, Property Management, Due Diligence, Transactions, Development. Active: `#629649` bg + white text. Default: `#fafafa` bg + `#e0e0e0` border.

### Tool Card

- **Grid:** 3-col desktop (`lg:grid-cols-3`), 2-col tablet (`md:grid-cols-2`), 1-col mobile
- **Surface:** `#fafafa` bg, `1.25px solid #e0e0e0` border, `8px` radius, `20px` padding
- **Hover:** border-color → `rgba(98, 150, 73, 0.4)`, `100ms ease-out` — no lift, no shadow change
- **Header row:**
  - Favicon: `<img>` via Google S2 API (`https://www.google.com/s2/favicons?sz=64&domain=...`), 40px, `8px` radius
  - Tool name: 14px, weight 600, `#1f1f1f`, links to `/{slug}`
  - Domain: 12px, `#737373`, truncated
- **Body:** One-liner description, 14px, `#737373`, 2-line clamp
- **Footer row:** Use-case tag chips
  - Style: `#f0f9f0` bg, `#629649` text, `6px` radius, `4px 8px` padding, 12px font
  - Max 2–3 chips per card, overflow hidden

### Category Chips (filter row)

| State | Bg | Border | Text |
|---|---|---|---|
| Default | `#fafafa` | `1.25px solid #e0e0e0` | `#1f1f1f` |
| Hover | `#f0f9f0` | `1.25px solid #b9e5b9` | `#1f1f1f` |
| Active | `#629649` | none | `#ffffff` |

### Buttons

| Variant | Bg | Text | Border | Hover bg |
|---|---|---|---|---|
| Primary | `#629649` | `#ffffff` | — | `#4a7238` |
| Secondary | `#ffffff` | `#1f1f1f` | `1.25px solid #e0e0e0` | `#fafafa` |
| Ghost | transparent | `#737373` | — | `#fafafa` |

All buttons: `6px` radius, `8px 16px` padding, 14px weight 500, `100ms ease-out`.

### Global Search (upgraded)

- Triggered by nav pill or `⌘K`
- Full-screen overlay: `rgba(255,255,255,0.95)` backdrop with blur
- Input: large (20px font), borderless, autofocused
- Results: tool name + favicon + one-liner, grouped by category
- Keyboard nav: arrow keys, enter to navigate, escape to close
- Empty state: "No tools found for..." with suggested categories

---

## Page Layouts

### Homepage (`/`)

```
┌─────────────────────────────────────────┐
│  NAV (fixed 50px + fade mask)           │
├─────────────────────────────────────────┤
│  HERO                                   │
│  Grid texture bg + gradient fade        │
│  Headline / Subtitle / Search / Chips   │
├─────────────────────────────────────────┤
│  TOOL GRID (3-col)                      │
│  Sorted by display_order                │
│  Paginated                              │
├─────────────────────────────────────────┤
│  BROWSE BY CATEGORY                     │
│  Text-link directory, 2-col grid        │
│  Name + tool count                      │
├─────────────────────────────────────────┤
│  FOOTER                                 │
└─────────────────────────────────────────┘
```

### Category page (`/categories/[slug]`)

```
┌─────────────────────────────────────────┐
│  Breadcrumb: Home / Categories / Name   │
│  H1 (category name)                     │
│  Description (muted)                    │
│  "See also:" sibling category chips     │
├─────────────────────────────────────────┤
│  Search (scoped) + Order by dropdown    │
├─────────────────────────────────────────┤
│  TOOL GRID (3-col) — same card anatomy  │
│  Pagination                             │
└─────────────────────────────────────────┘
```

### Tool detail (`/[slug]`)

```
┌──────────────────────────┬──────────────┐
│  Favicon + Name          │  INFO CARD   │
│  One-liner               │  (sticky)    │
│  "Used for:" chips       │              │
│  ─────────────────────   │  Pricing     │
│  Description             │  Category    │
│  ─────────────────────   │  Website CTA │
│  Similar tools (3-col)   │  (green btn) │
└──────────────────────────┴──────────────┘
```

- Column split: `lg:grid-cols-[1fr_360px]`
- Sidebar sticky: `sticky top-[66px]` (nav height + gap)
- Mobile: sidebar stacks below main content

### Footer

```
┌────────────┬─────────┬────────────┬──────────────────┐
│ Logo       │ Browse  │ Resources  │ Submit a Tool    │
│ Tagline    │ Links   │ Links      │ (CTA button)     │
└────────────┴─────────┴────────────┴──────────────────┘
Newsletter: Single email row, subtle — "Stay updated on new CRE AI tools"
Copyright bar
```

---

## CSS Implementation Notes

### globals.css changes

Replace current HSL variable system with flat hex tokens:

```css
@theme {
  --color-background: #ffffff;
  --color-card: #fafafa;
  --color-border: #e0e0e0;
  --color-foreground: #1f1f1f;
  --color-muted-foreground: #737373;
  --color-primary: #629649;
  --color-primary-hover: #4a7238;
  --color-primary-subtle: #f0f9f0;
  --color-primary-border: #b9e5b9;
  --radius: 8px;
  --radius-sm: 6px;
}
```

### Architectural grid texture (reusable utility class)

```css
.hero-grid-texture {
  background-image:
    linear-gradient(#e8e8e8 1px, transparent 1px),
    linear-gradient(90deg, #e8e8e8 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.08;
}
```

### Nav fade mask

```css
.nav-fade-mask::after {
  content: '';
  position: absolute;
  bottom: -32px;
  left: 0;
  right: 0;
  height: 32px;
  background: linear-gradient(to bottom, #ffffff, transparent);
  pointer-events: none;
}
```

---

## What Stays the Same

- All copy, tool names, descriptions, and categories
- Header structure (logo position, link labels, right-side CTA)
- Supabase data layer and all fetch logic
- shadcn/ui component primitives (Button, Input, etc.) — just re-themed
- Routing structure (`/`, `/[slug]`, `/categories/[category]`)
- PostHog analytics
- SEO metadata

## What Changes

- `globals.css` — all color tokens replaced
- `tailwind.config.ts` — green scale promoted to primary, indigo removed
- `Header.tsx` — search trigger redesigned, tokens updated
- `Hero.tsx` — architectural grid bg, new search bar, chip row
- `DirectoryItemCard.tsx` — new card anatomy (fafafa bg, 1.25px border, use-case chips in footer)
- `CategoryCard.tsx` — text-link style for browse section
- `Footer.tsx` — 4-col layout, submit CTA, subtle newsletter
- `globals.css` hero texture utility added

---

## Files to Create / Modify

| File | Action | Notes |
|---|---|---|
| `src/app/globals.css` | Modify | Replace token system |
| `tailwind.config.ts` | Modify | Green as primary, remove indigo |
| `src/components/layout/Header.tsx` | Modify | New search trigger, tokens |
| `src/components/landing/Hero.tsx` | Modify | Grid bg, search-first layout |
| `src/components/listing/DirectoryItemCard.tsx` | Modify | New card design |
| `src/components/category/CategoryCard.tsx` | Modify | Text-link style |
| `src/components/layout/Footer.tsx` | Modify | 4-col, submit CTA |
| `src/components/layout/GlobalSearch.tsx` | Modify | Overlay design upgrade |
| `src/components/ui/button.tsx` | Modify | New token values |
| `src/components/ui/input.tsx` | Modify | New border/radius tokens |
