import type { Metadata } from 'next';
import { getSeoCluster, interpolateSeoText } from '@/config/seo-clusters';
import { getCategoryLabel } from '@/config/design-tokens';
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

export function isPseoEligible(item: DirectoryItem): boolean {
  return item.pseoEligible;
}

export function filterItemsByPersona(
  items: DirectoryItem[],
  personaSlug: string,
  fallbackCategorySlugs: string[]
): DirectoryItem[] {
  const fallbackCategories = new Set(fallbackCategorySlugs);
  return items.filter((item) => {
    if (!isPseoEligible(item)) return false;
    if (item.personas.length > 0) return item.personas.includes(personaSlug as DirectoryItem['personas'][number]);
    return item.category.split(',').some((category) => fallbackCategories.has(category.trim()));
  });
}

function getSearchableItemText(item: DirectoryItem): string {
  const parts = [
    item.name,
    item.tagline,
    item.description,
    ...(item.tags ?? []),
    ...(item.features?.map((feature) => feature.name) ?? []),
  ].filter(Boolean);

  return parts.join(' ').toLowerCase();
}

export function itemMatchesTag(item: DirectoryItem, tag: SeoTag): boolean {
  if (item.workflows.length > 0) {
    return item.workflows.includes(tag.slug as DirectoryItem['workflows'][number]);
  }
  const haystack = getSearchableItemText(item);
  const matchers = tag.featureMatchers.map((m) => m.toLowerCase());
  return matchers.some((matcher) => haystack.includes(matcher));
}

export function filterItemsByTag(items: DirectoryItem[], tag: SeoTag): DirectoryItem[] {
  return items.filter((item) => isPseoEligible(item) && itemMatchesTag(item, tag));
}

export function getTagToolCount(items: DirectoryItem[], tagSlug: string): number {
  const tag = getSeoTag(tagSlug);
  if (!tag) return 0;
  return filterItemsByTag(items, tag).length;
}

export interface IndexableTag extends SeoTag {
  toolCount: number;
}

// Dataset identity is request-memoized by the data layer. Weak keys do not retain
// old directory snapshots after revalidation.
const indexableTagsCache = new WeakMap<DirectoryItem[], IndexableTag[]>();

export function getIndexableTags(items: DirectoryItem[]): IndexableTag[] {
  const cached = indexableTagsCache.get(items);
  if (cached) return cached;
  const tags = getAllSeoTags()
    .map((tag) => ({
      ...tag,
      toolCount: filterItemsByTag(items, tag).length,
    }))
    .filter((tag) => tag.toolCount >= MIN_TOOLS_FOR_INDEXABLE_TAG);
  indexableTagsCache.set(items, tags);
  return tags;
}

export async function getIndexableTagSlugs(): Promise<string[]> {
  const { getDirectoryItems } = await import('@/lib/supabase');
  const items = await getDirectoryItems();
  return getIndexableTags(items).map((t) => t.slug);
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

const SEO_TITLE_MAX = 60;
const SEO_DESCRIPTION_MAX = 155;

function truncateAtWord(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.6) {
    return `${truncated.slice(0, lastSpace)}...`;
  }
  return `${truncated}...`;
}

/**
 * Category-aware tool page metadata aligned with docs/SEO-KEYWORDS.md clusters.
 */
export function generateToolPageMeta(
  name: string,
  tagline: string | undefined,
  categorySlugs: string[],
): { title: string; description: string; keywords: string[] } {
  const primarySlug = categorySlugs[0];
  const cluster = primarySlug ? getSeoCluster(primarySlug) : undefined;
  const categoryLabel = primarySlug ? getCategoryLabel(primarySlug) : 'Commercial Real Estate';

  const titleCore = cluster
    ? `${name} — ${cluster.primaryKeyword}`
    : `${name} Review & Features`;
  const title = truncateAtWord(`${titleCore} | AI CRE Tools`, SEO_TITLE_MAX);

  const shortTagline =
    tagline?.trim() ||
    `${name} for ${categoryLabel.toLowerCase()} teams`;

  const descriptionCore = cluster
    ? `${name}: ${shortTagline}. Compare features, pricing & alternatives among ${cluster.primaryKeyword} tools.`
    : `${name}: ${shortTagline}. Compare features, pricing & alternatives for CRE teams.`;
  const description = truncateAtWord(descriptionCore, SEO_DESCRIPTION_MAX);

  const keywords = [
    name,
    `${name} review`,
    `${name} pricing`,
    `${name} alternatives`,
    `${name} features`,
    ...(cluster
      ? [cluster.primaryKeyword, ...cluster.secondaryKeywords.slice(0, 4)]
      : ['commercial real estate ai tools']),
    categoryLabel,
    'cre software comparison',
  ];

  return { title, description, keywords };
}
