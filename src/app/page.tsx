import type { Category } from "@/types";
import { Hero } from "@/components/landing/Hero";
import { DirectorySearch, type DirectorySearchCategory } from "@/components/listing/DirectorySearch";
import { DirectoryGrid } from "@/components/listing/DirectoryGrid";
import { CategoryCard } from "@/components/category/CategoryCard";
import { IntersectionLoader } from "@/components/performance/intersection-loader";
import { getDirectoryItems, getCategories } from "@/lib/supabase";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { FeaturedOn } from '@/components/sections/FeaturedOn';

// Create a client component wrapper for FAQ
const FAQSection = dynamic(
  () => import('@/components/sections/FAQ').then(mod => ({ default: mod.FAQ })),
  { 
    loading: () => <div className="h-64 flex items-center justify-center">Loading FAQ...</div>
  }
);

// Enhanced SEO metadata for homepage
export const metadata: Metadata = {
  title: `Best AI Real Estate Tools 2026 | AI CRE Tools Directory`,
  description: `Discover and compare the best AI real estate tools for commercial property. Software for investors, brokers, asset managers, and operators — one focused directory.`,
  keywords: [
    ...siteConfig.seo.primaryKeywords,
    ...siteConfig.seo.secondaryKeywords,
    'directory',
    'comparison',
    'reviews',
    'ratings'
  ],
  
  openGraph: {
    title: `Best AI Real Estate Tools 2026 | AI CRE Tools`,
    description: `Find and compare the best AI real estate tools for commercial property. Detailed comparisons to help you choose the right software for your team.`,
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
    title: `Best AI Real Estate Tools 2026 | AI CRE Tools`,
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

export const revalidate = 3600;

interface HomeProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams;
  const { search, category } = resolvedSearchParams;
  const searchTerm = search || "";
  const categoryFilter = category || "";

  try {
    // Items fetched first so the module-level cache is warm when getCategories runs
    const initialItems = await getDirectoryItems(searchTerm, categoryFilter);
    let categoriesFromSheet: Category[];
    try {
      categoriesFromSheet = await getCategories(true);
    } catch {
      categoriesFromSheet = await getCategories(false);
    }

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
            logo: `${siteConfig.url}/ai-cre-tools-logo.jpg`,
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

      <Hero
        totalItems={initialItems.length}
        totalCategories={categoriesFromSheet.length}
      />

      <section id="directory" className="border-b border-stone-200 py-16 md:py-20">
        <div className="container px-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-950">
                All tools
              </h2>
              <p className="mt-0.5 text-sm text-stone-400">{initialItems.length} AI tools</p>
            </div>
          </div>

          <DirectorySearch
            categories={searchCategories}
            initialSearchTerm={searchTerm}
            initialCategoryFilter={categoryFilter}
            totalItems={initialItems.length}
          />
          <DirectoryGrid items={initialItems} />
        </div>
      </section>

      <section className="bg-stone-50/60 py-16 md:py-20">
        <div className="container px-6">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-950">Browse by category</h2>
              <p className="mt-0.5 text-sm text-stone-400">Organized by CRE workflow, not generic SaaS labels.</p>
            </div>
            <Link
              href="/categories"
              className="inline-flex w-fit items-center gap-1.5 rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50"
            >
              View all categories
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <IntersectionLoader className="min-h-[200px]">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {categoriesFromSheet.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </IntersectionLoader>
        </div>
      </section>

      {/* Featured On Section */}
      <FeaturedOn />

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
  } catch {
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

        <Hero totalItems={0} totalCategories={0} />

        <section id="directory" className="py-16 md:py-20">
          <div className="container px-6">
            <div className="rounded-xl border border-stone-200 bg-white p-10 text-center">
              <h2 className="text-2xl font-bold text-gray-950">
                {siteConfig.categoryName} directory update in progress
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-base text-stone-500">
                We're currently updating our directory. Please check back soon for the latest {siteConfig.categoryName.toLowerCase()}.
              </p>
              <Link
                href="/categories"
                className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
              >
                Explore Categories <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-stone-50/60 py-16 md:py-20">
          <div className="container px-6">
            <div className="rounded-xl border border-stone-200 bg-white p-10 text-center">
              <h2 className="text-2xl font-bold text-gray-950">
                Browse by Category
              </h2>
              <p className="mt-3 text-base text-stone-500">
                Our directory is organized by specific use cases in commercial real estate.
              </p>
              <Link
                href="/categories"
                className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-5 py-2 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50"
              >
                View All Categories <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Featured On Section */}
        <FeaturedOn />

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
