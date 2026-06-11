import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategories, getDirectoryItems } from '@/lib/supabase';
import type { DirectoryItem } from '@/types';
import { siteConfig } from '@/config/site';
import { CategoryPageClient } from '@/components/category/CategoryPageClient';
import { parseDirectoryPage } from '@/lib/directory-pagination';
import { getSeoCluster, interpolateSeoText } from '@/config/seo-clusters';
import {
  filterItemsByCategorySlug,
  getFeaturedTools,
} from '@/lib/seo-pages';

export const revalidate = 3600;

export async function generateStaticParams() {
  const categories = await getCategories(false);
  return categories.map((category) => ({
    category: category.slug,
  }));
}

async function getCategoryToolCount(slug: string): Promise<number> {
  try {
    const items = await getDirectoryItems();
    return filterItemsByCategorySlug(items, slug).length;
  } catch {
    return 0;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ category: string }> }
): Promise<Metadata> {
  const { category: slug } = await params;
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

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/categories/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${siteConfig.url}/categories/${slug}`,
    },
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

  let allItems: DirectoryItem[] = [];
  let itemsLoadError = false;

  try {
    allItems = await getDirectoryItems();
  } catch (error) {
    console.warn(`Failed to load directory items for category ${slug}:`, error);
    itemsLoadError = true;
  }

  const itemsInCategory = filterItemsByCategorySlug(allItems, slug);
  const featuredTools = getFeaturedTools(itemsInCategory);

  return (
    <CategoryPageClient
      category={category}
      categories={categories}
      itemsInCategory={itemsInCategory}
      itemsLoadError={itemsLoadError}
      slug={slug}
      currentPage={currentPage}
      seoCluster={seoCluster}
      featuredTools={featuredTools}
    />
  );
}
