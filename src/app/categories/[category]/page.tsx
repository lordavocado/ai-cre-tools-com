import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategories, getDirectoryItems } from '@/lib/supabase';
import type { DirectoryItem } from '@/types';
import { siteConfig } from '@/config/site';
import { CategoryPageClient } from '@/components/category/CategoryPageClient';
import { parseDirectoryPage } from '@/lib/directory-pagination';

// Removed dynamic = 'force-dynamic' to allow static generation since categories are hardcoded
// If you need fresh data, consider using revalidate instead

export const revalidate = 3600;

export async function generateStaticParams() {
  const categories = await getCategories(false);
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ category: string }> }
): Promise<Metadata> {
  const { category: slug } = await params;
  const categories = await getCategories(false);
  const category = categories.find((cat) => cat.slug === slug);

  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
    };
  }

  return {
    title: `${category.name} AI Tools for Commercial Real Estate | ${siteConfig.name}`,
    description: category.description || `Discover the best ${category.name} tools and software solutions for your Commercial Real Estate AI needs.`,
    keywords: [
      'commercial real estate',
      'CRE',
      'AI tools',
      category.name.toLowerCase(),
      'software solutions',
      'automation',
      'productivity',
    ],
    openGraph: {
      title: `${category.name} AI Tools for Commercial Real Estate`,
      description: category.description || `Discover the best ${category.name} tools and software solutions for your Commercial Real Estate AI needs.`,
      url: `${siteConfig.url}/categories/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} AI Tools for Commercial Real Estate`,
      description: category.description || `Discover the best ${category.name} tools and software solutions for your Commercial Real Estate AI needs.`,
    },
    alternates: {
      canonical: `${siteConfig.url}/categories/${slug}`,
    },
  };
}

export default async function CategoryPage({ 
  params,
  searchParams
}: {
  params: Promise<{ category: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category: slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const currentPage = parseDirectoryPage(resolvedSearchParams.page);
  const categories = await getCategories();
  const category = categories.find((cat) => cat.slug === slug);

  if (!category) {
    notFound();
  }

  // Try to load directory items with proper error handling
  let allItems: DirectoryItem[] = [];
  let itemsLoadError = false;
  
  try {
    allItems = await getDirectoryItems();
  } catch (error) {
    console.warn(`Failed to load directory items for category ${slug}:`, error);
    itemsLoadError = true;
  }
  
  const itemsInCategory = allItems.filter((item) => {
    // Support comma-separated categories to match the logic in getCategories
    const itemCategories = item.category.split(',').map(cat => cat.trim());
    return itemCategories.includes(slug);
  });

  return (
    <CategoryPageClient
      category={category}
      categories={categories}
      itemsInCategory={itemsInCategory}
      itemsLoadError={itemsLoadError}
      slug={slug}
      currentPage={currentPage}
    />
  );
}
