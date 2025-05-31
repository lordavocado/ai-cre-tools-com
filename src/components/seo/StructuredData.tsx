import type { Guide } from "@/lib/markdown";
import { siteConfig } from "@/config/site";

interface ArticleStructuredDataProps {
  guide: Guide;
  url: string;
}

export function ArticleStructuredData({ guide, url }: ArticleStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.excerpt,
    image: guide.imageUrl ? `${siteConfig.url}${guide.imageUrl}` : `${siteConfig.url}/og-image.png`,
    url: url,
    datePublished: guide.publishedDate,
    dateModified: guide.publishedDate, // You could add a lastModified field
    author: {
      "@type": "Person",
      name: guide.author || "Analytics Team",
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    articleSection: guide.category ? guide.category.replace('-', ' ') : 'Guides',
    keywords: [
      guide.title.toLowerCase(),
      ...(guide.category ? [guide.category.replace('-', ' ')] : []),
      'guide', 'tutorial', 'analytics', 'product analytics'
    ].join(', '),
    wordCount: guide.content ? guide.content.split(/\s+/).length : undefined,
    timeRequired: guide.readingTime || '5 min read',
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    ...(guide.relatedItems && guide.relatedItems.length > 0 && {
      mentions: guide.relatedItems.map(slug => ({
        "@type": "SoftwareApplication",
        name: slug.replace('-', ' '),
        url: `${siteConfig.url}/${slug}`,
      }))
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface BreadcrumbStructuredDataProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface WebsiteStructuredDataProps {
  searchUrl?: string;
}

export function WebsiteStructuredData({ searchUrl }: WebsiteStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: 'en-US',
    ...(searchUrl && {
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${searchUrl}?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    }),
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 