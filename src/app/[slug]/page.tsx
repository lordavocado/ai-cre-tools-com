import { getDirectoryItemBySlug, getDirectoryItems } from "@/lib/supabase";
import { isValidSlug, isValidSlugFormat } from "@/lib/routing-utils-client";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Twitter, Linkedin, Facebook } from "lucide-react";
import { DirectoryItemCard } from "@/components/listing/DirectoryItemCard";
import { siteConfig, generateToolMeta } from "@/config/site";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { getCategoryLabel } from "@/config/design-tokens";
import { ToolFavicon } from "@/components/ui/tool-favicon";
import { normalizeToolDescription } from "@/lib/tool-content";

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
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#999999]">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-xl font-semibold tracking-[-0.01em] text-[#1f1f1f] sm:text-2xl">
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

  const toolMeta = generateToolMeta(item.name, item.tagline, item.description);
  const canonicalUrl = `${siteConfig.url}/${slug}`;
  const categories = item.category.split(",").map((cat) => cat.trim()).filter(Boolean);

  return {
    title: toolMeta.title,
    description: toolMeta.description,
    keywords: [
      ...toolMeta.keywords.split(", "),
      ...categories.map((cat) => `${cat} tools`),
      ...siteConfig.seo.primaryKeywords,
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
      type: "article",
      publishedTime: item.lastUpdated || new Date().toISOString(),
      modifiedTime: item.lastUpdated || new Date().toISOString(),
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

  const allItemsInCategory = primaryCategory
    ? await getDirectoryItems(undefined, primaryCategory)
    : [];
  const relatedItems = allItemsInCategory
    .filter((related) => related.id !== item.id)
    .slice(0, 6);
  const moreToolsInCategory = allItemsInCategory
    .filter((related) => related.id !== item.id)
    .slice(0, 12);

  const hasSocials =
    item.socials &&
    (item.socials.twitter || item.socials.linkedin || item.socials.facebook);

  const toolPageUrl = `${siteConfig.url}/${slug}`;
  const descriptionText = normalizeToolDescription(item.description);
  const descriptionParagraphs = descriptionText
    ? descriptionText.split("\n\n").filter(Boolean)
    : [];
  const websiteLabel = item.website ? getWebsiteLabel(item.website) : null;

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
            url: item.website,
            applicationCategory:
              item.category?.includes("management")
                ? "BusinessApplication"
                : item.category?.includes("analysis")
                  ? "DeveloperApplication"
                  : "BusinessApplication",
            operatingSystem: "Web-based",
            applicationSubCategory: item.category || "CRE AI Tool",
            softwareVersion: item.lastUpdated
              ? new Date(item.lastUpdated).getFullYear().toString()
              : undefined,
            downloadUrl: item.website,
            screenshot: item.imageUrl,
            offers: {
              "@type": "Offer",
              price: item.pricing ? item.pricing.replace(/[^\d.]/g, "") || "0" : "0",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              seller: { "@type": "Organization", name: item.name },
            },
            aggregateRating: item.rating
              ? {
                  "@type": "AggregateRating",
                  ratingValue: item.rating,
                  reviewCount: item.reviewCount || 1,
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
            datePublished: item.foundedYear
              ? `${item.foundedYear}-01-01`
              : new Date().toISOString(),
            dateModified: item.lastUpdated || new Date().toISOString(),
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

      {item.rating && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Review",
              author: { "@type": "Person", name: "CRE Professional" },
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
                  text:
                    feature.description ||
                    `${item.name} offers ${feature.name} as one of its key features.`,
                },
              })),
            }),
          }}
        />
      )}
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
            <span className="truncate text-[#1f1f1f]">{item.name}</span>
          </nav>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-[#e0e0e0] bg-white sm:h-16 sm:w-16">
                {item.website ? (
                  <ToolFavicon
                    website={item.website}
                    name={item.name}
                    apiSize={64}
                    className="h-9 w-9 sm:h-10 sm:w-10"
                  />
                ) : (
                  <span className="text-xl font-bold text-[#a0a0a0]">
                    {item.name.charAt(0)}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="text-balance text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-[#1f1f1f] sm:text-[36px]">
                  {item.name}
                </h1>
                {item.tagline && (
                  <p className="mt-2 max-w-2xl text-base leading-relaxed text-[#737373] sm:text-[17px]">
                    {item.tagline}
                  </p>
                )}
                {item.features && item.features.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.features.slice(0, 4).map((feature) => (
                      <span
                        key={feature.name}
                        className="rounded-full border border-[#e8e8e8] bg-[#fafafa] px-3 py-1 text-xs font-medium text-[#1f1f1f]"
                      >
                        {feature.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 lg:pt-1">
              <FavoriteButton
                toolId={item.id}
                variant="icon"
                className="h-11 w-11 rounded-[8px] border border-[#e0e0e0] bg-white p-0 text-[#737373] shadow-none transition-colors hover:bg-[#fafafa] hover:text-[#1f1f1f]"
              />
              {item.website && (
                <Link
                  href={item.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-1.5 rounded-[8px] bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors duration-100 hover:bg-primary/90"
                >
                  Visit Website
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Screenshot ────────────────────────────────────────────────── */}
      {item.heroScreenshotUrl && (
        <section className="border-b border-[#e0e0e0] bg-white py-8 md:py-10">
          <div className="container px-6">
            <div className="overflow-hidden rounded-[10px] border border-[#e0e0e0] bg-[#fafafa] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <img
                src={item.heroScreenshotUrl}
                alt={`${item.name} screenshot`}
                className="w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      )}

      {/* ── Main content + sidebar ────────────────────────────────────── */}
      <section className="border-b border-[#e0e0e0] bg-[#fafafa] py-10 md:py-14">
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
                        className="text-base leading-[1.75] text-[#1f1f1f]"
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

            <aside className="mt-10 lg:sticky lg:top-[66px] lg:mt-0 lg:self-start">
              <div className="overflow-hidden rounded-[8px] border border-[#e0e0e0] bg-white">
                <div className="border-b border-[#e0e0e0] px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#999999]">
                    Tool details
                  </p>
                </div>
                <dl className="divide-y divide-[#e0e0e0]">
                  {primaryCategory && (
                    <div className="flex items-start justify-between gap-4 px-4 py-3.5">
                      <dt className="text-sm text-[#737373]">Category</dt>
                      <dd className="text-right">
                        <Link
                          href={`/categories/${primaryCategory}`}
                          className="text-sm font-medium text-[#1f1f1f] underline-offset-2 transition-colors hover:underline"
                        >
                          {getCategoryLabel(primaryCategory)}
                        </Link>
                      </dd>
                    </div>
                  )}
                  {websiteLabel && item.website && (
                    <div className="flex items-start justify-between gap-4 px-4 py-3.5">
                      <dt className="text-sm text-[#737373]">Website</dt>
                      <dd className="text-right">
                        <Link
                          href={item.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-[#1f1f1f] underline-offset-2 transition-colors hover:underline"
                        >
                          {websiteLabel}
                        </Link>
                      </dd>
                    </div>
                  )}
                  {item.pricing && (
                    <div className="flex items-start justify-between gap-4 px-4 py-3.5">
                      <dt className="text-sm text-[#737373]">Pricing</dt>
                      <dd className="text-right text-sm font-medium text-[#1f1f1f]">
                        {item.pricing}
                      </dd>
                    </div>
                  )}
                  {item.foundedYear && (
                    <div className="flex items-start justify-between gap-4 px-4 py-3.5">
                      <dt className="text-sm text-[#737373]">Founded</dt>
                      <dd className="text-right text-sm font-medium text-[#1f1f1f]">
                        {item.foundedYear}
                      </dd>
                    </div>
                  )}
                  {(item.city || item.country) && (
                    <div className="flex items-start justify-between gap-4 px-4 py-3.5">
                      <dt className="text-sm text-[#737373]">Location</dt>
                      <dd className="text-right text-sm font-medium text-[#1f1f1f]">
                        {[item.city, item.country].filter(Boolean).join(", ")}
                      </dd>
                    </div>
                  )}
                </dl>

                {hasSocials && (
                  <div className="flex items-center gap-1.5 border-t border-[#e0e0e0] px-4 py-3.5">
                    {item.socials?.twitter && (
                      <Link
                        href={`https://twitter.com/${item.socials.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitter"
                        className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#e0e0e0] text-[#737373] transition-colors hover:bg-[#fafafa] hover:text-[#1f1f1f]"
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
                        className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#e0e0e0] text-[#737373] transition-colors hover:bg-[#fafafa] hover:text-[#1f1f1f]"
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
                        className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#e0e0e0] text-[#737373] transition-colors hover:bg-[#fafafa] hover:text-[#1f1f1f]"
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
              {primaryCategory && (
                <Link
                  href={`/categories/${primaryCategory}`}
                  className="inline-flex w-fit items-center gap-1 text-sm font-medium text-[#1f1f1f] underline-offset-2 hover:underline"
                >
                  View all {getCategoryLabel(primaryCategory)} tools
                </Link>
              )}
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
                    href={`/${relatedItem.slug}`}
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
