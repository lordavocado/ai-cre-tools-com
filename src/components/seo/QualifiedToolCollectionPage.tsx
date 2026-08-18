import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { DirectoryGrid } from '@/components/listing/DirectoryGrid';
import { siteConfig } from '@/config/site';
import type { SeoMarketPage } from '@/lib/seo-market-pages';

export function QualifiedToolCollectionPage({
  page,
  hubPath,
  hubLabel,
  eyebrow,
}: {
  page: SeoMarketPage;
  hubPath: string;
  hubLabel: string;
  eyebrow: string;
}) {
  const verifiedCount = page.tools.filter((tool) => tool.editorialStatus === 'verified').length;
  const freeCount = page.tools.filter((tool) => tool.hasFreePlan || tool.hasFreeTrial).length;
  const categories = new Set(page.tools.flatMap((tool) => tool.category.split(',').map((value) => value.trim()))).size;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: page.title,
            description: page.description,
            url: `${siteConfig.url}${page.path}`,
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: page.tools.length,
              itemListElement: page.tools.map((tool, index) => ({
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
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1.5 text-sm text-[#737373]">
            <Link href="/" className="hover:text-[#1f1f1f]">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href={hubPath} className="hover:text-[#1f1f1f]">{hubLabel}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-[#1f1f1f]">{page.label}</span>
          </nav>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#629649]">{eyebrow}</p>
          <h1 className="mt-2 max-w-4xl text-3xl font-bold tracking-tight text-[#1f1f1f] sm:text-4xl md:text-5xl">{page.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#737373]">{page.description}</p>
          <dl className="mt-8 grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-[8px] border border-[#e0e0e0] bg-[#e0e0e0]">
            {[
              ['Matching tools', page.tools.length],
              ['Verified profiles', verifiedCount],
              ['Workflow categories', categories],
            ].map(([label, value]) => (
              <div key={label} className="bg-white px-4 py-4">
                <dt className="text-xs text-[#737373]">{label}</dt>
                <dd className="mt-1 text-xl font-semibold text-[#1f1f1f]">{value}</dd>
              </div>
            ))}
          </dl>
          {freeCount > 0 && <p className="mt-3 text-xs text-[#737373]">{freeCount} listed tools report a free plan or free trial.</p>}
        </div>
      </section>

      <section className="bg-[#fafafa] py-14 md:py-20">
        <div className="container px-6">
          <h2 className="text-2xl font-semibold text-[#1f1f1f]">Compare the qualified shortlist</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#737373]">
            Inclusion requires explicit structured data or a specific documented mention on the product profile. Empty and undersized cohorts are not published.
          </p>
          <div className="mt-7"><DirectoryGrid items={page.tools} currentPage={1} basePath={page.path} /></div>
        </div>
      </section>
    </>
  );
}
