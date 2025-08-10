import type { Category } from "@/types";
import { getDirectoryItems, getCategoryBySlug, getCategories } from '@/lib/sheets';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from "next/navigation";
import { DirectorySearch, type DirectorySearchCategory } from "@/components/listing/DirectorySearch";
import { DirectoryGrid } from "@/components/listing/DirectoryGrid";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users, Zap, Shield, Star, CheckCircle } from "lucide-react";
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

  const itemsInCategory = await getDirectoryItems(searchTerm, slug);
  const allCategoriesForSearch: Category[] = await getCategories(); 
  const searchCategories: DirectorySearchCategory[] = allCategoriesForSearch.map(
    ({ id, slug, name }) => ({ id, slug, name })
  );

  // Get top-rated tools for featured section
  const topTools = itemsInCategory
    .filter(item => item.rating && item.rating >= 4.0)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3);

  // Calculate category statistics
  const avgRating = itemsInCategory.reduce((sum, item) => sum + (item.rating || 0), 0) / itemsInCategory.length;
  const freeTools = itemsInCategory.filter(item => item.pricing?.includes('Free') || item.pricing?.includes('free')).length;
  const enterpriseTools = itemsInCategory.filter(item => item.pricing?.includes('Enterprise') || item.pricing?.includes('enterprise')).length;

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

      {/* Hero Section with Enhanced Visual Design */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        
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
                    layout="fill" 
                    objectFit="contain"
                    className="p-2"
                    data-ai-hint="category icon badge"
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

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3">
                <TrendingUp className="mr-2 h-5 w-5" />
                Explore Tools
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3">
                <Users className="mr-2 h-5 w-5" />
                Compare Solutions
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search Section */}
      <div className="container py-12 pl-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 md:p-8">
            <h2 className="text-2xl font-serif mb-6 text-center">Find Your Perfect {category.name} Tool</h2>
            <DirectorySearch 
              categories={searchCategories} 
              initialSearchTerm={searchTerm}
              initialCategoryFilter={slug}
              totalItems={itemsInCategory.length}
            />
          </div>
        </div>
      </div>

      {/* Featured Top Tools Section */}
      {topTools.length > 0 && (
        <div className="container py-12 pl-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Top-Rated {category.name} Tools</h2>
              <p className="text-muted-foreground text-lg">Handpicked solutions with the highest user ratings</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {topTools.map((tool, index) => (
                <Card key={tool.id} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-500" />
                  {index === 0 && (
                    <div className="absolute top-4 left-4 z-10">
                      <Badge className="bg-yellow-500 text-white px-3 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        Top Pick
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="p-6 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 p-3">
                        {tool.imageUrl ? (
                          <Image 
                            src={tool.imageUrl} 
                            alt={tool.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-400">
                            {tool.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold">{tool.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < Math.floor(tool.rating || 0) ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {tool.rating?.toFixed(1)} ({tool.reviewCount || 0} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="px-6 pb-4">
                    <p className="text-muted-foreground mb-4 line-clamp-2">{tool.tagline}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary" className="text-xs">
                        {tool.category}
                      </Badge>
                      {tool.pricing && (
                        <Badge variant="outline" className="text-xs">
                          {tool.pricing}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardContent className="px-6 pb-6">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={tool.website} target="_blank" rel="noopener noreferrer">
                          Visit Site
                        </Link>
                      </Button>
                      <Button size="sm" className="flex-1" asChild>
                        <Link href={`/${tool.slug}`}>
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Tools Grid */}
      <div className="container py-12 pl-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif mb-4">All {category.name} Tools</h2>
            <p className="text-muted-foreground text-lg">
              Comprehensive directory of {itemsInCategory.length} {category.name.toLowerCase()} solutions
            </p>
          </div>
          
          <DirectoryGrid items={itemsInCategory} />
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
            {searchCategories.slice(0, 4).filter(cat => cat.slug !== slug).map((relatedCategory) => (
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
