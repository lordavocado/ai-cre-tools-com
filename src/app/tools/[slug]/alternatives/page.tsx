import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDirectoryItemBySlug, getDirectoryItems } from '@/lib/supabase';
import { isValidSlug, isValidSlugFormat } from '@/lib/routing-utils-client';
import { siteConfig } from '@/config/site';
import { getSeoCluster } from '@/config/seo-clusters';
import {
  getAlternativesForTool,
  hasEnoughAlternatives,
  getPrimaryCategorySlug,
} from '@/config/seo-alternatives';
import { DirectoryItemCard } from '@/components/listing/DirectoryItemCard';
import { getCategoryLabel } from '@/config/design-tokens';
import { getToolAlternativesPath, getToolPath } from '@/lib/tool-routes';
import { buildOpenGraphMetadata } from '@/lib/seo-pages';

export const revalidate = 3600;

export async function generateStaticParams() {
  const { getEligibleAlternativeSlugs } = await import('@/config/seo-alternatives');
  const slugs = await getEligibleAlternativeSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getDirectoryItemBySlug(slug);
  if (!item) return { title: 'Not Found' };

  const title = `${item.name} Alternatives for CRE | AI CRE Tools`;
  const description = `Compare alternatives to ${item.name} for commercial real estate teams. Similar tools, features, and workflow fit.`;

  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}${getToolAlternativesPath(slug)}` },
    openGraph: buildOpenGraphMetadata({
      title,
      description,
      url: `${siteConfig.url}${getToolAlternativesPath(slug)}`,
    }),
  };
}

export default async function AlternativesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isValidSlugFormat(slug) || !isValidSlug(slug)) notFound();

  const item = await getDirectoryItemBySlug(slug);
  if (!item) notFound();

  const allItems = await getDirectoryItems();
  if (!hasEnoughAlternatives(item, allItems)) notFound();

  const alternatives = getAlternativesForTool(item, allItems);
  const primaryCategory = getPrimaryCategorySlug(item);
  const cluster = primaryCategory ? getSeoCluster(primaryCategory) : undefined;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `${item.name} Alternatives`,
            description: `Alternatives to ${item.name} for commercial real estate`,
            url: `${siteConfig.url}${getToolAlternativesPath(slug)}`,
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: alternatives.length,
              itemListElement: alternatives.map((alt, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: alt.name,
                url: `${siteConfig.url}${getToolPath(alt.slug)}`,
              })),
            },
          }),
        }}
      />

      <section className="border-b border-[#e0e0e0] bg-white py-12 md:py-16">
        <div className="container px-6">
          <nav className="mb-6 text-sm text-[#737373]">
            <Link href="/" className="hover:text-[#1f1f1f]">Home</Link>
            <span className="mx-1.5">/</span>
            <Link href={getToolPath(slug)} className="hover:text-[#1f1f1f]">{item.name}</Link>
            <span className="mx-1.5">/</span>
            <span className="text-[#1f1f1f]">Alternatives</span>
          </nav>

          <h1 className="text-3xl font-bold tracking-tight text-[#1f1f1f] sm:text-4xl">
            {item.name} alternatives for commercial real estate
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#737373]">
            {item.tagline || item.description.slice(0, 200)}
            {' '}
            If you are evaluating similar platforms, compare these {alternatives.length} alternatives
            in the same workflow category.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={getToolPath(slug)}
              className="text-sm font-medium text-[#1f1f1f] underline-offset-2 hover:underline"
            >
              Back to {item.name} profile
            </Link>
            {primaryCategory && (
              <Link
                href={`/categories/${primaryCategory}`}
                className="text-sm font-medium text-[#629649] underline-offset-2 hover:underline"
              >
                {cluster?.h1 ?? `All ${getCategoryLabel(primaryCategory)} tools`}
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container px-6">
          <h2 className="text-xl font-semibold text-[#1f1f1f]">Similar tools</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {alternatives.map((alt) => (
              <DirectoryItemCard key={alt.id} item={alt} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
