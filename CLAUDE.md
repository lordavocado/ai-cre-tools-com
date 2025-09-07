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
- `tailwind.config.ts` - Tailwind CSS configuration with shadcn/ui theme
- `next.config.js` - Next.js configuration (minimal, relies on defaults)

## Additional Documentation Files

The project includes comprehensive documentation:
- **CONFIG_GUIDE.md** - Complete configuration reference
- **ENVIRONMENT_SETUP.md** - Detailed environment setup instructions
- **SECURITY.md** - Security best practices and guidelines
- **SEO-Improvement-Guide.md** - SEO optimization strategies
- **PAGESPEED-OPTIMIZATION-COMPLETE.md** - Performance optimization results

## Important Development Notes

**No Cursor Rules Found**: The project doesn't have .cursor/ or .cursorrules configuration files. The CLAUDE.md reference to Cursor rules appears outdated.

**Next.js Configuration**: Uses minimal configuration in `next.config.js` (empty file) - relies on Next.js 15 defaults with Turbopack enabled via package.json scripts.

**Testing**: No dedicated test framework is configured. Manual testing is done via the development server.

The application is production-ready and optimized for SEO, performance, and user experience in the commercial real estate AI tools directory space.

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