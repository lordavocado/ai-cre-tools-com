---
version: alpha
name: "AI CRE Tools Directory UI (OpenAlternative-inspired, green accent)"
description: >
  Human + agent-readable design system for aicretools.com. YAML tokens follow the
  Google Stitch / DESIGN.md open spec (hex colors, top-level token groups) so tools
  like npx @google/design.md can lint and export. Runtime CSS in globals.css keeps
  HSL channels for Tailwind v4 @theme — hex values here are the same sRGB colors.

# Normative tokens (schema: https://github.com/google-labs-code/design.md/blob/main/docs/spec.md)
colors:
  background: "#FFFFFF"
  foreground: "#0F172A"
  card: "#FFFFFF"
  card_foreground: "#0F172A"
  popover: "#FFFFFF"
  popover_foreground: "#0F172A"
  primary: "#2F7448"
  primary_foreground: "#FFFFFF"
  secondary: "#F8FAFC"
  secondary_foreground: "#0F172A"
  muted: "#F4F7FA"
  muted_foreground: "#64748B"
  border: "#E2E8F0"
  input: "#E2E8F0"
  ring: "#2F7448"
  destructive: "#EF4444"
  destructive_foreground: "#F8FAFC"

typography:
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.01em
  body-md:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.08em

rounded:
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  "2xl": 48px
  "3xl": 64px

# Shadows stay in prose (Elevation section); not part of the core YAML schema.
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary_foreground}"
    rounded: "{rounded.md}"
    height: 44px
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary_foreground}"
    rounded: "{rounded.md}"
    height: 44px
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    height: 44px
---

## Overview

This UI is a **directory-first** product: it should feel editorial, dense, and calm — closer to a curated catalogue than a flashy SaaS landing page.

The visual benchmark is **OpenAlternative**-style restraint (typography, spacing, card polish), with one twist:

- **Green is the brand accent** — and it is used sparingly.

**Format (Stitch / DESIGN.md):** This file follows Google’s [DESIGN.md overview](https://stitch.withgoogle.com/docs/design-md/overview), [specification](https://stitch.withgoogle.com/docs/design-md/specification/), and [usage](https://stitch.withgoogle.com/docs/design-md/usage/) (same rules as the open [design.md spec on GitHub](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md)): optional YAML front matter with **hex** `colors`, then ordered markdown sections. Validate or export with the [CLI](https://stitch.withgoogle.com/docs/design-md/cli/) (`npx -y @google/design.md lint DESIGN.md`). **Implementation** still maps these colors to **HSL channels** in `src/app/globals.css` for Tailwind — the hex values above are the matching sRGB colors.

Design principles:

- **Editorial over template**: cards read like entries, not feature tiles.
- **Accent is scarce**: the green token is for the **primary CTA** (and focus ring), not decoration.
- **Hierarchy through weight**: prefer weight/tracking/spacing changes over huge size jumps.
- **Mobile is a design target**: touch targets at least 44px; filters/search are mobile-first.
- **Speed is design**: avoid UI “fluff” that hurts LCP or adds layout shift.

## Colors

The palette is mostly neutral with a single accent.

- **Background / surfaces**: clean whites and very light neutrals (`background`, `card`, `secondary`, `muted`).
- **Foreground text**: deep ink (`foreground`), comfortable contrast.
- **Muted text**: for secondary metadata only (`muted_foreground`).
- **Primary (green)**: used for one dominant action per viewport (`primary`).

Rules:

- Use `primary` for:
  - Primary CTA button
  - Focus ring / active control highlight
  - “Selected” state in a small number of places (tabs/filters) *only if it improves clarity*
- Avoid using `primary` for:
  - Category chips, icons, bullets, “Explore →” links, arbitrary highlights
  - Multiple CTAs in the same viewport (pick one)

## Typography

Typography should signal credibility and craft: modern but not playful, readable at high density.

- **Font**: `Space Grotesk` (sans) across UI; monospace only for code-like UI.
- **Headlines**: semibold, tight tracking, balanced line breaks.
- **Body**: 16px base, comfortable line-height, avoid over-styling.

Rules:

- Don’t default to ALL CAPS. Use caps sparingly for tiny labels only.
- Prefer `text-muted-foreground` for metadata; keep primary content as `text-foreground`.
- Clamp long summaries/descriptions rather than shrinking text.

## Layout

Layout optimizes for scanning and comparison.

- **Max widths**:
  - Prose/detail content: keep within ~70–75ch equivalent
  - Grids/listings: wider containers are fine; keep consistent gutters
- **Spacing scale**: snap to the spacing tokens in front matter (4px base rhythm).

Listing pages:

- Title + short subtitle, then filters, then grid.
- Filters should be reachable and usable on mobile without precision taps.

## Elevation & Depth

Depth is subtle.

- Primary separation comes from **borders + tonal contrast**.
- Shadows are minimal and used to indicate hover/overlay, not to “float” the whole UI. Prefer utility classes such as `shadow-sm` / `shadow-md` only where hover or overlay needs a lift.

## Shapes

Shape language is modern and friendly but not bubbly.

- **Cards/containers**: `md` / `lg` rounding.
- **Inputs/buttons**: `md` rounding by default.
- **Chips/tags**: `full` rounding (pills).

Avoid mixing sharp and rounded corners within the same component family.

## Components

These are the “default recipes” to copy-paste in new UI.

- **Primary button**
  - Filled `primary` background
  - Min height 44px
  - Clear hover state (slight darken), visible focus ring
- **Secondary button**
  - Neutral background, no green unless it’s the primary CTA
- **Inputs (search/newsletter/forms)**
  - Neutral border, subtle shadow, 44px min height
  - Pill style allowed for global search
- **Cards (directory items)**
  - Neutral border, subtle shadow, gentle hover lift *if it doesn’t feel “floaty”*
  - Keep accents neutral; don’t sprinkle green inside the card
- **Menus / popovers**
  - Rounded container, border + shadow
  - Hover uses muted background; focus uses ring

## Do's and Don'ts

- Do keep the UI **neutral-first** and let content carry the interest.
- Do use the green accent for the single most important action.
- Do keep all interactive targets touch-safe on mobile.
- Do maintain visible `:focus-visible` rings.

- Don't add gradient blobs, wavy dividers, or “hero decoration” for its own sake.
- Don't create multiple competing CTAs above the fold.
- Don't use heavy shadows or thick outlines as the default separator.
- Don't use green for category labeling, icons, bullets, or decorative highlights.

## Implementation notes

Where this gets enforced in code:

- **Tokens & CSS variables**: `src/app/globals.css` (HSL channels for Tailwind; matches YAML hex)
- **Tailwind theme mapping**: `tailwind.config.ts`
- **UI primitives**: `src/components/ui/*`

If you change semantic colors in the YAML `colors` block, update the matching HSL channels in `globals.css` in the same PR (keep sRGB parity).
