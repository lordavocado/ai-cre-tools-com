# Codebase Structure Guide for AI CRE Tools Directory

This guide provides a comprehensive overview of the codebase organization, file relationships, and directory structure for the AI CRE Tools platform.

## Project Overview

The AI CRE Tools directory is a **Next.js 15 application** with TypeScript, following modern React patterns and best practices. The codebase is organized for scalability, maintainability, and optimal performance.

## Root Directory Structure

```
ai-cre-tools-com/
├── 📁 documentation/           # Project documentation (this guide and others)
├── 📁 public/                 # Static assets and files
├── 📁 scripts/                # Build and utility scripts
├── 📁 src/                    # Main source code
├── 📄 next.config.js          # Next.js configuration
├── 📄 package.json            # Dependencies and scripts
├── 📄 tailwind.config.ts      # Tailwind CSS configuration
├── 📄 tsconfig.json           # TypeScript configuration
└── 📄 components.json         # shadcn/ui configuration
```

## Source Code Architecture (`src/`)

### 1. Application Layer (`src/app/`)

**Next.js App Router Structure:**
```
src/app/
├── 📄 layout.tsx              # Root layout component
├── 📄 page.tsx                # Homepage
├── 📄 globals.css             # Global styles
├── 📄 error.tsx               # Global error boundary
├── 📄 actions.ts              # Server actions
│
├── 📁 [slug]/                 # Dynamic tool detail pages
│   └── 📄 page.tsx            # Tool detail page component
│
├── 📁 categories/             # Category browsing
│   ├── 📄 page.tsx            # Category listing page
│   └── 📁 [category]/         # Dynamic category pages
│       └── 📄 page.tsx        # Category detail page
│
├── 📁 blog/                   # Blog system
│   ├── 📄 page.tsx            # Blog listing page
│   └── 📁 [slug]/             # Dynamic blog posts
│       └── 📄 page.tsx        # Blog post page
│
├── 📁 api/                    # API routes
│   ├── 📁 sheets/             # Google Sheets API
│   ├── 📁 submit-tool/        # Tool submission API
│   ├── 📁 image-proxy/        # Image optimization proxy
│   └── 📁 admin/              # Admin functionality
│
├── 📁 admin/                  # Admin dashboard
│   ├── 📁 newsletter/         # Newsletter management
│   └── 📁 submissions/        # Tool submission management
│
├── 📁 submit-tool/            # Tool submission form
│   ├── 📄 layout.tsx          # Submission layout
│   └── 📄 page.tsx            # Submission form
│
├── 📁 favourites/             # User favorites
│   └── 📄 page.tsx            # Favorites page
│
├── 📄 about/page.tsx          # About page
├── 📄 privacy-policy/page.tsx # Privacy policy
├── 📄 terms-of-service/page.tsx # Terms of service
├── 📄 robots.txt/route.ts     # SEO robots.txt
└── 📄 sitemap.xml/route.ts    # SEO sitemap
```

**Key Connections:**
- `layout.tsx` → Global layout for all pages
- `[slug]/page.tsx` → Dynamic tool pages using `getDirectoryItemBySlug()`
- `categories/[category]/page.tsx` → Dynamic category pages using `getCategoryBySlug()`
- `api/` routes → Server-side data processing and external API integration

### 2. Components Layer (`src/components/`)

**Component Organization:**
```
src/components/
├── 📁 ui/                     # Base UI components (shadcn/ui)
│   ├── 📄 button.tsx          # Reusable button component
│   ├── 📄 card.tsx            # Card layout component
│   ├── 📄 badge.tsx           # Badge/tag component
│   ├── 📄 input.tsx           # Form input component
│   ├── 📄 dialog.tsx          # Modal dialog component
│   └── 📄 ...                 # Other base UI components
│
├── 📁 layout/                 # Layout components
│   ├── 📄 Header.tsx          # Site header with navigation
│   ├── 📄 Footer.tsx          # Site footer
│   └── 📄 GlobalSearch.tsx    # Global search functionality
│
├── 📁 listing/                # Directory listing components
│   ├── 📄 DirectoryGrid.tsx   # Main tool grid display
│   ├── 📄 DirectoryItemCard.tsx # Individual tool cards
│   └── 📄 DirectorySearch.tsx # Search and filter interface
│
├── 📁 category/               # Category-specific components
│   └── 📄 CategoryCard.tsx    # Category display cards
│
├── 📁 landing/                # Homepage components
│   ├── 📄 Hero.tsx            # Homepage hero section
│   ├── 📄 NewsletterForm.tsx  # Newsletter signup form
│   └── 📄 AnimatedBackground.tsx # Animated background effects
│
├── 📁 blog/                   # Blog-related components
│   ├── 📄 BlogList.tsx        # Blog post listing
│   └── 📄 BlogPost.tsx        # Individual blog post display
│
├── 📁 forms/                  # Form components
│   └── 📄 AdvancedNewsletterForm.tsx # Enhanced newsletter form
│
├── 📁 favourites/             # Favorites functionality
│   └── 📄 FavouritesClient.tsx # Client-side favorites management
│
├── 📁 sheets/                 # Google Sheets integration components
│   ├── 📄 SheetsDataWrapper.tsx # Data fetching wrapper
│   └── 📄 SheetsErrorFallback.tsx # Error handling
│
├── 📁 seo/                    # SEO components
│   ├── 📄 StructuredData.tsx  # Schema.org structured data
│   └── 📄 seo-audit.tsx       # SEO analysis tools
│
├── 📁 sections/               # Page sections
│   └── 📄 FAQ.tsx             # FAQ section component
│
└── 📁 performance/            # Performance optimization components
    ├── 📄 critical-resources.tsx # Critical resource loading
    ├── 📄 css-optimizer.tsx   # CSS optimization
    ├── 📄 js-execution-optimizer.tsx # JavaScript optimization
    ├── 📄 performance-monitor.tsx # Performance monitoring
    └── 📄 lazy-wrapper.tsx    # Lazy loading wrapper
```

**Component Relationships:**
```
layout.tsx
├── Header.tsx
│   └── GlobalSearch.tsx
├── [Page Content]
│   ├── DirectoryGrid.tsx
│   │   └── DirectoryItemCard.tsx
│   ├── CategoryCard.tsx
│   └── Hero.tsx
│       └── NewsletterForm.tsx
└── Footer.tsx
```

### 3. Configuration Layer (`src/config/`)

**Configuration Files:**
```
src/config/
└── 📄 site.ts                 # Central site configuration
    ├── Site metadata and SEO settings
    ├── Navigation structure
    ├── Category meta templates
    ├── Tool meta templates
    └── Social media configuration
```

**Key Exports:**
```typescript
// Central configuration
export const siteConfig = { ... }

// SEO helper functions
export function generateCategoryMeta()
export function generateToolMeta()
export function interpolateText()
```

### 4. Data Layer (`src/lib/`)

**Library Functions:**
```
src/lib/
├── 📄 sheets.ts               # Google Sheets integration
├── 📄 blog.ts                 # Blog content management
├── 📄 utils.ts                # General utilities
├── 📄 seo-utils.ts            # SEO helper functions
├── 📄 image-utils.ts          # Image processing utilities
├── 📄 markdown.ts             # Markdown processing
├── 📄 mailchimp.ts            # Email integration
├── 📄 posthog.ts              # Analytics configuration
└── 📄 perplexity.ts           # AI integration (if used)
```

**Data Flow:**
```
Google Sheets → sheets.ts → DirectoryItem[] → Components → Pages
```

### 5. Type Definitions (`src/types/`)

**Type System:**
```
src/types/
├── 📄 index.ts                # Core type definitions
└── 📄 next-page-props.d.ts    # Next.js type extensions
```

**Core Interfaces:**
```typescript
// Primary data types
interface DirectoryItem { ... }
interface Category { ... }
interface Guide { ... }
interface NewsletterSubscription { ... }
```

### 6. Custom Hooks (`src/hooks/`)

**React Hooks:**
```
src/hooks/
├── 📄 useFavourites.ts        # Favorites management
├── 📄 use-toast.ts            # Toast notifications
├── 📄 use-mobile.tsx          # Mobile detection
└── 📄 use-web-worker.ts       # Web worker integration
```

### 7. Providers (`src/providers/`)

**Context Providers:**
```
src/providers/
├── 📄 FavouritesProvider.tsx  # Favorites state management
└── 📄 PostHogProvider.tsx     # Analytics provider
```

### 8. Content Management (`src/content/`)

**Static Content:**
```
src/content/
├── 📁 blog/                   # Markdown blog posts
│   ├── 📄 brokers-ai-revolution.md
│   ├── 📄 investors-ai-co-pilot.md
│   └── 📄 property-managers-ai-survival-guide.md
│
└── 📁 guides/                 # Documentation guides
    └── 📄 getting-started.md
```

## Static Assets (`public/`)

**Asset Organization:**
```
public/
├── 📄 favicon.ico             # Site favicon
├── 📄 favicon.svg             # SVG favicon
├── 📄 site.webmanifest        # Web app manifest
├── 📄 ai-cre-tools-logo.jpg   # Main logo
├── 📄 og-image.png            # Open Graph image
├── 📄 twitter-image.png       # Twitter card image
├── 📄 linkedin-image.png      # LinkedIn share image
│
├── 📁 categories/             # Category images
│   ├── 📄 category-property-search-acquisition.jpg
│   ├── 📄 category-property-analysis-valuation.jpg
│   └── 📄 ... (other category images)
│
├── 📁 images/                 # General images
│   └── 📁 guides/             # Guide-specific images
│
├── 📁 blog/                   # Blog post images
│
└── 📁 workers/                # Web worker scripts
    └── 📄 data-processor.js
```

## Utility Scripts (`scripts/`)

**Build and Utility Scripts:**
```
scripts/
├── 📄 generate-social-images.js # Social media image generation
├── 📄 seo-audit.js            # SEO analysis script
├── 📄 social-media-templates.html # Social media templates
└── 📄 test-mailchimp.js       # Mailchimp integration testing
```

## Configuration Files

**Project Configuration:**
```
├── 📄 next.config.js          # Next.js configuration
├── 📄 tailwind.config.ts      # Tailwind CSS configuration
├── 📄 tsconfig.json           # TypeScript configuration
├── 📄 components.json         # shadcn/ui configuration
├── 📄 postcss.config.mjs      # PostCSS configuration
├── 📄 package.json            # Dependencies and scripts
└── 📄 vercel.json             # Vercel deployment configuration
```

## Data Flow Architecture

### 1. Page Rendering Flow

```
User Request → Next.js Router → Page Component → Data Fetching → Rendering
                                      ↓
                               getDirectoryItems() or getCategoryBySlug()
                                      ↓
                               Google Sheets API (via sheets.ts)
                                      ↓
                               Cached Data (5-minute TTL)
                                      ↓
                               TypeScript Interfaces
                                      ↓
                               Component Props
                                      ↓
                               Rendered HTML
```

### 2. Component Dependency Graph

```
App Layout (layout.tsx)
├── Header.tsx
│   ├── GlobalSearch.tsx → DirectorySearch.tsx
│   └── Navigation (from site.ts config)
│
├── Page Components
│   ├── DirectoryGrid.tsx
│   │   └── DirectoryItemCard.tsx
│   │       ├── FavouriteButton (useFavourites hook)
│   │       ├── CategoryChips (category data)
│   │       └── ImageWithFallback.tsx
│   │
│   ├── CategoryCard.tsx
│   │   └── Image optimization
│   │
│   └── Hero.tsx
│       └── NewsletterForm.tsx → mailchimp.ts
│
└── Footer.tsx
    └── Site configuration (from site.ts)
```

### 3. State Management Flow

```
User Interactions → Client Components → Custom Hooks → Local Storage / Context
                                              ↓
                                        State Updates
                                              ↓
                                        Component Re-renders
                                              ↓
                                        UI Updates
```

## File Naming Conventions

### 1. Component Files
- **PascalCase**: `DirectoryGrid.tsx`, `CategoryCard.tsx`
- **Descriptive**: Component name matches primary export
- **Location-based**: Organized by feature/domain

### 2. Utility Files
- **kebab-case**: `image-utils.ts`, `seo-utils.ts`
- **Descriptive**: Function indicates purpose
- **Grouped**: Related utilities in same file

### 3. Page Files
- **Next.js Convention**: `page.tsx` for pages, `layout.tsx` for layouts
- **Dynamic Routes**: `[slug]/page.tsx`, `[category]/page.tsx`
- **API Routes**: `route.ts` for API endpoints

### 4. Asset Files
- **kebab-case**: `category-property-search-acquisition.jpg`
- **Descriptive**: Name indicates content and usage
- **Consistent**: Similar assets use similar naming patterns

## Import/Export Patterns

### 1. Component Exports
```typescript
// Named export for main component
export function DirectoryGrid({ items }: DirectoryGridProps) { ... }

// Default export (when single component per file)
export default function CategoryCard({ category }: CategoryCardProps) { ... }
```

### 2. Utility Exports
```typescript
// Named exports for utilities
export function interpolateText(text: string, replacements: Record<string, string>): string { ... }
export function generateToolMeta(toolName: string, toolTagline?: string): Metadata { ... }
export const siteConfig = { ... }
```

### 3. Type Exports
```typescript
// Type-only exports
export type { DirectoryItem, Category, Guide, NewsletterSubscription }
export interface ComponentProps { ... }
```

### 4. Import Patterns
```typescript
// Absolute imports using path mapping
import { DirectoryGrid } from '@/components/listing/DirectoryGrid'
import { siteConfig } from '@/config/site'
import type { DirectoryItem } from '@/types'

// Relative imports for closely related files
import './globals.css'
import { ComponentHelpers } from './helpers'
```

## Build and Development Flow

### 1. Development Process
```
npm run dev → Next.js Dev Server → Turbopack → Hot Reload → Browser
```

### 2. Build Process
```
npm run build → Static Generation → Asset Optimization → Production Bundle
```

### 3. Deployment Flow
```
Git Push → Vercel → Build → Deploy → CDN Distribution
```

## Key Integration Points

### 1. Google Sheets Integration
- **Entry Point**: `src/lib/sheets.ts`
- **Used By**: All data-dependent pages and components
- **Caching**: In-memory with 5-minute TTL
- **Error Handling**: Graceful fallbacks and retry logic

### 2. SEO System
- **Configuration**: `src/config/site.ts`
- **Implementation**: Page-level metadata generation
- **Structured Data**: `src/components/seo/StructuredData.tsx`
- **Dynamic Generation**: Template-based meta generation

### 3. Performance Optimization
- **Components**: `src/components/performance/`
- **Image Optimization**: Custom components with fallbacks
- **Code Splitting**: Automatic via Next.js App Router
- **Monitoring**: PostHog integration for Core Web Vitals

This codebase structure provides a scalable, maintainable architecture that supports the AI CRE Tools directory's current needs while allowing for future growth and feature additions.