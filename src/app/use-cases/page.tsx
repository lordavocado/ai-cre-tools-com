import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { getDirectoryItems } from '@/lib/supabase';
import { getIndexableUseCases } from '@/lib/seo-use-cases';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'CRE AI Software by Workflow and Role | AI CRE Tools',
  description:
    'Find commercial real estate AI software for specific workflows and teams. Compare qualified tools by use case, role, integrations, and pricing.',
  alternates: { canonical: `${siteConfig.url}/use-cases` },
  openGraph: {
    title: 'CRE AI Software by Workflow and Role',
    description: 'Qualified CRE software shortlists for specific workflow and team combinations.',
    url: `${siteConfig.url}/use-cases`,
    type: 'website',
  },
};

export default async function UseCasesHubPage() {
  const items = await getDirectoryItems();
  const useCases = getIndexableUseCases(items);
  const groupedUseCases = Array.from(
    useCases.reduce((groups, useCase) => {
      const current = groups.get(useCase.workflow.slug) ?? [];
      current.push(useCase);
      groups.set(useCase.workflow.slug, current);
      return groups;
    }, new Map<string, typeof useCases>())
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'CRE AI Software Use Cases',
            description: metadata.description,
            url: `${siteConfig.url}/use-cases`,
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: useCases.length,
              itemListElement: useCases.map((useCase, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: useCase.title,
                url: `${siteConfig.url}${useCase.path}`,
              })),
            },
          }),
        }}
      />

      <section className="border-b border-[#e0e0e0] bg-white py-14 md:py-20">
        <div className="container px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#629649]">
            Use-case directory
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-[#1f1f1f] md:text-5xl">
            Find CRE software for the job your team needs to do
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#737373]">
            These pages combine a real CRE workflow with a specific team. A page appears only when
            enough eligible tools match and the shortlist is meaningfully different from broader directories.
          </p>
          <p className="mt-4 text-sm font-medium text-[#1f1f1f]">
            {useCases.length} qualified long-tail use cases
          </p>
        </div>
      </section>

      <div className="container space-y-14 px-6 py-14 md:py-20">
        {groupedUseCases.map(([workflowSlug, workflowUseCases]) => (
          <section key={workflowSlug}>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-[#1f1f1f]">
                  {workflowUseCases[0].workflow.label}
                </h2>
                <p className="mt-1 text-sm text-[#737373]">
                  Qualified shortlists by team
                </p>
              </div>
              <Link
                href={`/tags/${workflowSlug}`}
                className="text-sm font-medium text-[#629649] hover:underline"
              >
                All {workflowUseCases[0].workflow.label.toLowerCase()} tools
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {workflowUseCases.map((useCase) => (
                <Link
                  key={useCase.path}
                  href={useCase.path}
                  className="group rounded-[8px] border border-[#e0e0e0] bg-[#fafafa] p-5 transition-colors hover:border-[rgba(98,150,73,0.45)] hover:bg-white"
                >
                  <h3 className="font-semibold text-[#1f1f1f] group-hover:text-[#629649]">
                    {useCase.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#737373]">
                    {useCase.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#629649]">
                    Compare {useCase.tools.length} tools
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
