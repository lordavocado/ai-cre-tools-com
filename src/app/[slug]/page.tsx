import { getDirectoryItemBySlug, getDirectoryItems } from "@/lib/supabase";
import { isValidSlug, isValidSlugFormat } from "@/lib/routing-utils-client";
import type { Metadata, ResolvingMetadata } from 'next';
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ExternalLink,
  Star,
  Tag,
  ThumbsUp,
  ThumbsDown,
  Zap,
  DollarSign,
  CalendarDays,
  Users,
  Twitter,
  Linkedin,
  Facebook
} from "lucide-react";
import { DirectoryItemCard } from "@/components/listing/DirectoryItemCard"; // For related items
import { CategoryChipsWithIcons } from "@/components/ui/category-chips-with-icons";
import { SafeImage } from "@/components/ui/safe-image";
import { siteConfig, generateToolMeta } from "@/config/site";
import { FavoriteButton } from "@/components/ui/favorite-button";

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const items = await getDirectoryItems();
  return items.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const item = await getDirectoryItemBySlug(slug);

  if (!item) {
    return {
      title: "Tool Not Found",
    };
  }

  const toolMeta = generateToolMeta(item.name, item.tagline, item.description);
  const canonicalUrl = `${siteConfig.url}/${slug}`;
  const categories = item.category.split(',').map(cat => cat.trim());

  return {
    title: toolMeta.title,
    description: toolMeta.description,
    keywords: [
      ...toolMeta.keywords.split(', '),
      ...categories.map(cat => `${cat} tools`),
      ...siteConfig.seo.primaryKeywords,
      'tool review',
      'software comparison',
      'CRE AI software'
    ],
    
    // Enhanced Open Graph for tool pages
    openGraph: {
      title: toolMeta.title,
      description: toolMeta.description,
      url: canonicalUrl,
      siteName: siteConfig.seo.openGraph.siteName,
      images: [
        {
          url: item.imageUrl || siteConfig.seo.openGraph.images.default,
          width: siteConfig.seo.openGraph.images.width,
          height: siteConfig.seo.openGraph.images.height,
          alt: `${item.name} - ${item.tagline}`,
        },
      ],
      locale: siteConfig.seo.openGraph.locale,
      type: 'article',
      publishedTime: item.lastUpdated || new Date().toISOString(),
      modifiedTime: item.lastUpdated || new Date().toISOString(),
    },
    
    // Enhanced Twitter card for tool pages
    twitter: {
      card: siteConfig.seo.twitter.card,
      title: toolMeta.title,
      description: toolMeta.description,
      site: siteConfig.seo.twitter.site,
      creator: siteConfig.seo.twitter.creator,
      images: [
        {
          url: item.imageUrl || siteConfig.seo.twitter.images.default,
          width: siteConfig.seo.twitter.images.width,
          height: siteConfig.seo.twitter.images.height,
          alt: `${item.name} Tool Review`,
        },
      ],
    },
    
    // Canonical URL and alternates
    alternates: {
      canonical: canonicalUrl,
    },
    
    // Enhanced robots directive
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    
    // Additional metadata
    authors: [{ name: `${siteConfig.name} Team` }],
    category: 'Technology',
    classification: 'Software Review',
  };
}

export default async function DirectoryItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Validate slug format for SEO compliance
  if (!isValidSlugFormat(slug)) {
    notFound();
  }
  
  // Check if slug conflicts with reserved routes
  if (!isValidSlug(slug)) {
    notFound();
  }
  
  const item = await getDirectoryItemBySlug(slug);

  if (!item) {
    notFound();
  }
  
  // Split categories and get the first one for related items lookup
  const categories = item.category.split(',').map(cat => cat.trim());
  const primaryCategory = categories[0];
  
  // Fetch related items (e.g., same category, excluding current item)
  const allItemsInCategory = await getDirectoryItems(undefined, primaryCategory);
  const relatedItems = allItemsInCategory.filter(related => related.id !== item.id).slice(0, 3);

  return (
    <>
      {/* Enhanced SoftwareApplication Schema for Tool */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: item.name,
            description: item.description || item.tagline,
            url: item.website,
            applicationCategory: item.category?.includes('management') ? 'BusinessApplication' :
                                item.category?.includes('analysis') ? 'DeveloperApplication' :
                                item.category?.includes('market') ? 'BusinessApplication' : 'BusinessApplication',
            operatingSystem: "Web-based",
            applicationSubCategory: item.category || 'CRE AI Tool',
            softwareVersion: item.lastUpdated ? new Date(item.lastUpdated).getFullYear().toString() : undefined,
            fileSize: undefined,
            downloadUrl: item.website,
            screenshot: item.imageUrl,
            offers: {
              "@type": "Offer",
              price: item.pricing ? item.pricing.replace(/[^\d.]/g, '') || "0" : "0",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              seller: {
                "@type": "Organization",
                name: item.name,
              },
            },
            aggregateRating: item.rating ? {
              "@type": "AggregateRating",
              ratingValue: item.rating,
              reviewCount: item.reviewCount || 1,
              bestRating: 5,
              worstRating: 1,
            } : undefined,
            author: {
              "@type": "Organization",
              name: siteConfig.name,
              url: siteConfig.url,
            },
            publisher: {
              "@type": "Organization",
              name: siteConfig.name,
              url: siteConfig.url,
              logo: {
                "@type": "ImageObject",
                url: `${siteConfig.url}/ai-cre-tools-logo.jpg`,
              },
            },
            datePublished: item.foundedYear ? `${item.foundedYear}-01-01` : new Date().toISOString(),
            dateModified: item.lastUpdated || new Date().toISOString(),
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${siteConfig.url}/${slug}`,
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
                  name: "Tools",
                  item: `${siteConfig.url}/#directory`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: item.name,
                  item: `${siteConfig.url}/${slug}`,
                },
              ],
            },
            about: [
              {
                "@type": "Thing",
                name: "Commercial Real Estate",
                sameAs: "https://en.wikipedia.org/wiki/Commercial_property",
              },
              {
                "@type": "Thing",
                name: "Artificial Intelligence",
                sameAs: "https://en.wikipedia.org/wiki/Artificial_intelligence",
              },
              {
                "@type": "Thing",
                name: "PropTech",
                sameAs: "https://en.wikipedia.org/wiki/PropTech",
              },
            ],
            keywords: [
              item.name,
              item.category,
              "AI",
              "artificial intelligence",
              "commercial real estate",
              "CRE",
              "PropTech",
              "automation",
              "efficiency",
            ].filter(Boolean),
          }),
        }}
      />

      {/* Review/Rating Schema if available */}
      {item.rating && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Review",
              author: {
                "@type": "Person",
                name: "CRE Professional",
              },
              reviewRating: {
                "@type": "Rating",
                ratingValue: item.rating,
                bestRating: 5,
                worstRating: 1,
              },
              reviewBody: `${item.name} is rated ${item.rating}/5 by CRE professionals for its AI-powered capabilities in commercial real estate.`,
              itemReviewed: {
                "@type": "SoftwareApplication",
                name: item.name,
                description: item.description || item.tagline,
              },
            }),
          }}
        />
      )}

      {/* FAQ Structured Data if features exist */}
      {item.features && item.features.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: item.features.slice(0, 5).map((feature) => ({
                "@type": "Question",
                name: `What is ${feature.name}?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: feature.description || `${item.name} offers ${feature.name} as one of its key features.`,
                },
              })),
            }),
          }}
        />
      )}

      <div className="container py-8 md:py-12 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section with Tool Info */}
          <div className="relative mb-4 p-8 bg-white rounded-3xl border border-slate-200/60 shadow-xl">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Logo */}
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mx-auto rounded-3xl overflow-hidden shadow-lg shrink-0 flex items-center justify-center bg-neutral-50 border border-neutral-200">
                  <SafeImage
                    src={item.imageUrl}
                    website={item.website}
                    alt={`${item.name} logo`}
                    className="w-28 h-28 object-contain drop-shadow-md"
                  />
                </div>
              </div>

              {/* Main Content: title, subtitle, location, categories, actions */}
              <div className="flex-1 min-w-0">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-3">{item.name}</h1>
                <p className="text-xl text-slate-600 leading-relaxed mb-4">{item.tagline}</p>

                <div className="flex flex-wrap items-center gap-3 mb-6">
                  {item.country && (
                    <div className="flex items-center gap-2 text-sm bg-slate-50/80 px-3 py-2 rounded-xl border border-slate-200/50 shadow-sm">
                      <Users className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-600 text-sm">
                        {item.city && `${item.city}, `}{item.country}
                      </span>
                    </div>
                  )}
                  {item.category && (
                    <CategoryChipsWithIcons categories={item.category} variant="outline" />
                  )}
                  {item.rating && (
                    <div className="flex items-center gap-2 text-sm bg-amber-50/80 px-4 py-2 rounded-xl border border-amber-200/50 shadow-sm">
                      <Star className="h-5 w-5 text-amber-500 fill-amber-400" />
                      <span className="font-semibold text-slate-700">{item.rating.toFixed(1)}</span>
                      {item.reviewCount && <span className="text-slate-500">({item.reviewCount} reviews)</span>}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <Button asChild variant="default" className="sm:w-auto bg-neutral-900 hover:bg-neutral-800 text-white shadow-md hover:shadow-lg transition-all duration-200">
                    <Link href={item.website} target="_blank" rel="noopener noreferrer">
                      Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <FavoriteButton 
                    toolId={item.id} 
                    variant="with-text" 
                    className="sm:w-auto"
                  />
                </div>

                {/* Key Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {item.pricing && (
                    <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 shadow-sm text-center">
                      <DollarSign className="h-6 w-6 text-neutral-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-600 mb-1">Pricing</p>
                      <p className="font-semibold text-slate-800 text-sm">{item.pricing}</p>
                    </div>
                  )}
                  {item.foundedYear && (
                    <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 shadow-sm text-center">
                      <CalendarDays className="h-6 w-6 text-neutral-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-600 mb-1">Founded</p>
                      <p className="font-semibold text-slate-800 text-sm">{item.foundedYear}</p>
                    </div>
                  )}
                  {item.socials && Object.keys(item.socials).length > 0 && (
                    <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 shadow-sm text-center">
                      <div className="flex justify-center gap-2 mb-2">
                        {item.socials.twitter && <Link href={`https://twitter.com/${item.socials.twitter}`} target="_blank" rel="noopener noreferrer" className="p-1 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-all duration-200 hover:scale-105"><Twitter size={12} className="text-neutral-600"/></Link>}
                        {item.socials.linkedin && <Link href={`https://linkedin.com/${item.socials.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-1 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-all duration-200 hover:scale-105"><Linkedin size={12} className="text-neutral-600"/></Link>}
                        {item.socials.facebook && <Link href={`https://facebook.com/${item.socials.facebook}`} target="_blank" rel="noopener noreferrer" className="p-1 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-all duration-200 hover:scale-105"><Facebook size={12} className="text-neutral-600"/></Link>}
                      </div>
                      <p className="text-xs text-slate-600 mb-1">Social</p>
                      <p className="font-semibold text-slate-800 text-sm">Connected</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-4">
            {/* Description */}
            {item.description && (
              <Card className="border border-slate-200/60 shadow-lg rounded-2xl bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center text-slate-800">
                    <div className="w-1 h-8 bg-neutral-900 rounded-full mr-3"></div>
                    About {item.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.description }} />
                </CardContent>
              </Card>
            )}

            {/* Features and Pros/Cons Row */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Key Features */}
              {item.features && item.features.length > 0 && (
                <Card className="lg:col-span-2 border border-slate-200/60 shadow-lg rounded-2xl bg-white">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center text-slate-800">
                      <div className="p-2 bg-neutral-100 rounded-xl mr-3 shadow-sm">
                        <Zap className="h-5 w-5 text-neutral-600"/>
                      </div>
                      Key Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {item.features.map((feature, index) => (
                        <div key={index} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-200">
                          <p className="font-semibold text-slate-800 mb-1">{feature.name}</p>
                          {feature.description && <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Pros & Cons */}
              {((item.pros && item.pros.length > 0) || (item.cons && item.cons.length > 0)) && (
                <Card className="border border-slate-200/60 shadow-lg rounded-2xl bg-white">
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-800 flex items-center">
                      <div className="w-1 h-6 bg-neutral-900 rounded-full mr-3"></div>
                      Pros & Cons
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 shadow-sm">
                      <h3 className="text-sm font-semibold mb-3 flex items-center text-neutral-700">
                        <div className="p-1 bg-neutral-100 rounded-lg mr-2">
                          <ThumbsUp className="h-3 w-3 text-neutral-600"/>
                        </div>
                        Pros
                      </h3>
                      <ul className="space-y-2 text-xs">
                        {item.pros && item.pros.slice(0, 3).map((pro: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-slate-700">
                            <div className="w-1 h-1 bg-neutral-400 rounded-full mt-1.5 shrink-0"></div>
                            {pro}
                          </li>
                        ))}
                        {(!item.pros || item.pros.length === 0) && (
                          <li className="text-slate-500 italic text-xs">No pros listed.</li>
                        )}
                      </ul>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 shadow-sm">
                      <h3 className="text-sm font-semibold mb-3 flex items-center text-neutral-700">
                        <div className="p-1 bg-neutral-100 rounded-lg mr-2">
                          <ThumbsDown className="h-3 w-3 text-neutral-600"/>
                        </div>
                        Cons
                      </h3>
                      <ul className="space-y-2 text-xs">
                        {item.cons && item.cons.slice(0, 3).map((con, index) => (
                          <li key={index} className="flex items-start gap-2 text-slate-700">
                            <div className="w-1 h-1 bg-neutral-400 rounded-full mt-1.5 shrink-0"></div>
                            {con}
                          </li>
                        ))}
                        {(!item.cons || item.cons.length === 0) && <li className="text-slate-500 italic text-xs">No cons listed.</li>}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <Card className="border border-slate-200/60 shadow-lg rounded-2xl bg-white">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center text-slate-800">
                    <div className="p-2 bg-neutral-100 rounded-xl mr-3 shadow-sm">
                      <Tag className="h-4 w-4 text-neutral-600"/>
                    </div>
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-sm px-3 py-1 bg-neutral-50 border border-neutral-200 hover:border-neutral-300 transition-all duration-200 hover:shadow-sm text-slate-700">
                        {typeof tag === 'string' ? tag.trim() : tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Related Tools */}
            {relatedItems.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-slate-800 flex items-center">
                  <div className="w-1 h-8 bg-neutral-900 rounded-full mr-3"></div>
                  Related Tools
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedItems.map(relatedItem => (
                    <DirectoryItemCard key={relatedItem.id} item={relatedItem} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Structured Data for Tool Page */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: item.name,
              description: item.description,
              url: `${siteConfig.url}/${item.slug}`,
              applicationCategory: item.category,
              operatingSystem: "Web-based",
              offers: {
                "@type": "Offer",
                price: item.pricing || "Contact for pricing",
                priceCurrency: "USD",
                availability: "https://schema.org/InStock"
              },
              ...(item.foundedYear && {
                foundingDate: item.foundedYear.toString()
              }),
              ...(item.lastUpdated && {
                dateModified: item.lastUpdated
              }),
              ...(item.website && {
                url: item.website
              }),
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
                  ...categories.map((cat, index) => ({
                    "@type": "ListItem",
                    position: 3 + index,
                    name: cat,
                    item: `${siteConfig.url}/categories/${cat.toLowerCase().replace(/\s+/g, '-')}`
                  }))
                ]
              }
            })
          }}
        />
      </div>
    </>
  );
}