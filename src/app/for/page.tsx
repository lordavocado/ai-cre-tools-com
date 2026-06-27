import type { Metadata } from 'next';
import Link from 'next/link';
import { getDirectoryItems } from '@/lib/supabase';
import { siteConfig } from '@/config/site';
import { getAllSeoPersonas } from '@/config/seo-personas';
import { filterItemsByCategories } from '@/lib/seo-pages';
import type { DirectoryItem } from '@/types';
import { ArrowRight } from 'lucide-react';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'CRE AI Tools by Role (2026) | AI CRE Tools',
  description:
    'Find commercial real estate AI software for your role. Curated directories for investors, developers, brokers, asset managers, property managers, and operators.',
  keywords: [
    'ai tools for real estate investors',
    'ai tools for real estate developers',
    'ai tools for commercial real estate brokers',
    'property management ai software',
    'commercial real estate portfolio management software',
    'cre ai software by role',
  ],
  alternates: { canonical: `${siteConfig.url}/for` },
  openGraph: {
    title: 'CRE AI Tools by Role | AI CRE Tools',
    description:
      'Role-based directories for commercial real estate AI software — investors, developers, brokers, and operators.',
    url: `${siteConfig.url}/for`,
    type: 'website',
  },
};

export default async function ForHubPage() {
  const personas = getAllSeoPersonas();
  let items: DirectoryItem[] = [];
  try {
    items = await getDirectoryItems();
  } catch {
    items = [];
  }

  const personasWithCounts = personas.map((persona) => ({
    ...persona,
    toolCount: filterItemsByCategories(items, persona.categorySlugs).length,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'CRE AI Tools by Role',
            description:
              'Role-based directories for commercial real estate AI software.',
            url: `${siteConfig.url}/for`,
            isPartOf: {
              '@type': 'WebSite',
              name: siteConfig.name,
              url: siteConfig.url,
            },
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: personasWithCounts.length,
              itemListElement: personasWithCounts.map((persona, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: persona.name,
                url: `${siteConfig.url}/for/${persona.slug}`,
              })),
            },
          }),
        }}
      />

      <div className="container px-6 py-16 md:py-20">
        <div className="mb-12 max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#999999]">
            By role
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#1f1f1f] md:text-4xl">
            Commercial real estate AI tools for your team
          </h1>
          <p className="mt-3 text-base leading-7 text-[#737373]">
            US commercial real estate professionals evaluate software by workflow and role.
            Each hub below maps AI tools to how investors, developers, brokers, asset managers,
            property managers, and operators actually work.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {personasWithCounts.map((persona) => (
            <Link
              key={persona.slug}
              href={`/for/${persona.slug}`}
              className="group flex flex-col gap-3 rounded-[8px] border border-[#e0e0e0] bg-[#fafafa] p-5 transition-colors hover:border-[rgba(98,150,73,0.4)] hover:bg-white"
            >
              <h2 className="text-lg font-semibold text-[#1f1f1f] group-hover:text-[#629649]">
                {persona.h1}
              </h2>
              <p className="line-clamp-3 text-sm leading-relaxed text-[#737373]">
                {persona.intro}
              </p>
              <p className="mt-auto flex items-center gap-1 text-xs font-medium text-[#629649]">
                {persona.toolCount > 0
                  ? `${persona.toolCount} tools in scope`
                  : 'Browse workflows'}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
