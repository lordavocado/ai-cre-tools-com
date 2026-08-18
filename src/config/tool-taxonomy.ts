export const TOOL_WORKFLOW_OPTIONS = [
  { value: 'lease-abstraction', label: 'Lease Abstraction' },
  { value: 'underwriting', label: 'AI Underwriting' },
  { value: 'due-diligence', label: 'Due Diligence' },
  { value: 'deal-sourcing', label: 'Deal Sourcing' },
  { value: 'portfolio-analytics', label: 'Portfolio Analytics' },
  { value: 'lease-administration', label: 'Lease Administration' },
  { value: 'transaction-management', label: 'Transaction Management' },
  { value: 'property-valuation', label: 'Property Valuation' },
  { value: 'construction-management', label: 'Construction Management' },
  { value: 'real-estate-copilot', label: 'Real Estate Copilot' },
  { value: 'property-management', label: 'Property Management' },
  { value: 'market-analysis', label: 'Market Analysis' },
  { value: 'document-automation', label: 'Document Automation' },
  { value: 'leasing-automation', label: 'Leasing Automation' },
  { value: 'data-integration', label: 'Data Integration' },
] as const;

export const TOOL_PERSONA_OPTIONS = [
  { value: 'investors', label: 'Investors' },
  { value: 'developers', label: 'Developers' },
  { value: 'brokers', label: 'Brokers' },
  { value: 'asset-managers', label: 'Asset Managers' },
  { value: 'property-managers', label: 'Property Managers' },
  { value: 'operators', label: 'Operators' },
] as const;

export const TOOL_ASSET_CLASS_OPTIONS = [
  { value: 'multifamily', label: 'Multifamily' },
  { value: 'office', label: 'Office' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'retail', label: 'Retail' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'student-housing', label: 'Student Housing' },
  { value: 'senior-housing', label: 'Senior Housing' },
  { value: 'self-storage', label: 'Self Storage' },
  { value: 'data-centers', label: 'Data Centers' },
  { value: 'land', label: 'Land' },
  { value: 'mixed-use', label: 'Mixed Use' },
  { value: 'corporate-real-estate', label: 'Corporate Real Estate' },
  { value: 'all-asset-classes', label: 'All Asset Classes' },
] as const;

export const TOOL_DEPLOYMENT_OPTIONS = [
  { value: 'cloud', label: 'Cloud' },
  { value: 'on-premise', label: 'On-premise' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'desktop', label: 'Desktop' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'excel-add-in', label: 'Excel Add-in' },
  { value: 'api', label: 'API' },
] as const;

export const TOOL_PRICING_MODELS = [
  { value: 'unknown', label: 'Unknown' },
  { value: 'free', label: 'Free' },
  { value: 'freemium', label: 'Freemium' },
  { value: 'subscription', label: 'Subscription' },
  { value: 'usage_based', label: 'Usage based' },
  { value: 'per_user', label: 'Per user' },
  { value: 'per_unit', label: 'Per unit' },
  { value: 'per_deal', label: 'Per deal' },
  { value: 'one_time', label: 'One-time purchase' },
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'custom', label: 'Custom' },
] as const;

export const TOOL_PRICING_PERIODS = [
  { value: 'month', label: 'Per month' },
  { value: 'year', label: 'Per year' },
  { value: 'user_month', label: 'Per user / month' },
  { value: 'unit_month', label: 'Per unit / month' },
  { value: 'deal', label: 'Per deal' },
  { value: 'one_time', label: 'One time' },
  { value: 'custom', label: 'Custom' },
] as const;

export const TOOL_EDITORIAL_STATUSES = [
  { value: 'legacy', label: 'Legacy — needs review' },
  { value: 'draft', label: 'Draft' },
  { value: 'in_review', label: 'In review' },
  { value: 'verified', label: 'Verified' },
  { value: 'stale', label: 'Stale' },
  { value: 'rejected', label: 'Rejected' },
] as const;

export type ToolWorkflow = (typeof TOOL_WORKFLOW_OPTIONS)[number]['value'];
export type ToolPersona = (typeof TOOL_PERSONA_OPTIONS)[number]['value'];
export type ToolAssetClass = (typeof TOOL_ASSET_CLASS_OPTIONS)[number]['value'];
export type ToolDeployment = (typeof TOOL_DEPLOYMENT_OPTIONS)[number]['value'];
export type ToolPricingModel = (typeof TOOL_PRICING_MODELS)[number]['value'];
export type ToolPricingPeriod = (typeof TOOL_PRICING_PERIODS)[number]['value'];
export type ToolEditorialStatus = (typeof TOOL_EDITORIAL_STATUSES)[number]['value'];

export function getTaxonomyLabel(
  options: ReadonlyArray<{ value: string; label: string }>,
  value: string,
): string {
  return options.find((option) => option.value === value)?.label ?? value;
}
