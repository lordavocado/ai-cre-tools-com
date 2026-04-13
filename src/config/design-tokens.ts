/**
 * Design token constants for AI CRE Tools
 *
 * Single source of truth for all design values.
 * CSS variables in globals.css mirror these values — the CSS vars are used by
 * Tailwind utilities (bg-background, text-foreground, etc.), while these
 * constants are used in arbitrary Tailwind values and inline style needs.
 *
 * To fork this system for another vertical directory:
 *   1. Swap the PRIMARY_* values for the new brand accent color family
 *   2. Everything else (neutrals, spacing, radii, transitions) stays identical
 */

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------

export const colors = {
  /** Page and section backgrounds */
  background: '#ffffff',
  /** Card and input surfaces */
  card: '#fafafa',
  /** Borders, dividers, input edges */
  border: '#e0e0e0',

  /** Primary text — headings, body */
  foreground: '#1f1f1f',
  /** Secondary text — subtitles, meta, placeholders */
  muted: '#737373',

  /** Moss green — primary action / accent */
  primary: '#629649',
  /** Darker green — hover state for primary */
  primaryHover: '#4a7238',
  /** Pale green — chip backgrounds, icon wells */
  primarySubtle: '#f0f9f0',
  /** Soft green — chip borders, focus rings */
  primaryBorder: '#b9e5b9',

  /** White text on green buttons */
  onPrimary: '#ffffff',
} as const;

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

export const typography = {
  /** Font family — Inter only via --font-inter CSS var */
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',

  /** Hero headline */
  heroSize: '48px',
  heroWeight: '600',
  heroTracking: '-1.2px',
  heroLineHeight: '1.0',

  /** Page heading */
  headingSize: '32px',
  headingWeight: '600',
  headingTracking: '-0.5px',

  /** Section heading */
  sectionSize: '24px',
  sectionWeight: '600',
  sectionTracking: '-0.3px',

  /** Body */
  bodySize: '16px',
  bodyWeight: '400',
  bodyLineHeight: '1.6',

  /** Small / meta */
  smallSize: '14px',
  smallLineHeight: '1.4',

  /** Caption / tag */
  captionSize: '12px',
} as const;

// ---------------------------------------------------------------------------
// Spacing & Shape
// ---------------------------------------------------------------------------

export const spacing = {
  /** Max content width */
  containerMax: '1088px',
  /** Horizontal page padding */
  containerPadding: '32px',
  /** Section vertical padding */
  sectionPadding: '80px',
  /** Card internal padding */
  cardPadding: '20px',
  /** Gap between cards */
  cardGap: '16px',
  /** Fixed nav height */
  navHeight: '50px',
} as const;

export const radius = {
  /** Cards, inputs */
  card: '8px',
  /** Buttons, chips */
  button: '6px',
  /** Same as chip */
  chip: '6px',
} as const;

// ---------------------------------------------------------------------------
// Transitions
// ---------------------------------------------------------------------------

/** Single easing used on all interactive elements */
export const transition = 'all 100ms cubic-bezier(0, 0, 0.2, 1)';

// ---------------------------------------------------------------------------
// Category slug → display name map
// Kept here so any component can import it without hitting the data layer.
// ---------------------------------------------------------------------------

export const CATEGORY_LABELS: Record<string, string> = {
  'property-search-acquisition': 'Property Search & Acquisition',
  'property-analysis-valuation': 'Property Analysis & Valuation',
  'development-construction': 'Development & Construction',
  'legal-compliance-due-diligence': 'Legal, Compliance & Due Diligence',
  'property-management-operations': 'Property Management & Operations',
  'asset-portfolio-management': 'Asset & Portfolio Management',
  'transactions-brokerage': 'Transactions & Brokerage',
  'marketing-leasing-enablement': 'Marketing & Leasing Enablement',
  'data-workflow-infrastructure': 'Data & Workflow Infrastructure',
  'productivity-copilots': 'Productivity & Copilots',
};

/**
 * Returns the human-readable display name for a category slug.
 * Falls back to prettifying the slug if no mapping is found.
 */
export function getCategoryLabel(slug: string): string {
  return (
    CATEGORY_LABELS[slug] ??
    slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  );
}
