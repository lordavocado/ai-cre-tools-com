import { getDirectoryItemBySlug, getDirectoryItems } from "@/lib/supabase";
import { isValidSlug, isValidSlugFormat } from "@/lib/routing-utils-client";
import type { Metadata } from "next";
import Image from 'next/image';
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Twitter, Linkedin, Facebook } from "lucide-react";
import { DirectoryItemCard } from "@/components/listing/DirectoryItemCard";
import { siteConfig } from "@/config/site";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { getCategoryLabel } from "@/config/design-tokens";
import { getSeoCluster } from "@/config/seo-clusters";
import { ToolFavicon } from "@/components/ui/tool-favicon";
import { normalizeToolDescription } from "@/lib/tool-content";
import { hasEnoughAlternatives } from "@/config/seo-alternatives";
import { getResolvedComparisons } from "@/config/seo-comparisons";
import { findIndexableTagSlugForFeature, generateToolPageMeta } from "@/lib/seo-pages";
import { getToolAlternativesPath, getToolPath } from "@/lib/tool-routes";
import {
  TOOL_ASSET_CLASS_OPTIONS,
  TOOL_DEPLOYMENT_OPTIONS,
  TOOL_PERSONA_OPTIONS,
  TOOL_PRICING_MODELS,
  TOOL_PRICING_PERIODS,
  TOOL_WORKFLOW_OPTIONS,
  getTaxonomyLabel,
} from "@/config/tool-taxonomy";
import { getIndexableUseCases } from "@/lib/seo-use-cases";
import { getIndexableAssetPages, getIndexableIntegrationPages } from "@/lib/seo-market-pages";

function getWebsiteLabel(website: string): string {
  try {
    return new URL(website).hostname.replace(/^www\./, "");
  } catch {
    return website.replace(/^https?:\/\//, "").replace(/^www\./, "");
  }
}

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-balance text-xl font-semibold tracking-[-0.01em] text-foreground sm:text-2xl">
        {title}
      </h2>
    </div>
  );
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const items = await getDirectoryItems();
  return items.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const item = await getDirectoryItemBySlug(slug);

  if (!item) {
    return { title: "Tool Not Found" };
  }

  const categories = item.category.split(",").map((cat) => cat.trim()).filter(Boolean);
  const toolMeta = generateToolPageMeta(item.name, item.tagline, categories);
  const canonicalUrl = `${siteConfig.url}${getToolPath(slug)}`;

  return {
    title: toolMeta.title,
    description: toolMeta.description,
    keywords: [
      ...toolMeta.keywords,
      "tool review",
      "software comparison",
      "CRE AI software",
    ],
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
      type: "website",
    },
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
    alternates: { canonical: canonicalUrl },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    authors: [{ name: `${siteConfig.name} Team` }],
    category: "Technology",
    classification: "Software Review",
  };
}

export default async function DirectoryItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isValidSlugFormat(slug)) notFound();
  if (!isValidSlug(slug)) notFound();

  const item = await getDirectoryItemBySlug(slug);
  if (!item) notFound();

  const categories = item.category.split(",").map((cat) => cat.trim()).filter(Boolean);
  const primaryCategory = categories[0];
  const seoCluster = primaryCategory ? getSeoCluster(primaryCategory) : undefined;

  const allItemsInCategory = primaryCategory
    ? await getDirectoryItems(undefined, primaryCategory)
    : [];
  const allItems = await getDirectoryItems();
  const relatedItems = allItemsInCategory
    .filter((related) => related.id !== item.id)
    .slice(0, 6);
  const moreToolsInCategory = allItemsInCategory
    .filter((related) => related.id !== item.id)
    .slice(0, 12);

  const hasSocials =
    item.socials &&
    (item.socials.twitter || item.socials.linkedin || item.socials.facebook);

  const toolPageUrl = `${siteConfig.url}${getToolPath(slug)}`;
  const descriptionText = normalizeToolDescription(item.description, item.slug);
  const descriptionParagraphs = descriptionText
    ? descriptionText.split("\n\n").filter(Boolean)
    : [];
  const websiteLabel = item.website ? getWebsiteLabel(item.website) : null;
  const showAlternativesLink = hasEnoughAlternatives(item, allItems);
  const itemComparisons = getResolvedComparisons(allItems)
    .filter((comparison) => comparison.toolA.slug === slug || comparison.toolB.slug === slug);
  const capabilityTags = item.tags ?? item.features?.map((feature) => feature.name) ?? [];
  const structuredOffer = item.startingPriceAmount !== undefined && item.startingPriceCurrency
    ? {
        "@type": "Offer",
        price: item.startingPriceAmount.toString(),
        priceCurrency: item.startingPriceCurrency,
        url: item.website || toolPageUrl,
      }
    : item.hasFreePlan === true || item.pricingModel === 'free'
      ? { "@type": "Offer", price: "0", url: item.website || toolPageUrl }
      : undefined;
  const pricingLabel = item.startingPriceAmount !== undefined && item.startingPriceCurrency
    ? `${new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: item.startingPriceCurrency,
        maximumFractionDigits: 2,
      }).format(item.startingPriceAmount)}${item.pricingPeriod
        ? ` ${getTaxonomyLabel(TOOL_PRICING_PERIODS, item.pricingPeriod).toLowerCase()}`
        : ''}`
    : item.hasFreePlan === true || item.pricingModel === 'free'
      ? 'Free plan available'
      : item.pricingModel !== 'unknown'
        ? getTaxonomyLabel(TOOL_PRICING_MODELS, item.pricingModel)
        : undefined;
  const buyingDetails = [
    { label: 'Workflows', values: item.workflows.map((value) => getTaxonomyLabel(TOOL_WORKFLOW_OPTIONS, value)) },
    { label: 'Best for roles', values: item.personas.map((value) => getTaxonomyLabel(TOOL_PERSONA_OPTIONS, value)) },
    { label: 'Asset classes', values: item.assetClasses.map((value) => getTaxonomyLabel(TOOL_ASSET_CLASS_OPTIONS, value)) },
    { label: 'Integrations', values: item.integrations },
    { label: 'Deployment', values: item.deploymentOptions.map((value) => getTaxonomyLabel(TOOL_DEPLOYMENT_OPTIONS, value)) },
    { label: 'Geographic coverage', values: item.geographicCoverage },
    { label: 'Security', values: item.securityCertifications },
    { label: 'Inputs', values: item.inputTypes },
    { label: 'Outputs', values: item.outputTypes },
  ].filter((detail) => detail.values.length > 0);
  const itemUseCases = getIndexableUseCases(allItems)
    .filter((useCase) => useCase.tools.some((tool) => tool.slug === item.slug))
    .slice(0, 4);
  const itemMarketPages = [
    ...getIndexableAssetPages(allItems),
    ...getIndexableIntegrationPages(allItems),
  ]
    .filter((page) => page.tools.some((tool) => tool.slug === item.slug))
    .slice(0, 4);

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: item.name,
            description: item.description || item.tagline,
            url: toolPageUrl,
            sameAs: item.website || undefined,
            applicationCategory: "BusinessApplication",
            applicationSubCategory: item.category || "CRE AI Tool",
            screenshot: item.heroScreenshotUrl || item.screenshotUrl || undefined,
            offers: structuredOffer,
            aggregateRating: item.rating && item.reviewCount && item.reviewCount > 0
              ? {
                  "@type": "AggregateRating",
                  ratingValue: item.rating,
                  reviewCount: item.reviewCount,
                  bestRating: 5,
                  worstRating: 1,
                }
              : undefined,
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
            datePublished: item.createdAt || undefined,
            dateModified: item.lastUpdated || undefined,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": toolPageUrl,
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
                { "@type": "ListItem", position: 2, name: "Tools", item: `${siteConfig.url}/#directory` },
                { "@type": "ListItem", position: 3, name: item.name, item: toolPageUrl },
              ],
            },
            keywords: [
              item.name,
              item.category,
              seoCluster?.primaryKeyword,
              ...(seoCluster?.secondaryKeywords.slice(0, 3) ?? []),
              ...capabilityTags,
              "commercial real estate",
              "CRE",
              "PropTech",
            ].filter(Boolean),
          }),
        }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="border-b border-[#e0e0e0] bg-white py-6 md:py-8">
        <div className="container px-6">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-1.5 text-sm text-[#737373]"
          >
            <Link href="/" className="transition-colors hover:text-[#1f1f1f]">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/#directory" className="transition-colors hover:text-[#1f1f1f]">
              Tools
            </Link>
            <span aria-hidden="true">/</span>
            <span className="truncate text-foreground">{item.name}</span>
          </nav>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-background ring-1 ring-inset ring-black/10 sm:h-16 sm:w-16">
                {item.website ? (
                  <ToolFavicon
                    website={item.website}
                    name={item.name}
                    apiSize={64}
                    className="h-9 w-9 sm:h-10 sm:w-10"
                  />
                ) : (
                  <span className="text-xl font-bold text-muted-foreground">
                    {item.name.charAt(0)}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="text-balance text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-foreground sm:text-[36px]">
                  {item.name}
                </h1>
                {seoCluster && (
                  <p className="mt-2 text-sm font-medium text-primary">
                    {seoCluster.primaryKeyword} for commercial real estate teams
                  </p>
                )}
                {item.tagline && (
                  <p className="mt-2 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-[17px]">
                    {item.tagline}
                  </p>
                )}
                {capabilityTags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {capabilityTags.slice(0, 4).map((tag) => {
                      const tagSlug = findIndexableTagSlugForFeature(tag, allItems);
                      if (tagSlug) {
                        return (
                          <Link
                            key={tag}
                            href={`/tags/${tagSlug}`}
                            className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground transition-[color,border-color,transform] motion-safe:active:scale-[0.97] hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {tag}
                          </Link>
                        );
                      }
                      return (
                        <span
                          key={tag}
                          className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground"
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 lg:pt-1">
              <FavoriteButton
                toolId={item.id}
                variant="icon"
                className="h-11 w-11 rounded-lg border border-border bg-background p-0 text-muted-foreground shadow-none hover:bg-secondary hover:text-foreground"
              />
              {item.website && (
                <Link
                  href={item.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-[background-color,transform] duration-150 motion-safe:active:scale-[0.97] hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Visit website
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {itemComparisons.length > 0 && (
        <section className="border-b border-border bg-white py-8">
          <div className="container px-6">
            <h2 className="text-xl font-semibold">Compare {item.name}</h2>
            <ul className="mt-4 flex flex-wrap gap-4">
              {itemComparisons.map((comparison) => (
                <li key={comparison.slug}>
                  <Link href={`/compare/${comparison.slug}`} prefetch={false} className="text-sm underline-offset-2 hover:underline">
                    {comparison.toolA.name} vs {comparison.toolB.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Screenshot ────────────────────────────────────────────────── */}
      {item.heroScreenshotUrl && (
        <section className="border-b border-border bg-background py-8 md:py-10">
          <div className="container px-6">
            <div className="overflow-hidden rounded-xl bg-secondary shadow-sm ring-1 ring-inset ring-black/10">
              <Image
                src={item.heroScreenshotUrl}
                alt={`${item.name} product interface`}
                className="w-full object-cover"
                width={1600}
                height={900}
                sizes="(max-width: 768px) 100vw, 1200px"
                unoptimized
              />
            </div>
          </div>
        </section>
      )}

      {/* ── Main content + sidebar ────────────────────────────────────── */}
      <section className="border-b border-border bg-secondary py-10 md:py-14">
        <div className="container px-6">
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-12">
            <div className="min-w-0 space-y-10">
              {descriptionParagraphs.length > 0 && (
                <section>
                  <SectionHeading eyebrow="Overview" title={`About ${item.name}`} />
                  <div className="max-w-3xl space-y-4">
                    {descriptionParagraphs.map((paragraph, index) => (
                      <p
                        key={index}
                        className="break-words text-base leading-[1.75] text-foreground [overflow-wrap:anywhere]"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              )}

              {item.features && item.features.length > 0 && (
                <section className="border-t border-[#e0e0e0] pt-10">
                  <SectionHeading eyebrow="Capabilities" title="Key features" />
                  <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {item.features.map((feature) => (
                      <li
                        key={feature.name}
                        className="rounded-[8px] border border-[#e0e0e0] bg-white px-4 py-3.5"
                      >
                        <p className="text-sm font-medium text-[#1f1f1f]">
                          {feature.name}
                        </p>
                        {feature.description && (
                          <p className="mt-1 text-sm leading-relaxed text-[#737373]">
                            {feature.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {(item.bestFor || buyingDetails.length > 0 || item.limitations.length > 0) && (
                <section className="border-t border-[#e0e0e0] pt-10">
                  <SectionHeading eyebrow="Buying guide" title="Fit and requirements" />
                  {item.bestFor && (
                    <div className="mb-5 rounded-[8px] border border-[#dcebd5] bg-[#f6faf4] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#527c3e]">Best for</p>
                      <p className="mt-1.5 text-sm leading-6 text-[#1f1f1f]">{item.bestFor}</p>
                    </div>
                  )}
                  {buyingDetails.length > 0 && (
                    <dl className="grid gap-3 sm:grid-cols-2">
                      {buyingDetails.map((detail) => (
                        <div key={detail.label} className="rounded-[8px] border border-[#e0e0e0] bg-white p-4">
                          <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-[#999999]">{detail.label}</dt>
                          <dd className="mt-2 text-sm leading-6 text-[#1f1f1f]">{detail.values.join(', ')}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  {item.limitations.length > 0 && (
                    <div className="mt-3 rounded-[8px] border border-amber-200 bg-amber-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-amber-800">Known limitations</p>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-amber-950">
                        {item.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}
                      </ul>
                    </div>
                  )}
                </section>
              )}

              {itemUseCases.length > 0 && (
                <section className="border-t border-[#e0e0e0] pt-10">
                  <SectionHeading eyebrow="Use cases" title={`Where ${item.name} fits`} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    {itemUseCases.map((useCase) => (
                      <Link
                        key={useCase.path}
                        href={useCase.path}
                        className="group rounded-[8px] border border-[#e0e0e0] bg-white p-4 hover:border-[rgba(98,150,73,0.45)]"
                      >
                        <p className="text-sm font-semibold text-[#1f1f1f] group-hover:text-[#629649]">{useCase.title}</p>
                        <p className="mt-1 text-xs text-[#737373]">Compare {useCase.tools.length} matching tools</p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {itemMarketPages.length > 0 && (
                <section className="border-t border-[#e0e0e0] pt-10">
                  <SectionHeading eyebrow="Related shortlists" title={`More ways to compare ${item.name}`} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    {itemMarketPages.map((page) => (
                      <Link
                        key={page.path}
                        href={page.path}
                        className="group rounded-[8px] border border-[#e0e0e0] bg-white p-4 hover:border-[rgba(98,150,73,0.45)]"
                      >
                        <p className="text-sm font-semibold text-[#1f1f1f] group-hover:text-[#629649]">{page.title}</p>
                        <p className="mt-1 text-xs text-[#737373]">Compare {page.tools.length} documented tools</p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {((item.pros && item.pros.length > 0) ||
                (item.cons && item.cons.length > 0)) && (
                <section className="border-t border-[#e0e0e0] pt-10">
                  <SectionHeading eyebrow="Evaluation" title="Pros and cons" />
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {item.pros && item.pros.length > 0 && (
                      <div className="rounded-[8px] border border-[#e0e0e0] bg-white p-5">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#999999]">
                          Pros
                        </p>
                        <ul className="space-y-2.5">
                          {item.pros.map((pro) => (
                            <li
                              key={pro}
                              className="flex items-start gap-2.5 text-sm leading-relaxed text-[#1f1f1f]"
                            >
                              <span
                                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#a0a0a0]"
                                aria-hidden="true"
                              />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {item.cons && item.cons.length > 0 && (
                      <div className="rounded-[8px] border border-[#e0e0e0] bg-white p-5">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#999999]">
                          Cons
                        </p>
                        <ul className="space-y-2.5">
                          {item.cons.map((con) => (
                            <li
                              key={con}
                              className="flex items-start gap-2.5 text-sm leading-relaxed text-[#1f1f1f]"
                            >
                              <span
                                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#a0a0a0]"
                                aria-hidden="true"
                              />
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>

            <aside className="mt-10 min-w-0 lg:sticky lg:top-[66px] lg:mt-0 lg:self-start">
              <div className="overflow-hidden rounded-lg border border-border bg-background">
                <div className="border-b border-border px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Tool details
                  </p>
                </div>
                <dl className="divide-y divide-border">
                  {primaryCategory && (
                    <div className="flex items-start justify-between gap-4 px-4 py-3.5">
                      <dt className="shrink-0 text-sm text-muted-foreground">Category</dt>
                      <dd className="min-w-0 break-words text-right [overflow-wrap:anywhere]">
                        <Link
                          href={`/categories/${primaryCategory}`}
                          className="text-sm font-medium text-foreground underline-offset-2 transition-colors hover:text-primary hover:underline"
                        >
                          {getCategoryLabel(primaryCategory)}
                        </Link>
                      </dd>
                    </div>
                  )}
                  {websiteLabel && item.website && (
                    <div className="flex items-start justify-between gap-4 px-4 py-3.5">
                      <dt className="shrink-0 text-sm text-muted-foreground">Website</dt>
                      <dd className="min-w-0 break-words text-right [overflow-wrap:anywhere]">
                        <Link
                          href={item.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-foreground underline-offset-2 transition-colors hover:text-primary hover:underline"
                        >
                          {websiteLabel}
                        </Link>
                      </dd>
                    </div>
                  )}
                  {pricingLabel && (
                    <div className="flex items-start justify-between gap-4 px-4 py-3.5">
                      <dt className="shrink-0 text-sm text-muted-foreground">Pricing</dt>
                      <dd className="min-w-0 break-words text-right text-sm font-medium text-foreground [overflow-wrap:anywhere]">
                        {pricingLabel}
                      </dd>
                    </div>
                  )}
                  {item.hasFreeTrial === true && (
                    <div className="flex items-start justify-between gap-4 px-4 py-3.5">
                      <dt className="shrink-0 text-sm text-muted-foreground">Free trial</dt>
                      <dd className="min-w-0 break-words text-right text-sm font-medium text-foreground [overflow-wrap:anywhere]">Available</dd>
                    </div>
                  )}
                  {item.foundedYear && (
                    <div className="flex items-start justify-between gap-4 px-4 py-3.5">
                      <dt className="shrink-0 text-sm text-muted-foreground">Founded</dt>
                      <dd className="min-w-0 break-words text-right text-sm font-medium text-foreground tabular-nums [overflow-wrap:anywhere]">
                        {item.foundedYear}
                      </dd>
                    </div>
                  )}
                  {(item.city || item.country) && (
                    <div className="flex items-start justify-between gap-4 px-4 py-3.5">
                      <dt className="shrink-0 text-sm text-muted-foreground">Location</dt>
                      <dd className="min-w-0 break-words text-right text-sm font-medium text-foreground [overflow-wrap:anywhere]">
                        {[item.city, item.country].filter(Boolean).join(", ")}
                      </dd>
                    </div>
                  )}
                </dl>

                {item.editorialStatus === 'verified' && item.lastVerifiedAt && (
                  <div className="border-t border-border px-4 py-3.5">
                    <p className="text-xs font-medium text-primary tabular-nums">
                      Data verified {new Date(item.lastVerifiedAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </p>
                    {item.sourceUrls.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                        {item.sourceUrls.map((sourceUrl, index) => (
                          <Link
                            key={sourceUrl}
                            href={sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-sm text-xs text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            Source {index + 1}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {hasSocials && (
                  <div className="flex items-center gap-1.5 border-t border-border px-4 py-3.5">
                    {item.socials?.twitter && (
                      <Link
                        href={`https://twitter.com/${item.socials.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitter"
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Twitter size={14} aria-hidden="true" />
                      </Link>
                    )}
                    {item.socials?.linkedin && (
                      <Link
                        href={`https://linkedin.com/${item.socials.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Linkedin size={14} aria-hidden="true" />
                      </Link>
                    )}
                    {item.socials?.facebook && (
                      <Link
                        href={`https://facebook.com/${item.socials.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Facebook size={14} aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── Related tools (full width) ────────────────────────────────── */}
      {relatedItems.length > 0 && (
        <section className="border-b border-[#e0e0e0] bg-white py-10 md:py-14">
          <div className="container px-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading eyebrow="Directory" title="Similar tools" />
              <div className="flex flex-col gap-2 sm:items-end">
                {showAlternativesLink && (
                  <Link
                    href={getToolAlternativesPath(slug)}
                    className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-[#629649] underline-offset-2 hover:underline"
                  >
                    View {item.name} alternatives
                  </Link>
                )}
                {primaryCategory && (
                  <Link
                    href={`/categories/${primaryCategory}`}
                    className="inline-flex w-fit items-center gap-1 text-sm font-medium text-[#1f1f1f] underline-offset-2 hover:underline"
                  >
                    View all {getCategoryLabel(primaryCategory)} tools
                  </Link>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedItems.map((relatedItem) => (
                <DirectoryItemCard key={relatedItem.id} item={relatedItem} />
              ))}
            </div>
          </div>
        </section>
      )}

      {moreToolsInCategory.length > 0 && primaryCategory && (
        <section className="border-b border-[#e0e0e0] bg-[#fafafa] py-10 md:py-12">
          <div className="container px-6">
            <SectionHeading
              eyebrow="Explore"
              title={`More ${getCategoryLabel(primaryCategory)} tools`}
            />
            <ul className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
              {moreToolsInCategory.map((relatedItem) => (
                <li key={relatedItem.id}>
                  <Link
                    href={getToolPath(relatedItem.slug)}
                    className="text-sm text-[#1f1f1f] underline-offset-2 transition-colors hover:text-[#629649] hover:underline"
                  >
                    {relatedItem.name}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-[#737373]">
              <Link
                href="/all-tools"
                className="font-medium text-[#1f1f1f] underline-offset-2 hover:underline"
              >
                Browse the full A–Z tool index
              </Link>
            </p>
          </div>
        </section>
      )}
    </>
  );
}
