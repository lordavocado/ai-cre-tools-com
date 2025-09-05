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

/**
 * Get the display name for a category slug
 */
export function getCategoryDisplayName(slug: string): string {
  const category = HARDCODED_CATEGORIES.find(cat => cat.slug === slug);
  if (category) {
    return category.name;
  }
  
  // Fallback: capitalize and replace dashes with spaces
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
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
