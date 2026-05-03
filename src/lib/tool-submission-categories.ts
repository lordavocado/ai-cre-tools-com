/**
 * Directory categories for submissions and AI research.
 * Labels must match `HARDCODED_CATEGORIES` display names in `src/lib/utils.ts`
 * so `resolveCategoryInfo` and publishing normalize to the same slugs.
 */
export const TOOL_SUBMISSION_CATEGORIES = [
  'Property Search & Acquisition',
  'Property Analysis & Valuation',
  'Development & Construction',
  'Legal, Compliance & Due Diligence',
  'Property Management & Operations',
  'Asset & Portfolio Management',
  'Transactions & Brokerage',
  'Marketing & Leasing Enablement',
  'Data & Workflow Infrastructure',
  'Productivity & Copilots',
] as const;

export type ToolSubmissionCategory = (typeof TOOL_SUBMISSION_CATEGORIES)[number];
