"use client";

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DirectoryGrid } from '@/components/listing/DirectoryGrid';
import type { DirectoryItem } from '@/types';
import { siteConfig } from '@/config/site';
import { CATEGORY_ICONS } from '@/lib/category-icons';
import {
  CheckCircle, Zap, Users, Shield, ArrowRight, Star,
  ChevronRight, Workflow, BarChart3, Target,
} from 'lucide-react';

interface CategoryPageClientProps {
  category: any;
  categories: any[];
  itemsInCategory: DirectoryItem[];
  itemsLoadError: boolean;
  slug: string;
}

export function CategoryPageClient({
  category,
  categories,
  itemsInCategory,
  itemsLoadError,
  slug,
}: CategoryPageClientProps) {
  const topTools = itemsInCategory
    .filter(item => item.rating && item.rating >= 4.0)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3);

  const relatedCategories = categories
    .filter(cat => cat.slug !== slug)
    .slice(0, 4);

  const IconComponent = category.icon
    ? CATEGORY_ICONS[category.icon as keyof typeof CATEGORY_ICONS]
    : null;

  return (
    <>
      {/* Structured Data */}
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
                { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
                { "@type": "ListItem", position: 2, name: "Categories", item: `${siteConfig.url}/categories` },
                { "@type": "ListItem", position: 3, name: category.name, item: `${siteConfig.url}/categories/${slug}` },
              ],
            },
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
              })),
            },
          }),
        }}
      />

      {/* Hero */}
      <section className="border-b border-gray-200 bg-white py-12 md:py-16">
        <div className="container px-6">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-1.5 text-sm text-gray-400">
            <Link href="/" className="transition-colors hover:text-gray-700">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/categories" className="transition-colors hover:text-gray-700">Categories</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-gray-700">{category.name}</span>
          </nav>

          <div className="mx-auto max-w-2xl text-center">
            {/* Category icon */}
            {IconComponent && (
              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                <IconComponent className="h-6 w-6" />
              </div>
            )}

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {category.name}
            </h1>

            <p className="mt-4 text-base leading-7 text-gray-500">
              {category.description || `Discover the best ${category.name} tools and software solutions for your Commercial Real Estate AI needs.`}
            </p>

            {/* Stats row */}
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500">
              <span>
                <strong className="font-semibold text-slate-900">{itemsInCategory.length}</strong>{' '}
                {itemsInCategory.length === 1 ? 'tool' : 'tools'} indexed
              </span>
              {topTools.length > 0 && (
                <>
                  <span className="h-4 w-px bg-slate-200" />
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                    <strong className="font-semibold text-slate-900">{topTools.length}</strong> top rated
                  </span>
                </>
              )}
              <span className="h-4 w-px bg-slate-200" />
              <span>Updated weekly</span>
            </div>

            {/* Top rated pills */}
            {topTools.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs font-medium text-slate-500">Top rated:</span>
                {topTools.map(tool => (
                  <Link
                    key={tool.slug}
                    href={`/${tool.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                    {tool.name}
                    <Badge variant="secondary" className="ml-0.5 bg-amber-50 px-1.5 py-0 text-[10px] font-medium text-amber-700">
                      {tool.rating}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tools grid — the main content */}
      <section id="tools-section" className="border-b border-gray-200 py-14 md:py-20">
        <div className="container px-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                All {category.name} tools
              </h2>
              <p className="mt-0.5 text-sm text-gray-400">
                {itemsInCategory.length > 0
                  ? `${itemsInCategory.length} solutions`
                  : `Discover ${category.name.toLowerCase()} solutions`}
              </p>
            </div>
          </div>

          {itemsInCategory.length > 0 ? (
            <DirectoryGrid items={itemsInCategory} />
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
              {itemsLoadError ? (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">Tools loading issue</h3>
                  <p className="mx-auto max-w-md text-gray-500 text-sm">
                    We&apos;re temporarily unable to load the tools for this category. Please try again later.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">No tools available yet</h3>
                  <p className="mx-auto max-w-md text-gray-500 text-sm">
                    We&apos;re constantly adding new {category.name.toLowerCase()} tools. Check back soon or explore related categories.
                  </p>
                </div>
              )}
              <Link
                href="/categories"
                className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
              >
                Browse all categories
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* About this category */}
      {category.longDescription && (
        <section className="border-b border-slate-200 bg-slate-50 py-16 md:py-24">
          <div className="container px-6">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                About {category.name} tools
              </h2>
              <div
                className="prose prose-slate mt-6 max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-7 prose-a:text-sky-700 prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: category.longDescription }}
              />
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="border-b border-slate-200 py-16 md:py-24">
        <div className="container px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              Frequently asked questions
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Common questions about {category.name.toLowerCase()} tools
            </p>

            <div className="mt-10 divide-y divide-slate-200">
              {[
                {
                  icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
                  q: `What are ${category.name} tools?`,
                  a: `${category.name} tools are specialized AI-powered software solutions designed to help commercial real estate professionals ${category.description?.toLowerCase() || 'improve their workflows'}. These tools leverage artificial intelligence and machine learning to automate processes, provide insights, and improve decision-making.`,
                },
                {
                  icon: <Zap className="h-5 w-5 text-sky-500" />,
                  q: `How do I choose the right ${category.name} tool?`,
                  a: `Consider your specific business needs, budget, team size, and existing technology stack. Look for tools that offer free trials, have strong customer support, and integrate well with your current workflow. Our directory provides detailed comparisons to help you make an informed decision.`,
                },
                {
                  icon: <Users className="h-5 w-5 text-violet-500" />,
                  q: `Are these tools suitable for small businesses?`,
                  a: `Many ${category.name} tools offer scalable pricing plans suitable for businesses of all sizes. We indicate pricing models and company size recommendations in our directory to help you find solutions that fit your budget and requirements.`,
                },
                {
                  icon: <Shield className="h-5 w-5 text-amber-500" />,
                  q: `What should I expect for implementation time?`,
                  a: `Implementation time varies by tool complexity and business requirements. Simple tools may be ready in days, while comprehensive platforms might take weeks. Most vendors provide implementation support and training to ensure successful adoption.`,
                },
              ].map((faq, i) => (
                <div key={i} className="py-6 first:pt-0 last:pb-0">
                  <h3 className="flex items-center gap-2.5 text-base font-semibold text-slate-900">
                    {faq.icon}
                    {faq.q}
                  </h3>
                  <p className="mt-3 pl-[30px] text-sm leading-7 text-slate-600">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related categories */}
      {relatedCategories.length > 0 && (
        <section className="bg-slate-50 py-16 md:py-24">
          <div className="container px-6">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                  Related categories
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Tools that complement your {category.name.toLowerCase()} workflow
                </p>
              </div>
              <Button asChild variant="outline" className="w-fit rounded-lg border-slate-300 bg-white">
                <Link href="/categories">
                  View all categories
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {relatedCategories.map(relCat => {
                const RelIcon = relCat.icon
                  ? CATEGORY_ICONS[relCat.icon as keyof typeof CATEGORY_ICONS]
                  : null;
                return (
                  <Link key={relCat.slug} href={`/categories/${relCat.slug}`} className="group block h-full">
                    <Card className="relative flex h-full overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_18px_70px_-52px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_24px_90px_-46px_rgba(15,23,42,0.45)]">
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-sky-400 to-cyan-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <CardContent className="flex h-full flex-col p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                            {RelIcon ? <RelIcon className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
                          </div>
                          {relCat.itemCount !== undefined && (
                            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                              {relCat.itemCount} tool{relCat.itemCount !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                        <div className="mt-6 space-y-3">
                          <h3 className="text-xl font-semibold leading-tight tracking-tight text-slate-950 transition-colors duration-200 group-hover:text-slate-700">
                            {relCat.name}
                          </h3>
                          <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                            {relCat.description}
                          </p>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-8 text-sm font-semibold text-slate-900">
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
