import {
  TOOL_ASSET_CLASS_OPTIONS,
  getTaxonomyLabel,
  type ToolAssetClass,
} from '@/config/tool-taxonomy';
import type { DirectoryItem } from '@/types';
import { isPseoEligible } from '@/lib/seo-pages';

export const MIN_TOOLS_FOR_MARKET_PAGE = 3;
export const MAX_TOOLS_FOR_MARKET_PAGE = 60;

type MarketDefinition = {
  slug: string;
  label: string;
  matchers: string[];
};

export type SeoMarketPage = MarketDefinition & {
  tools: DirectoryItem[];
  path: string;
  title: string;
  description: string;
};

const ASSET_MATCHERS: Record<Exclude<ToolAssetClass, 'all-asset-classes'>, string[]> = {
  multifamily: ['multifamily', 'multi-family', 'apartment'],
  office: ['office building', 'office space', 'office real estate'],
  industrial: ['industrial real estate', 'industrial property', 'warehouse'],
  retail: ['retail real estate', 'retail property', 'shopping center', 'shopping centre'],
  hospitality: ['hospitality', 'hotel'],
  healthcare: ['healthcare real estate', 'medical office'],
  'student-housing': ['student housing'],
  'senior-housing': ['senior housing'],
  'self-storage': ['self-storage', 'self storage'],
  'data-centers': ['data center', 'data centre'],
  land: ['land acquisition', 'land development'],
  'mixed-use': ['mixed-use', 'mixed use'],
  'corporate-real-estate': ['corporate real estate'],
};

const ASSET_DEFINITIONS: MarketDefinition[] = TOOL_ASSET_CLASS_OPTIONS
  .filter((option) => option.value !== 'all-asset-classes')
  .map((option) => ({
    slug: option.value,
    label: option.label,
    matchers: ASSET_MATCHERS[option.value as Exclude<ToolAssetClass, 'all-asset-classes'>],
  }));

const INTEGRATION_DEFINITIONS: MarketDefinition[] = [
  { slug: 'yardi', label: 'Yardi', matchers: ['yardi'] },
  { slug: 'mri-software', label: 'MRI Software', matchers: ['mri software', 'mri real estate'] },
  { slug: 'realpage', label: 'RealPage', matchers: ['realpage'] },
  { slug: 'salesforce', label: 'Salesforce', matchers: ['salesforce'] },
  { slug: 'hubspot', label: 'HubSpot', matchers: ['hubspot'] },
  { slug: 'microsoft-excel', label: 'Microsoft Excel', matchers: ['microsoft excel', 'excel add-in', 'excel integration'] },
  { slug: 'appfolio', label: 'AppFolio', matchers: ['appfolio'] },
  { slug: 'quickbooks', label: 'QuickBooks', matchers: ['quickbooks'] },
  { slug: 'procore', label: 'Procore', matchers: ['procore'] },
];

function searchableText(item: DirectoryItem): string {
  return [
    item.name,
    item.tagline,
    item.description,
    ...(item.tags ?? []),
    ...(item.features?.map((feature) => feature.name) ?? []),
  ].join(' ').toLowerCase();
}

function qualifies(tools: DirectoryItem[]): boolean {
  return tools.length >= MIN_TOOLS_FOR_MARKET_PAGE && tools.length <= MAX_TOOLS_FOR_MARKET_PAGE;
}

function matchesLegacyEvidence(item: DirectoryItem, definition: MarketDefinition): boolean {
  const haystack = searchableText(item);
  return definition.matchers.some((matcher) => haystack.includes(matcher));
}

function filterByAsset(items: DirectoryItem[], definition: MarketDefinition): DirectoryItem[] {
  return items.filter((item) => {
    if (!isPseoEligible(item)) return false;
    if (item.assetClasses.length > 0) {
      return item.assetClasses.includes(definition.slug as ToolAssetClass)
        || item.assetClasses.includes('all-asset-classes');
    }
    return matchesLegacyEvidence(item, definition);
  });
}

function normalizedIntegration(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function filterByIntegration(items: DirectoryItem[], definition: MarketDefinition): DirectoryItem[] {
  return items.filter((item) => {
    if (!isPseoEligible(item)) return false;
    if (item.integrations.length > 0) {
      return item.integrations.some((integration) => {
        const normalized = normalizedIntegration(integration);
        return definition.matchers.some((matcher) => normalized.includes(normalizedIntegration(matcher)));
      });
    }
    return matchesLegacyEvidence(item, definition);
  });
}

function buildPage(
  definition: MarketDefinition,
  tools: DirectoryItem[],
  type: 'asset' | 'integration',
): SeoMarketPage {
  const path = type === 'asset'
    ? `/asset-classes/${definition.slug}`
    : `/integrations/${definition.slug}`;
  const title = type === 'asset'
    ? `AI Software for ${definition.label} Real Estate`
    : `CRE Software That Integrates with ${definition.label}`;
  const description = type === 'asset'
    ? `Compare ${tools.length} AI and software tools with documented support for ${definition.label.toLowerCase()} real estate workflows.`
    : `Compare ${tools.length} commercial real estate tools with documented ${definition.label} integration support.`;

  return { ...definition, tools, path, title, description };
}

const assetPagesCache = new WeakMap<DirectoryItem[], SeoMarketPage[]>();
const integrationPagesCache = new WeakMap<DirectoryItem[], SeoMarketPage[]>();

export function getIndexableAssetPages(items: DirectoryItem[]): SeoMarketPage[] {
  const cached = assetPagesCache.get(items);
  if (cached) return cached;
  const pages = ASSET_DEFINITIONS
    .map((definition) => buildPage(definition, filterByAsset(items, definition), 'asset'))
    .filter((page) => qualifies(page.tools))
    .sort((a, b) => b.tools.length - a.tools.length || a.label.localeCompare(b.label));
  assetPagesCache.set(items, pages);
  return pages;
}

export function getIndexableIntegrationPages(items: DirectoryItem[]): SeoMarketPage[] {
  const cached = integrationPagesCache.get(items);
  if (cached) return cached;
  const pages = INTEGRATION_DEFINITIONS
    .map((definition) => buildPage(definition, filterByIntegration(items, definition), 'integration'))
    .filter((page) => qualifies(page.tools))
    .sort((a, b) => b.tools.length - a.tools.length || a.label.localeCompare(b.label));
  integrationPagesCache.set(items, pages);
  return pages;
}

export function getIndexableAssetPage(
  items: DirectoryItem[],
  slug: string,
): SeoMarketPage | undefined {
  return getIndexableAssetPages(items).find((page) => page.slug === slug);
}

export function getIndexableIntegrationPage(
  items: DirectoryItem[],
  slug: string,
): SeoMarketPage | undefined {
  return getIndexableIntegrationPages(items).find((page) => page.slug === slug);
}

export function getAssetLabel(slug: string): string {
  return getTaxonomyLabel(TOOL_ASSET_CLASS_OPTIONS, slug);
}
