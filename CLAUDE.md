# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack on port 9002
npm run build           # Production build
npm run start           # Start production server
npm run lint            # ESLint check
npm run typecheck       # TypeScript validation

# AI/GenKit Development
npm run genkit:dev      # Start GenKit development
npm run genkit:watch    # Start GenKit with file watching

# Testing
# No dedicated test framework configured - manual testing via dev server
```

## Architecture Overview

This is a **Next.js 15 directory/marketplace application** built for showcasing AI Commercial Real Estate tools. The architecture follows modern React patterns with server-side data fetching:

### Core Data Flow
- **Data Source**: Google Sheets API (configured in `src/lib/sheets.ts`)
- **Content Management**: Google Sheets serves as the CMS for directory items and newsletter subscriptions
- **Categories**: Hardcoded categories defined in `src/lib/sheets.ts` with rich descriptions
- **Routing**: Next.js App Router with dynamic routes for tools (`[slug]`) and categories (`[category]`)

### Key Architecture Components

**Configuration System** (`src/config/site.ts`):
- Central configuration for site metadata, SEO settings, and branding
- Template-based SEO generation for categories and tools
- Interpolation system for dynamic content replacement

**Data Layer** (`src/lib/sheets.ts`):
- Google Sheets integration with column mapping configuration
- Server-side data fetching with caching
- Type-safe data transformations from sheets to TypeScript interfaces

**Component Architecture**:
- **UI Layer**: shadcn/ui components in `src/components/ui/`
- **Feature Components**: Directory-specific components in `src/components/listing/`, `src/components/category/`
- **Layout Components**: Header, Footer, Navigation in `src/components/layout/`
- **Performance Components**: Optimized components in `src/components/performance/`

**Type System** (`src/types/index.ts`):
- Core interfaces: `DirectoryItem`, `Category`, `Guide`, `NewsletterSubscription`
- Full TypeScript coverage with strict type checking

### Performance Optimizations
- **Turbopack**: Enabled for development builds
- **Image Optimization**: Custom image components with fallback handling
- **PostHog Integration**: Analytics with performance monitoring
- **Web Workers**: Available via custom hooks for heavy computations
- **Critical Resource Loading**: Optimized CSS and JavaScript execution

### Key Integration Points

**Google Sheets Setup**:
- Sheet names configured in `SHEET_NAMES` constant
- Column mappings in `COLUMN_MAPPINGS` for flexible schema
- Categories hardcoded in code (not from sheets) for better control

**SEO & Analytics**:
- Structured data generation for search engines
- PostHog integration for user analytics
- Social media metadata configuration
- Sitemap and robots.txt generation

**Newsletter Integration**:
- Mailchimp API integration
- Server-side email validation and subscription
- GDPR-compliant double opt-in support

## Project Structure Notes

```
src/
├── app/                # Next.js App Router
│   ├── [slug]/        # Dynamic tool detail pages
│   ├── categories/    # Category browsing and detail pages
│   └── api/          # Server-side API routes
├── components/        # React components
│   ├── ui/           # shadcn/ui component library
│   ├── listing/      # Directory grid and search functionality
│   ├── category/     # Category-specific components
│   └── performance/  # Optimization components
├── config/           # Site configuration and constants
├── lib/              # Utilities, data fetching, and integrations
├── types/            # TypeScript type definitions
└── hooks/            # Custom React hooks
```

## Development Guidelines

**Making Changes to Categories**:
- Categories are hardcoded in `src/lib/sheets.ts` (HARDCODED_CATEGORIES array)
- Each category requires: id, slug, name, description, longDescription (HTML), imageUrl, icon
- Category changes require code deployment (not just sheet updates)

**Adding New Tools**:
- Add data to Google Sheets following the column mapping in `COLUMN_MAPPINGS`
- Features should be JSON: `[{"name": "Feature 1"}, {"name": "Feature 2"}]`
- Category field must match existing category slugs

**Styling Approach**:
- Tailwind CSS with CSS variables for theming
- shadcn/ui components for consistency
- Custom color scheme defined in `tailwind.config.ts`
- Dark mode support via class-based toggle

**Environment Configuration**:
- Google Sheets integration requires service account credentials
- Mailchimp integration for newsletter functionality
- PostHog for analytics (optional)

## Important Files to Know

- `src/config/site.ts` - Central site configuration and SEO settings
- `src/lib/sheets.ts` - Google Sheets integration and data fetching logic
- `src/types/index.ts` - Core TypeScript interfaces
- `.cursor/rules/blueprint.md` - Design system and feature specifications
- `next.config.js` - Next.js configuration (minimal, relies on defaults)

## Custom Cursor Rules

The project includes Cursor IDE rules for:
- **Blueprint**: Core design system with color scheme (soft blue #64B5F6, light blue background #F0F8FF, purple accent #957DAD)
- **PostHog Integration**: Analytics implementation patterns
- **Favourites Feature**: User preference management patterns

The application is production-ready and optimized for SEO, performance, and user experience in the commercial real estate AI tools directory space.