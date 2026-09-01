import type { SeoFaq } from '@/config/seo-clusters';
import { getCategoryLabel } from '@/config/design-tokens';
import { getTaxonomyLabel, TOOL_WORKFLOW_OPTIONS } from '@/config/tool-taxonomy';
import type { DirectoryItem } from '@/types';
import { isPseoEligible } from '@/lib/seo-pages';

export interface ResolvedComparison {
  slug: string;
  toolA: DirectoryItem;
  toolB: DirectoryItem;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  verdict: string;
  whenChooseA: string;
  whenChooseB: string;
  faqs: SeoFaq[];
  relatedCategorySlug: string;
}

const MAX_TOOLS_PER_CATEGORY_FOR_COMPARISONS = 3;

const LEGACY_COMPARISONS = [
  ['diligence-tools-leaders', 'legal-compliance-due-diligence', 0, 1],
  ['underwriting-tools-leaders', 'property-analysis-valuation', 0, 1],
  ['deal-sourcing-tools-leaders', 'property-search-acquisition', 0, 1],
  ['portfolio-tools-leaders', 'asset-portfolio-management', 0, 1],
  ['property-management-tools-leaders', 'property-management-operations', 0, 1],
  ['brokerage-tools-leaders', 'transactions-brokerage', 0, 1],
  ['leasing-tools-leaders', 'marketing-leasing-enablement', 0, 1],
  ['development-tools-leaders', 'development-construction', 0, 1],
  ['data-infrastructure-tools-leaders', 'data-workflow-infrastructure', 0, 1],
  ['copilot-tools-leaders', 'productivity-copilots', 0, 1],
  ['analysis-valuation-alt-pair', 'property-analysis-valuation', 0, 2],
  ['diligence-alt-pair', 'legal-compliance-due-diligence', 1, 2],
  ['transactions-alt-pair', 'transactions-brokerage', 0, 2],
  ['pm-operations-alt-pair', 'property-management-operations', 1, 2],
  ['acquisition-research-pair', 'property-search-acquisition', 0, 2],
] as const;

function primaryCategory(item: DirectoryItem): string | undefined {
  return item.category.split(',')[0]?.trim() || undefined;
}

function hasComparisonEvidence(item: DirectoryItem): boolean {
  return Boolean(item.tagline || item.description) && (item.features?.length ?? 0) > 0;
}

function comparisonSlug(toolA: DirectoryItem, toolB: DirectoryItem): string {
  return `${toolA.slug}-vs-${toolB.slug}`;
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const candidate = text.slice(0, max - 1);
  const breakAt = candidate.lastIndexOf(' ');
  return `${candidate.slice(0, breakAt > max * 0.65 ? breakAt : undefined)}…`;
}

function documentedFocus(item: DirectoryItem): string {
  if (item.bestFor) return item.bestFor;
  if (item.workflows.length > 0) {
    return item.workflows
      .slice(0, 2)
      .map((workflow) => getTaxonomyLabel(TOOL_WORKFLOW_OPTIONS, workflow).toLowerCase())
      .join(' and ');
  }
  const features = item.features?.slice(0, 2).map((feature) => feature.name) ?? [];
  return features.length > 0 ? features.join(' and ') : 'your required CRE workflow';
}

function createComparison(toolA: DirectoryItem, toolB: DirectoryItem, categorySlug: string): ResolvedComparison {
  const category = getCategoryLabel(categorySlug);
  const titleCore = `${toolA.name} vs ${toolB.name}`;
  return {
    slug: comparisonSlug(toolA, toolB),
    toolA,
    toolB,
    h1: `${titleCore}: CRE Software Comparison`,
    metaTitle: truncate(`${titleCore} — CRE Software Comparison | AI CRE Tools`, 60),
    metaDescription: truncate(`Compare ${toolA.name} and ${toolB.name} for ${category.toLowerCase()}: documented features, workflows, pricing, integrations, and fit.`, 155),
    verdict: `${toolA.name} and ${toolB.name} are both listed for ${category.toLowerCase()}. The better fit depends on the workflows, integrations, deployment requirements, and pricing model your team can verify during evaluation.`,
    whenChooseA: `Shortlist ${toolA.name} when its documented focus on ${documentedFocus(toolA)} maps more closely to your requirements.`,
    whenChooseB: `Shortlist ${toolB.name} when its documented focus on ${documentedFocus(toolB)} maps more closely to your requirements.`,
    faqs: [
      {
        question: `How should I evaluate ${toolA.name} vs ${toolB.name}?`,
        answer: 'Run both products against the same representative project, then compare output quality, integrations, security, implementation effort, and total cost.',
      },
      {
        question: `Are ${toolA.name} and ${toolB.name} direct substitutes?`,
        answer: `They share a ${category.toLowerCase()} category, but their documented features and target workflows may differ. Confirm scope with each vendor before treating them as like-for-like alternatives.`,
      },
    ],
    relatedCategorySlug: categorySlug,
  };
}

const comparisonsCache = new WeakMap<DirectoryItem[], ResolvedComparison[]>();

export function getResolvedComparisons(items: DirectoryItem[]): ResolvedComparison[] {
  const cached = comparisonsCache.get(items);
  if (cached) return cached;
  const categories = new Map<string, DirectoryItem[]>();
  for (const item of items) {
    const category = primaryCategory(item);
    if (!category || !isPseoEligible(item) || !hasComparisonEvidence(item)) continue;
    const categoryItems = categories.get(category) ?? [];
    if (categoryItems.length < MAX_TOOLS_PER_CATEGORY_FOR_COMPARISONS) categoryItems.push(item);
    categories.set(category, categoryItems);
  }

  const comparisons: ResolvedComparison[] = [];
  for (const [category, categoryItems] of categories) {
    for (let left = 0; left < categoryItems.length; left += 1) {
      for (let right = left + 1; right < categoryItems.length; right += 1) {
        comparisons.push(createComparison(categoryItems[left], categoryItems[right], category));
      }
    }
  }
  comparisons.sort((a, b) => a.h1.localeCompare(b.h1));
  comparisonsCache.set(items, comparisons);
  return comparisons;
}

function getLegacyComparison(slug: string, items: DirectoryItem[]): ResolvedComparison | null {
  const legacy = LEGACY_COMPARISONS.find(([legacySlug]) => legacySlug === slug);
  if (!legacy) return null;
  const [, category, indexA, indexB] = legacy;
  const candidates = items.filter((item) => (
    primaryCategory(item) === category && isPseoEligible(item) && hasComparisonEvidence(item)
  ));
  const toolA = candidates[indexA];
  const toolB = candidates[indexB];
  return toolA && toolB ? createComparison(toolA, toolB, category) : null;
}

export function getComparisonBySlug(slug: string, items: DirectoryItem[]): ResolvedComparison | null {
  return getResolvedComparisons(items).find((comparison) => comparison.slug === slug)
    ?? getLegacyComparison(slug, items);
}

export function getAllComparisonTemplateSlugs(): string[] {
  return LEGACY_COMPARISONS.map(([slug]) => slug);
}

export async function getResolvableComparisonSlugs(): Promise<string[]> {
  const { getDirectoryItems } = await import('@/lib/supabase');
  try {
    const items = await getDirectoryItems();
    return [
      ...getResolvedComparisons(items).map((comparison) => comparison.slug),
      ...LEGACY_COMPARISONS
        .filter(([slug]) => getLegacyComparison(slug, items))
        .map(([slug]) => slug),
    ];
  } catch {
    return [];
  }
}
