/**
 * Service-role Supabase helpers for the live directory (`ecosystem_apps`).
 * Import only from server contexts (App Router routes, server actions, CLI scripts).
 */
if (typeof window !== 'undefined') {
  throw new Error('supabase-admin can only be used on the server side');
}

import { createClient } from '@supabase/supabase-js';
import type { AdminTool } from '@/types';
import { revalidateDirectoryCache } from '@/lib/supabase-cache';
import { normalizeToolDescription } from '@/lib/tool-content';
import { resolveCategoryInfo } from '@/lib/utils';

const ECOSYSTEM_APPS_TABLE = 'ecosystem_apps';

type AdminToolRow = {
  slug: string;
  website_url: string | null;
  name: string;
  category: string | null;
  features: string[] | null;
  one_liner: string | null;
  description: string | null;
  country: string | null;
  city: string | null;
  icon_url: string | null;
  screenshot_url: string | null;
  screenshot_path: string | null;
  display_order: number | null;
  created_at: string;
  updated_at: string;
  workflows?: AdminTool['workflows'] | null;
  personas?: AdminTool['personas'] | null;
  asset_classes?: AdminTool['assetClasses'] | null;
  integrations?: string[] | null;
  geographic_coverage?: string[] | null;
  deployment_options?: AdminTool['deploymentOptions'] | null;
  security_certifications?: string[] | null;
  input_types?: string[] | null;
  output_types?: string[] | null;
  limitations?: string[] | null;
  pricing_model?: AdminTool['pricingModel'] | null;
  starting_price_amount?: number | string | null;
  starting_price_currency?: string | null;
  pricing_period?: AdminTool['pricingPeriod'] | null;
  has_free_trial?: boolean | null;
  has_free_plan?: boolean | null;
  best_for?: string | null;
  source_urls?: string[] | null;
  last_verified_at?: string | null;
  editorial_status?: AdminTool['editorialStatus'] | null;
  pseo_eligible?: boolean | null;
};

export type PublishableToolDraft = {
  website: string;
  slug: string;
  name: string;
  category: string;
  features: string | string[];
  oneLiner: string;
  description: string;
  country?: string;
  city?: string;
  iconLink?: string;
};

export type AdminToolUpdateInput = {
  originalSlug: string;
  slug: string;
  name: string;
  websiteUrl: string;
  category: string;
  features: string[];
  oneLiner: string;
  description: string;
  country?: string;
  city?: string;
  iconUrl?: string;
  displayOrder: number;
  workflows: AdminTool['workflows'];
  personas: AdminTool['personas'];
  assetClasses: AdminTool['assetClasses'];
  integrations: string[];
  geographicCoverage: string[];
  deploymentOptions: AdminTool['deploymentOptions'];
  securityCertifications: string[];
  inputTypes: string[];
  outputTypes: string[];
  limitations: string[];
  pricingModel: AdminTool['pricingModel'];
  startingPriceAmount: number | null;
  startingPriceCurrency?: string;
  pricingPeriod: AdminTool['pricingPeriod'];
  hasFreeTrial: boolean | null;
  hasFreePlan: boolean | null;
  bestFor?: string;
  sourceUrls: string[];
  lastVerifiedAt?: string;
  editorialStatus: AdminTool['editorialStatus'];
  pseoEligible: boolean;
};

let supabaseAdminClient: ReturnType<typeof createClient> | null = null;

/**
 * Legacy labels from older prompts/forms + common AI drift.
 * Prefer matching directory display names or slugs via `resolveCategoryInfo`.
 */
const SUBMISSION_CATEGORY_TO_DIRECTORY_CATEGORY: Record<string, string> = {
  'development & construction': 'development-construction',
  'efficiency & general tools': 'productivity-copilots',
  'investment & portfolio management': 'asset-portfolio-management',
  'legal & compliance': 'legal-compliance-due-diligence',
  'legal & compliance & due diligence': 'legal-compliance-due-diligence',
  'market analysis & valuation': 'property-analysis-valuation',
  'property management & operations': 'property-management-operations',
  'transaction & brokerage': 'transactions-brokerage',
  'transactions & brokerage': 'transactions-brokerage',
  'property search & acquisition': 'property-search-acquisition',
  'property analysis & valuation': 'property-analysis-valuation',
  'marketing & leasing enablement': 'marketing-leasing-enablement',
  'data & workflow infrastructure': 'data-workflow-infrastructure',
  'productivity & copilots': 'productivity-copilots',
};

function getSupabaseAdminClient() {
  if (supabaseAdminClient) {
    return supabaseAdminClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serverKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not properly configured.');
  }

  if (!serverKey || serverKey.includes('placeholder')) {
    throw new Error('SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY is not properly configured.');
  }

  supabaseAdminClient = createClient(supabaseUrl, serverKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return supabaseAdminClient;
}

function trimNullable(value?: string | null) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseFeatures(features: string | string[] | null | undefined) {
  if (Array.isArray(features)) {
    return features.map((feature) => feature.trim()).filter(Boolean);
  }

  if (!features) {
    return [];
  }

  // Automated reviews serialize capability tags on separate lines so a legacy
  // feature containing an internal comma is not accidentally split into fragments.
  return features
    .split(features.includes('\n') ? /\n+/ : /,/)
    .map((feature) => feature.trim())
    .filter(Boolean);
}

function mapAdminToolRow(row: AdminToolRow): AdminTool {
  const normalizedDataAvailable = row.editorial_status !== undefined;
  const startingPrice = row.starting_price_amount == null ? null : Number(row.starting_price_amount);

  return {
    slug: row.slug,
    name: row.name,
    websiteUrl: row.website_url ?? '',
    category: row.category ?? '',
    features: row.features ?? [],
    oneLiner: row.one_liner ?? '',
    description: normalizeToolDescription(row.description ?? ''),
    country: row.country ?? '',
    city: row.city ?? '',
    iconUrl: row.icon_url ?? '',
    screenshotUrl: row.screenshot_url ?? '',
    screenshotPath: row.screenshot_path ?? '',
    displayOrder: row.display_order ?? 999,
    workflows: row.workflows ?? [],
    personas: row.personas ?? [],
    assetClasses: row.asset_classes ?? [],
    integrations: row.integrations ?? [],
    geographicCoverage: row.geographic_coverage ?? [],
    deploymentOptions: row.deployment_options ?? [],
    securityCertifications: row.security_certifications ?? [],
    inputTypes: row.input_types ?? [],
    outputTypes: row.output_types ?? [],
    limitations: row.limitations ?? [],
    pricingModel: row.pricing_model ?? 'unknown',
    startingPriceAmount: Number.isFinite(startingPrice) ? startingPrice : null,
    startingPriceCurrency: row.starting_price_currency ?? '',
    pricingPeriod: row.pricing_period ?? null,
    hasFreeTrial: row.has_free_trial ?? null,
    hasFreePlan: row.has_free_plan ?? null,
    bestFor: row.best_for ?? '',
    sourceUrls: row.source_urls ?? [],
    lastVerifiedAt: row.last_verified_at ?? '',
    editorialStatus: row.editorial_status ?? 'legacy',
    pseoEligible: normalizedDataAvailable ? row.pseo_eligible === true : true,
    normalizedDataAvailable,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function normalizeWebsiteUrl(url: string) {
  const parsed = new URL(url.trim());
  parsed.hash = '';
  parsed.search = '';
  parsed.hostname = parsed.hostname.toLowerCase();
  parsed.protocol = parsed.protocol.toLowerCase();

  if ((parsed.protocol === 'https:' && parsed.port === '443') || (parsed.protocol === 'http:' && parsed.port === '80')) {
    parsed.port = '';
  }

  if (parsed.pathname !== '/') {
    parsed.pathname = parsed.pathname.replace(/\/+$/, '');
  }

  return parsed.toString();
}

function normalizeCategory(value: string) {
  const trimmedValue = value.trim();
  const mappedCategory = SUBMISSION_CATEGORY_TO_DIRECTORY_CATEGORY[trimmedValue.toLowerCase()];

  if (mappedCategory) {
    return mappedCategory;
  }

  const categoryInfo = resolveCategoryInfo(trimmedValue);
  return categoryInfo.hasPage ? categoryInfo.slug : null;
}

function buildPayload(input: {
  slug: string;
  name: string;
  websiteUrl: string;
  category: string;
  features: string[] | string;
  oneLiner: string;
  description: string;
  country?: string;
  city?: string;
  iconUrl?: string;
  displayOrder?: number | null;
}) {
  const normalizedCategory = normalizeCategory(input.category);

  if (!normalizedCategory) {
    throw new Error(`Category "${input.category}" does not match a live site category.`);
  }

  return {
    slug: input.slug.trim(),
    name: input.name.trim(),
    website_url: normalizeWebsiteUrl(input.websiteUrl),
    category: normalizedCategory,
    features: parseFeatures(input.features),
    one_liner: input.oneLiner.trim(),
    description: normalizeToolDescription(input.description),
    country: trimNullable(input.country),
    city: trimNullable(input.city),
    icon_url: trimNullable(input.iconUrl),
    display_order: input.displayOrder ?? null,
  };
}

async function getToolBySlug(slug: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from(ECOSYSTEM_APPS_TABLE)
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch published tool: ${error.message}`);
  }

  return data as AdminToolRow | null;
}

async function getToolByWebsite(websiteUrl: string) {
  const supabase = getSupabaseAdminClient();
  const normalizedWebsite = normalizeWebsiteUrl(websiteUrl);
  const alternateWebsite = normalizedWebsite.endsWith('/') ? normalizedWebsite.slice(0, -1) : `${normalizedWebsite}/`;

  const { data, error } = await supabase
    .from(ECOSYSTEM_APPS_TABLE)
    .select('*')
    .in('website_url', [normalizedWebsite, alternateWebsite])
    .limit(1);

  if (error) {
    throw new Error(`Failed to check for an existing live tool: ${error.message}`);
  }

  return ((data as AdminToolRow[] | null) ?? [])[0] ?? null;
}

async function hasNormalizedToolSchema(): Promise<boolean> {
  const { error } = await getSupabaseAdminClient()
    .from(ECOSYSTEM_APPS_TABLE)
    .select('editorial_status')
    .limit(1);

  if (!error) return true;
  if (error.code === '42703' || error.code === 'PGRST204' || /column .* does not exist|could not find .* column/i.test(error.message)) {
    return false;
  }
  throw new Error(`Failed to inspect the live tool schema: ${error.message}`);
}

async function resolveUniqueSlug(baseSlug: string, websiteUrl: string) {
  const normalizedWebsite = normalizeWebsiteUrl(websiteUrl);
  let candidate = baseSlug;
  let suffix = 2;

  while (true) {
    const existingTool = await getToolBySlug(candidate);

    if (!existingTool) {
      return candidate;
    }

    if (existingTool.website_url && normalizeWebsiteUrl(existingTool.website_url) === normalizedWebsite) {
      return candidate;
    }

    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

export async function listAdminTools() {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from(ECOSYSTEM_APPS_TABLE)
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list published tools: ${error.message}`);
  }

  return ((data as AdminToolRow[] | null) ?? []).map(mapAdminToolRow);
}

export async function getAdminToolBySlug(slug: string) {
  const row = await getToolBySlug(slug);
  return row ? mapAdminToolRow(row) : null;
}

export async function updateAdminTool(input: AdminToolUpdateInput) {
  const supabase = getSupabaseAdminClient();
  const currentRow = await getToolBySlug(input.originalSlug);
  if (!currentRow) {
    throw new Error(`Tool "${input.originalSlug}" no longer exists.`);
  }

  const basicPayload = buildPayload({
    slug: input.slug,
    name: input.name,
    websiteUrl: input.websiteUrl,
    category: input.category,
    features: input.features,
    oneLiner: input.oneLiner,
    description: input.description,
    country: input.country,
    city: input.city,
    iconUrl: input.iconUrl,
    displayOrder: input.displayOrder,
  });

  const payload = currentRow.editorial_status === undefined
    ? basicPayload
    : {
        ...basicPayload,
        workflows: input.workflows,
        personas: input.personas,
        asset_classes: input.assetClasses,
        integrations: input.integrations,
        geographic_coverage: input.geographicCoverage,
        deployment_options: input.deploymentOptions,
        security_certifications: input.securityCertifications,
        input_types: input.inputTypes,
        output_types: input.outputTypes,
        limitations: input.limitations,
        pricing_model: input.pricingModel,
        starting_price_amount: input.startingPriceAmount,
        starting_price_currency: trimNullable(input.startingPriceCurrency)?.toUpperCase() ?? null,
        pricing_period: input.pricingPeriod,
        has_free_trial: input.hasFreeTrial,
        has_free_plan: input.hasFreePlan,
        best_for: trimNullable(input.bestFor),
        source_urls: input.sourceUrls,
        last_verified_at: trimNullable(input.lastVerifiedAt),
        editorial_status: input.editorialStatus,
        pseo_eligible: input.pseoEligible,
      };

  const { data, error } = await (supabase
    .from(ECOSYSTEM_APPS_TABLE) as any)
    .update(payload)
    .eq('slug', input.originalSlug)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to update published tool: ${error.message}`);
  }
  revalidateDirectoryCache();
  return mapAdminToolRow(data as AdminToolRow);
}

export async function publishToolFromSubmission(input: { draft: PublishableToolDraft }) {
  const supabase = getSupabaseAdminClient();
  const payload = buildPayload({
    slug: input.draft.slug,
    name: input.draft.name,
    websiteUrl: input.draft.website,
    category: input.draft.category,
    features: input.draft.features,
    oneLiner: input.draft.oneLiner,
    description: input.draft.description,
    country: input.draft.country,
    city: input.draft.city,
    iconUrl: input.draft.iconLink,
  });
  const normalizedSchemaAvailable = await hasNormalizedToolSchema();
  const editorialPayload = normalizedSchemaAvailable
    ? {
        editorial_status: 'draft',
        pseo_eligible: false,
        source_urls: [payload.website_url],
        last_verified_at: null,
      }
    : {};

  const existingTool = await getToolByWebsite(payload.website_url);

  if (existingTool) {
    const { data, error } = await (supabase
      .from(ECOSYSTEM_APPS_TABLE) as any)
      .update({
        ...payload,
        ...editorialPayload,
        slug: existingTool.slug,
      })
      .eq('slug', existingTool.slug)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to update the existing live tool: ${error.message}`);
    }
    revalidateDirectoryCache();
    return mapAdminToolRow(data as AdminToolRow);
  }

  const finalSlug = await resolveUniqueSlug(payload.slug, payload.website_url);
  const { data, error } = await (supabase
    .from(ECOSYSTEM_APPS_TABLE) as any)
    .insert({
      ...payload,
      ...editorialPayload,
      slug: finalSlug,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to publish tool to the live directory: ${error.message}`);
  }
  revalidateDirectoryCache();
  return mapAdminToolRow(data as AdminToolRow);
}
