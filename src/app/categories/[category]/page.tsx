import type { Category } from "@/types";
import { getCategories, getCategory, getDirectoryItems } from "@/lib/sheets";
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from "next/navigation";
import { DirectorySearch, type DirectorySearchCategory } from "@/components/listing/DirectorySearch";
import { DirectoryGrid } from "@/components/listing/DirectoryGrid";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig, generateCategoryMeta } from "@/config/site";

type Props = {
  params: { category: string }; // This is the category slug from the path
  searchParams: {
    search?: string;
    // category?: string; // This would be from query params, potentially overriding path
  };
};

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = await getCategory(categorySlug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  const categoryMeta = generateCategoryMeta(category.name, category.description);
  const parentMetadata = await parent;
  const canonicalUrl = `${siteConfig.url}/categories/${categorySlug}`;

  return {
    title: categoryMeta.title,
    description: categoryMeta.description,
    keywords: [
      ...categoryMeta.keywords.split(', '),
      ...siteConfig.seo.primaryKeywords,
      'category directory',
      'tool comparison',
      'software reviews'
    ],
    
    // Enhanced Open Graph for category pages
    openGraph: {
      title: categoryMeta.title,
      description: categoryMeta.description,
      url: canonicalUrl,
      siteName: siteConfig.seo.openGraph.siteName,
      images: [
        {
          url: category.imageUrl || siteConfig.seo.openGraph.images.default,
          width: siteConfig.seo.openGraph.images.width,
          height: siteConfig.seo.openGraph.images.height,
          alt: `${category.name} Tools - Commercial Real Estate AI Category`,
        },
      ],
      locale: siteConfig.seo.openGraph.locale,
      type: 'website',
    },
    
    // Enhanced Twitter card for category pages
    twitter: {
      card: siteConfig.seo.twitter.card,
      title: categoryMeta.title,
      description: categoryMeta.description,
      site: siteConfig.seo.twitter.site,
      creator: siteConfig.seo.twitter.creator,
      images: [
        {
          url: category.imageUrl || siteConfig.seo.twitter.images.default,
          width: siteConfig.seo.twitter.images.width,
          height: siteConfig.seo.twitter.images.height,
          alt: `${category.name} Tools Directory`,
        },
      ],
    },
    
    // Canonical URL and alternates
    alternates: {
      canonical: canonicalUrl,
    },
    
    // Robots directive
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };
}

// Revalidate every hour
export const revalidate = 3600;

export default async function CategoryDetailPage({ params, searchParams }: Props) {
  const { category: categorySlugFromPath } = await params;
  const { search } = await searchParams;
  const searchTerm = search || "";
  // const categoryFilterFromQuery = searchParams.category; // Not directly used for fetching items on this page, path slug is primary.

  const category = await getCategoryBySlug(categorySlugFromPath);
  if (!category) {
    notFound();
  }

  // Items are always fetched based on the category slug from the path for this page.
  // Search term applies within this path-defined category.
  const itemsInCategory = await getDirectoryItems(searchTerm, categorySlugFromPath);
  
  const allCategoriesForSearch: Category[] = await getCategories(); 
  const searchCategories: DirectorySearchCategory[] = allCategoriesForSearch.map(
    ({ id, slug, name }) => ({ id, slug, name })
  );

  return (
    <>
      {/* Structured Data for Category */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${category.name} Tools`,
            description: category.description,
            url: `${siteConfig.url}/categories/${categorySlugFromPath}`,
            isPartOf: {
              "@type": "WebSite",
              name: siteConfig.name,
              url: siteConfig.url,
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: siteConfig.url,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Categories",
                  item: `${siteConfig.url}/categories`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: category.name,
                  item: `${siteConfig.url}/categories/${categorySlugFromPath}`,
                },
              ],
            },
            mainEntity: {
              "@type": "ItemList",
              name: `${category.name} Tools`,
              description: `Curated list of the best ${category.name} tools and software`,
              numberOfItems: itemsInCategory.length,
              itemListElement: itemsInCategory.slice(0, 10).map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${siteConfig.url}/${item.slug}`,
                name: item.name,
                description: item.tagline,
              })),
            },
          }),
        }}
      />

      <div className="container py-12 md:py-16 pl-6">
        <header className="mb-12 text-center">
          {category.imageUrl && (
             <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-lg border-4 border-primary/20">
              <Image 
                src={category.imageUrl} 
                alt={`${category.name} category icon`}
                layout="fill" 
                objectFit="cover"
                data-ai-hint="category icon badge"
              />
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">{category.name} Tools</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {category.description || `Discover the best ${category.name} tools and software solutions for your Commercial Real Estate AI needs.`}
          </p>
          
          {/* Category Stats */}
          <div className="flex justify-center items-center gap-6 mt-6 text-sm text-muted-foreground">
            <span>{itemsInCategory.length} tools available</span>
            <span>•</span>
            <span>Updated regularly</span>
            <span>•</span>
            <span>Expert reviewed</span>
          </div>
        </header>

        {category.longDescription && (
          <Card className="mb-12 shadow-sm">
            <CardContent className="pt-6">
              <div className="prose prose-sm sm:prose-base max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: category.longDescription }} />
            </CardContent>
          </Card>
        )}

        <DirectorySearch 
          categories={searchCategories} 
          initialSearchTerm={searchTerm}
          initialCategoryFilter={categorySlugFromPath}
          totalItems={itemsInCategory.length}
        />
        <DirectoryGrid items={itemsInCategory} />
      </div>
    </>
  );
}
