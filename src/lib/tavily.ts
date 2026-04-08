import { z } from 'zod';
import { generateSEOSlug } from '@/lib/routing-utils';
import { TOOL_SUBMISSION_CATEGORIES } from '@/lib/tool-submission-categories';

const TavilyCreateResearchResponseSchema = z.object({
  request_id: z.string(),
  status: z.string(),
}).passthrough();

const TavilySourceSchema = z.object({
  favicon: z.string().optional(),
}).passthrough();

const TavilyGetResearchResponseSchema = z.object({
  request_id: z.string(),
  status: z.string(),
  content: z.union([z.string(), z.record(z.string(), z.unknown())]).optional(),
  sources: z.array(TavilySourceSchema).optional(),
  error: z.string().optional(),
}).passthrough();

const TavilyToolContentSchema = z.object({
  slug: z.string().optional().default(''),
  website: z.string().optional().default(''),
  name: z.string().optional().default(''),
  category: z.enum(TOOL_SUBMISSION_CATEGORIES).optional().default('Development & Construction'),
  features: z.union([z.string(), z.array(z.string())]).optional().default(''),
  one_liner: z.string().optional().default(''),
  description: z.string().optional().default(''),
  country: z.string().optional().default(''),
  city: z.string().optional().default(''),
  icon_link: z.string().optional().default(''),
});

function buildFailureResult(website: string, userComment: string, error: unknown) {
  const errorMessage =
    error instanceof Error ? error.message.slice(0, 500) : 'Unknown Tavily research error';

  return {
    slug: `tool_${Date.now()}`,
    website,
    name: 'Research Failed',
    category: 'Unknown',
    features: 'Research in progress',
    one_liner: 'Automated research failed - manual review required',
    description: `Failed to automatically research this tool. Reason: ${errorMessage}. User comment: ${userComment}`,
    country: '',
    city: '',
    icon_link: '',
    research_status: 'failed',
  };
}

function buildResearchPrompt(website: string, userComment: string) {
  return [
    'Research the official product website and trustworthy public sources for this commercial real estate software tool.',
    `Website: ${website}`,
    `User comment on relevance: ${userComment}`,
    '',
    'Return structured data for a CRE software directory entry.',
    `Choose exactly one category from this list: ${TOOL_SUBMISSION_CATEGORIES.join(', ')}.`,
    'Focus on what the product actually does today, not vague marketing claims.',
    'Use the official website as the primary source whenever possible.',
    'The one_liner should be a concise directory tagline.',
    'The description should be a useful plain-language overview paragraph for buyers, around 2-4 sentences.',
    'The features field should capture the most concrete product capabilities.',
    'If city or country are not confidently available, leave them blank.',
    'If a direct logo URL is not confidently available, leave icon_link blank.',
  ].join('\n');
}

function buildOutputSchema() {
  return {
    properties: {
      slug: {
        type: 'string',
        description: 'Lowercase URL slug for the tool, using hyphens.',
      },
      website: {
        type: 'string',
        description: 'Official website URL for the tool.',
      },
      name: {
        type: 'string',
        description: 'Official product or company name.',
      },
      category: {
        type: 'string',
        description: 'One supported submission category.',
        enum: [...TOOL_SUBMISSION_CATEGORIES],
      },
      features: {
        type: 'array',
        description: 'Concrete product capabilities as short phrases.',
        items: { type: 'string' },
      },
      one_liner: {
        type: 'string',
        description: 'Short tagline for a software directory card.',
      },
      description: {
        type: 'string',
        description: 'Buyer-friendly summary paragraph explaining the product and value.',
      },
      country: {
        type: 'string',
        description: 'Country where the company is based, if confidently known.',
      },
      city: {
        type: 'string',
        description: 'City where the company is based, if confidently known.',
      },
      icon_link: {
        type: 'string',
        description: 'Direct logo or icon URL, if confidently known.',
      },
    },
    required: ['website', 'name', 'category', 'features', 'one_liner', 'description'],
  };
}

function normalizeStructuredContent(
  content: string | Record<string, unknown> | undefined,
  website: string,
  fallbackIconLink: string
) {
  let parsedContent: unknown = content;

  if (typeof content === 'string') {
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('Tavily completed research but did not return structured JSON content');
    }

    parsedContent = JSON.parse(jsonMatch[0]);
  }

  const structuredContent = TavilyToolContentSchema.parse(parsedContent ?? {});
  const normalizedWebsite = structuredContent.website.trim() || website;
  const fallbackName = structuredContent.name.trim() || new URL(website).hostname.replace(/^www\./, '');
  const normalizedSlug = structuredContent.slug.trim()
    ? generateSEOSlug(structuredContent.slug)
    : generateSEOSlug(fallbackName);
  const normalizedFeatures = Array.isArray(structuredContent.features)
    ? structuredContent.features.map((feature) => feature.trim()).filter(Boolean).join(', ')
    : structuredContent.features.trim();

  return {
    slug: normalizedSlug,
    website: normalizedWebsite,
    name: fallbackName,
    category: structuredContent.category,
    features: normalizedFeatures,
    one_liner: structuredContent.one_liner.trim(),
    description: structuredContent.description.trim(),
    country: structuredContent.country.trim(),
    city: structuredContent.city.trim(),
    icon_link: structuredContent.icon_link.trim() || fallbackIconLink,
  };
}

async function createResearchTask(prompt: string) {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    throw new Error('TAVILY_API_KEY environment variable is not set');
  }

  const response = await fetch('https://api.tavily.com/research', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: prompt,
      model: process.env.TAVILY_MODEL ?? 'mini',
      stream: false,
      output_schema: buildOutputSchema(),
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Tavily create research error: ${response.status} - ${errorData}`);
  }

  return TavilyCreateResearchResponseSchema.parse(await response.json());
}

async function getResearchTask(requestId: string) {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    throw new Error('TAVILY_API_KEY environment variable is not set');
  }

  const response = await fetch(`https://api.tavily.com/research/${requestId}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Tavily get research error: ${response.status} - ${errorData}`);
  }

  return TavilyGetResearchResponseSchema.parse(await response.json());
}

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function waitForCompletedResearch(requestId: string) {
  const timeoutMs = Number.parseInt(process.env.TAVILY_RESEARCH_TIMEOUT_MS ?? '90000', 10);
  const pollIntervalMs = Number.parseInt(process.env.TAVILY_RESEARCH_POLL_INTERVAL_MS ?? '2000', 10);
  const deadline = Date.now() + timeoutMs;
  let lastStatus = 'pending';

  while (Date.now() < deadline) {
    const response = await getResearchTask(requestId);
    lastStatus = response.status;

    if (response.status === 'completed') {
      return response;
    }

    if (response.status === 'failed' || response.error) {
      throw new Error(response.error || `Tavily research failed with status "${response.status}"`);
    }

    await wait(pollIntervalMs);
  }

  throw new Error(`Tavily research timed out after ${timeoutMs}ms (last status: ${lastStatus})`);
}

export async function researchToolWithTavily(website: string, userComment: string) {
  try {
    const task = await createResearchTask(buildResearchPrompt(website, userComment));
    const completedTask = await waitForCompletedResearch(task.request_id);
    const fallbackIconLink = completedTask.sources?.find((source) => Boolean(source.favicon))?.favicon ?? '';
    const toolData = normalizeStructuredContent(completedTask.content, website, fallbackIconLink);

    return {
      ...toolData,
      research_status: 'completed',
    };
  } catch (error) {
    console.error('Tavily research error:', error);
    return buildFailureResult(website, userComment, error);
  }
}
