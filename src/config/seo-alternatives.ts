import type { DirectoryItem } from '@/types';
import { isPseoEligible } from '@/lib/seo-pages';

export const MIN_ALTERNATIVES_FOR_INDEX = 3;
export const MAX_ALTERNATIVES_LISTED = 8;

export function getPrimaryCategorySlug(item: DirectoryItem): string | undefined {
  const primary = item.category.split(',')[0]?.trim();
  return primary || undefined;
}

function sharedCount(left: string[], right: string[]): number {
  const rightValues = new Set(right.map((value) => value.toLowerCase()));
  return left.filter((value) => rightValues.has(value.toLowerCase())).length;
}

function relevanceScore(tool: DirectoryItem, candidate: DirectoryItem): number {
  return sharedCount(tool.workflows, candidate.workflows) * 8
    + sharedCount(tool.personas, candidate.personas) * 4
    + sharedCount(tool.assetClasses, candidate.assetClasses) * 4
    + sharedCount(tool.integrations, candidate.integrations) * 3
    + sharedCount(
      tool.features?.map((feature) => feature.name) ?? [],
      candidate.features?.map((feature) => feature.name) ?? [],
    ) * 2;
}

export function getAlternativesForTool(
  tool: DirectoryItem,
  allItems: DirectoryItem[]
): DirectoryItem[] {
  if (!isPseoEligible(tool)) return [];
  const primaryCategory = getPrimaryCategorySlug(tool);
  if (!primaryCategory) return [];

  return allItems
    .filter((candidate) => {
      if (candidate.slug === tool.slug) return false;
      if (!isPseoEligible(candidate)) return false;
      const categories = candidate.category.split(',').map((c) => c.trim());
      return categories.includes(primaryCategory);
    })
    .map((candidate, originalIndex) => ({
      candidate,
      originalIndex,
      score: relevanceScore(tool, candidate),
    }))
    .sort((a, b) => b.score - a.score || a.originalIndex - b.originalIndex)
    .map(({ candidate }) => candidate)
    .slice(0, MAX_ALTERNATIVES_LISTED);
}

export function hasEnoughAlternatives(tool: DirectoryItem, allItems: DirectoryItem[]): boolean {
  if (!isPseoEligible(tool)) return false;
  const primaryCategory = getPrimaryCategorySlug(tool);
  if (!primaryCategory) return false;
  let count = 0;
  for (const candidate of allItems) {
    if (candidate.slug === tool.slug || !isPseoEligible(candidate)) continue;
    if (!candidate.category.split(',').some((category) => category.trim() === primaryCategory)) continue;
    if (++count >= MIN_ALTERNATIVES_FOR_INDEX) return true;
  }
  return false;
}

export async function getEligibleAlternativeSlugs(): Promise<string[]> {
  const { getDirectoryItems } = await import('@/lib/supabase');
  const { isValidSlug, isValidSlugFormat } = await import('@/lib/routing-utils-client');
  const items = await getDirectoryItems();
  return items
    .filter((item) => isValidSlugFormat(item.slug) && isValidSlug(item.slug))
    .filter(isPseoEligible)
    .filter((item) => hasEnoughAlternatives(item, items))
    .map((item) => item.slug);
}
