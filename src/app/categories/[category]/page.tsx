import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CategoryChips } from '@/components/ui/category-chips';
import { DirectoryGrid } from '@/components/listing/DirectoryGrid';
import { getCategories, getDirectoryItems } from '@/lib/sheets';
import type { DirectoryItem } from '@/types';
import { siteConfig } from '@/config/site';
import { CheckCircle, Zap, Users, Shield, ArrowRight, Star } from 'lucide-react';

// Removed dynamic = 'force-dynamic' to allow static generation since categories are hardcoded
// If you need fresh data, consider using revalidate instead

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ category: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { category: slug } = await params;
  const categories = await getCategories();
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

  // If no tools found, still show the category page with full content
  // This ensures category pages work even when tools fail to load
  if (itemsInCategory.length === 0) {
    // Don't return early - show the full category page with description and FAQ
    // Just set empty tools array for the grid component
  }

  // Get top-rated tools for hero section
  const topTools = itemsInCategory
    .filter(item => item.rating && item.rating >= 4.0)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3);

  // Calculate category statistics
  const avgRating = itemsInCategory.reduce((sum, item) => sum + (item.rating || 0), 0) / itemsInCategory.length;
  const freeTools = itemsInCategory.filter(item => 
    item.pricing?.includes('Free') || item.pricing?.includes('free')
  ).length;
  const enterpriseTools = itemsInCategory.filter(item => 
    item.pricing?.includes('Enterprise') || item.pricing?.includes('enterprise')
  ).length;

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

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container relative py-16 md:py-24 pl-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-foreground transition-colors">Categories</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{category.name}</span>
          </nav>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            {category.imageUrl && (
              <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40 rounded-2xl blur-xl" />
                <div className="relative w-full h-full bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-2xl border border-primary/20">
                  <Image 
                    src={category.imageUrl} 
                    alt={`${category.name} category icon`}
                    fill 
                    style={{ objectFit: "contain" }}
                    className="p-2"
                  />
                </div>
              </div>
            )}
            
            <h1 className="text-4xl md:text-6xl font-serif tracking-tight mb-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
              {category.name} Tools
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              {category.description || `Discover the best ${category.name} tools and software solutions for your Commercial Real Estate AI needs.`}
            </p>

            {/* Category Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-primary">{itemsInCategory.length}</div>
                <div className="text-sm text-muted-foreground">Tools Available</div>
              </div>
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-green-600">{avgRating.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </div>
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-blue-600">{freeTools}</div>
                <div className="text-sm text-muted-foreground">Free Options</div>
              </div>
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-purple-600">{enterpriseTools}</div>
                <div className="text-sm text-muted-foreground">Enterprise</div>
              </div>
            </div>

            {/* Top Tools Preview */}
            {topTools.length > 0 && (
              <div className="mt-12">
                <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Top Rated Tools</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {topTools.map((tool) => (
                    <Link 
                      key={tool.slug} 
                      href={`/${tool.slug}`}
                      className="group flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-slate-800/90 rounded-lg border border-white/20 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105"
                    >
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium group-hover:text-primary transition-colors">
                        {tool.name}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {tool.rating}★
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Tools Grid */}
      <div className="container py-12 pl-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif mb-4">All {category.name} Tools</h2>
            <p className="text-muted-foreground text-lg">
              {itemsInCategory.length > 0 
                ? `Comprehensive directory of ${itemsInCategory.length} ${category.name.toLowerCase()} solutions`
                : `Discover ${category.name.toLowerCase()} solutions for your commercial real estate needs`
              }
            </p>
          </div>
          
          {itemsInCategory.length > 0 ? (
            <DirectoryGrid items={itemsInCategory} />
          ) : (
            <div className="text-center py-16">
              <div className="max-w-2xl mx-auto">
                {itemsLoadError ? (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Tools Loading Issue</h3>
                    <p className="text-muted-foreground">
                      We're temporarily unable to load the tools for this category. 
                      Please try again later or explore other categories below.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">No Tools Available</h3>
                    <p className="text-muted-foreground">
                      We're constantly adding new {category.name.toLowerCase()} tools to our directory. 
                      Check back soon or explore related categories below.
                    </p>
                  </div>
                )}
                <Link 
                  href="/categories" 
                  className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <ArrowRight className="h-4 w-4" />
                  Browse All Categories
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Category Description */}
      {category.longDescription && (
        <div className="container py-16 pl-6">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-900">
              <CardContent className="p-8 md:p-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">About {category.name} Tools</h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-primary to-blue-500 mx-auto rounded-full" />
                </div>
                <div className="prose prose-lg max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: category.longDescription }} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Enhanced FAQ Section */}
      <div className="container py-16 pl-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to know about {category.name.toLowerCase()} tools
            </p>
          </div>
          
          <div className="grid gap-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  What are {category.name} tools?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {category.name} tools are specialized AI-powered software solutions designed to help commercial real estate professionals {category.description.toLowerCase()}. These tools leverage artificial intelligence and machine learning to automate processes, provide insights, and improve decision-making in the commercial real estate industry.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-500" />
                  How do I choose the right {category.name} tool?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Consider your specific business needs, budget, team size, and existing technology stack. Look for tools that offer free trials, have strong customer support, and integrate well with your current workflow. Our directory provides detailed comparisons to help you make an informed decision.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  Are these {category.name} tools suitable for small businesses?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Many {category.name} tools offer scalable pricing plans suitable for businesses of all sizes. We indicate pricing models and company size recommendations in our directory to help you find solutions that fit your budget and requirements.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-orange-500" />
                  What should I expect in terms of implementation time?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Implementation time varies by tool complexity and business requirements. Simple tools may be ready in days, while comprehensive platforms might take weeks or months. Most vendors provide implementation support and training to ensure successful adoption.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Related Categories Section */}
      <div className="container py-16 pl-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Explore Related Categories</h2>
            <p className="text-muted-foreground text-lg">
              Discover other AI tools that complement your {category.name.toLowerCase()} solutions
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 4).filter(cat => cat.slug !== slug).map((relatedCategory) => (
              <Link 
                key={relatedCategory.slug} 
                href={`/categories/${relatedCategory.slug}`}
                className="group block"
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
                      <ArrowRight className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {relatedCategory.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Structured Data for Category Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${category.name} Tools`,
            description: category.description || `Discover the best ${category.name} tools and software solutions for your Commercial Real Estate AI needs.`,
            url: `${siteConfig.url}/categories/${slug}`,
            mainEntity: {
              "@type": "ItemList",
              name: `${category.name} Tools Directory`,
              description: `Directory of ${category.name} AI tools for commercial real estate`,
              numberOfItems: itemsInCategory.length,
              itemListElement: itemsInCategory.map((item, index) => ({
                "@type": "SoftwareApplication",
                position: index + 1,
                name: item.name,
                description: item.tagline,
                url: `${siteConfig.url}/${item.slug}`,
                applicationCategory: category.name,
                operatingSystem: "Web-based",
              }))
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: siteConfig.url
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Categories",
                  item: `${siteConfig.url}/categories`
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: category.name,
                  item: `${siteConfig.url}/categories/${slug}`
                }
              ]
            }
          })
        }}
      />
    </>
  );
}
