# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

For a shorter, agent-agnostic entry point (any AI coding tool), see **[AGENTS.md](./AGENTS.md)**.

## UI, Design & SEO Reference

**Primary design reference: https://openalternative.co/**

When making UI/design decisions or building new frontend features, visit and study openalternative.co first. It is the benchmark for:
- Visual design quality, typography hierarchy, and spacing
- Card layouts, hover states, and component polish
- Color usage and indigo accent patterns
- SEO page structure, metadata patterns, and content organization
- Directory/listing page conventions

When in doubt about a design decision, check what openalternative.co does.

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
- **Data Source**: Supabase Database (configured in `src/lib/supabase.ts`)
- **Content Management**: Supabase `ecosystem_apps` table serves as the database for directory items
- **Categories**: Hardcoded categories defined in `src/lib/supabase.ts` with rich descriptions
- **Routing**: Next.js App Router with dynamic routes for tools (`[slug]`) and categories (`[category]`)

### Key Architecture Components

**Configuration System** (`src/config/site.ts`):
- Central configuration for site metadata, SEO settings, and branding
- Template-based SEO generation for categories and tools
- Interpolation system for dynamic content replacement

**Data Layer** (`src/lib/supabase.ts`):
- Supabase database integration with type-safe queries
- Server-side data fetching with intelligent caching for optimal performance
- Type-safe data transformations from Supabase to TypeScript interfaces
- Built-in error handling and fallback mechanisms

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

**Supabase Database Setup**:
- Table: `ecosystem_apps` with comprehensive schema for CRE tools
- Column mappings configured for flexible data transformations
- Categories hardcoded in code (not from database) for better control and performance
- Full-text search capabilities with GIN indexes
- Row Level Security (RLS) enabled for data protection

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
├── app/                    # Next.js App Router
│   ├── [slug]/             # Dynamic tool detail pages
│   ├── categories/         # Category index + categories/[category]/
│   ├── blog/               # Blog index + blog/[slug]/
│   ├── guides/             # Guides index + guides/[slug]/
│   ├── favorites/          # Saved tools (client-backed)
│   ├── submit-tool/        # Tool submission flow
│   ├── admin/              # Admin areas (newsletter, tools, submissions)
│   └── api/                # Server-side API routes
├── components/             # React components
│   ├── ui/                 # shadcn/ui component library
│   ├── listing/            # Directory grid and search functionality
│   ├── category/           # Category-specific components
│   └── performance/        # Optimization components
├── config/                 # Site configuration and constants
├── lib/                    # Utilities, data fetching, and integrations
├── types/                  # TypeScript type definitions
└── hooks/                  # Custom React hooks
```

## Development Guidelines

**Making Changes to Categories**:
- Categories are hardcoded in `src/lib/supabase.ts` (categories array in getCategories function)
- Each category requires: id, slug, name, description, longDescription (HTML), imageUrl, icon
- Category changes require code deployment (not database updates)

**Adding New Tools**:
- Add data directly to Supabase `ecosystem_apps` table
- Features should be string array: `["Feature 1", "Feature 2", "Feature 3"]`
- Category field must match existing category slugs
- Use the Supabase dashboard or SQL commands to add new tools

**Styling Approach**:
- Tailwind CSS with CSS variables for theming
- shadcn/ui components for consistency
- Custom color scheme defined in `tailwind.config.ts`
- Dark mode support via class-based toggle

**Environment Configuration**:
- Supabase integration requires project URL and API keys:
  - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` - Supabase anon/public key
  - `SUPABASE_SERVICE_ROLE_KEY` - Service role key for admin operations (optional)
- Mailchimp integration for newsletter functionality
- PostHog for analytics (optional)

**Production deployment (Coolify only)**:
- Deploys via Coolify on Hetzner using the root `Dockerfile` (Next.js `output: 'standalone'`, port 3000)
- Push to `master` triggers Coolify rebuilds via GitHub webhook
- Do not add `vercel.json` or Vercel-specific config — production is self-hosted, not Vercel
- Set env vars in the Coolify application UI (see `docs/ENVIRONMENT_VARIABLES.md`)

## Important Files to Know

- `src/config/site.ts` - Central site configuration and SEO settings
- `src/lib/supabase.ts` - Supabase database integration and data fetching logic
- `src/types/index.ts` - Core TypeScript interfaces  
- `tailwind.config.ts` - Tailwind CSS configuration with shadcn/ui theme
- `next.config.mjs` - Next.js configuration (performance, security headers, bundle analyzer wrapper, PostHog-related settings)

## Additional Documentation Files

**Repo root (agent onboarding):** [AGENTS.md](./AGENTS.md) — short guide for any AI coding agent; this file (CLAUDE.md) is the deeper reference.

All other long-form project docs live in `docs/` (not the repo root):
- **docs/CONFIG_GUIDE.md** - Complete configuration reference
- **docs/ENVIRONMENT_SETUP.md** - Detailed environment setup instructions
- **docs/ENVIRONMENT_VARIABLES.md** - Environment variable reference
- **docs/SECURITY.md** - Security best practices and guidelines
- **docs/SEO-GUIDE.md** - SEO optimization strategies
- **docs/SEO-KEYWORDS.md** / **docs/SEO-RANKING-TRACKER.md** - Keyword and ranking notes
- **docs/ARCHITECTURE-GUIDE.md** - Architecture overview and patterns
- **docs/CODEBASE-STRUCTURE-GUIDE.md** - File and folder map
- **docs/CATEGORIES-GUIDE.md** - Category content and structure
- **docs/TOOLS-PAGES-GUIDE.md** - Tool detail page patterns
- **docs/AI-COMMERCIAL-REAL-ESTATE-GUIDE.md** - Domain context for CRE + AI
- **docs/CONTENT-STYLE-GUIDE.md** - Editorial tone and content rules
- **docs/supabase-schema.md** - Database schema reference
- **docs/superpowers/specs/** - Design specs and planning documents

## Important Development Notes

**Cursor / IDE rules**:
- **`.cursorrules`** (repo root) — project-wide Cursor guidance (Supabase patterns, categories, data-layer conventions).
- **`.cursor/rules/`** — optional focused rules (for example `favourites-feature.mdc`, `posthog-integration.mdc`) when editing those areas.

**Next.js configuration**: `next.config.mjs` (not `next.config.js`) — includes package import optimization, production `removeConsole`, security headers, compression, PostHog-related `transpilePackages`, and `@next/bundle-analyzer` when enabled. **Turbopack** is used in development via `npm run dev` in `package.json`.

**Testing**: No dedicated test framework is configured. Manual testing is done via the development server.

The application is production-ready and optimized for SEO, performance, and user experience in the commercial real estate AI tools directory space.

## Supabase Database Schema

The application uses Supabase as the primary database with the following schema:

### `ecosystem_apps` Table
```sql
create table public.ecosystem_apps (
  slug         text primary key,        -- unique identifier, e.g. "dreamoffice"
  website_url  text,                    -- app website
  name         text not null,           -- display name
  category     text,                    -- free text category
  features     text[] default '{}',     -- array of features
  one_liner    text,                    -- short tagline
  description  text,                    -- longer description
  country      text,
  city         text,
  icon_url     text,                    -- link to favicon/logo
  display_order integer default 999,   -- ordering for featured/priority tools (lower = first)
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
```

### Database Features
- **Row Level Security (RLS)**: Enabled with read-only policy for anon users
- **Indexes**: Optimized indexes for slug, category, country/city, features, and display_order
- **Full-text Search**: GIN index for search across name, one_liner, and description
- **Auto-updating Timestamps**: Automatic `updated_at` trigger
- **Custom Ordering**: `display_order` column allows featured/priority tool positioning

### Data Migration from Google Sheets
The application was migrated from Google Sheets to Supabase for:
- ✅ Better performance and reliability
- ✅ Advanced querying capabilities with SQL
- ✅ Full-text search functionality
- ✅ Real-time capabilities (if needed in future)
- ✅ Better scalability and concurrent access
- ✅ No API rate limiting issues

## Code Quality and Cleanup Standards

**Post-Development Cleanup Requirements**:
After completing any development work, Claude MUST perform the following cleanup tasks:

1. **Remove Dead Code and Bloat**:
   - Remove any unused imports, variables, and functions
   - Delete commented-out code blocks unless they serve as important documentation
   - Remove console.log statements and debug code
   - Clean up empty or placeholder files created during development

2. **Code Documentation Standards**:
   - Add clear JSDoc comments to all public functions and complex logic
   - Document component props with TypeScript interfaces and descriptions
   - Add inline comments for complex business logic or non-obvious code
   - Document any external API integrations or third-party dependencies

3. **Code Organization**:
   - Ensure consistent file naming and organization
   - Group related functions and maintain logical file structure
   - Remove redundant or duplicate code
   - Ensure proper separation of concerns

4. **Type Safety Verification**:
   - Run `npm run typecheck` to ensure no TypeScript errors
   - Verify all function parameters and return types are properly typed
   - Remove any `any` types that were added during development

5. **Linting and Formatting**:
   - Run `npm run lint` and fix all linting issues
   - Ensure consistent code formatting throughout modified files
   - Verify ESLint rules are followed

**Documentation Template for New Functions**:
```typescript
/**
 * Brief description of what the function does
 * @param paramName - Description of parameter
 * @returns Description of return value
 * @example
 * ```typescript
 * const result = functionName(param);
 * ```
 */
```

**Component Documentation Template**:
```typescript
/**
 * Component description and purpose
 * @component
 * @example
 * ```tsx
 * <ComponentName prop="value" />
 * ```
 */
interface ComponentProps {
  /** Description of prop and its purpose */
  propName: string;
}
```

**Cleanup Verification Checklist**:
- [ ] All TypeScript errors resolved (`npm run typecheck`)
- [ ] All ESLint warnings resolved (`npm run lint`)
- [ ] No unused imports or dead code
- [ ] All functions and components documented
- [ ] No debug code or console.logs in production code
- [ ] File structure is clean and organized