import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategories, getDirectoryItems } from '@/lib/supabase';
import { siteConfig } from '@/config/site';
import { getSeoTag } from '@/config/seo-tags';
import { getSeoCluster } from '@/config/seo-clusters';
import {
  buildTagPageMetadata,
  filterItemsByTag,
  getIndexableTags,
  getIndexableTagSlugs,
} from '@/lib/seo-pages';
import { DirectoryGrid } from '@/components/listing/DirectoryGrid';
import { CATEGORY_ICONS } from '@/lib/category-icons';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { getToolPath } from '@/lib/tool-routes';
import { getIndexableUseCases } from '@/lib/seo-use-cases';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getIndexableTagSlugs();
  return slugs.map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag: slug } = await params;
  const seoTag = getSeoTag(slug);
  if (!seoTag) return { title: 'Tag Not Found' };

  const { getDirectoryItems } = await import('@/lib/supabase');
  let toolCount = 0;
  try {
    const items = await getDirectoryItems();
    toolCount = filterItemsByTag(items, seoTag).length;
  } catch {
    toolCount = 0;
  }

  const { title, description } = buildTagPageMetadata(seoTag, toolCount);

  return {
    title,
    description,
    openGraph: { title, description, url: `${siteConfig.url}/tags/${slug}`, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `${siteConfig.url}/tags/${slug}` },
  };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag: slug } = await params;
  const seoTag = getSeoTag(slug);
  if (!seoTag) notFound();

  const [allItems, categories] = await Promise.all([getDirectoryItems(), getCategories()]);
  const itemsForTag = filterItemsByTag(allItems, seoTag);
  const indexable = getIndexableTags(allItems);
  const isIndexable = indexable.some((t) => t.slug === slug);

  if (!isIndexable) notFound();

  const relatedCategories = seoTag.relatedCategorySlugs
    .map((catSlug) => categories.find((c) => c.slug === catSlug))
    .filter((c) => c !== undefined);

  const relatedTags = seoTag.relatedTagSlugs
    .map((tagSlug) => indexable.find((t) => t.slug === tagSlug))
    .filter((t) => t !== undefined);
  const roleUseCases = getIndexableUseCases(allItems)
    .filter((useCase) => useCase.workflow.slug === slug);

  const pageUrl = `${siteConfig.url}/tags/${slug}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: seoTag.h1,
            description: seoTag.intro,
            url: pageUrl,
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: itemsForTag.length,
              itemListElement: itemsForTag.map((item, index) => ({
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
          <nav className="mb-8 flex items-center gap-1.5 text-sm text-[#737373]">
            <Link href="/" className="hover:text-[#1f1f1f]">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/tags" className="hover:text-[#1f1f1f]">Capabilities</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-[#1f1f1f]">{seoTag.label}</span>
          </nav>

          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-[#1f1f1f] sm:text-4xl">
              {seoTag.h1}
            </h1>
            <p className="mt-4 text-base leading-7 text-[#737373]">{seoTag.intro}</p>
            <p className="mt-3 text-sm text-[#737373]">
              We index{' '}
              <strong className="font-semibold text-[#1f1f1f]">{itemsForTag.length}</strong>{' '}
              {itemsForTag.length === 1 ? 'tool' : 'tools'} with this capability.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e0e0e0] py-14 md:py-20">
        <div className="container px-6">
          <h2 className="text-xl font-semibold text-[#1f1f1f]">Matching tools</h2>
          <div className="mt-6">
            <DirectoryGrid items={itemsForTag} basePath={`/tags/${slug}`} />
          </div>
        </div>
      </section>

      {roleUseCases.length > 0 && (
        <section className="border-b border-[#e0e0e0] bg-white py-12 md:py-16">
          <div className="container px-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-2xl font-semibold text-[#1f1f1f]">Explore by team</h2>
                <p className="mt-1 text-sm text-[#737373]">
                  Narrow this workflow to tools qualified for a specific CRE role.
                </p>
              </div>
              <Link href="/use-cases" className="text-sm font-medium text-[#629649] hover:underline">
                All use cases
              </Link>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {roleUseCases.map((useCase) => (
                <Link
                  key={useCase.path}
                  href={useCase.path}
                  className="group rounded-[8px] border border-[#e0e0e0] bg-[#fafafa] p-5 hover:border-[rgba(98,150,73,0.45)] hover:bg-white"
                >
                  <h3 className="font-semibold text-[#1f1f1f] group-hover:text-[#629649]">{useCase.title}</h3>
                  <p className="mt-2 text-sm text-[#737373]">{useCase.tools.length} matching tools</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedCategories.length > 0 && (
        <section className="border-b border-[#e0e0e0] bg-[#fafafa] py-16 md:py-20">
          <div className="container px-6">
            <h2 className="text-2xl font-semibold text-[#1f1f1f]">Related categories</h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedCategories.map((cat) => {
                const cluster = getSeoCluster(cat.slug);
                const Icon = cat.icon
                  ? CATEGORY_ICONS[cat.icon as keyof typeof CATEGORY_ICONS]
                  : null;
                return (
                  <Link
                    key={cat.slug}
                    href={`/categories/${cat.slug}`}
                    className="group flex gap-4 rounded-[8px] border border-[#e0e0e0] bg-white p-5 hover:border-[rgba(98,150,73,0.4)]"
                  >
                    {Icon && (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0f9f0] text-[#629649]">
                        <Icon className="h-5 w-5" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-[#1f1f1f] group-hover:text-[#629649]">
                        {cluster?.h1 ?? cat.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-[#737373]">{cat.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {relatedTags.length > 0 && (
        <section className="border-b border-[#e0e0e0] py-12">
          <div className="container px-6">
            <h2 className="text-lg font-semibold text-[#1f1f1f]">Related capabilities</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {relatedTags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/tags/${tag.slug}`}
                  className="rounded-full border border-[#e0e0e0] bg-[#fafafa] px-3 py-1 text-sm font-medium text-[#1f1f1f] hover:bg-white"
                >
                  {tag.label}
                  <span className="ml-1.5 text-xs text-[#737373]">({tag.toolCount})</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-20">
        <div className="container px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-semibold text-[#1f1f1f]">Frequently asked questions</h2>
            <div className="mt-10 divide-y divide-[#e0e0e0]">
              {seoTag.faqs.map((faq) => (
                <div key={faq.question} className="py-6 first:pt-0">
                  <h3 className="text-base font-semibold text-[#1f1f1f]">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#737373]">{faq.answer}</p>
                </div>
              ))}
            </div>
            <Link
              href="/tags"
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-[#1f1f1f] hover:underline"
            >
              All capabilities
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
