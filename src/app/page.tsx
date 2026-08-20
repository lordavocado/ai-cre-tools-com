import type { Category } from "@/types";
import { Hero } from "@/components/landing/Hero";
import { type DirectorySearchCategory } from "@/components/listing/DirectorySearch";
import { HomeDirectory } from '@/components/listing/HomeDirectory';
import { getDirectoryListItems, getCategories } from "@/lib/supabase";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { FeaturedOn } from '@/components/sections/FeaturedOn';
import { FAQ } from '@/components/sections/FAQ';
import { getAllSeoPersonas } from '@/config/seo-personas';
import { getTopTagSlugs } from '@/config/seo-tags';
import { getToolPath } from '@/lib/tool-routes';

const HOME_TITLE = 'Best Commercial Real Estate AI Tools (2026) | AI CRE Tools';
const HOME_DESCRIPTION =
  'Discover and compare the best commercial real estate AI tools. Software for investors, brokers, asset managers, and operators — one focused CRE directory.';

export const metadata: Metadata = {
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
    alternates: { canonical: siteConfig.url },
    robots: { index: true, follow: true },
  };

export const revalidate = 3600;

export default async function Home() {
  try {
    // Items fetched first so the module-level cache is warm when getCategories runs
    const initialItems = await getDirectoryListItems();
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
                    url: `${siteConfig.url}${getToolPath(item.slug)}`,
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

      <section id="directory" className="border-b border-border bg-secondary py-16 md:py-20">
        <div className="container px-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Directory</p>
              <h2 className="mt-1 text-[28px] font-medium leading-[1.15] tracking-[-0.01em] text-foreground sm:text-[32px]">
                All tools
              </h2>
              <p className="mt-2 text-sm text-muted-foreground"><span className="tabular-nums">{initialItems.length}</span> AI tools, curated for CRE professionals.</p>
            </div>
            <Link
              href="/all-tools"
              className="inline-flex min-h-10 w-fit items-center gap-1.5 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-[background-color,border-color,transform] motion-safe:active:scale-[0.97] hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Browse A–Z index
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <Suspense
            fallback={
              <div className="py-12 text-center text-sm text-muted-foreground" role="status">
                Loading directory…
              </div>
            }
          >
            <HomeDirectory items={initialItems} categories={searchCategories} />
          </Suspense>
        </div>
      </section>

      <section className="border-b border-border py-16 md:py-20">
        <div className="container px-6">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Categories</p>
              <h2 className="mt-1 text-[28px] font-medium leading-[1.15] tracking-[-0.01em] text-foreground sm:text-[32px]">Browse by category</h2>
              <p className="mt-2 text-sm text-muted-foreground">Organized by CRE workflow, not generic SaaS labels.</p>
            </div>
            <Link
              href="/categories"
              className="inline-flex min-h-10 w-fit items-center gap-1.5 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-[background-color,border-color,transform] motion-safe:active:scale-[0.97] hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                className="group flex flex-col gap-3 rounded-lg border border-border bg-secondary p-4 transition-[background-color,border-color,box-shadow,transform] duration-150 motion-safe:active:scale-[0.99] hover:border-foreground/20 hover:bg-background hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-xs font-bold text-foreground">
                  {cat.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium leading-snug text-foreground">{cat.name}</p>
                  {cat.itemCount !== undefined && (
                    <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">{cat.itemCount} tools</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background py-16 md:py-20">
        <div className="container px-6">
          <div className="mx-auto max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Guide
            </p>
            <h2 className="mt-2 text-balance text-[28px] font-medium leading-[1.15] tracking-[-0.01em] text-foreground sm:text-[32px]">
              Commercial real estate AI software, compared
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                {siteConfig.name} is a focused directory of commercial real estate AI tools for US
                B2B teams — investors underwriting deals, developers managing construction,
                brokers running transactions, and operators running buildings. We organize software
                by CRE workflow, not generic SaaS categories, so you can compare platforms that
                match how your team actually works.
              </p>
              <p>
                Start with{' '}
                <Link href="/categories/property-analysis-valuation" className="font-medium text-foreground underline-offset-2 hover:underline">
                  commercial real estate investment analysis software
                </Link>
                ,{' '}
                <Link href="/tags/lease-abstraction" className="font-medium text-foreground underline-offset-2 hover:underline">
                  lease abstraction AI software
                </Link>
                ,{' '}
                <Link href="/categories/property-management-operations" className="font-medium text-foreground underline-offset-2 hover:underline">
                  property management AI software
                </Link>
                , or browse{' '}
                <Link href="/for/investors" className="font-medium text-foreground underline-offset-2 hover:underline">
                  AI tools for real estate investors
                </Link>
                {' '}and{' '}
                <Link href="/for/developers" className="font-medium text-foreground underline-offset-2 hover:underline">
                  AI tools for real estate developers
                </Link>
                . Use{' '}
                <Link href="/compare" className="font-medium text-foreground underline-offset-2 hover:underline">
                  side-by-side comparisons
                </Link>
                {' '}and the{' '}
                <Link href="/glossary" className="font-medium text-foreground underline-offset-2 hover:underline">
                  CRE glossary
                </Link>
                {' '}to evaluate vendors before you buy.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-secondary py-12 md:py-16">
        <div className="container px-6">
          <div className="mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">By capability</p>
            <h2 className="mt-1 text-xl font-medium text-foreground sm:text-2xl">Browse by workflow</h2>
            <p className="mt-2 text-sm text-muted-foreground">Long-tail CRE software topics matched to product features.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {getTopTagSlugs(6).map((tagSlug) => (
              <Link
                key={tagSlug}
                href={`/tags/${tagSlug}`}
                className="inline-flex min-h-10 items-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-[background-color,border-color,transform] motion-safe:active:scale-[0.97] hover:border-foreground/20 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {tagSlug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </Link>
            ))}
            <Link
              href="/tags"
              className="inline-flex min-h-10 items-center gap-1 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-[color,background-color,transform] motion-safe:active:scale-[0.97] hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              All capabilities
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-secondary py-12 md:py-16">
        <div className="container px-6">
          <div className="mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">By role</p>
            <h2 className="mt-1 text-xl font-medium text-foreground sm:text-2xl">Tools for your team</h2>
            <p className="mt-2 text-sm text-muted-foreground">Curated directories for common CRE roles.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {getAllSeoPersonas().map((persona) => (
              <Link
                key={persona.slug}
                href={`/for/${persona.slug}`}
                className="inline-flex min-h-10 items-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-[background-color,border-color,transform] motion-safe:active:scale-[0.97] hover:border-foreground/20 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {persona.shortLabel}
              </Link>
            ))}
            <Link
              href="/for"
              className="inline-flex min-h-10 items-center gap-1 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-[color,background-color,transform] motion-safe:active:scale-[0.97] hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              All roles
              <ArrowRight className="h-3.5 w-3.5" />
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
            <div className="rounded-xl border border-border bg-background p-10 text-center">
              <h2 className="text-2xl font-bold text-foreground">
                {siteConfig.categoryName} directory update in progress
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-pretty text-base text-muted-foreground">
                We're currently updating our directory. Please check back soon for the latest {siteConfig.categoryName.toLowerCase()}.
              </p>
              <Link
                href="/categories"
                className="mt-6 inline-flex min-h-10 items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-[background-color,transform] motion-safe:active:scale-[0.97] hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Explore categories <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-secondary py-16 md:py-20">
          <div className="container px-6">
            <div className="rounded-xl border border-border bg-background p-10 text-center">
              <h2 className="text-2xl font-bold text-foreground">
                Browse by category
              </h2>
              <p className="mt-3 text-base text-muted-foreground">
                Our directory is organized by specific use cases in commercial real estate.
              </p>
              <Link
                href="/categories"
                className="mt-6 inline-flex min-h-10 items-center gap-1.5 rounded-full border border-border bg-background px-5 py-2 text-sm font-medium text-foreground transition-[background-color,border-color,transform] motion-safe:active:scale-[0.97] hover:border-foreground/20 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                View all categories <ArrowRight className="h-3.5 w-3.5" />
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
