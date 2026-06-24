import type { Metadata } from 'next';
import type { SeoFaq } from '@/config/seo-clusters';
import { interpolateSeoText } from '@/config/seo-clusters';
import {
  getAllSeoTags,
  getSeoTag,
  MIN_TOOLS_FOR_INDEXABLE_TAG,
  type SeoTag,
} from '@/config/seo-tags';
import { siteConfig } from '@/config/site';
import type { DirectoryItem } from '@/types';
import { parseDirectoryPage } from '@/lib/directory-pagination';

export function itemMatchesCategory(item: DirectoryItem, categorySlug: string): boolean {
  const itemCategories = item.category.split(',').map((cat) => cat.trim());
  return itemCategories.includes(categorySlug);
}

export function filterItemsByCategorySlug(
  items: DirectoryItem[],
  categorySlug: string
): DirectoryItem[] {
  return items.filter((item) => itemMatchesCategory(item, categorySlug));
}

export function filterItemsByCategories(
  items: DirectoryItem[],
  categorySlugs: string[]
): DirectoryItem[] {
  const slugSet = new Set(categorySlugs);
  return items.filter((item) => {
    const itemCategories = item.category.split(',').map((cat) => cat.trim());
    return itemCategories.some((cat) => slugSet.has(cat));
  });
}

function getSearchableItemText(item: DirectoryItem): string {
  const parts = [
    item.name,
    item.tagline,
    item.description,
    ...(item.features?.map((feature) => feature.name) ?? []),
  ].filter(Boolean);

  return parts.join(' ').toLowerCase();
}

export function itemMatchesTag(item: DirectoryItem, tag: SeoTag): boolean {
  const haystack = getSearchableItemText(item);
  const matchers = tag.featureMatchers.map((m) => m.toLowerCase());
  return matchers.some((matcher) => haystack.includes(matcher));
}

export function filterItemsByTag(items: DirectoryItem[], tag: SeoTag): DirectoryItem[] {
  return items.filter((item) => itemMatchesTag(item, tag));
}

export function getTagToolCount(items: DirectoryItem[], tagSlug: string): number {
  const tag = getSeoTag(tagSlug);
  if (!tag) return 0;
  return filterItemsByTag(items, tag).length;
}

export interface IndexableTag extends SeoTag {
  toolCount: number;
}

export function getIndexableTags(items: DirectoryItem[]): IndexableTag[] {
  return getAllSeoTags()
    .map((tag) => ({
      ...tag,
      toolCount: filterItemsByTag(items, tag).length,
    }))
    .filter((tag) => tag.toolCount >= MIN_TOOLS_FOR_INDEXABLE_TAG);
}

export async function getIndexableTagSlugs(): Promise<string[]> {
  const { getDirectoryItems } = await import('@/lib/supabase');
  try {
    const items = await getDirectoryItems();
    return getIndexableTags(items).map((t) => t.slug);
  } catch {
    return [];
  }
}

/** Returns an indexable tag slug when a feature name matches curated matchers. */
export function findIndexableTagSlugForFeature(
  featureName: string,
  items: DirectoryItem[]
): string | undefined {
  const name = featureName.toLowerCase();
  const indexable = getIndexableTags(items);
  for (const tag of indexable) {
    const matchers = tag.featureMatchers.map((m) => m.toLowerCase());
    if (matchers.some((matcher) => name.includes(matcher))) {
      return tag.slug;
    }
  }
  return undefined;
}

/** First N tools — callers should pass items already sorted by display_order, name. */
export function getFeaturedTools(items: DirectoryItem[], limit = 3): DirectoryItem[] {
  return items.slice(0, limit);
}

export function buildFaqStructuredData(faqs: SeoFaq[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export interface PaginatedMetadataInput {
  basePath: string;
  page?: string | string[];
  hasFilters?: boolean;
  title: string;
  description: string;
}

export function buildPaginatedMetadata({
  basePath,
  page,
  hasFilters = false,
  title,
  description,
}: PaginatedMetadataInput): Pick<Metadata, 'alternates' | 'robots'> {
  const currentPage = parseDirectoryPage(page);
  const path = basePath.startsWith('/') ? basePath : `/${basePath}`;
  const canonicalBase = `${siteConfig.url}${path === '/' ? '' : path}`;

  if (hasFilters) {
    return {
      robots: { index: false, follow: true },
      alternates: { canonical: siteConfig.url },
    };
  }

  const canonical =
    currentPage > 1
      ? `${canonicalBase}?page=${currentPage}`
      : canonicalBase || siteConfig.url;

  return {
    robots: { index: true, follow: true },
    alternates: { canonical },
  };
}

export function buildTagPageMetadata(
  tag: SeoTag,
  toolCount: number
): { title: string; description: string } {
  return {
    title: interpolateSeoText(tag.metaTitle, { toolCount }),
    description: interpolateSeoText(tag.metaDescription, { toolCount }),
  };
}
