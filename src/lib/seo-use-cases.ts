import { getAllSeoPersonas, getSeoPersona, type SeoPersona } from '@/config/seo-personas';
import { getAllSeoTags, getSeoTag, type SeoTag } from '@/config/seo-tags';
import type { DirectoryItem } from '@/types';
import { filterItemsByPersona, isPseoEligible } from '@/lib/seo-pages';

export const MIN_TOOLS_FOR_INDEXABLE_USE_CASE = 3;
export const MAX_TOOLS_FOR_FOCUSED_USE_CASE = 40;
const MAX_PARENT_COHORT_OVERLAP = 0.9;

const LEGACY_USE_CASE_MATCHERS: Record<string, string[]> = {
  'lease-abstraction': ['lease abstraction', 'lease abstract'],
  underwriting: ['underwriting', 'underwrite', 'financial modeling'],
  'due-diligence': ['due diligence', 'diligence platform'],
  'deal-sourcing': ['deal sourcing', 'off-market', 'site selection'],
  'portfolio-analytics': ['portfolio analytics', 'portfolio management', 'asset management platform'],
  'lease-administration': ['lease administration', 'lease management', 'critical dates'],
  'transaction-management': ['transaction management', 'brokerage crm', 'deal pipeline', 'commission management'],
  'property-valuation': ['property valuation', 'automated valuation', 'appraisal', 'comparable sales'],
  'construction-management': ['construction management', 'construction platform', 'rfi management'],
  'real-estate-copilot': ['real estate copilot', 'cre copilot', 'ai assistant'],
  'property-management': ['property management', 'work order', 'tenant experience', 'facilities management'],
  'market-analysis': ['market analysis', 'market intelligence', 'submarket analysis'],
  'document-automation': ['document automation', 'document extraction', 'document processing'],
  'leasing-automation': ['leasing automation', 'leasing platform', 'lease marketing', 'tour scheduling'],
  'data-integration': ['data integration', 'etl', 'data pipeline', 'api integration'],
};

export interface SeoUseCase {
  workflow: SeoTag;
  persona: SeoPersona;
  tools: DirectoryItem[];
  path: string;
  title: string;
  description: string;
}

export function getUseCasePath(workflowSlug: string, personaSlug: string): string {
  return `/use-cases/${workflowSlug}/for/${personaSlug}`;
}

export function filterItemsByUseCase(
  items: DirectoryItem[],
  workflow: SeoTag,
  persona: SeoPersona
): DirectoryItem[] {
  return filterItemsByPersona(items, persona.slug, persona.categorySlugs)
    .filter((item) => itemMatchesUseCaseWorkflow(item, workflow));
}

function itemMatchesUseCaseWorkflow(item: DirectoryItem, workflow: SeoTag): boolean {
  if (!isPseoEligible(item)) return false;
  if (item.workflows.length > 0) {
    return item.workflows.includes(workflow.slug as DirectoryItem['workflows'][number]);
  }

  const searchableText = [
    item.name,
    item.tagline,
    item.description,
    ...(item.tags ?? []),
    ...(item.features?.map((feature) => feature.name) ?? []),
  ].join(' ').toLowerCase();
  const matchers = LEGACY_USE_CASE_MATCHERS[workflow.slug] ?? [workflow.label.toLowerCase()];
  return matchers.some((matcher) => searchableText.includes(matcher));
}

function filterItemsByUseCaseWorkflow(items: DirectoryItem[], workflow: SeoTag): DirectoryItem[] {
  return items.filter((item) => itemMatchesUseCaseWorkflow(item, workflow));
}

function isTaxonomicallyRelevant(
  workflow: SeoTag,
  persona: SeoPersona,
  tools: DirectoryItem[]
): boolean {
  const curatedCategoryOverlap = workflow.relatedCategorySlugs
    .some((categorySlug) => persona.categorySlugs.includes(categorySlug));
  const explicitToolMatch = tools.some((tool) => (
    tool.workflows.includes(workflow.slug as DirectoryItem['workflows'][number])
    && tool.personas.includes(persona.slug as DirectoryItem['personas'][number])
  ));
  return curatedCategoryOverlap || explicitToolMatch;
}

function isDistinctFromParentCohorts(
  useCaseTools: DirectoryItem[],
  workflowTools: DirectoryItem[],
  personaTools: DirectoryItem[]
): boolean {
  if (workflowTools.length === 0 || personaTools.length === 0) return false;
  return useCaseTools.length / workflowTools.length <= MAX_PARENT_COHORT_OVERLAP
    && useCaseTools.length / personaTools.length <= MAX_PARENT_COHORT_OVERLAP;
}

function buildUseCaseTitle(workflow: SeoTag, persona: SeoPersona): string {
  return `${workflow.label} Software for ${persona.name}`;
}

function buildUseCaseDescription(
  workflow: SeoTag,
  persona: SeoPersona,
  toolCount: number
): string {
  return `Compare ${toolCount} ${workflow.label.toLowerCase()} tools for ${persona.name.toLowerCase()}. Review workflow fit, pricing, integrations, and verified product data.`;
}

export function getIndexableUseCases(items: DirectoryItem[]): SeoUseCase[] {
  const useCases: SeoUseCase[] = [];
  const seenToolSets = new Set<string>();

  for (const workflow of getAllSeoTags()) {
    const workflowTools = filterItemsByUseCaseWorkflow(items, workflow);
    for (const persona of getAllSeoPersonas()) {
      const personaTools = filterItemsByPersona(items, persona.slug, persona.categorySlugs);
      const tools = filterItemsByUseCase(items, workflow, persona);

      if (tools.length < MIN_TOOLS_FOR_INDEXABLE_USE_CASE) continue;
      if (tools.length > MAX_TOOLS_FOR_FOCUSED_USE_CASE) continue;
      if (!isTaxonomicallyRelevant(workflow, persona, tools)) continue;
      if (!isDistinctFromParentCohorts(tools, workflowTools, personaTools)) continue;

      const toolSetKey = tools.map((tool) => tool.slug).sort().join('|');
      if (seenToolSets.has(toolSetKey)) continue;
      seenToolSets.add(toolSetKey);

      useCases.push({
        workflow,
        persona,
        tools,
        path: getUseCasePath(workflow.slug, persona.slug),
        title: buildUseCaseTitle(workflow, persona),
        description: buildUseCaseDescription(workflow, persona, tools.length),
      });
    }
  }

  return useCases.sort((a, b) => b.tools.length - a.tools.length || a.title.localeCompare(b.title));
}

export function getIndexableUseCase(
  items: DirectoryItem[],
  workflowSlug: string,
  personaSlug: string
): SeoUseCase | undefined {
  const workflow = getSeoTag(workflowSlug);
  const persona = getSeoPersona(personaSlug);
  if (!workflow || !persona) return undefined;
  return getIndexableUseCases(items).find((useCase) => (
    useCase.workflow.slug === workflowSlug && useCase.persona.slug === personaSlug
  ));
}

export function getRelatedUseCases(
  useCase: SeoUseCase,
  allUseCases: SeoUseCase[],
  limit = 6
): SeoUseCase[] {
  return allUseCases
    .filter((candidate) => candidate.path !== useCase.path)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.workflow.slug === useCase.workflow.slug ? 2 : 0)
        + (candidate.persona.slug === useCase.persona.slug ? 2 : 0)
        + candidate.tools.filter((tool) => useCase.tools.some((current) => current.slug === tool.slug)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.candidate.tools.length - a.candidate.tools.length)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
