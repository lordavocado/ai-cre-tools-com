import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { DirectoryGrid } from '@/components/listing/DirectoryGrid';
import { TOOL_PRICING_MODELS, getTaxonomyLabel } from '@/config/tool-taxonomy';
import { siteConfig } from '@/config/site';
import {
  buildOpenGraphMetadata,
  buildPaginatedCanonicalUrl,
  buildPaginatedMetadata,
} from '@/lib/seo-pages';
import { getDirectoryItems } from '@/lib/supabase';
import {
  getIndexableUseCase,
  getIndexableUseCases,
  getRelatedUseCases,
} from '@/lib/seo-use-cases';
import { parseDirectoryPage } from '@/lib/directory-pagination';

export const revalidate = 3600;

type UseCaseParams = Promise<{ workflow: string; persona: string }>;

function topValues(values: string[], limit = 4): string[] {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([value]) => value);
}

export async function generateStaticParams() {
  const items = await getDirectoryItems();
  return getIndexableUseCases(items).map((useCase) => ({
    workflow: useCase.workflow.slug,
    persona: useCase.persona.slug,
  }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: UseCaseParams;
  searchParams: Promise<{ page?: string | string[] }>;
}): Promise<Metadata> {
  const [{ workflow, persona }, query, items] = await Promise.all([
    params,
    searchParams,
    getDirectoryItems(),
  ]);
  const useCase = getIndexableUseCase(items, workflow, persona);
  if (!useCase) return { title: 'Use Case Not Found' };

  const shortPersona = useCase.persona.shortLabel.replace(/^For /, '');
  const title = `${useCase.workflow.label} for ${shortPersona} (${useCase.tools.length} Tools) | AI CRE Tools`;
  const pagination = buildPaginatedMetadata({
    basePath: useCase.path,
    page: query.page,
    title,
    description: useCase.description,
  });
  const canonicalUrl = buildPaginatedCanonicalUrl(useCase.path, query.page);

  return {
    title,
    description: useCase.description,
    ...pagination,
    openGraph: buildOpenGraphMetadata({
      title,
      description: useCase.description,
      url: canonicalUrl,
    }),
    twitter: { card: 'summary_large_image', title, description: useCase.description },
  };
}

export default async function UseCasePage({
  params,
  searchParams,
}: {
  params: UseCaseParams;
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const [{ workflow, persona }, query, items] = await Promise.all([
    params,
    searchParams,
    getDirectoryItems(),
  ]);
  const useCase = getIndexableUseCase(items, workflow, persona);
  if (!useCase) notFound();

  const allUseCases = getIndexableUseCases(items);
  const relatedUseCases = getRelatedUseCases(useCase, allUseCases);
  const currentPage = parseDirectoryPage(query.page);
  const verifiedCount = useCase.tools.filter((tool) => tool.editorialStatus === 'verified').length;
  const freeTrialCount = useCase.tools.filter((tool) => tool.hasFreeTrial === true).length;
  const integrations = topValues(useCase.tools.flatMap((tool) => tool.integrations));
  const deployment = topValues(useCase.tools.flatMap((tool) => tool.deploymentOptions));
  const security = topValues(useCase.tools.flatMap((tool) => tool.securityCertifications));
  const pricingModels = topValues(
    useCase.tools.map((tool) => tool.pricingModel).filter((model) => model !== 'unknown')
  ).map((model) => getTaxonomyLabel(TOOL_PRICING_MODELS, model));
  const leaders = useCase.tools.slice(0, 3).map((tool) => tool.name);
  const evaluationSignals = [
    { label: 'Common integrations', values: integrations },
    { label: 'Deployment options', values: deployment },
    { label: 'Security evidence', values: security },
    { label: 'Pricing models', values: pricingModels },
  ].filter((signal) => signal.values.length > 0);
  const pageUrl = buildPaginatedCanonicalUrl(useCase.path, query.page);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: useCase.title,
            description: useCase.description,
            url: pageUrl,
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
                { '@type': 'ListItem', position: 2, name: 'Use cases', item: `${siteConfig.url}/use-cases` },
                { '@type': 'ListItem', position: 3, name: useCase.workflow.label, item: `${siteConfig.url}/tags/${workflow}` },
                { '@type': 'ListItem', position: 4, name: useCase.title, item: pageUrl },
              ],
            },
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: useCase.tools.length,
              itemListElement: useCase.tools.map((tool, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: tool.name,
                url: `${siteConfig.url}/tools/${tool.slug}`,
              })),
            },
          }),
        }}
      />

      <section className="border-b border-[#e0e0e0] bg-white py-12 md:py-16">
        <div className="container px-6">
          <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-[#737373]">
            <Link href="/" className="hover:text-[#1f1f1f]">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/use-cases" className="hover:text-[#1f1f1f]">Use cases</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-[#1f1f1f]">{useCase.workflow.label} for {useCase.persona.name}</span>
          </nav>

          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#629649]">
              {useCase.workflow.label} · {useCase.persona.shortLabel}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#1f1f1f] sm:text-4xl md:text-5xl">
              {useCase.title}
            </h1>
            <p className="mt-5 text-base leading-7 text-[#737373]">{useCase.description}</p>
          </div>

          <dl className="mt-8 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-[8px] border border-[#e0e0e0] bg-[#e0e0e0] sm:grid-cols-4">
            {[
              ['Matching tools', useCase.tools.length],
              ['Verified profiles', verifiedCount],
              ['Free trials', freeTrialCount],
              ['Typical workflows', useCase.persona.workflows.length],
            ].map(([label, value]) => (
              <div key={label} className="bg-white px-4 py-4">
                <dt className="text-xs text-[#737373]">{label}</dt>
                <dd className="mt-1 text-xl font-semibold text-[#1f1f1f]">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-b border-[#e0e0e0] bg-[#fafafa] py-14 md:py-20">
        <div className="container px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-[#1f1f1f]">
            Compare {useCase.workflow.label.toLowerCase()} tools for {useCase.persona.name.toLowerCase()}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#737373]">
            This shortlist contains only tools matching both the workflow and role—not every product in either broader directory.
          </p>
          <div className="mt-7">
            <DirectoryGrid items={useCase.tools} currentPage={currentPage} basePath={useCase.path} />
          </div>
        </div>
      </section>

      <section className="border-b border-[#e0e0e0] bg-white py-14 md:py-20">
        <div className="container grid gap-10 px-6 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#999999]">Workflow fit</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#1f1f1f]">
              How {useCase.persona.name.toLowerCase()} use {useCase.workflow.label.toLowerCase()}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#737373]">{useCase.workflow.intro}</p>
            <ul className="mt-5 space-y-2">
              {useCase.persona.workflows.map((personaWorkflow) => (
                <li key={personaWorkflow} className="flex items-start gap-2 text-sm leading-6 text-[#1f1f1f]">
                  <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-[#629649]" />
                  {personaWorkflow}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#999999]">Selection data</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#1f1f1f]">What to compare in a shortlist</h2>
            {evaluationSignals.length > 0 ? (
              <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                {evaluationSignals.map((signal) => (
                  <div key={signal.label} className="rounded-[8px] border border-[#e0e0e0] bg-[#fafafa] p-4">
                    <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-[#999999]">{signal.label}</dt>
                    <dd className="mt-2 text-sm leading-6 text-[#1f1f1f]">{signal.values.join(', ')}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <div className="mt-5 rounded-[8px] border border-[#e0e0e0] bg-[#fafafa] p-5">
                <p className="text-sm leading-7 text-[#1f1f1f]">
                  Validate support for your core systems, asset classes, security requirements, and pricing unit in a live demo. Run the leading options against the same representative workflow before selecting one.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-[#e0e0e0] py-14 md:py-20">
        <div className="container px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-semibold text-[#1f1f1f]">Questions about this use case</h2>
            <div className="mt-8 divide-y divide-[#e0e0e0]">
              {[
                {
                  question: `Which ${useCase.workflow.label.toLowerCase()} tools should ${useCase.persona.name.toLowerCase()} compare first?`,
                  answer: `${leaders.join(', ')}${leaders.length < useCase.tools.length ? ` and ${useCase.tools.length - leaders.length} other qualified tools` : ''} currently match both this workflow and role. Use the same sample project or dataset in every demo.`,
                },
                {
                  question: `Why is this shortlist narrower than the general ${useCase.workflow.label.toLowerCase()} directory?`,
                  answer: `It includes only products that also fit ${useCase.persona.name.toLowerCase()}. The broader capability directory includes tools intended for other CRE teams and operating models.`,
                },
                {
                  question: `What should ${useCase.persona.name.toLowerCase()} verify before buying?`,
                  answer: useCase.workflow.faqs[2]?.answer ?? 'Confirm workflow depth, integrations, security, implementation effort, and the pricing unit against a representative project.',
                },
              ].map((faq) => (
                <div key={faq.question} className="py-6 first:pt-0">
                  <h3 className="font-semibold text-[#1f1f1f]">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#737373]">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {relatedUseCases.length > 0 && (
        <section className="py-14 md:py-20">
          <div className="container px-6">
            <h2 className="text-2xl font-semibold text-[#1f1f1f]">Related use cases</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedUseCases.map((related) => (
                <Link
                  key={related.path}
                  href={related.path}
                  className="group rounded-[8px] border border-[#e0e0e0] bg-white p-5 hover:border-[rgba(98,150,73,0.45)]"
                >
                  <h3 className="font-semibold text-[#1f1f1f] group-hover:text-[#629649]">{related.title}</h3>
                  <p className="mt-2 text-sm text-[#737373]">{related.tools.length} matching tools</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
