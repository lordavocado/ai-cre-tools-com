import { getDirectoryItemBySlug, getDirectoryItems } from "@/lib/supabase";
import { isValidSlug, isValidSlugFormat } from "@/lib/routing-utils-client";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Twitter, Linkedin, Facebook } from "lucide-react";
import { DirectoryItemCard } from "@/components/listing/DirectoryItemCard";
import { SafeImage } from "@/components/ui/safe-image";
import { siteConfig, generateToolMeta } from "@/config/site";
import { FavoriteButton } from "@/components/ui/favorite-button";

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

  const hasQuickFacts =
    item.pricing || item.foundedYear || item.country || item.city || item.rating;

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

      {/* Breadcrumb */}
      <div className="border-b border-[#e0e0e0] bg-white">
        <div className="container px-6 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[#737373]">
            <Link href="/" className="transition-colors hover:text-[#1f1f1f]">Home</Link>
            <span>/</span>
            <span className="text-[#1f1f1f]">{item.name}</span>
          </nav>
        </div>
      </div>

      {/* Tool header */}
      <div className="border-b border-[#e0e0e0] bg-white">
        <div className="container px-6 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            {/* Logo */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#e0e0e0] bg-[#fafafa]">
              <SafeImage
                src={item.imageUrl}
                website={item.website}
                alt={`${item.name} logo`}
                className="h-12 w-12 object-contain"
              />
            </div>

            {/* Name, tagline, categories, features */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold leading-tight text-[#1f1f1f] md:text-4xl">
                {item.name}
              </h1>
              {item.tagline && (
                <p className="mt-2 text-base leading-7 text-[#737373]">{item.tagline}</p>
              )}
              {item.features && item.features.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="text-sm text-[#737373]">Used for:</span>
                  {item.features.slice(0, 4).map((f, i) => (
                    <span key={i} className="rounded-[6px] bg-[#f0f9f0] px-2 py-1 text-xs text-[#629649]">
                      {f.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body: two-column layout — main content + sticky sidebar */}
      <div className="container px-6 py-10">
        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-8">

          {/* Left column: about + features + pros/cons + tags + related tools */}
          <div className="space-y-6">

            {/* About */}
            {item.description && (
              <div className="rounded-xl border border-[#e0e0e0] bg-white p-8">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#737373]">
                  About {item.name}
                </p>
                <div
                  className="prose prose-slate max-w-none leading-relaxed text-[#1f1f1f]"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              </div>
            )}

            {/* Key Features */}
            {item.features && item.features.length > 0 && (
              <div className="rounded-xl border border-[#e0e0e0] bg-white p-8">
                <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-[#737373]">
                  Key Features
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {item.features.map((feature, index) => (
                    <div key={index} className="border-l-2 border-[#b9e5b9] pl-4">
                      <p className="text-sm font-semibold text-[#1f1f1f]">{feature.name}</p>
                      {feature.description && (
                        <p className="mt-1 text-sm leading-6 text-[#737373]">
                          {feature.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pros & Cons */}
            {((item.pros && item.pros.length > 0) ||
              (item.cons && item.cons.length > 0)) && (
              <div className="rounded-xl border border-[#e0e0e0] bg-white p-8">
                <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-[#737373]">
                  Pros & Cons
                </p>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-green-600">Pros</p>
                    <ul className="space-y-2">
                      {item.pros?.map((pro: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[#1f1f1f]">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" aria-hidden="true" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#737373]">Cons</p>
                    <ul className="space-y-2">
                      {item.cons?.map((con: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[#1f1f1f]">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e0e0e0]" aria-hidden="true" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="rounded-xl border border-[#e0e0e0] bg-white p-8">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#737373]">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-[#fafafa] px-3 py-1 text-xs font-medium text-[#737373]"
                    >
                      {typeof tag === "string" ? tag.trim() : tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related tools (inside left column on lg) */}
            {relatedItems.length > 0 && (
              <div>
                <div className="border-t border-[#e0e0e0] pt-8 mb-6">
                  <h2 className="text-xl font-bold text-[#1f1f1f]">Similar Tools</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {relatedItems.map((relatedItem) => (
                    <DirectoryItemCard key={relatedItem.id} item={relatedItem} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column: sticky sidebar */}
          <div className="mt-6 lg:mt-0 lg:sticky lg:top-[66px] lg:self-start space-y-4">

            {/* CTA + category chip */}
            <div className="rounded-xl border border-[#e0e0e0] bg-white p-6 space-y-4">
              {item.website && (
                <Link
                  href={item.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#629649] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4a7238]"
                >
                  Visit Website
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              )}
              <FavoriteButton
                toolId={item.id}
                variant="with-text"
                className="w-full justify-center rounded-[6px] border border-[#e0e0e0] bg-white shadow-none hover:bg-[#fafafa]"
              />
              {primaryCategory && (
                <div className="pt-1">
                  <Link
                    href={`/categories/${primaryCategory.toLowerCase().replace(/\s+/g, "-")}`}
                    className="inline-flex items-center rounded-[6px] bg-[#f0f9f0] px-2 py-1 text-xs text-[#629649] hover:bg-[#e0f5e0] transition-colors"
                  >
                    {primaryCategory}
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Facts */}
            {hasQuickFacts && (
              <div className="rounded-xl border border-[#e0e0e0] bg-white p-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#737373]">Quick Facts</p>
                <dl className="divide-y divide-[#e0e0e0]">
                  {item.pricing && (
                    <div className="flex items-start justify-between gap-4 py-3">
                      <dt className="text-xs font-medium text-[#737373]">Pricing</dt>
                      <dd className="text-right text-sm font-semibold text-[#1f1f1f]">{item.pricing}</dd>
                    </div>
                  )}
                  {item.foundedYear && (
                    <div className="flex items-start justify-between gap-4 py-3">
                      <dt className="text-xs font-medium text-[#737373]">Founded</dt>
                      <dd className="text-sm font-semibold text-[#1f1f1f]">{item.foundedYear}</dd>
                    </div>
                  )}
                  {(item.country || item.city) && (
                    <div className="flex items-start justify-between gap-4 py-3">
                      <dt className="text-xs font-medium text-[#737373]">Location</dt>
                      <dd className="text-right text-sm font-semibold text-[#1f1f1f]">
                        {[item.city, item.country].filter(Boolean).join(", ")}
                      </dd>
                    </div>
                  )}
                  {item.rating && (
                    <div className="flex items-start justify-between gap-4 py-3">
                      <dt className="text-xs font-medium text-[#737373]">Rating</dt>
                      <dd className="text-sm font-semibold text-[#1f1f1f]">
                        {item.rating.toFixed(1)}/5
                        {item.reviewCount ? (
                          <span className="ml-1 font-normal text-[#737373]">({item.reviewCount})</span>
                        ) : null}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Socials */}
            {hasSocials && (
              <div className="rounded-xl border border-[#e0e0e0] bg-white p-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#737373]">Follow</p>
                <div className="flex gap-2">
                  {item.socials?.twitter && (
                    <Link
                      href={`https://twitter.com/${item.socials.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#e0e0e0] text-[#737373] transition-colors hover:bg-[#fafafa] hover:text-[#629649]"
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
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#e0e0e0] text-[#737373] transition-colors hover:bg-[#fafafa] hover:text-[#629649]"
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
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#e0e0e0] text-[#737373] transition-colors hover:bg-[#fafafa] hover:text-[#629649]"
                    >
                      <Facebook size={14} aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
