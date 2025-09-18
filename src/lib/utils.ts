import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Category utilities
const HARDCODED_CATEGORIES = [
  {
    id: 'property-search-acquisition',
    slug: 'property-search-acquisition',
    name: 'Property Search & Acquisition',
  },
  {
    id: 'property-analysis-valuation',
    slug: 'property-analysis-valuation',
    name: 'Property Analysis & Valuation',
  },
  {
    id: 'development-construction',
    slug: 'development-construction',
    name: 'Development & Construction',
  },
  {
    id: 'legal-compliance-due-diligence',
    slug: 'legal-compliance-due-diligence',
    name: 'Legal, Compliance & Due Diligence',
  },
  {
    id: 'property-management-operations',
    slug: 'property-management-operations',
    name: 'Property Management & Operations',
  },
  {
    id: 'asset-portfolio-management',
    slug: 'asset-portfolio-management',
    name: 'Asset & Portfolio Management',
  },
  {
    id: 'transactions-brokerage',
    slug: 'transactions-brokerage',
    name: 'Transactions & Brokerage',
  },
  {
    id: 'marketing-leasing-enablement',
    slug: 'marketing-leasing-enablement',
    name: 'Marketing & Leasing Enablement',
  },
  {
    id: 'data-workflow-infrastructure',
    slug: 'data-workflow-infrastructure',
    name: 'Data & Workflow Infrastructure',
  },
  {
    id: 'productivity-copilots',
    slug: 'productivity-copilots',
    name: 'Productivity & Copilots',
  },
];

const CATEGORY_LOOKUP_BY_SLUG = new Map(
  HARDCODED_CATEGORIES.map((category) => [category.slug.toLowerCase(), category])
);

const CATEGORY_LOOKUP_BY_NAME = new Map(
  HARDCODED_CATEGORIES.map((category) => [category.name.toLowerCase(), category])
);

export interface CategoryInfo {
  slug: string;
  displayName: string;
  hasPage: boolean;
}

function createSlugCandidate(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatCategoryDisplay(value: string): string {
  if (!value) {
    return 'Unknown';
  }

  if (/[A-Z]/.test(value)) {
    return value;
  }

  return value
    .replace(/[-_]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Resolve category information from a slug or name.
 * Provides normalized slug for routing, formatted display name, and whether a page exists.
 */
export function resolveCategoryInfo(rawCategory: string): CategoryInfo {
  const trimmed = rawCategory.trim();
  const lower = trimmed.toLowerCase();

  const directSlugMatch = CATEGORY_LOOKUP_BY_SLUG.get(lower);
  const slugCandidate = createSlugCandidate(trimmed);
  const normalizedSlugMatch = CATEGORY_LOOKUP_BY_SLUG.get(slugCandidate);
  const nameMatch = CATEGORY_LOOKUP_BY_NAME.get(lower);

  const matchedCategory = directSlugMatch ?? normalizedSlugMatch ?? nameMatch;

  if (matchedCategory) {
    return {
      slug: matchedCategory.slug,
      displayName: matchedCategory.name,
      hasPage: true,
    };
  }

  return {
    slug: slugCandidate || lower.replace(/\s+/g, '-') || trimmed,
    displayName: formatCategoryDisplay(trimmed || slugCandidate),
    hasPage: false,
  };
}

/**
 * Get the display name for a category slug
 */
export function getCategoryDisplayName(slug: string): string {
  return resolveCategoryInfo(slug).displayName;
}

/**
 * Get display names for multiple category slugs (comma-separated)
 */
export function getCategoryDisplayNames(categoryString: string): string[] {
  return categoryString
    .split(',')
    .map(slug => slug.trim())
    .filter(slug => slug.length > 0)
    .map(slug => getCategoryDisplayName(slug));
}
