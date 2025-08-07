import type { Category } from "@/types";
import { getDirectoryItems, getCategoryBySlug, getCategories } from '@/lib/sheets';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from "next/navigation";
import { DirectorySearch, type DirectorySearchCategory } from "@/components/listing/DirectorySearch";
import { DirectoryGrid } from "@/components/listing/DirectoryGrid";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig, generateCategoryMeta } from "@/config/site";



export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ category: string }> },
  parent: ResolvingMetadata
) {
  const { category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

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
      'software reviews',
      `${category.name.toLowerCase()} software`,
      `best ${category.name.toLowerCase()} tools`,
      `${category.name.toLowerCase()} solutions`,
      `compare ${category.name.toLowerCase()} tools`,
      `${category.name.toLowerCase()} directory`,
      'commercial real estate software',
      'proptech tools',
      'real estate ai solutions'
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

export default async function CategoryPage({ 
  params,
  searchParams
}: {
  params: Promise<{ category: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category: slug } = await params;
  const resolvedSearchParams = await (searchParams || Promise.resolve({} as { [key: string]: string | string[] | undefined }));
  const searchTerm = resolvedSearchParams?.search as string || '';
  // const categoryFilterFromQuery = searchParams.category; // Not directly used for fetching items on this page, path slug is primary.

  const category = await getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  // Items are always fetched based on the category slug from the path for this page.
  // Search term applies within this path-defined category.
  const itemsInCategory = await getDirectoryItems(searchTerm, slug);
  
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
            url: `${siteConfig.url}/categories/${slug}`,
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
                  item: `${siteConfig.url}/categories/${slug}`,
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

      {/* FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: `What are ${category.name} tools?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `${category.name} tools are specialized AI-powered software solutions designed to help commercial real estate professionals ${category.description.toLowerCase()}. These tools leverage artificial intelligence and machine learning to automate processes, provide insights, and improve decision-making in the commercial real estate industry.`
                }
              },
              {
                "@type": "Question",
                name: `How do I choose the right ${category.name} tool?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Consider your specific business needs, budget, team size, and existing technology stack. Look for tools that offer free trials, have strong customer support, and integrate well with your current workflow."
                }
              },
              {
                "@type": "Question",
                name: `Are these ${category.name} tools suitable for small businesses?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `Many ${category.name} tools offer scalable pricing plans suitable for businesses of all sizes. We indicate pricing models and company size recommendations in our directory to help you find solutions that fit your budget and requirements.`
                }
              },
              {
                "@type": "Question",
                name: "What should I expect in terms of implementation time?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Implementation time varies by tool complexity and business requirements. Simple tools may be ready in days, while comprehensive platforms might take weeks or months. Most vendors provide implementation support and training to ensure successful adoption."
                }
              }
            ]
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
          initialCategoryFilter={slug}
          totalItems={itemsInCategory.length}
        />
        <DirectoryGrid items={itemsInCategory} />

        {/* Additional SEO Content Section */}
        {itemsInCategory.length > 0 && (
          <div className="mt-16">
            {/* FAQ Section for Category */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions about {category.name} Tools</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">What are {category.name} tools?</h3>
                    <p className="text-muted-foreground">
                      {category.name} tools are specialized AI-powered software solutions designed to help commercial real estate professionals {category.description.toLowerCase()}. These tools leverage artificial intelligence and machine learning to automate processes, provide insights, and improve decision-making in the commercial real estate industry.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">How do I choose the right {category.name} tool?</h3>
                    <p className="text-muted-foreground">
                      Consider your specific business needs, budget, team size, and existing technology stack. Look for tools that offer free trials, have strong customer support, and integrate well with your current workflow. Our directory provides detailed comparisons to help you make an informed decision.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Are these {category.name} tools suitable for small businesses?</h3>
                    <p className="text-muted-foreground">
                      Many {category.name} tools offer scalable pricing plans suitable for businesses of all sizes. We indicate pricing models and company size recommendations in our directory to help you find solutions that fit your budget and requirements.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">What should I expect in terms of implementation time?</h3>
                    <p className="text-muted-foreground">
                      Implementation time varies by tool complexity and business requirements. Simple tools may be ready in days, while comprehensive platforms might take weeks or months. Most vendors provide implementation support and training to ensure successful adoption.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Categories */}
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Explore Related Categories</h2>
              <p className="text-muted-foreground mb-8">
                Discover other AI tools that complement your {category.name.toLowerCase()} solutions
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {searchCategories.slice(0, 4).filter(cat => cat.slug !== slug).map((relatedCategory) => (
                  <Link 
                    key={relatedCategory.slug} 
                    href={`/categories/${relatedCategory.slug}`}
                    className="inline-flex items-center px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors"
                  >
                    {relatedCategory.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
