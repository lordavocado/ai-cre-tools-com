export const TOOL_SUBMISSION_CATEGORIES = [
  'Development & Construction',
  'Efficiency & General Tools',
  'Investment & Portfolio Management',
  'Legal & Compliance',
  'Market Analysis & Valuation',
  'Property Management & Operations',
  'Transaction & Brokerage',
] as const;

export type ToolSubmissionCategory = (typeof TOOL_SUBMISSION_CATEGORIES)[number];
