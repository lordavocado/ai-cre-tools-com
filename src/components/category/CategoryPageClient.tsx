"use client";

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DirectoryGrid } from '@/components/listing/DirectoryGrid';
import type { DirectoryItem, Category } from '@/types';
import type { SeoCluster } from '@/config/seo-clusters';
import { getPersonaShortLabel } from '@/config/seo-personas';
import { siteConfig } from '@/config/site';
import { CATEGORY_ICONS } from '@/lib/category-icons';
import { getToolPath } from '@/lib/tool-routes';
import { buildDirectoryPageUrl } from '@/lib/directory-pagination';
import {
  CheckCircle, Zap, Users, Shield, ArrowRight,
  ChevronRight, Sparkles,
} from 'lucide-react';

const FAQ_ICONS = [CheckCircle, Zap, Users, Shield] as const;

interface CategoryPageClientProps {
  category: Category;
  categories: Category[];
  itemsInCategory: DirectoryItem[];
  itemsLoadError: boolean;
  slug: string;
  currentPage?: number;
  seoCluster: SeoCluster;
  featuredTools: DirectoryItem[];
  relatedTags: { slug: string; label: string }[];
}

export function CategoryPageClient({
  category,
  categories,
  itemsInCategory,
  itemsLoadError,
  slug,
  currentPage = 1,
  seoCluster,
  featuredTools,
  relatedTags,
}: CategoryPageClientProps) {
  const relatedCategories = seoCluster.relatedCategorySlugs
    .map((relSlug) => categories.find((cat) => cat.slug === relSlug))
    .filter((cat): cat is Category => cat !== undefined);
  const pageUrl = `${siteConfig.url}${buildDirectoryPageUrl(`/categories/${slug}`, currentPage)}`;

  const IconComponent = category.icon
    ? CATEGORY_ICONS[category.icon as keyof typeof CATEGORY_ICONS]
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: seoCluster.h1,
            description: seoCluster.intro,
            url: pageUrl,
            isPartOf: {
              "@type": "WebSite",
              name: siteConfig.name,
              url: siteConfig.url,
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
                { "@type": "ListItem", position: 2, name: "Categories", item: `${siteConfig.url}/categories` },
                { "@type": "ListItem", position: 3, name: category.name, item: pageUrl },
              ],
            },
            mainEntity: {
              "@type": "ItemList",
              name: `${category.name} Tools Directory`,
              description: `Directory of ${category.name} AI tools for commercial real estate`,
              numberOfItems: itemsInCategory.length,
              itemListElement: itemsInCategory.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: item.name,
                url: `${siteConfig.url}${getToolPath(item.slug)}`,
              })),
            },
          }),
        }}
      />

      <section className="border-b border-[#e0e0e0] bg-white py-12 md:py-16">
        <div className="container px-6">
          <nav className="mb-8 flex items-center gap-1.5 text-sm text-[#737373]">
            <Link href="/" className="transition-colors hover:text-[#1f1f1f]">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/categories" className="transition-colors hover:text-[#1f1f1f]">Categories</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-[#1f1f1f]">{category.name}</span>
          </nav>

          <div className="mx-auto max-w-2xl text-center">
            {IconComponent && (
              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0f9f0] text-[#629649]">
                <IconComponent className="h-6 w-6" />
              </div>
            )}

            <h1 className="text-3xl font-bold tracking-tight text-[#1f1f1f] sm:text-4xl">
              {seoCluster.h1}
            </h1>

            <p className="mt-4 text-base leading-7 text-[#737373]">
              {seoCluster.intro}
            </p>
            <p className="mt-3 text-sm text-[#737373]">
              We index{' '}
              <strong className="font-semibold text-[#1f1f1f]">{itemsInCategory.length}</strong>{' '}
              {itemsInCategory.length === 1 ? 'tool' : 'tools'} in this category.
            </p>

            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-[#737373]">
              <span>
                <strong className="font-semibold text-[#1f1f1f]">{itemsInCategory.length}</strong>{' '}
                {itemsInCategory.length === 1 ? 'tool' : 'tools'} indexed
              </span>
              {featuredTools.length > 0 && (
                <>
                  <span className="h-4 w-px bg-[#e0e0e0]" />
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-[#629649]" />
                    <strong className="font-semibold text-[#1f1f1f]">{featuredTools.length}</strong> featured
                  </span>
                </>
              )}
              <span className="h-4 w-px bg-[#e0e0e0]" />
              <span>Updated weekly</span>
            </div>

            {featuredTools.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs font-medium text-[#737373]">Featured:</span>
                {featuredTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={getToolPath(tool.slug)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#e0e0e0] bg-white px-3 py-1 text-sm text-[#1f1f1f] transition hover:border-[rgba(98,150,73,0.4)] hover:bg-[#fafafa]"
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            )}

            {seoCluster.personaSlugs.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs font-medium text-[#737373]">Built for:</span>
                {seoCluster.personaSlugs.map((personaSlug) => (
                  <Link
                    key={personaSlug}
                    href={`/for/${personaSlug}`}
                    className="inline-flex items-center rounded-full border border-[#e0e0e0] bg-[#fafafa] px-3 py-1 text-xs font-medium text-[#1f1f1f] transition hover:border-[rgba(98,150,73,0.4)] hover:bg-white"
                  >
                    {getPersonaShortLabel(personaSlug)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="tools-section" className="border-b border-[#e0e0e0] py-14 md:py-20">
        <div className="container px-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#1f1f1f]">
                All {category.name} tools
              </h2>
              <p className="mt-0.5 text-sm text-[#737373]">
                {itemsInCategory.length > 0
                  ? `${itemsInCategory.length} solutions`
                  : `Discover ${category.name.toLowerCase()} solutions`}
              </p>
            </div>
          </div>

          {itemsInCategory.length > 0 ? (
            <DirectoryGrid
              items={itemsInCategory}
              currentPage={currentPage}
              basePath={`/categories/${slug}`}
            />
          ) : (
            <div className="rounded-xl border border-[#e0e0e0] bg-white p-10 text-center">
              {itemsLoadError ? (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-[#1f1f1f]">Tools loading issue</h3>
                  <p className="mx-auto max-w-md text-[#737373] text-sm">
                    We&apos;re temporarily unable to load the tools for this category. Please try again later.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-[#1f1f1f]">No tools available yet</h3>
                  <p className="mx-auto max-w-md text-[#737373] text-sm">
                    We&apos;re constantly adding new {category.name.toLowerCase()} tools. Check back soon or explore related categories.
                  </p>
                </div>
              )}
              <Link
                href="/categories"
                className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-[#1f1f1f] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#333333]"
              >
                Browse all categories
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {relatedTags.length > 0 && (
        <section className="border-b border-[#e0e0e0] py-12 md:py-16">
          <div className="container px-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#737373]">
              Browse by capability
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {relatedTags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/tags/${tag.slug}`}
                  className="rounded-full border border-[#e0e0e0] bg-white px-4 py-1.5 text-sm font-medium text-[#1f1f1f] transition-colors hover:border-[rgba(98,150,73,0.4)] hover:text-[#629649]"
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {category.longDescription && (
        <section className="border-b border-[#e0e0e0] bg-[#fafafa] py-16 md:py-24">
          <div className="container px-6">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-semibold tracking-tight text-[#1f1f1f]">
                About {category.name} tools
              </h2>
              <div
                className="prose prose-neutral mt-6 max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-7 prose-a:text-[#629649] prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: category.longDescription }}
              />
            </div>
          </div>
        </section>
      )}

      <section className="border-b border-[#e0e0e0] py-16 md:py-24">
        <div className="container px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-[#1f1f1f]">
              Frequently asked questions
            </h2>
            <p className="mt-2 text-sm text-[#737373]">
              Common questions about {seoCluster.primaryKeyword}
            </p>

            <div className="mt-10 divide-y divide-[#e0e0e0]">
              {seoCluster.faqs.map((faq, i) => {
                const Icon = FAQ_ICONS[i % FAQ_ICONS.length];
                return (
                  <div key={faq.question} className="py-6 first:pt-0 last:pb-0">
                    <h3 className="flex items-center gap-2.5 text-base font-semibold text-[#1f1f1f]">
                      <Icon className="h-5 w-5 text-[#629649]" />
                      {faq.question}
                    </h3>
                    <p className="mt-3 pl-[30px] text-sm leading-7 text-[#737373]">
                      {faq.answer}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {relatedCategories.length > 0 && (
        <section className="bg-[#fafafa] py-16 md:py-24">
          <div className="container px-6">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-[#1f1f1f]">
                  Related categories
                </h2>
                <p className="mt-1 text-sm text-[#737373]">
                  Tools that complement your {category.name.toLowerCase()} workflow
                </p>
              </div>
              <Button asChild variant="outline" className="w-fit rounded-lg border-[#e0e0e0] bg-white">
                <Link href="/categories">
                  View all categories
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {relatedCategories.map((relCat) => {
                const RelIcon = relCat.icon
                  ? CATEGORY_ICONS[relCat.icon as keyof typeof CATEGORY_ICONS]
                  : null;
                return (
                  <Link key={relCat.slug} href={`/categories/${relCat.slug}`} className="group block h-full">
                    <Card className="relative flex h-full overflow-hidden rounded-[8px] border-[1.25px] border-[#e0e0e0] bg-[#fafafa] transition-colors duration-200 hover:border-[rgba(98,150,73,0.4)]">
                      <CardContent className="flex h-full flex-col p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0f9f0] text-[#629649]">
                            {RelIcon ? <RelIcon className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
                          </div>
                          {relCat.itemCount !== undefined && (
                            <div className="rounded-full bg-[#fafafa] border border-[#e0e0e0] px-3 py-1 text-xs font-medium text-[#737373]">
                              {relCat.itemCount} tool{relCat.itemCount !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                        <div className="mt-6 space-y-3">
                          <h3 className="text-xl font-semibold leading-tight tracking-tight text-[#1f1f1f] transition-colors duration-200 group-hover:text-[#629649]">
                            {relCat.name}
                          </h3>
                          <p className="line-clamp-3 text-sm leading-6 text-[#737373]">
                            {relCat.description}
                          </p>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-8 text-sm font-semibold text-[#1f1f1f]">
                          <span>Explore category</span>
                          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
