import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategories, getDirectoryItems } from '@/lib/supabase';
import { hasEnoughAlternatives } from '@/config/seo-alternatives';
import { getToolAlternativesPath } from '@/lib/tool-routes';
import { siteConfig } from '@/config/site';
import { CategoryPageClient } from '@/components/category/CategoryPageClient';
import { parseDirectoryPage } from '@/lib/directory-pagination';
import { getSeoCluster, interpolateSeoText } from '@/config/seo-clusters';
import {
  filterItemsByCategorySlug,
  getFeaturedTools,
  buildPaginatedMetadata,
  buildPaginatedCanonicalUrl,
  buildOpenGraphMetadata,
  getIndexableTags,
} from '@/lib/seo-pages';
import { getTagsForCategory } from '@/config/seo-tags';

export const revalidate = 3600;

export async function generateStaticParams() {
  const categories = await getCategories(false);
  return categories.map((category) => ({
    category: category.slug,
  }));
}

async function getCategoryToolCount(slug: string): Promise<number> {
  const items = await getDirectoryItems();
  return filterItemsByCategorySlug(items, slug).length;
}

export async function generateMetadata(
  {
    params,
    searchParams,
  }: {
    params: Promise<{ category: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
  }
): Promise<Metadata> {
  const { category: slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const categories = await getCategories(false);
  const category = categories.find((cat) => cat.slug === slug);
  const seoCluster = getSeoCluster(slug);

  if (!category || !seoCluster) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
    };
  }

  const toolCount = await getCategoryToolCount(slug);
  const title = interpolateSeoText(seoCluster.metaTitle, { toolCount });
  const description = interpolateSeoText(seoCluster.metaDescription, { toolCount });
  const keywords = [
    seoCluster.primaryKeyword,
    ...seoCluster.secondaryKeywords,
    'commercial real estate',
    'CRE AI tools',
    'software comparison',
  ];

  const pagination = buildPaginatedMetadata({
    basePath: `/categories/${slug}`,
    page: resolvedSearchParams.page,
    hasFilters: false,
    title,
    description,
  });
  const canonicalUrl = buildPaginatedCanonicalUrl(
    `/categories/${slug}`,
    resolvedSearchParams.page,
  );

  return {
    title,
    description,
    keywords,
    openGraph: buildOpenGraphMetadata({
      title,
      description,
      url: canonicalUrl,
    }),
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: pagination.alternates,
    robots: pagination.robots,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category: slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const currentPage = parseDirectoryPage(resolvedSearchParams.page);
  const seoCluster = getSeoCluster(slug);

  if (!seoCluster) {
    notFound();
  }

  const categories = await getCategories();
  const category = categories.find((cat) => cat.slug === slug);

  if (!category) {
    notFound();
  }

  const allItems = await getDirectoryItems();

  const itemsInCategory = filterItemsByCategorySlug(allItems, slug);
  const alternativeTools = itemsInCategory.filter((item) => hasEnoughAlternatives(item, allItems));
  const featuredTools = getFeaturedTools(itemsInCategory);
  const indexableTagSlugs = new Set(getIndexableTags(allItems).map((t) => t.slug));
  const relatedTags = getTagsForCategory(slug)
    .filter((tag) => indexableTagSlugs.has(tag.slug))
    .slice(0, 3)
    .map((tag) => ({ slug: tag.slug, label: tag.label }));

  return (
    <>
    <CategoryPageClient
      category={category}
      categories={categories}
      itemsInCategory={itemsInCategory}
      itemsLoadError={false}
      slug={slug}
      currentPage={currentPage}
      seoCluster={seoCluster}
      featuredTools={featuredTools}
      relatedTags={relatedTags}
    />
    {currentPage === 1 && alternativeTools.length > 0 && (
      <section className="container px-6 py-10">
        <h2 className="text-xl font-semibold">Compare alternatives in {category.name}</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {alternativeTools.map((item) => (
            <li key={item.slug}>
              <Link href={getToolAlternativesPath(item.slug)} prefetch={false} className="text-sm underline-offset-2 hover:underline">
                {item.name} alternatives
              </Link>
            </li>
          ))}
        </ul>
      </section>
    )}
    </>
  );
}
