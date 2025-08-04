import type { Category } from "@/types";
import { Hero } from "@/components/landing/Hero";
import { DirectorySearch, type DirectorySearchCategory } from "@/components/listing/DirectorySearch";
import { DirectoryGrid } from "@/components/listing/DirectoryGrid";
import { CategoryCard } from "@/components/category/CategoryCard";
import { GuideCard } from "@/components/guide/GuideCard";
import { IntersectionLoader } from "@/components/performance/intersection-loader";
import { getDirectoryItems, getCategories, getFeaturedItems } from "@/lib/sheets";
import { getGuides, getRecentGuides } from "@/lib/markdown";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Create a client component wrapper for FAQ
const FAQSection = dynamic(
  () => import('@/components/sections/FAQ').then(mod => ({ default: mod.FAQ })),
  { 
    loading: () => <div className="h-64 flex items-center justify-center">Loading FAQ...</div>
  }
);

// Enhanced SEO metadata for homepage
export const metadata: Metadata = {
  title: `${siteConfig.name} - Find & Compare the Best ${siteConfig.categoryName}`,
  description: `Discover and compare the best ${siteConfig.categoryName.toLowerCase()} for your commercial real estate business. Detailed information and comparisons to help you choose the perfect AI solution.`,
  keywords: [
    ...siteConfig.seo.primaryKeywords,
    ...siteConfig.seo.secondaryKeywords,
    'directory',
    'comparison',
    'reviews',
    'ratings'
  ],
  
  openGraph: {
    title: `${siteConfig.name} - The Ultimate ${siteConfig.categoryName} Directory`,
    description: `Find and compare the best ${siteConfig.categoryName.toLowerCase()}. Detailed information and comparisons to help you choose the perfect AI solution for commercial real estate.`,
    url: siteConfig.url,
    siteName: siteConfig.seo.openGraph.siteName,
    images: [
      {
        url: siteConfig.seo.openGraph.images.default,
        width: siteConfig.seo.openGraph.images.width,
        height: siteConfig.seo.openGraph.images.height,
        alt: siteConfig.seo.openGraph.images.alt,
      },
    ],
    locale: siteConfig.seo.openGraph.locale,
    type: 'website',
  },
  
  twitter: {
    card: siteConfig.seo.twitter.card,
    title: `${siteConfig.name} - The Ultimate ${siteConfig.categoryName} Directory`,
    description: `Find and compare the best ${siteConfig.categoryName.toLowerCase()}. Detailed information and comparisons to help you choose the perfect AI solution for commercial real estate.`,
    site: siteConfig.seo.twitter.site,
    creator: siteConfig.seo.twitter.creator,
    images: [
      {
        url: siteConfig.seo.twitter.images.default,
        width: siteConfig.seo.twitter.images.width,
        height: siteConfig.seo.twitter.images.height,
        alt: siteConfig.seo.twitter.images.alt,
      },
    ],
  },
  
  alternates: {
    canonical: siteConfig.url,
  },
  
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
};

// Revalidate every hour
export const revalidate = 3600; 

interface HomeProps {
  searchParams: {
    search?: string;
    category?: string;
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const { search, category } = await searchParams;
  const searchTerm = search || "";
  const categoryFilter = category || "";

  const initialItems = await getDirectoryItems(searchTerm, categoryFilter);
  const categoriesFromSheet: Category[] = await getCategories(); 
  const topCategories = categoriesFromSheet.slice(0, 4);

  const searchCategories: DirectorySearchCategory[] = categoriesFromSheet.map(
    ({ id, slug, name }) => ({ id, slug, name })
  );

  return (
    <>
      {/* Enhanced Structured Data for Homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteConfig.name,
            url: siteConfig.url,
            description: siteConfig.description,
            inLanguage: "en-US",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${siteConfig.url}/?search={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
            mainEntity: {
              "@type": "ItemList",
              name: `${siteConfig.categoryName} Directory`,
              description: `Comprehensive directory of ${siteConfig.categoryName.toLowerCase()}`,
              numberOfItems: initialItems.length,
              itemListElement: initialItems.slice(0, 20).map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "SoftwareApplication",
                  name: item.name,
                  description: item.tagline,
                  url: `${siteConfig.url}/${item.slug}`,
                  applicationCategory: "BusinessApplication",
                  operatingSystem: "Web-based",
                },
              })),
            },
          }),
        }}
      />

      {/* Business/Organization Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
            logo: `${siteConfig.url}/logo.png`,
            description: siteConfig.description,
            sameAs: Object.values(siteConfig.social).map(handle => 
              handle.includes('@') ? `https://twitter.com/${handle}` : 
              handle.includes('company/') ? `https://linkedin.com/${handle}` :
              `https://github.com/${handle}`
            ),
            knowsAbout: [
              "Commercial Real Estate",
              "AI Tools",
              "PropTech",
              "Real Estate Analytics",
              "Property Management Software",
              "Investment Analysis"
            ],
          }),
        }}
      />

      <Hero />

      <section id="directory" className="py-16 md:py-24">
        <div className="container pl-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Discover Top {siteConfig.categoryName}
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Explore our curated directory of {siteConfig.categoryName.toLowerCase()}. Use the filters below to find exactly what you need.
          </p>
          <DirectorySearch 
            categories={searchCategories} 
            initialSearchTerm={searchTerm}
            initialCategoryFilter={categoryFilter}
            totalItems={initialItems.length}
          />
          <DirectoryGrid items={initialItems} />
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container pl-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Browse {siteConfig.categoryName} by Category
              </h2>
              <p className="text-lg text-muted-foreground mb-4 md:mb-0">
                Find {siteConfig.categoryName.toLowerCase()} tailored to specific needs across various categories.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/categories">
                View All Categories <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <IntersectionLoader className="min-h-[200px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </IntersectionLoader>
        </div>
      </section>

              {/* FAQ Section */}
        <Suspense fallback={<div>Loading...</div>}>
          <IntersectionLoader>
            <FAQSection />
          </IntersectionLoader>
        </Suspense>
    </>
  );
}
