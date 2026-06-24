import type { DirectoryItem } from '@/types';
import { filterItemsByCategorySlug } from '@/lib/seo-pages';

export const MIN_ALTERNATIVES_FOR_INDEX = 3;
export const MAX_ALTERNATIVES_LISTED = 8;

export function getPrimaryCategorySlug(item: DirectoryItem): string | undefined {
  const primary = item.category.split(',')[0]?.trim();
  return primary || undefined;
}

export function getAlternativesForTool(
  tool: DirectoryItem,
  allItems: DirectoryItem[]
): DirectoryItem[] {
  const primaryCategory = getPrimaryCategorySlug(tool);
  if (!primaryCategory) return [];

  return allItems
    .filter((candidate) => {
      if (candidate.slug === tool.slug) return false;
      const categories = candidate.category.split(',').map((c) => c.trim());
      return categories.includes(primaryCategory);
    })
    .slice(0, MAX_ALTERNATIVES_LISTED);
}

export function hasEnoughAlternatives(tool: DirectoryItem, allItems: DirectoryItem[]): boolean {
  return getAlternativesForTool(tool, allItems).length >= MIN_ALTERNATIVES_FOR_INDEX;
}

export async function getEligibleAlternativeSlugs(): Promise<string[]> {
  const { getDirectoryItems } = await import('@/lib/supabase');
  const { isValidSlug, isValidSlugFormat } = await import('@/lib/routing-utils-client');
  try {
    const items = await getDirectoryItems();
    return items
      .filter((item) => isValidSlugFormat(item.slug) && isValidSlug(item.slug))
      .filter((item) => hasEnoughAlternatives(item, items))
      .map((item) => item.slug);
  } catch {
    return [];
  }
}
