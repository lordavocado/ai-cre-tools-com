/**
 * One-click accept: coerce AI + submission data into a publishable draft when research
 * is incomplete or uses placeholder values, then validate before writing to production.
 */

import { generateSEOSlug, isValidSlug, isValidSlugFormat } from '@/lib/routing-utils';
import { TOOL_SUBMISSION_CATEGORIES } from '@/lib/tool-submission-categories';
import { getCategoryDisplayName, resolveCategoryInfo } from '@/lib/utils';

/** Same draft shape as `buildPublishDraft` in admin submissions route */
export type MergedPublishDraft = {
  website: string;
  slug: string;
  name: string;
  category: string;
  features: string;
  oneLiner: string;
  description: string;
  country: string;
  city: string;
  iconLink: string;
};

const DEFAULT_CATEGORY_LABEL = 'Productivity & Copilots';

const PLACEHOLDER_NAMES = new Set([
  '',
  'research failed',
  'unknown',
]);

/** Legacy research labels → canonical directory display names (see also supabase-admin). */
const LEGACY_CATEGORY_TO_LABEL: Record<string, string> = {
  'development & construction': 'Development & Construction',
  'efficiency & general tools': 'Productivity & Copilots',
  'investment & portfolio management': 'Asset & Portfolio Management',
  'legal & compliance': 'Legal, Compliance & Due Diligence',
  'market analysis & valuation': 'Property Analysis & Valuation',
  'property management & operations': 'Property Management & Operations',
  'transaction & brokerage': 'Transactions & Brokerage',
  'transactions & brokerage': 'Transactions & Brokerage',
};

function isAllowedCategoryLabel(value: string): boolean {
  return (TOOL_SUBMISSION_CATEGORIES as readonly string[]).includes(value);
}

/**
 * Returns a category string that `normalizeCategory` in supabase-admin will accept
 * (directory display name or slug-resolvable label).
 */
export function coerceCategoryForPublish(raw: string | undefined): string {
  const t = (raw ?? '').trim();
  if (!t || t.toLowerCase() === 'unknown') {
    return DEFAULT_CATEGORY_LABEL;
  }

  if (isAllowedCategoryLabel(t)) {
    return t;
  }

  const legacy = LEGACY_CATEGORY_TO_LABEL[t.toLowerCase()];
  if (legacy && isAllowedCategoryLabel(legacy)) {
    return legacy;
  }

  const info = resolveCategoryInfo(t);
  if (info.hasPage) {
    const label = getCategoryDisplayName(info.slug);
    if (isAllowedCategoryLabel(label)) {
      return label;
    }
  }

  return DEFAULT_CATEGORY_LABEL;
}

function hostnameBrandName(website: string): string {
  try {
    const host = new URL(website).hostname.replace(/^www\./, '');
    const segment = host.split('.')[0] ?? host;
    if (!segment) {
      return 'Tool';
    }
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  } catch {
    return 'Tool';
  }
}

function ensureDescription(name: string, comment: string, existing: string): string {
  const d = existing.trim();
  if (d.length >= 80) {
    return d;
  }

  const c = comment.trim();
  const base =
    c.length >= 30
      ? `${c} This product is listed in the AI CRE Tools directory for commercial real estate professionals seeking AI-enabled software.`
      : `${name} is software relevant to commercial real estate teams. ${c ? `${c} ` : ''}Listing curated via AI CRE Tools — a focused directory of AI products for underwriting, asset management, leasing, and operations.`;

  if (base.length >= 80) {
    return base;
  }

  return `${base} Use this directory entry to evaluate fit for your workflow before adopting new tools.`;
}

function ensureOneLiner(description: string, existing: string): string {
  const o = existing.trim();
  if (o.length >= 12 && !o.toLowerCase().includes('manual review') && !o.toLowerCase().includes('research failed')) {
    return o.slice(0, 300);
  }

  const sentence = description.split(/(?<=[.!?])\s+/)[0]?.trim() || description;
  const clipped = sentence.length > 160 ? `${sentence.slice(0, 157)}…` : sentence;
  return clipped.length >= 12 ? clipped : `${description.slice(0, 120).trim()}…`;
}

function ensureFeatures(existing: string): string {
  const f = existing.trim();
  if (f.length >= 8 && !/research in progress|research failed/i.test(f)) {
    return f;
  }
  return 'AI-assisted workflows and features for commercial real estate teams';
}

function ensureSlug(slug: string, name: string): string {
  const s = slug.trim();
  if (s && isValidSlugFormat(s) && isValidSlug(s)) {
    return s;
  }
  return generateSEOSlug(name);
}

/**
 * Fills gaps and replaces AI placeholders so the draft can pass publish validation
 * without opening the admin form.
 */
export function finalizeAutoPublishDraft(
  draft: MergedPublishDraft,
  ctx: { website: string; comment: string }
): MergedPublishDraft {
  const website = (draft.website || ctx.website).trim();

  let name = draft.name.trim();
  if (!name || PLACEHOLDER_NAMES.has(name.toLowerCase())) {
    name = hostnameBrandName(website);
  }

  const category = coerceCategoryForPublish(draft.category);

  let description = ensureDescription(name, ctx.comment, draft.description);

  let oneLiner = ensureOneLiner(description, draft.oneLiner);

  const features = ensureFeatures(draft.features);

  const slug = ensureSlug(draft.slug, name);

  return {
    website,
    slug,
    name,
    category,
    features,
    oneLiner,
    description,
    country: (draft.country ?? '').trim(),
    city: (draft.city ?? '').trim(),
    iconLink: (draft.iconLink ?? '').trim(),
  };
}

/** Lightweight sanity check after finalize (before DB publish). */
export function verifyAutoPublishDraft(draft: MergedPublishDraft): string | null {
  if (!draft.website) {
    return 'Website is missing.';
  }
  if (!draft.name || draft.name.length < 2) {
    return 'Could not derive a tool name.';
  }
  if (!draft.category) {
    return 'Category could not be resolved.';
  }
  if (!draft.description || draft.description.length < 40) {
    return 'Description is too short after auto-fill.';
  }
  if (!draft.oneLiner || draft.oneLiner.length < 10) {
    return 'Tagline is too short after auto-fill.';
  }
  if (!isValidSlugFormat(draft.slug) || !isValidSlug(draft.slug)) {
    return 'Slug is invalid after auto-fill.';
  }
  return null;
}
