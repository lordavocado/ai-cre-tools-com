/**
 * Curated comparison page templates — tools resolved at build time from category + rank.
 */

import type { SeoFaq } from '@/config/seo-clusters';
import type { DirectoryItem } from '@/types';
import { filterItemsByCategorySlug } from '@/lib/seo-pages';

export interface SeoComparisonTemplate {
  slug: string;
  categorySlug: string;
  toolIndexA: number;
  toolIndexB: number;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  verdict: string;
  whenChooseA: string;
  whenChooseB: string;
  faqs: SeoFaq[];
  relatedCategorySlug: string;
}

export interface ResolvedComparison {
  slug: string;
  toolA: DirectoryItem;
  toolB: DirectoryItem;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  verdict: string;
  whenChooseA: string;
  whenChooseB: string;
  faqs: SeoFaq[];
  relatedCategorySlug: string;
}

const COMPARISON_TEMPLATES: SeoComparisonTemplate[] = [
  {
    slug: 'diligence-tools-leaders',
    categorySlug: 'legal-compliance-due-diligence',
    toolIndexA: 0,
    toolIndexB: 1,
    h1: 'CRE Due Diligence Tools Compared',
    metaTitle: 'CRE Due Diligence Software Comparison | AI CRE Tools',
    metaDescription:
      'Compare leading commercial real estate due diligence tools side by side. Features, workflows, and fit for investors.',
    verdict:
      'Both tools target document-heavy CRE diligence workflows. Your choice depends on which integrates with your data room, asset class coverage, and how much lease abstraction you need in the same stack.',
    whenChooseA: 'Choose the first tool when its extraction accuracy on your sample lease set is stronger and your team already uses compatible systems.',
    whenChooseB: 'Choose the second tool when its workflow, pricing, or asset-class templates better match your transaction volume and team size.',
    faqs: [
      { question: 'What should I compare in CRE due diligence software?', answer: 'Document types supported, human review workflow, integration with your VDR, and pricing model per seat vs per deal.' },
      { question: 'Can I use both tools?', answer: 'Some teams use one for extraction and another for checklist management—avoid duplicate data entry without integration.' },
    ],
    relatedCategorySlug: 'legal-compliance-due-diligence',
  },
  {
    slug: 'underwriting-tools-leaders',
    categorySlug: 'property-analysis-valuation',
    toolIndexA: 0,
    toolIndexB: 1,
    h1: 'CRE Underwriting & Valuation Tools Compared',
    metaTitle: 'CRE Underwriting Software Comparison | AI CRE Tools',
    metaDescription:
      'Compare commercial real estate underwriting and valuation tools. See which platform fits your investment workflow.',
    verdict:
      'Underwriting platforms differ most in asset-class depth, model export formats, and how well they ingest offering memoranda and rent rolls. Run both on a closed deal before standardizing.',
    whenChooseA: 'Prefer the first option if your IC templates and asset classes align with its default outputs.',
    whenChooseB: 'Prefer the second option if it offers stronger integrations or better support for your deal sizes.',
    faqs: [
      { question: 'Is AI underwriting accurate enough for IC memos?', answer: 'Use AI for data prep and drafts; analysts should own assumptions and final numbers presented to committee.' },
    ],
    relatedCategorySlug: 'property-analysis-valuation',
  },
  {
    slug: 'deal-sourcing-tools-leaders',
    categorySlug: 'property-search-acquisition',
    toolIndexA: 0,
    toolIndexB: 1,
    h1: 'CRE Deal Sourcing Tools Compared',
    metaTitle: 'CRE Deal Sourcing Software Comparison | AI CRE Tools',
    metaDescription:
      'Compare commercial real estate deal sourcing platforms for acquisitions and site selection.',
    verdict:
      'Deal sourcing tools are differentiated by geographic data coverage, off-market signal quality, and CRM integration. Match the product to the markets and asset classes you actually pursue.',
    whenChooseA: 'Choose the first platform when its data freshness and alerts outperform in your target metros.',
    whenChooseB: 'Choose the second when its UI, pricing, or export workflow fits your acquisition team better.',
    faqs: [
      { question: 'Do sourcing tools replace brokers?', answer: 'No—they augment research and pipeline building; relationship-driven off-market deal flow still matters.' },
    ],
    relatedCategorySlug: 'property-search-acquisition',
  },
  {
    slug: 'portfolio-tools-leaders',
    categorySlug: 'asset-portfolio-management',
    toolIndexA: 0,
    toolIndexB: 1,
    h1: 'CRE Portfolio Management Tools Compared',
    metaTitle: 'CRE Portfolio Software Comparison | AI CRE Tools',
    metaDescription:
      'Compare commercial real estate portfolio management and asset analytics platforms.',
    verdict:
      'Portfolio platforms win or lose on data ingestion from PM and accounting, reporting flexibility for LPs, and scenario modeling—not feature checklists alone.',
    whenChooseA: 'Favor the first tool if your existing stack integrates cleanly and reporting matches investor expectations.',
    whenChooseB: 'Favor the second if it offers better analytics or a faster path for your portfolio size.',
    faqs: [
      { question: 'When do owners need portfolio software?', answer: 'Typically when holding 10+ assets or when investor reporting requires audit-ready rollups.' },
    ],
    relatedCategorySlug: 'asset-portfolio-management',
  },
  {
    slug: 'property-management-tools-leaders',
    categorySlug: 'property-management-operations',
    toolIndexA: 0,
    toolIndexB: 1,
    h1: 'CRE Property Management AI Tools Compared',
    metaTitle: 'CRE Property Management Software Comparison | AI CRE Tools',
    metaDescription:
      'Compare AI property management tools for commercial real estate operations and tenant service.',
    verdict:
      'Property management AI tools should reduce ticket volume and improve response times without adding another system field teams ignore. Pilot one building before portfolio rollout.',
    whenChooseA: 'Choose the first when tenant portal adoption and engineering mobile workflows are strongest.',
    whenChooseB: 'Choose the second when accounting integration or asset-class features fit your portfolio better.',
    faqs: [
      { question: 'What is the fastest ROI in PM AI?', answer: 'Tenant service automation and work-order triage before advanced portfolio analytics.' },
    ],
    relatedCategorySlug: 'property-management-operations',
  },
  {
    slug: 'brokerage-tools-leaders',
    categorySlug: 'transactions-brokerage',
    toolIndexA: 0,
    toolIndexB: 1,
    h1: 'CRE Brokerage & Transaction Tools Compared',
    metaTitle: 'CRE Brokerage CRM Comparison | AI CRE Tools',
    metaDescription:
      'Compare commercial real estate brokerage CRM and transaction management platforms.',
    verdict:
      'Brokerage software lives or dies on rep adoption. Compare mobile experience, marketing integrations, and how naturally the CRM maps to listings and commissions.',
    whenChooseA: 'Pick the first if your team will actually log activity and tours in it daily.',
    whenChooseB: 'Pick the second if comp data, marketing, or deal-type support better matches your shop.',
    faqs: [
      { question: 'How is CRE CRM different from generic CRM?', answer: 'It models properties, spaces, commissions, and co-broker splits—not just contacts.' },
    ],
    relatedCategorySlug: 'transactions-brokerage',
  },
  {
    slug: 'leasing-tools-leaders',
    categorySlug: 'marketing-leasing-enablement',
    toolIndexA: 0,
    toolIndexB: 1,
    h1: 'Commercial Leasing Software Compared',
    metaTitle: 'CRE Leasing Software Comparison | AI CRE Tools',
    metaDescription:
      'Compare commercial leasing and marketing enablement tools for landlords and brokers.',
    verdict:
      'Leasing tools differ in marketing syndication, tour tech, and proposal workflows. Industrial and office products are not interchangeable—validate against your vacancy types.',
    whenChooseA: 'Choose the first when marketing output quality and lead routing meet your listing velocity.',
    whenChooseB: 'Choose the second when proposal generation or PM handoff is stronger for your team.',
    faqs: [
      { question: 'Should leasing software connect to PM?', answer: 'Yes—executed leases should flow into property management without re-keying.' },
    ],
    relatedCategorySlug: 'marketing-leasing-enablement',
  },
  {
    slug: 'development-tools-leaders',
    categorySlug: 'development-construction',
    toolIndexA: 0,
    toolIndexB: 1,
    h1: 'CRE Development & Construction Tools Compared',
    metaTitle: 'CRE Development Software Comparison | AI CRE Tools',
    metaDescription:
      'Compare real estate development and construction management AI tools.',
    verdict:
      'Development platforms are judged on schedule and budget visibility, draw reporting, and contractor collaboration—not generic project management features.',
    whenChooseA: 'Favor the first on active projects if field adoption and cost-code reporting are solid.',
    whenChooseB: 'Favor the second if lender reporting or pre-development feasibility is the bigger gap.',
    faqs: [
      { question: 'Do developers need separate feasibility and field tools?', answer: 'Many use one platform across phases; others split—match to project complexity.' },
    ],
    relatedCategorySlug: 'development-construction',
  },
  {
    slug: 'data-infrastructure-tools-leaders',
    categorySlug: 'data-workflow-infrastructure',
    toolIndexA: 0,
    toolIndexB: 1,
    h1: 'CRE Data Integration Tools Compared',
    metaTitle: 'CRE Data Integration Comparison | AI CRE Tools',
    metaDescription:
      'Compare commercial real estate data integration and workflow automation platforms.',
    verdict:
      'Integration tools should be evaluated on source system coverage, error monitoring, and whether business users can maintain flows without developers.',
    whenChooseA: 'Choose the first when it connects your PM and accounting stack with minimal custom code.',
    whenChooseB: 'Choose the second when security posture or specific connector library fits IT requirements better.',
    faqs: [
      { question: 'Why fix data before buying more AI?', answer: 'Most CRE AI fails on bad inputs—integration improves every downstream tool.' },
    ],
    relatedCategorySlug: 'data-workflow-infrastructure',
  },
  {
    slug: 'copilot-tools-leaders',
    categorySlug: 'productivity-copilots',
    toolIndexA: 0,
    toolIndexB: 1,
    h1: 'CRE AI Copilot Tools Compared',
    metaTitle: 'CRE AI Copilot Comparison | AI CRE Tools',
    metaDescription:
      'Compare AI copilots for commercial real estate research, documents, and daily workflows.',
    verdict:
      'Copilots differ in data connectors, security certifications, and how well they handle CRE-specific prompts. Never upload confidential deal files without reviewing retention policies.',
    whenChooseA: 'Choose the first when enterprise security and connectors match your IT policy.',
    whenChooseB: 'Choose the second when out-of-the-box CRE templates and ease of use win for a lean team.',
    faqs: [
      { question: 'Can copilots replace vertical CRE software?', answer: 'They complement specialized tools—they do not replace diligence or PM systems for regulated workflows.' },
    ],
    relatedCategorySlug: 'productivity-copilots',
  },
  {
    slug: 'analysis-valuation-alt-pair',
    categorySlug: 'property-analysis-valuation',
    toolIndexA: 0,
    toolIndexB: 2,
    h1: 'CRE Valuation Platforms: Top Picks Compared',
    metaTitle: 'CRE Valuation Tools Compared | AI CRE Tools',
    metaDescription:
      'Side-by-side comparison of commercial real estate valuation and analysis platforms.',
    verdict:
      'When comparing tools ranked differently by display priority, focus on comp methodology, rent-roll ingestion, and export compatibility with your lender or IC formats.',
    whenChooseA: 'Select the higher-priority directory pick when it wins on your asset-class sample deals.',
    whenChooseB: 'Select the alternative when its modeling flexibility or support model is stronger for your team.',
    faqs: [
      { question: 'How were these tools selected?', answer: 'From our curated directory sorted by display order within property analysis and valuation.' },
    ],
    relatedCategorySlug: 'property-analysis-valuation',
  },
  {
    slug: 'diligence-alt-pair',
    categorySlug: 'legal-compliance-due-diligence',
    toolIndexA: 1,
    toolIndexB: 2,
    h1: 'Lease Abstraction & Diligence Tools Compared',
    metaTitle: 'Lease Abstraction Software Comparison | AI CRE Tools',
    metaDescription:
      'Compare lease abstraction and due diligence AI tools for commercial real estate transactions.',
    verdict:
      'Lease-heavy diligence requires accuracy on economic terms and a review UI attorneys and analysts will actually use. Validate on a real abstract set before rollout.',
    whenChooseA: 'Choose the first when extraction quality on your lease PDFs is higher with acceptable review time.',
    whenChooseB: 'Choose the second when pricing, turnaround, or integration with your VDR is better.',
    faqs: [
      { question: 'Is lease abstraction the same as legal review?', answer: 'No—abstraction structures data; counsel interprets material legal risk.' },
    ],
    relatedCategorySlug: 'legal-compliance-due-diligence',
  },
  {
    slug: 'transactions-alt-pair',
    categorySlug: 'transactions-brokerage',
    toolIndexA: 0,
    toolIndexB: 2,
    h1: 'CRE Transaction Platforms Compared',
    metaTitle: 'CRE Transaction Software Comparison | AI CRE Tools',
    metaDescription:
      'Compare commercial real estate transaction management and brokerage workflow tools.',
    verdict:
      'Transaction tools should shorten time from pitch to close with clear pipelines and document control. Broker adoption is the deciding factor for CRM-style products.',
    whenChooseA: 'Prefer the first when pipeline visibility and mobile touring work for your reps.',
    whenChooseB: 'Prefer the second when marketing automation or commission tracking is the bottleneck.',
    faqs: [
      { question: 'What is transaction management in CRE?', answer: 'Coordinating parties, documents, and deadlines from listing or mandate through closing.' },
    ],
    relatedCategorySlug: 'transactions-brokerage',
  },
  {
    slug: 'pm-operations-alt-pair',
    categorySlug: 'property-management-operations',
    toolIndexA: 1,
    toolIndexB: 2,
    h1: 'Commercial PM Operations Tools Compared',
    metaTitle: 'CRE Operations Software Comparison | AI CRE Tools',
    metaDescription:
      'Compare property management operations and tenant service automation tools.',
    verdict:
      'Operations tools must win on-site—engineers and assistant managers need simple mobile workflows, not dashboards only regional staff see.',
    whenChooseA: 'Choose the first when maintenance and tenant portals show measurable response-time gains.',
    whenChooseB: 'Choose the second when lease admin depth or owner reporting is the priority.',
    faqs: [
      { question: 'How long should a PM software pilot run?', answer: 'At least one full quarter at a representative building before portfolio-wide contracts.' },
    ],
    relatedCategorySlug: 'property-management-operations',
  },
  {
    slug: 'acquisition-research-pair',
    categorySlug: 'property-search-acquisition',
    toolIndexA: 0,
    toolIndexB: 2,
    h1: 'CRE Acquisition Research Tools Compared',
    metaTitle: 'CRE Acquisition Tools Comparison | AI CRE Tools',
    metaDescription:
      'Compare commercial real estate acquisition research and site selection platforms.',
    verdict:
      'Acquisition research tools should compress time from market thesis to actionable target list with data you cannot easily replicate in spreadsheets.',
    whenChooseA: 'Favor the first when market coverage and alert quality win in your geographies.',
    whenChooseB: 'Favor the second when workflow into your CRM or underwriting stack is smoother.',
    faqs: [
      { question: 'Who uses acquisition research software?', answer: 'Investors, developers scouting land, and occupiers running site selection.' },
    ],
    relatedCategorySlug: 'property-search-acquisition',
  },
];

function interpolateComparisonText(text: string, toolA: DirectoryItem, toolB: DirectoryItem): string {
  return text
    .replace(/\{toolA\}/g, toolA.name)
    .replace(/\{toolB\}/g, toolB.name);
}

export function resolveComparison(
  template: SeoComparisonTemplate,
  items: DirectoryItem[]
): ResolvedComparison | null {
  const inCategory = filterItemsByCategorySlug(items, template.categorySlug);
  const toolA = inCategory[template.toolIndexA];
  const toolB = inCategory[template.toolIndexB];
  if (!toolA || !toolB || toolA.slug === toolB.slug) return null;

  return {
    slug: template.slug,
    toolA,
    toolB,
    h1: interpolateComparisonText(template.h1, toolA, toolB),
    metaTitle: interpolateComparisonText(template.metaTitle, toolA, toolB),
    metaDescription: interpolateComparisonText(template.metaDescription, toolA, toolB),
    verdict: interpolateComparisonText(template.verdict, toolA, toolB),
    whenChooseA: interpolateComparisonText(template.whenChooseA, toolA, toolB),
    whenChooseB: interpolateComparisonText(template.whenChooseB, toolB, toolA),
    faqs: template.faqs.map((faq) => ({
      question: interpolateComparisonText(faq.question, toolA, toolB),
      answer: interpolateComparisonText(faq.answer, toolA, toolB),
    })),
    relatedCategorySlug: template.relatedCategorySlug,
  };
}

export function getResolvedComparisons(items: DirectoryItem[]): ResolvedComparison[] {
  return COMPARISON_TEMPLATES.map((t) => resolveComparison(t, items)).filter(
    (c): c is ResolvedComparison => c !== null
  );
}

export function getComparisonBySlug(
  slug: string,
  items: DirectoryItem[]
): ResolvedComparison | null {
  const template = COMPARISON_TEMPLATES.find((t) => t.slug === slug);
  if (!template) return null;
  return resolveComparison(template, items);
}

export function getAllComparisonTemplateSlugs(): string[] {
  return COMPARISON_TEMPLATES.map((t) => t.slug);
}

export async function getResolvableComparisonSlugs(): Promise<string[]> {
  const { getDirectoryItems } = await import('@/lib/supabase');
  try {
    const items = await getDirectoryItems();
    return getResolvedComparisons(items).map((c) => c.slug);
  } catch {
    return [];
  }
}
