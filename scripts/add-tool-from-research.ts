/**
 * Research a product URL with Tavily or Perplexity (same stack as admin Accept),
 * normalize the draft, then insert or update `ecosystem_apps` via the service role.
 *
 * Prereqs in `.env.local`:
 * - `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
 * - `TAVILY_API_KEY` and/or `PERPLEXITY_API_KEY` (Tavily wins when both are set)
 *
 * Usage:
 *   npx tsx scripts/add-tool-from-research.ts <https://product.example> [comment]
 *   npx tsx scripts/add-tool-from-research.ts --dry-run <url> [comment]
 *
 * `--dry-run` runs research + validation and prints the draft JSON; no DB write.
 */

import { config } from 'dotenv';
import { resolve } from 'node:path';

config({ path: resolve(process.cwd(), '.env.local') });

import { researchTool } from '@/lib/tool-research';
import {
  finalizeAutoPublishDraft,
  verifyAutoPublishDraft,
  type MergedPublishDraft,
} from '@/lib/submission-auto-publish';
import { publishToolFromSubmission } from '@/lib/supabase-admin';

type ResearchRow = {
  slug: string;
  website: string;
  name: string;
  category: string;
  features: string | string[];
  one_liner?: string;
  description: string;
  country?: string;
  city?: string;
  icon_link?: string;
  research_status?: string;
};

function toMergedDraft(raw: ResearchRow): MergedPublishDraft {
  const featuresStr = Array.isArray(raw.features)
    ? raw.features.map((f) => f.trim()).filter(Boolean).join(', ')
    : String(raw.features ?? '');

  return {
    website: raw.website.trim(),
    slug: raw.slug.trim(),
    name: raw.name.trim(),
    category: raw.category.trim(),
    features: featuresStr,
    oneLiner: (raw.one_liner ?? '').trim(),
    description: raw.description.trim(),
    country: (raw.country ?? '').trim(),
    city: (raw.city ?? '').trim(),
    iconLink: (raw.icon_link ?? '').trim(),
  };
}

function printUsage() {
  console.error(`
Usage:
  npx tsx scripts/add-tool-from-research.ts [--dry-run] <websiteUrl> [comment]

Examples:
  npx tsx scripts/add-tool-from-research.ts https://www.prop.tech "CRE underwriting AI"
  npx tsx scripts/add-tool-from-research.ts --dry-run https://example.com
`);
}

async function main() {
  const argv = process.argv.slice(2);
  const dryRun = argv[0] === '--dry-run';
  const rest = dryRun ? argv.slice(1) : argv;

  const website = rest[0];
  const comment = rest.slice(1).join(' ').trim() || 'Added via scripts/add-tool-from-research.ts';

  if (!website || website.startsWith('-')) {
    printUsage();
    process.exit(1);
  }

  let normalizedUrl: string;
  try {
    const u = new URL(website.trim());
    if (u.protocol !== 'http:' && u.protocol !== 'https:') {
      throw new Error('Only http(s) URLs are supported');
    }
    normalizedUrl = u.toString();
  } catch {
    console.error('Invalid website URL:', website);
    printUsage();
    process.exit(1);
  }

  console.error(`Researching: ${normalizedUrl}`);
  console.error(`Comment: ${comment}`);

  const raw = (await researchTool(normalizedUrl, comment)) as ResearchRow;

  if (raw.research_status === 'failed') {
    console.error('Research failed; refusing to publish. Raw row:', JSON.stringify(raw, null, 2));
    process.exit(1);
  }

  const merged = finalizeAutoPublishDraft(toMergedDraft(raw), {
    website: normalizedUrl,
    comment,
  });

  const validationError = verifyAutoPublishDraft(merged);
  if (validationError) {
    console.error('Draft validation failed:', validationError);
    console.error('Merged draft:', JSON.stringify(merged, null, 2));
    process.exit(1);
  }

  if (dryRun) {
    console.log(JSON.stringify({ dryRun: true, draft: merged }, null, 2));
    return;
  }

  const published = await publishToolFromSubmission({
    draft: {
      website: merged.website,
      slug: merged.slug,
      name: merged.name,
      category: merged.category,
      features: merged.features,
      oneLiner: merged.oneLiner,
      description: merged.description,
      country: merged.country,
      city: merged.city,
      iconLink: merged.iconLink,
    },
  });

  console.log(
    JSON.stringify(
      {
        ok: true,
        slug: published.slug,
        name: published.name,
        websiteUrl: published.websiteUrl,
        category: published.category,
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
