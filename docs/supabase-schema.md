# Supabase Database Schema Documentation

This document provides comprehensive documentation for the Supabase database schema used in the AI CRE Tools directory application.

## Database Overview

- **Database**: Supabase PostgreSQL
- **Primary Table**: `ecosystem_apps`
- **Purpose**: Store commercial real estate AI tools directory data
- **Access**: Read-only via RLS policies for public access

## Table: `ecosystem_apps`

### Schema Definition

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

### Column Descriptions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `slug` | `text` | PRIMARY KEY | Unique identifier for the tool (URL-safe) |
| `website_url` | `text` | - | Official website URL of the tool |
| `name` | `text` | NOT NULL | Display name of the tool |
| `category` | `text` | - | Category slug (matches hardcoded categories) |
| `features` | `text[]` | DEFAULT '{}' | Array of feature strings |
| `one_liner` | `text` | - | Short tagline/elevator pitch |
| `description` | `text` | - | Detailed description of the tool |
| `country` | `text` | - | Country where the tool/company is based |
| `city` | `text` | - | City where the tool/company is based |
| `icon_url` | `text` | - | URL to tool's favicon or logo |
| `display_order` | `integer` | DEFAULT 999 | Custom ordering (lower numbers appear first) |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT now() | Record creation timestamp |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT now() | Last update timestamp |

### Data Types & Constraints

#### `slug` (Primary Key)
- Must be URL-safe (lowercase, hyphens, no spaces)
- Examples: `dreamoffice`, `elise-ai`, `prop-marker`
- Used in URLs: `/[slug]`

#### `category`
- Must match existing hardcoded category slugs:
  - `property-search-acquisition`
  - `property-analysis-valuation`
  - `development-construction`
  - `legal-compliance-due-diligence`
  - `property-management-operations`
  - `asset-portfolio-management`
  - `transactions-brokerage`
  - `marketing-leasing-enablement`
  - `data-workflow-infrastructure`
  - `productivity-copilots`

#### `features`
- PostgreSQL text array
- Example: `['AI Search', 'Data Analytics', 'Reporting']`

#### `display_order`
- Controls sort order in listings
- Lower numbers appear first
- Default: 999 (appears after prioritized items)
- Priority tools: 1-9 (as set for the featured tools)

### Indexes

```sql
-- Primary key index (automatic)
CREATE UNIQUE INDEX ecosystem_apps_pkey ON ecosystem_apps(slug);

-- Performance indexes
CREATE INDEX ecosystem_apps_category_idx ON ecosystem_apps(category);
CREATE INDEX ecosystem_apps_country_city_idx ON ecosystem_apps(country, city);
CREATE INDEX ecosystem_apps_display_order_idx ON ecosystem_apps(display_order);

-- Full-text search index
CREATE INDEX ecosystem_apps_search_idx ON ecosystem_apps 
USING GIN (to_tsvector('english', coalesce(name,'') || ' ' || coalesce(one_liner,'') || ' ' || coalesce(description,'')));

-- Features array index
CREATE INDEX ecosystem_apps_features_gin ON ecosystem_apps USING GIN (features);
```

### Triggers

#### Auto-update `updated_at` timestamp
```sql
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END $$;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.ecosystem_apps
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
```

## Row Level Security (RLS)

### Policy Configuration
```sql
-- Enable RLS
ALTER TABLE public.ecosystem_apps ENABLE ROW LEVEL SECURITY;

-- Read-only policy for anonymous users
CREATE POLICY ecosystem_apps_read
ON public.ecosystem_apps
FOR SELECT
USING (true);
```

### Access Control
- **Anonymous users**: Read-only access to all rows
- **Authenticated users**: Read-only access (same as anonymous)
- **Service role**: Full CRUD access for admin operations

## Query Examples

### Basic Queries

```sql
-- Get all tools ordered by display priority
SELECT * FROM ecosystem_apps 
ORDER BY display_order ASC, name ASC;

-- Get tools by category
SELECT * FROM ecosystem_apps 
WHERE category = 'property-management-operations'
ORDER BY display_order ASC, name ASC;

-- Full-text search
SELECT * FROM ecosystem_apps 
WHERE to_tsvector('english', coalesce(name,'') || ' ' || coalesce(one_liner,'') || ' ' || coalesce(description,''))
@@ websearch_to_tsquery('english', 'AI property management');
```

### Advanced Queries

```sql
-- Get featured tools (first 3 by display order)
SELECT * FROM ecosystem_apps 
ORDER BY display_order ASC, name ASC 
LIMIT 3;

-- Search with category filter
SELECT * FROM ecosystem_apps 
WHERE category ILIKE '%property%' 
  AND (name ILIKE '%AI%' OR one_liner ILIKE '%AI%' OR description ILIKE '%AI%')
ORDER BY display_order ASC, name ASC;

-- Get tools with specific features
SELECT * FROM ecosystem_apps 
WHERE features @> ARRAY['AI Search']
ORDER BY display_order ASC, name ASC;
```

## Data Management

### Adding New Tools
```sql
INSERT INTO ecosystem_apps (
  slug, name, website_url, one_liner, description, 
  category, features, country, city, icon_url, display_order
) VALUES (
  'new-tool',
  'New Tool Name',
  'https://newtool.com',
  'Revolutionary AI for CRE',
  'Detailed description of the new tool...',
  'property-management-operations',
  ARRAY['AI Analytics', 'Automation', 'Reporting'],
  'United States',
  'San Francisco',
  'https://newtool.com/favicon.ico',
  999
);
```

### Updating Display Order
```sql
-- Set priority tools (1-9 for featured display)
UPDATE ecosystem_apps SET display_order = 1 WHERE slug = 'dreamoffice';
UPDATE ecosystem_apps SET display_order = 2 WHERE slug = 'eliseai';
-- ... etc

-- Reset tool to default ordering
UPDATE ecosystem_apps SET display_order = 999 WHERE slug = 'some-tool';
```

### Bulk Operations
```sql
-- Update category for multiple tools
UPDATE ecosystem_apps 
SET category = 'new-category-slug' 
WHERE slug IN ('tool1', 'tool2', 'tool3');

-- Add feature to multiple tools
UPDATE ecosystem_apps 
SET features = array_append(features, 'New Feature')
WHERE category = 'property-management-operations';
```

## Application Integration

### TypeScript Interface Mapping
The database columns map to the `DirectoryItem` TypeScript interface:

```typescript
interface DirectoryItem {
  id: string;              // → slug
  slug: string;            // → slug
  name: string;            // → name
  tagline: string;         // → one_liner
  description: string;     // → description
  category: string;        // → category
  website: string;         // → website_url
  imageUrl?: string;       // → icon_url
  features?: Array<{name: string; description?: string}>; // → features (transformed)
  country?: string;        // → country
  city?: string;          // → city
}
```

### Query Order in Application
All queries use the following consistent ordering:
1. `display_order ASC` (priority tools first)
2. `name ASC` (alphabetical secondary sort)

This ensures featured tools (display_order 1-9) always appear first, followed by other tools in alphabetical order.

## Maintenance & Monitoring

### Regular Maintenance Tasks
1. **Vacuum and Analyze**: PostgreSQL maintenance
2. **Index Monitoring**: Check query performance
3. **RLS Policy Review**: Ensure security policies remain appropriate
4. **Data Validation**: Verify category slugs match hardcoded values

### Monitoring Queries
```sql
-- Check table size and row count
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  most_common_vals
FROM pg_stats 
WHERE tablename = 'ecosystem_apps';

-- Verify display order distribution
SELECT display_order, COUNT(*) 
FROM ecosystem_apps 
GROUP BY display_order 
ORDER BY display_order;

-- Check category distribution
SELECT category, COUNT(*) 
FROM ecosystem_apps 
GROUP BY category 
ORDER BY COUNT(*) DESC;
```

## Backup & Recovery

### Backup Considerations
- **Supabase Automatic Backups**: Enabled by default
- **Point-in-time Recovery**: Available for paid plans
- **Manual Exports**: Can export data via Supabase dashboard or SQL

### Data Export
```sql
-- Export all tools data
SELECT * FROM ecosystem_apps 
ORDER BY display_order ASC, name ASC;

-- Export for specific category
SELECT * FROM ecosystem_apps 
WHERE category = 'property-management-operations'
ORDER BY display_order ASC, name ASC;
```

This schema documentation should be updated whenever structural changes are made to the database.