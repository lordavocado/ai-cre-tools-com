import { getDirectoryItemBySlug, getDirectoryItems } from "@/lib/supabase";
import { isValidSlug, isValidSlugFormat } from "@/lib/routing-utils-client";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Twitter, Linkedin, Facebook } from "lucide-react";
import { DirectoryItemCard } from "@/components/listing/DirectoryItemCard";
import { CategoryChipsWithIcons } from "@/components/ui/category-chips-with-icons";
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
      <div className="border-b-2 border-black bg-white">
        <div className="container px-6 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2">
            <Link
              href="/"
              className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-colors hover:text-black"
            >
              Home
            </Link>
            <span className="font-mono text-[10px] text-slate-400">/</span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-black">
              {item.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Tool header */}
      <div className="border-b-2 border-black bg-white">
        <div className="container px-6 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            {/* Favicon */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden border-2 border-black bg-white">
              <SafeImage
                src={item.imageUrl}
                website={item.website}
                alt={`${item.name} logo`}
                className="h-12 w-12 object-contain"
              />
            </div>

            {/* Name, tagline, categories, CTAs */}
            <div className="flex-1 min-w-0">
              <h1 className="font-serif text-4xl font-bold leading-tight text-black md:text-5xl">
                {item.name}
              </h1>
              {item.tagline && (
                <p className="mt-2 text-lg leading-7 text-slate-600">{item.tagline}</p>
              )}
              {item.category && (
                <div className="mt-4">
                  <CategoryChipsWithIcons categories={item.category} variant="outline" />
                </div>
              )}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {item.website && (
                  <Link
                    href={item.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border-2 border-black bg-black px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-black"
                  >
                    Visit Website
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </Link>
                )}
                <FavoriteButton
                  toolId={item.id}
                  variant="with-text"
                  className="rounded-none border-2 border-black bg-white shadow-none hover:bg-black hover:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body: main content + sidebar */}
      <div className="container px-6 py-10">
        <div className="grid grid-cols-1 border-2 border-black md:grid-cols-3">

          {/* Left: content */}
          <div className="md:col-span-2 md:border-r-2 md:border-black">

            {/* About */}
            {item.description && (
              <div className="border-b-2 border-black p-8">
                <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-widest text-black">
                  About {item.name}
                </p>
                <div
                  className="prose prose-slate max-w-none leading-relaxed text-slate-700"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              </div>
            )}

            {/* Key Features */}
            {item.features && item.features.length > 0 && (
              <div className="border-b-2 border-black p-8">
                <p className="mb-5 font-mono text-[10px] font-bold uppercase tracking-widest text-black">
                  Key Features
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {item.features.map((feature, index) => (
                    <div key={index} className="border-l-2 border-black pl-4">
                      <p className="text-sm font-bold text-black">{feature.name}</p>
                      {feature.description && (
                        <p className="mt-1 text-sm leading-6 text-slate-600">
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
              <div className="border-b-2 border-black p-8">
                <p className="mb-5 font-mono text-[10px] font-bold uppercase tracking-widest text-black">
                  Pros & Cons
                </p>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-[#9fcc89]">
                      Pros
                    </p>
                    <ul className="space-y-2">
                      {item.pros?.map((pro: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-black" aria-hidden="true" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Cons
                    </p>
                    <ul className="space-y-2">
                      {item.cons?.map((con: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-slate-400" aria-hidden="true" />
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
              <div className="p-8">
                <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-widest text-black">
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="border-2 border-black px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-black"
                    >
                      {typeof tag === "string" ? tag.trim() : tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: quick facts sidebar */}
          <div className="flex flex-col border-t-2 border-black md:border-t-0">
            {hasQuickFacts && (
              <div className="border-b-2 border-black p-6">
                <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-widest text-black">
                  Quick Facts
                </p>
                <dl className="divide-y-2 divide-black">
                  {item.pricing && (
                    <div className="flex items-start justify-between gap-4 py-3">
                      <dt className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Pricing
                      </dt>
                      <dd className="text-right text-sm font-bold text-black">
                        {item.pricing}
                      </dd>
                    </div>
                  )}
                  {item.foundedYear && (
                    <div className="flex items-start justify-between gap-4 py-3">
                      <dt className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Founded
                      </dt>
                      <dd className="text-sm font-bold text-black">{item.foundedYear}</dd>
                    </div>
                  )}
                  {(item.country || item.city) && (
                    <div className="flex items-start justify-between gap-4 py-3">
                      <dt className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Location
                      </dt>
                      <dd className="text-right text-sm font-bold text-black">
                        {[item.city, item.country].filter(Boolean).join(", ")}
                      </dd>
                    </div>
                  )}
                  {item.rating && (
                    <div className="flex items-start justify-between gap-4 py-3">
                      <dt className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Rating
                      </dt>
                      <dd className="text-sm font-bold text-black">
                        {item.rating.toFixed(1)}/5
                        {item.reviewCount ? (
                          <span className="ml-1 font-normal text-slate-500">
                            ({item.reviewCount})
                          </span>
                        ) : null}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {hasSocials && (
              <div className="p-6">
                <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-black">
                  Follow
                </p>
                <div className="flex gap-2">
                  {item.socials?.twitter && (
                    <Link
                      href={`https://twitter.com/${item.socials.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter"
                      className="inline-flex h-8 w-8 items-center justify-center border-2 border-black text-black transition-colors hover:bg-black hover:text-white"
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
                      className="inline-flex h-8 w-8 items-center justify-center border-2 border-black text-black transition-colors hover:bg-black hover:text-white"
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
                      className="inline-flex h-8 w-8 items-center justify-center border-2 border-black text-black transition-colors hover:bg-black hover:text-white"
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

      {/* Related tools */}
      {relatedItems.length > 0 && (
        <div className="container px-6 pb-16">
          <p className="mb-6 border-t-2 border-black pt-8 font-mono text-[10px] font-bold uppercase tracking-widest text-black">
            Similar Tools
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {relatedItems.map((relatedItem) => (
              <DirectoryItemCard key={relatedItem.id} item={relatedItem} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
