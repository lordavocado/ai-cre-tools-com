import { getAllBlogPosts } from '@/lib/blog';
import { getGuides } from '@/lib/markdown';
import { getCategories, getDirectoryItems } from '@/lib/supabase';
import { siteConfig } from '@/config/site';
import { getAllSeoPersonaSlugs, getSeoPersona } from '@/config/seo-personas';
import { getAllGlossarySlugs } from '@/config/seo-glossary';
import { getEligibleAlternativeSlugs, getAlternativesForTool } from '@/config/seo-alternatives';
import { getResolvedComparisons } from '@/config/seo-comparisons';
import {
  filterItemsByCategorySlug,
  filterItemsByPersona,
  filterItemsByTag,
  getIndexableTags,
} from '@/lib/seo-pages';
import { isValidSlug, isValidSlugFormat } from '@/lib/routing-utils-client';
import { getToolAlternativesPath, getToolPath } from '@/lib/tool-routes';
import type { DirectoryItem } from '@/types';
import { getIndexableUseCases } from '@/lib/seo-use-cases';
import { getIndexableAssetPages, getIndexableIntegrationPages } from '@/lib/seo-market-pages';
import { buildDirectoryPageUrl, getDirectoryItemsPerPage } from '@/lib/directory-pagination';

export const SITEMAP_GROUPS = ['tools', 'alternatives', 'taxonomy', 'use-cases', 'markets', 'content'] as const;
export type SitemapGroup = (typeof SITEMAP_GROUPS)[number];

export type SitemapEntry = {
  loc: string;
  lastmod?: string;
};

const CONTENT_LAST_REVIEWED = '2026-08-18T00:00:00.000Z';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function validDate(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function latestItemDate(items: DirectoryItem[]): string | undefined {
  const timestamps = items
    .map((item) => validDate(item.lastUpdated ?? item.createdAt))
    .filter((value): value is string => Boolean(value));
  return timestamps.sort().at(-1);
}

function getPaginatedEntries(path: string, items: DirectoryItem[]): SitemapEntry[] {
  const totalPages = Math.ceil(items.length / getDirectoryItemsPerPage());
  const lastmod = latestItemDate(items);

  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
    loc: `${siteConfig.url}${buildDirectoryPageUrl(path, index + 2)}`,
    lastmod,
  }));
}

export function buildUrlSetXml(entries: SitemapEntry[]): string {
  const urls = entries.map((entry) => `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>${entry.lastmod
    ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`
    : ''}\n  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

export function buildSitemapIndexXml(locations: string[]): string {
  const sitemaps = locations
    .map((location) => `  <sitemap>\n    <loc>${escapeXml(location)}</loc>\n  </sitemap>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemaps}\n</sitemapindex>`;
}

async function getToolEntries(): Promise<SitemapEntry[]> {
  const items = await getDirectoryItems();
  return items
    .filter((item) => isValidSlugFormat(item.slug) && isValidSlug(item.slug))
    .map((item) => ({
      loc: `${siteConfig.url}${getToolPath(item.slug)}`,
      lastmod: validDate(item.lastUpdated ?? item.createdAt),
    }));
}

async function getAlternativeEntries(): Promise<SitemapEntry[]> {
  const items = await getDirectoryItems();
  const eligibleSlugs = new Set(await getEligibleAlternativeSlugs());
  return items
    .filter((item) => eligibleSlugs.has(item.slug))
    .map((item) => ({
      loc: `${siteConfig.url}${getToolAlternativesPath(item.slug)}`,
      lastmod: latestItemDate([item, ...getAlternativesForTool(item, items)]),
    }));
}

async function getTaxonomyEntries(): Promise<SitemapEntry[]> {
  const [items, categories] = await Promise.all([getDirectoryItems(), getCategories(false)]);
  const entries: SitemapEntry[] = [
    { loc: `${siteConfig.url}/categories`, lastmod: latestItemDate(items) },
    { loc: `${siteConfig.url}/for`, lastmod: latestItemDate(items) },
    { loc: `${siteConfig.url}/tags`, lastmod: latestItemDate(items) },
  ];

  for (const category of categories) {
    const categoryItems = filterItemsByCategorySlug(items, category.slug);
    entries.push({
      loc: `${siteConfig.url}/categories/${category.slug}`,
      lastmod: latestItemDate(categoryItems),
    });
    entries.push(...getPaginatedEntries(`/categories/${category.slug}`, categoryItems));
  }

  for (const slug of getAllSeoPersonaSlugs()) {
    const persona = getSeoPersona(slug);
    if (!persona) continue;
    entries.push({
      loc: `${siteConfig.url}/for/${slug}`,
      lastmod: latestItemDate(filterItemsByPersona(items, slug, persona.categorySlugs)),
    });
  }

  for (const tag of getIndexableTags(items)) {
    entries.push({
      loc: `${siteConfig.url}/tags/${tag.slug}`,
      lastmod: latestItemDate(filterItemsByTag(items, tag)),
    });
  }

  return entries;
}

async function getContentEntries(): Promise<SitemapEntry[]> {
  const [items, guides, blogPosts] = await Promise.all([
    getDirectoryItems(),
    getGuides(),
    getAllBlogPosts(),
  ]);
  return [
    { loc: siteConfig.url },
    { loc: `${siteConfig.url}/about` },
    { loc: `${siteConfig.url}/all-tools`, lastmod: latestItemDate(items) },
    { loc: `${siteConfig.url}/guides` },
    { loc: `${siteConfig.url}/blog` },
    { loc: `${siteConfig.url}/compare`, lastmod: latestItemDate(items.filter((item) => item.pseoEligible)) },
    { loc: `${siteConfig.url}/glossary`, lastmod: CONTENT_LAST_REVIEWED },
    { loc: `${siteConfig.url}/privacy-policy` },
    { loc: `${siteConfig.url}/terms-of-service` },
    ...guides.map((guide) => ({
      loc: `${siteConfig.url}/guides/${guide.slug}`,
      lastmod: validDate(guide.publishedDate),
    })),
    ...blogPosts.map((post) => ({
      loc: `${siteConfig.url}/blog/${post.slug}`,
      lastmod: validDate(post.publishedDate),
    })),
    ...getResolvedComparisons(items).map((comparison) => ({
      loc: `${siteConfig.url}/compare/${comparison.slug}`,
      lastmod: latestItemDate([comparison.toolA, comparison.toolB]),
    })),
    ...getAllGlossarySlugs().map((slug) => ({
      loc: `${siteConfig.url}/glossary/${slug}`,
      lastmod: CONTENT_LAST_REVIEWED,
    })),
  ];
}

async function getUseCaseEntries(): Promise<SitemapEntry[]> {
  const items = await getDirectoryItems();
  const useCases = getIndexableUseCases(items);
  return [
    { loc: `${siteConfig.url}/use-cases`, lastmod: latestItemDate(useCases.flatMap((useCase) => useCase.tools)) },
    ...useCases.map((useCase) => ({
      loc: `${siteConfig.url}${useCase.path}`,
      lastmod: latestItemDate(useCase.tools),
    })),
    ...useCases.flatMap((useCase) => getPaginatedEntries(useCase.path, useCase.tools)),
  ];
}

async function getMarketEntries(): Promise<SitemapEntry[]> {
  const items = await getDirectoryItems();
  const assetPages = getIndexableAssetPages(items);
  const integrationPages = getIndexableIntegrationPages(items);
  return [
    { loc: `${siteConfig.url}/asset-classes`, lastmod: latestItemDate(assetPages.flatMap((page) => page.tools)) },
    { loc: `${siteConfig.url}/integrations`, lastmod: latestItemDate(integrationPages.flatMap((page) => page.tools)) },
    ...assetPages.map((page) => ({
      loc: `${siteConfig.url}${page.path}`,
      lastmod: latestItemDate(page.tools),
    })),
    ...integrationPages.map((page) => ({
      loc: `${siteConfig.url}${page.path}`,
      lastmod: latestItemDate(page.tools),
    })),
  ];
}

export async function getSitemapEntries(group: SitemapGroup): Promise<SitemapEntry[]> {
  if (group === 'tools') return getToolEntries();
  if (group === 'alternatives') return getAlternativeEntries();
  if (group === 'taxonomy') return getTaxonomyEntries();
  if (group === 'use-cases') return getUseCaseEntries();
  if (group === 'markets') return getMarketEntries();
  return getContentEntries();
}
