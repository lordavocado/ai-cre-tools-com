import { getGuideBySlug, getGuides } from "@/lib/markdown";
import { getDirectoryItems } from "@/lib/sheets";
import { markdownToHtml } from "@/lib/markdown-renderer";
import { ArticleStructuredData, BreadcrumbStructuredData } from "@/components/seo/StructuredData";
import { RelatedGuides } from "@/components/guide/RelatedGuides";
import type { Metadata, ResolvingMetadata } from 'next';
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, UserCircle, Clock, Tag, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { DirectoryItemCard } from "@/components/listing/DirectoryItemCard";
import { GuideImage } from "@/components/guide/GuideImage";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { GuideCard } from "@/components/guide/GuideCard";


type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const guides = await getGuides();
  return guides.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    return {
      title: "Guide Not Found | Product Analytics Tools",
      description: "The guide you're looking for could not be found.",
    };
  }

  const parentMetadata = await parent;
  const siteUrl = siteConfig.url;
  const guideUrl = `${siteUrl}/guides/${guide.slug}`;
  const imageUrl = guide.imageUrl ? `${siteUrl}${guide.imageUrl}` : `${siteUrl}/og-image.png`;
  
  // Generate dynamic keywords based on guide content and category
  const keywords = [
    guide.title.toLowerCase(),
    ...(guide.category ? [guide.category.replace('-', ' ')] : []),
    'guide', 'tutorial', 'how-to',
    'product analytics', 'analytics tools', 'data analysis',
    ...(guide.author ? [guide.author.toLowerCase()] : [])
  ].join(', ');

  return {
    title: `${guide.title} | ${siteConfig.name}`,
    description: guide.excerpt,
    keywords: keywords,
    authors: guide.author ? [{ name: guide.author }] : [{ name: 'Analytics Team' }],
    creator: guide.author || 'Analytics Team',
    publisher: siteConfig.name,
    category: guide.category ? guide.category.replace('-', ' ') : 'Guides',
    
    // Canonical URL
    alternates: {
      canonical: guideUrl,
    },

    // OpenGraph metadata
    openGraph: {
      title: guide.title,
      description: guide.excerpt,
      url: guideUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: guide.title,
        },
      ],
      type: 'article',
      publishedTime: guide.publishedDate,
      modifiedTime: guide.publishedDate, // You could add a lastModified field to frontmatter
      authors: guide.author ? [guide.author] : ['Analytics Team'],
      section: guide.category ? guide.category.replace('-', ' ') : 'Guides',
      tags: guide.category ? [guide.category.replace('-', ' ')] : ['guide'],
    },

    // Twitter metadata
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description: guide.excerpt,
      creator: siteConfig.social?.twitter || '@productanalyticstools',
      site: siteConfig.social?.twitter || '@productanalyticstools',
      images: [
        {
          url: imageUrl,
          alt: guide.title,
        },
      ],
    },

    // Additional metadata for better indexing
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Article-specific metadata
    other: {
      'article:author': guide.author || 'Analytics Team',
      'article:published_time': guide.publishedDate,
      'article:section': guide.category ? guide.category.replace('-', ' ') : 'Guides',
      'article:tag': guide.category ? guide.category.replace('-', ' ') : 'guide',
      'reading-time': guide.readingTime || '5 min read',
    },
  };
}

// Revalidate every hour
export const revalidate = 3600;

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const relatedItemsData = guide.relatedItems && guide.relatedItems.length > 0
    ? (await getDirectoryItems()).filter(item => guide.relatedItems?.includes(item.slug))
    : [];

  // Get all guides for related guides component
  const allGuides = await getGuides();

  const htmlContent = markdownToHtml(guide.content);
  const guideUrl = `${siteConfig.url}/guides/${guide.slug}`;

  // Breadcrumb data for structured data
  const breadcrumbItems = [
    { name: 'Home', url: siteConfig.url },
    { name: 'Guides', url: `${siteConfig.url}/guides` },
    { name: guide.title, url: guideUrl },
  ];

  return (
    <>
      {/* Structured Data */}
      <ArticleStructuredData guide={guide} url={guideUrl} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      
      <div className="container py-12 md:py-16 pl-6">
        <article className="max-w-3xl mx-auto">
        <header className="mb-8">
          {guide.category && (
            <Link href={`/categories/${guide.category}`}>
              <Badge variant="secondary" className="mb-3 capitalize">{guide.category.replace('-', ' ')}</Badge>
            </Link>
          )}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{guide.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">{guide.excerpt}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CalendarDays className="mr-1.5 h-4 w-4" />
              Published on {format(new Date(guide.publishedDate), "MMMM d, yyyy")}
            </div>
            {guide.author && (
              <div className="flex items-center">
                <UserCircle className="mr-1.5 h-4 w-4" />
                By {guide.author}
              </div>
            )}
            {guide.readingTime && (
              <div className="flex items-center">
                <Clock className="mr-1.5 h-4 w-4" />
                {guide.readingTime}
              </div>
            )}
          </div>
        </header>

        {guide.imageUrl && (
          <GuideImage src={guide.imageUrl} alt={guide.title} />
        )}

        <Separator className="my-8" />

        <div 
          className="max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />

        {relatedItemsData.length > 0 && (
          <section className="mt-16">
            <Separator className="my-8" />
            <h2 className="text-2xl font-semibold mb-6">Related Tools Mentioned</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedItemsData.map(item => (
                <DirectoryItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* Related Guides Section for Internal Linking */}
        <RelatedGuides currentGuide={guide} allGuides={allGuides} maxItems={3} />
        
        <div className="mt-12 text-center">
            <Button asChild variant="outline">
                <Link href="/guides">
                    Back to All Guides <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>

      </article>
    </div>
    </>
  );
}
