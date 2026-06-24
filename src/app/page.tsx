import type { Category } from "@/types";
import { Hero } from "@/components/landing/Hero";
import { DirectorySearch, type DirectorySearchCategory } from "@/components/listing/DirectorySearch";
import { DirectoryGrid } from "@/components/listing/DirectoryGrid";
import { getDirectoryItems, getCategories } from "@/lib/supabase";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { Metadata } from 'next';
import { FeaturedOn } from '@/components/sections/FeaturedOn';
import { FAQ } from '@/components/sections/FAQ';
import { parseDirectoryPage } from '@/lib/directory-pagination';
import { getAllSeoPersonas } from '@/config/seo-personas';
import { getTopTagSlugs } from '@/config/seo-tags';
import { buildPaginatedMetadata } from '@/lib/seo-pages';

const HOME_TITLE = 'Best Commercial Real Estate AI Tools (2026) | AI CRE Tools';
const HOME_DESCRIPTION =
  'Discover and compare the best commercial real estate AI tools. Software for investors, brokers, asset managers, and operators — one focused CRE directory.';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; page?: string }>;
}): Promise<Metadata> {
  const resolved = await searchParams;
  const hasFilters = Boolean(resolved.search?.trim() || resolved.category?.trim());
  const pagination = buildPaginatedMetadata({
    basePath: '/',
    page: resolved.page,
    hasFilters,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  });

  return {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    keywords: [
      ...siteConfig.seo.primaryKeywords,
      ...siteConfig.seo.secondaryKeywords,
      'directory',
      'comparison',
      'reviews',
    ],
    openGraph: {
      title: HOME_TITLE,
      description:
        'Find and compare the best commercial real estate AI tools. Detailed comparisons for investors, brokers, and asset managers.',
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
      title: HOME_TITLE,
      description:
        'Find and compare the best commercial real estate AI tools for investors, brokers, and operators.',
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
    alternates: pagination.alternates,
    robots: pagination.robots,
  };
}

export const revalidate = 3600;

interface HomeProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams;
  const { search, category, page } = resolvedSearchParams;
  const searchTerm = search || "";
  const categoryFilter = category || "";
  const currentPage = parseDirectoryPage(page);
  const directoryQuery = {
    search: searchTerm || undefined,
    category: categoryFilter || undefined,
  };

  try {
    // Items fetched first so the module-level cache is warm when getCategories runs
    const initialItems = await getDirectoryItems(searchTerm, categoryFilter);
    let categoriesFromSheet: Category[];
    try {
      categoriesFromSheet = await getCategories(true);
    } catch {
      categoriesFromSheet = await getCategories(false);
    }

    // All categories for the search filter
    const searchCategories: DirectorySearchCategory[] = categoriesFromSheet.map(
      ({ id, slug, name, icon }) => ({ id, slug, name, icon })
    );

    // Curated subset of 6 for the hero chip row (most recognisable CRE workflows)
    const HERO_CATEGORY_SLUGS = [
      'property-analysis-valuation',
      'property-management-operations',
      'transactions-brokerage',
      'marketing-leasing-enablement',
      'asset-portfolio-management',
      'legal-compliance-due-diligence',
    ];
    const heroCategories = categoriesFromSheet
      .filter((c) => HERO_CATEGORY_SLUGS.includes(c.slug))
      .sort((a, b) => HERO_CATEGORY_SLUGS.indexOf(a.slug) - HERO_CATEGORY_SLUGS.indexOf(b.slug));

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
        categories={heroCategories}
      />

      <section id="directory" className="border-b border-[#e0e0e0] bg-[#fafafa] py-16 md:py-20">
        <div className="container px-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#999999]">Directory</p>
              <h2 className="mt-1 text-[28px] font-medium leading-[1.15] tracking-[-0.01em] text-[#1f1f1f] sm:text-[32px]">
                All tools
              </h2>
              <p className="mt-2 text-sm text-[#737373]">{initialItems.length} AI tools, curated for CRE professionals.</p>
            </div>
            <Link
              href="/all-tools"
              className="inline-flex w-fit items-center gap-1.5 rounded-[6px] border border-[#e0e0e0] bg-white px-4 py-2 text-sm font-medium text-[#1f1f1f] transition-colors hover:bg-[#fafafa]"
            >
              Browse A–Z index
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <DirectorySearch
            categories={searchCategories}
            initialSearchTerm={searchTerm}
            initialCategoryFilter={categoryFilter}
            totalItems={initialItems.length}
          />
          <DirectoryGrid
            items={initialItems}
            currentPage={currentPage}
            basePath="/"
            query={directoryQuery}
          />
        </div>
      </section>

      <section className="border-b border-[#e0e0e0] py-16 md:py-20">
        <div className="container px-6">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#999999]">Categories</p>
              <h2 className="mt-1 text-[28px] font-medium leading-[1.15] tracking-[-0.01em] text-[#1f1f1f] sm:text-[32px]">Browse by category</h2>
              <p className="mt-2 text-sm text-[#737373]">Organized by CRE workflow, not generic SaaS labels.</p>
            </div>
            <Link
              href="/categories"
              className="inline-flex w-fit items-center gap-1.5 rounded-[6px] border border-[#e0e0e0] bg-white px-4 py-2 text-sm font-medium text-[#1f1f1f] transition-colors hover:bg-[#fafafa]"
            >
              View all categories
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {categoriesFromSheet.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group flex flex-col gap-3 rounded-[8px] border border-[#e0e0e0] bg-[#fafafa] p-4 transition-colors duration-100 hover:border-[#c8c8c8] hover:bg-white"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-white border border-[#e0e0e0] text-xs font-bold text-[#1f1f1f]">
                  {cat.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1f1f1f] leading-snug">{cat.name}</p>
                  {cat.itemCount !== undefined && (
                    <p className="mt-0.5 text-xs text-[#737373]">{cat.itemCount} tools</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#e0e0e0] bg-[#fafafa] py-12 md:py-16">
        <div className="container px-6">
          <div className="mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#999999]">By capability</p>
            <h2 className="mt-1 text-xl font-medium text-[#1f1f1f] sm:text-2xl">Browse by workflow</h2>
            <p className="mt-2 text-sm text-[#737373]">Long-tail CRE software topics matched to product features.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {getTopTagSlugs(6).map((tagSlug) => (
              <Link
                key={tagSlug}
                href={`/tags/${tagSlug}`}
                className="inline-flex items-center rounded-full border border-[#e0e0e0] bg-white px-4 py-2 text-sm font-medium text-[#1f1f1f] transition-colors hover:border-[#c8c8c8] hover:bg-[#fafafa]"
              >
                {tagSlug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </Link>
            ))}
            <Link
              href="/tags"
              className="inline-flex items-center gap-1 rounded-full border border-[#e0e0e0] bg-white px-4 py-2 text-sm font-medium text-[#737373] hover:text-[#1f1f1f]"
            >
              All capabilities
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e0e0e0] bg-[#fafafa] py-12 md:py-16">
        <div className="container px-6">
          <div className="mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#999999]">By role</p>
            <h2 className="mt-1 text-xl font-medium text-[#1f1f1f] sm:text-2xl">Tools for your team</h2>
            <p className="mt-2 text-sm text-[#737373]">Curated directories for common CRE roles.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {getAllSeoPersonas().map((persona) => (
              <Link
                key={persona.slug}
                href={`/for/${persona.slug}`}
                className="inline-flex items-center rounded-full border border-[#e0e0e0] bg-white px-4 py-2 text-sm font-medium text-[#1f1f1f] transition-colors hover:border-[#c8c8c8] hover:bg-[#fafafa]"
              >
                {persona.shortLabel}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured On Section */}
      <FeaturedOn />

        {/* FAQ Section */}
        <FAQ />

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

        <Hero totalItems={0} />

        <section id="directory" className="py-16 md:py-20">
          <div className="container px-6">
            <div className="rounded-xl border border-[#e0e0e0] bg-white p-10 text-center">
              <h2 className="text-2xl font-bold text-[#1f1f1f]">
                {siteConfig.categoryName} directory update in progress
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-base text-[#737373]">
                We're currently updating our directory. Please check back soon for the latest {siteConfig.categoryName.toLowerCase()}.
              </p>
              <Link
                href="/categories"
                className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-[#629649] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#4a7238]"
              >
                Explore Categories <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-[#fafafa] py-16 md:py-20">
          <div className="container px-6">
            <div className="rounded-xl border border-[#e0e0e0] bg-white p-10 text-center">
              <h2 className="text-2xl font-bold text-[#1f1f1f]">
                Browse by Category
              </h2>
              <p className="mt-3 text-base text-[#737373]">
                Our directory is organized by specific use cases in commercial real estate.
              </p>
              <Link
                href="/categories"
                className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-[#e0e0e0] bg-white px-5 py-2 text-sm font-medium text-[#1f1f1f] transition-colors hover:bg-[#fafafa] hover:border-[#c8c8c8]"
              >
                View All Categories <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Featured On Section */}
        <FeaturedOn />

        {/* FAQ Section */}
        <FAQ />
      </>
    );
  }
}
