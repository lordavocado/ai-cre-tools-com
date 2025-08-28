import type { Category } from "@/types";
import { Hero } from "@/components/landing/Hero";
import { DirectorySearch, type DirectorySearchCategory } from "@/components/listing/DirectorySearch";
import { DirectoryGrid } from "@/components/listing/DirectoryGrid";
import { CategoryCard } from "@/components/category/CategoryCard";
import { IntersectionLoader } from "@/components/performance/intersection-loader";
import { getDirectoryItems, getCategories, getFeaturedItems } from "@/lib/sheets";
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
  searchParams: Promise<{
    search?: string;
    category?: string;
    country?: string;
    city?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams;
  const { search, category, country, city } = resolvedSearchParams;
  const searchTerm = search || "";
  const categoryFilter = category || "";
  const countryFilter = country || "";
  const cityFilter = city || "";

  try {
    const initialItems = await getDirectoryItems(searchTerm, categoryFilter, countryFilter, cityFilter);
    const categoriesFromSheet: Category[] = await getCategories(); 
    const topCategories = categoriesFromSheet.slice(0, 4);

    const searchCategories: DirectorySearchCategory[] = categoriesFromSheet.map(
      ({ id, slug, name, icon }) => ({ id, slug, name, icon })
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

      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: siteConfig.url
              }
            ]
          })
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
            logo: `${siteConfig.url}/ai-cre-tools-logo.png`,
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
          initialCountryFilter={countryFilter}
          initialCityFilter={cityFilter}
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
                  name: "What are CRE AI tools?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "CRE AI tools are software platforms that leverage artificial intelligence to enhance decision-making and automate processes within the Commercial Real Estate sector. They provide insights into market trends, property valuation, investment analysis, and operational efficiency. These tools are essential for maintaining a competitive edge in today's market."
                  }
                },
                {
                  "@type": "Question",
                  name: "Which CRE AI tool is best for beginners?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "For those new to CRE AI, starting with a tool that has a user-friendly interface and strong customer support is key. Many platforms offer free trials or demos, which are a great way to explore the features and find the best fit for your business needs without a significant initial investment."
                  }
                },
                {
                  "@type": "Question",
                  name: "What's the difference between traditional CRE software and AI-powered tools?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Traditional CRE software typically offers data storage and management functionalities. AI-powered tools go a step further by providing predictive analytics, automated workflows, and data-driven insights that help you forecast market changes, identify investment opportunities, and optimize your portfolio performance."
                  }
                },
                {
                  "@type": "Question",
                  name: "Do I need a data scientist to use CRE AI tools?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "No, most modern CRE AI tools are designed to be user-friendly and do not require a background in data science. They often feature intuitive dashboards and automated reporting, making it easy for real estate professionals to access and understand the insights generated by the AI."
                  }
                },
                {
                  "@type": "Question",
                  name: "How much do CRE AI tools typically cost?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "The cost of CRE AI tools can vary widely, from affordable monthly subscriptions for specific features to comprehensive enterprise-level packages. Pricing is often based on the number of users, the volume of data processed, or the specific functionalities included."
                  }
                },
                {
                  "@type": "Question",
                  name: "What metrics are most important when evaluating CRE AI tools?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "When evaluating CRE AI tools, focus on metrics that align with your business goals. Key areas to consider include the accuracy of predictive models, the level of automation provided, the ease of integration with your existing systems, and the quality of customer support."
                  }
                },
                {
                  "@type": "Question",
                  name: "Can I integrate multiple CRE AI tools?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, it is often beneficial to use a combination of CRE AI tools to cover different aspects of your business, such as property management, investment analysis, and marketing. Look for tools with robust API capabilities to ensure seamless data flow between platforms."
                  }
                },
                {
                  "@type": "Question",
                  name: "How do I ensure data security with CRE AI tools?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Data security is a top priority for CRE AI tool providers. They typically employ advanced encryption, regular security audits, and comply with industry standards to protect your sensitive information. Always review a tool's security and compliance documentation before making a commitment."
                  }
                }
              ]
            })
          }}
        />
      </>
    );
  } catch (error) {
    // Fallback when data fetching fails
    console.error('Error loading homepage data:', error);
    
    // Provide empty data as fallbacks
    const initialItems: any[] = [];
    const categoriesFromSheet: Category[] = [];
    const topCategories: Category[] = [];
    const searchCategories: DirectorySearchCategory[] = [];
    
    return (
      <>
        {/* Basic Structured Data for error case */}
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
            }),
          }}
        />

        <Hero />

        <section id="directory" className="py-16 md:py-24">
          <div className="container pl-6">
            <div className="text-center py-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {siteConfig.categoryName} Directory
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                We're currently updating our directory. Please check back soon for the latest {siteConfig.categoryName.toLowerCase()}.
              </p>
              <Button asChild>
                <Link href="/categories">
                  Explore Categories <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container pl-6">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Browse by Category
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our directory is organized by specific use cases in commercial real estate.
              </p>
              <Button asChild variant="outline">
                <Link href="/categories">
                  View All Categories <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
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
}
