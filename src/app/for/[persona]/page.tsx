import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategories, getDirectoryItems } from '@/lib/supabase';
import { siteConfig } from '@/config/site';
import { interpolateSeoText } from '@/config/seo-clusters';
import {
  getSeoPersona,
  getAllSeoPersonaSlugs,
} from '@/config/seo-personas';
import { getSeoCluster } from '@/config/seo-clusters';
import {
  filterItemsByPersona,
  getIndexableTags,
} from '@/lib/seo-pages';
import { getTagsForCategory } from '@/config/seo-tags';
import { DirectoryGrid } from '@/components/listing/DirectoryGrid';
import { CATEGORY_ICONS } from '@/lib/category-icons';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { getToolPath } from '@/lib/tool-routes';
import { getIndexableUseCases } from '@/lib/seo-use-cases';

export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllSeoPersonaSlugs().map((persona) => ({ persona }));
}

async function getPersonaToolCount(personaSlug: string, categorySlugs: string[]): Promise<number> {
  try {
    const items = await getDirectoryItems();
    return filterItemsByPersona(items, personaSlug, categorySlugs).length;
  } catch {
    return 0;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ persona: string }>;
}): Promise<Metadata> {
  const { persona: slug } = await params;
  const seoPersona = getSeoPersona(slug);

  if (!seoPersona) {
    return { title: 'Page Not Found' };
  }

  const toolCount = await getPersonaToolCount(slug, seoPersona.categorySlugs);
  const title = interpolateSeoText(seoPersona.metaTitle, { toolCount });
  const description = interpolateSeoText(seoPersona.metaDescription, { toolCount });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/for/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${siteConfig.url}/for/${slug}`,
    },
  };
}

export default async function PersonaPage({
  params,
}: {
  params: Promise<{ persona: string }>;
}) {
  const { persona: slug } = await params;
  const seoPersona = getSeoPersona(slug);

  if (!seoPersona) {
    notFound();
  }

  const [allItems, categories] = await Promise.all([
    getDirectoryItems(),
    getCategories(),
  ]);

  const itemsForPersona = filterItemsByPersona(allItems, slug, seoPersona.categorySlugs);
  const personaCategories = seoPersona.categorySlugs
    .map((catSlug) => categories.find((c) => c.slug === catSlug))
    .filter((c) => c !== undefined);

  const indexableTagSlugs = new Set(getIndexableTags(allItems).map((t) => t.slug));
  const personaTags = [
    ...new Map(
      seoPersona.categorySlugs
        .flatMap((catSlug) => getTagsForCategory(catSlug))
        .filter((tag) => indexableTagSlugs.has(tag.slug))
        .map((tag) => [tag.slug, tag])
    ).values(),
  ].slice(0, 6);
  const useCaseByWorkflow = new Map(
    getIndexableUseCases(allItems)
      .filter((useCase) => useCase.persona.slug === slug)
      .map((useCase) => [useCase.workflow.slug, useCase.path])
  );

  const pageUrl = `${siteConfig.url}/for/${slug}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: seoPersona.h1,
            description: seoPersona.intro,
            url: pageUrl,
            isPartOf: {
              '@type': 'WebSite',
              name: siteConfig.name,
              url: siteConfig.url,
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
                { '@type': 'ListItem', position: 2, name: seoPersona.shortLabel, item: pageUrl },
              ],
            },
            mainEntity: {
              '@type': 'ItemList',
              name: `${seoPersona.name} AI Tools`,
              numberOfItems: itemsForPersona.length,
              itemListElement: itemsForPersona.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: item.name,
                url: `${siteConfig.url}${getToolPath(item.slug)}`,
              })),
            },
          }),
        }}
      />

      <section className="border-b border-[#e0e0e0] bg-white py-12 md:py-16">
        <div className="container px-6">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-1.5 text-sm text-[#737373]"
          >
            <Link href="/" className="transition-colors hover:text-[#1f1f1f]">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-[#1f1f1f]">{seoPersona.shortLabel}</span>
          </nav>

          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-[#1f1f1f] sm:text-4xl">
              {seoPersona.h1}
            </h1>
            <p className="mt-4 text-base leading-7 text-[#737373]">{seoPersona.intro}</p>
            <p className="mt-3 text-sm text-[#737373]">
              We index{' '}
              <strong className="font-semibold text-[#1f1f1f]">{itemsForPersona.length}</strong>{' '}
              {itemsForPersona.length === 1 ? 'tool' : 'tools'} for {seoPersona.name.toLowerCase()}.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-xl">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#737373]">
              Typical workflows
            </h2>
            <ul className="mt-4 space-y-2 text-left text-sm leading-6 text-[#1f1f1f]">
              {seoPersona.workflows.map((workflow) => (
                <li key={workflow} className="flex items-start gap-2">
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#629649]" />
                  {workflow}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e0e0e0] py-14 md:py-20">
        <div className="container px-6">
          <h2 className="text-xl font-semibold text-[#1f1f1f]">
            Tools for {seoPersona.name}
          </h2>
          <p className="mt-0.5 text-sm text-[#737373]">
            {itemsForPersona.length > 0
              ? `${itemsForPersona.length} curated solutions`
              : 'Check back soon as we add more tools'}
          </p>
          {itemsForPersona.length > 0 ? (
            <div className="mt-6">
              <DirectoryGrid items={itemsForPersona} basePath={`/for/${slug}`} />
            </div>
          ) : (
            <p className="mt-6 text-sm text-[#737373]">
              No tools match this persona yet. Browse by category below.
            </p>
          )}
        </div>
      </section>

      {personaCategories.length > 0 && (
        <section className="border-b border-[#e0e0e0] bg-[#fafafa] py-16 md:py-20">
          <div className="container px-6">
            <h2 className="text-2xl font-semibold tracking-tight text-[#1f1f1f]">
              Browse by workflow
            </h2>
            <p className="mt-1 text-sm text-[#737373]">
              Category hubs with tools relevant to {seoPersona.name.toLowerCase()}
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {personaCategories.map((cat) => {
                const cluster = getSeoCluster(cat.slug);
                const Icon = cat.icon
                  ? CATEGORY_ICONS[cat.icon as keyof typeof CATEGORY_ICONS]
                  : null;
                return (
                  <Link
                    key={cat.slug}
                    href={`/categories/${cat.slug}`}
                    className="group flex flex-col gap-3 rounded-[8px] border border-[#e0e0e0] bg-white p-5 transition-colors hover:border-[rgba(98,150,73,0.4)]"
                  >
                    {Icon && (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0f9f0] text-[#629649]">
                        <Icon className="h-5 w-5" />
                      </div>
                    )}
                    <h3 className="text-base font-semibold text-[#1f1f1f] group-hover:text-[#629649]">
                      {cluster?.h1 ?? cat.name}
                    </h3>
                    <p className="line-clamp-2 text-sm text-[#737373]">{cat.description}</p>
                    {cat.itemCount !== undefined && (
                      <p className="text-xs text-[#737373]">{cat.itemCount} tools</p>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {personaTags.length > 0 && (
        <section className="border-b border-[#e0e0e0] py-12 md:py-16">
          <div className="container px-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#737373]">
              Top capabilities for {seoPersona.name.toLowerCase()}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {personaTags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={useCaseByWorkflow.get(tag.slug) ?? `/tags/${tag.slug}`}
                  className="rounded-full border border-[#e0e0e0] bg-white px-4 py-1.5 text-sm font-medium text-[#1f1f1f] transition-colors hover:border-[rgba(98,150,73,0.4)] hover:text-[#629649]"
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-20">
        <div className="container px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-[#1f1f1f]">
              Frequently asked questions
            </h2>
            <div className="mt-10 divide-y divide-[#e0e0e0]">
              {seoPersona.faqs.map((faq) => (
                <div key={faq.question} className="py-6 first:pt-0 last:pb-0">
                  <h3 className="text-base font-semibold text-[#1f1f1f]">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#737373]">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
