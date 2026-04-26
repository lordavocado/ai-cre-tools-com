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

  const allItemsInCategory = await getDirectoryItems(undefined, primaryCategory);
  const relatedItems = allItemsInCategory
    .filter((related) => related.id !== item.id)
    .slice(0, 3);

  const hasSocials =
    item.socials &&
    (item.socials.twitter || item.socials.linkedin || item.socials.facebook);

  const toolPageUrl = `${siteConfig.url}/${slug}`;

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

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="border-b border-border bg-background">
        <div className="container px-6 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/#directory" className="transition-colors hover:text-foreground">Tools</Link>
            <span>/</span>
            <span className="text-foreground">{item.name}</span>
          </nav>
        </div>
      </div>

      <div className="border-b border-border bg-background">
        <div className="container px-6 py-8">
          {/* Top row: favicon + identity + action buttons */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              {/* Favicon */}
              <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/60">
                {item.website ? (
                  <ToolFavicon
                    website={item.website}
                    name={item.name}
                    apiSize={64}
                    className="h-9 w-9"
                  />
                ) : (
                  <span className="text-xl font-bold text-muted-foreground">{item.name.charAt(0)}</span>
                )}
              </div>

              {/* Name + tagline + chips */}
              <div className="min-w-0">
                <h1 className="text-balance text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-foreground sm:text-[32px]">
                  {item.name}
                </h1>
                {item.tagline && (
                  <p className="mt-2 text-[16px] leading-relaxed text-muted-foreground">{item.tagline}</p>
                )}
                {item.features && item.features.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.features.slice(0, 5).map((f, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                      >
                        {f.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons — primary CTA uses accent green per DESIGN */}
            <div className="flex shrink-0 items-center gap-2">
              <FavoriteButton
                toolId={item.id}
                variant="icon"
                className="rounded-md border border-border bg-background p-2 text-muted-foreground shadow-none hover:bg-muted hover:text-foreground"
              />
              {item.website && (
                <Link
                  href={item.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors duration-100 hover:bg-primary/90"
                >
                  Visit Website
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="container px-6 py-10">
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-10">

          {/* ── Left: content sections, separated by dividers — no boxes ── */}
          <div>

            {/* Screenshot Hero */}
            {item.heroScreenshotUrl && (
              <section className="pb-8">
                <div className="overflow-hidden rounded-lg border border-border bg-muted/30">
                  <img
                    src={item.heroScreenshotUrl}
                    alt={`${item.name} screenshot`}
                    className="w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </section>
            )}

            {/* About */}
            {item.description && (
              <section className="pb-8">
                <h2 className="mb-4 text-sm font-semibold text-foreground">
                  About {item.name}
                </h2>
                <div
                  className="prose prose-neutral max-w-none text-sm leading-7 text-foreground prose-headings:font-sans prose-p:font-sans prose-li:font-sans prose-strong:font-sans prose-a:font-sans prose-a:text-foreground prose-a:underline prose-a:decoration-muted-foreground prose-a:underline-offset-2 hover:prose-a:decoration-primary"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              </section>
            )}

            {/* Key Features */}
            {item.features && item.features.length > 0 && (
              <section className="border-t border-border py-8">
                <h2 className="mb-5 text-sm font-semibold text-foreground">
                  Key features
                </h2>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {item.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{feature.name}</p>
                        {feature.description && (
                          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{feature.description}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Pros & Cons */}
            {((item.pros && item.pros.length > 0) || (item.cons && item.cons.length > 0)) && (
              <section className="border-t border-border py-8">
                <h2 className="mb-5 text-sm font-semibold text-foreground">
                  Pros and cons
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {item.pros && item.pros.length > 0 && (
                    <div>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pros</p>
                      <ul className="space-y-2">
                        {item.pros.map((pro: string, i: number) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {item.cons && item.cons.length > 0 && (
                    <div>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cons</p>
                      <ul className="space-y-2">
                        {item.cons.map((con: string, i: number) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Similar Tools */}
            {relatedItems.length > 0 && (
              <section className="border-t border-border pt-8">
                <h2 className="mb-5 text-sm font-semibold text-foreground">
                  Similar tools
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {relatedItems.map((relatedItem) => (
                    <DirectoryItemCard key={relatedItem.id} item={relatedItem} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── Right: single unified info card ─────────────────────────── */}
          <aside className="mt-8 lg:mt-0 lg:sticky lg:top-[66px] lg:self-start">
            <div className="overflow-hidden rounded-md border border-border bg-card shadow-sm">

              {/* Info rows */}
              <dl className="divide-y divide-border">
                {primaryCategory && (
                  <div className="flex items-center justify-between px-4 py-3">
                    <dt className="text-xs text-muted-foreground">Category</dt>
                    <dd>
                      <Link
                        href={`/categories/${primaryCategory}`}
                        className="text-xs font-medium text-foreground underline-offset-2 transition-colors hover:underline"
                      >
                        {getCategoryLabel(primaryCategory)}
                      </Link>
                    </dd>
                  </div>
                )}
                {item.website && (
                  <div className="flex items-center justify-between px-4 py-3">
                    <dt className="text-xs text-muted-foreground">Website</dt>
                    <dd>
                      <Link
                        href={item.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-foreground underline-offset-2 transition-colors hover:underline"
                      >
                        {new URL(item.website).hostname.replace(/^www\./, "")}
                      </Link>
                    </dd>
                  </div>
                )}
                {item.pricing && (
                  <div className="flex items-center justify-between px-4 py-3">
                    <dt className="text-xs text-muted-foreground">Pricing</dt>
                    <dd className="text-xs font-medium text-foreground">{item.pricing}</dd>
                  </div>
                )}
                {item.foundedYear && (
                  <div className="flex items-center justify-between px-4 py-3">
                    <dt className="text-xs text-muted-foreground">Founded</dt>
                    <dd className="text-xs font-medium text-foreground">{item.foundedYear}</dd>
                  </div>
                )}
                {(item.city || item.country) && (
                  <div className="flex items-center justify-between px-4 py-3">
                    <dt className="text-xs text-muted-foreground">Location</dt>
                    <dd className="text-xs font-medium text-foreground">
                      {[item.city, item.country].filter(Boolean).join(", ")}
                    </dd>
                  </div>
                )}
              </dl>

              {/* Social links */}
              {hasSocials && (
                <div className="flex items-center gap-1.5 border-t border-border px-4 py-3">
                  {item.socials?.twitter && (
                    <Link
                      href={`https://twitter.com/${item.socials.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter"
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                    >
                      <Twitter size={12} aria-hidden="true" />
                    </Link>
                  )}
                  {item.socials?.linkedin && (
                    <Link
                      href={`https://linkedin.com/${item.socials.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                    >
                      <Linkedin size={12} aria-hidden="true" />
                    </Link>
                  )}
                  {item.socials?.facebook && (
                    <Link
                      href={`https://facebook.com/${item.socials.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                    >
                      <Facebook size={12} aria-hidden="true" />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </aside>

        </div>
      </div>
    </>
  );
}
