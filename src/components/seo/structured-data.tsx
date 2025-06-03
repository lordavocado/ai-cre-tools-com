import { siteConfig } from '@/config/site';

interface StructuredDataProps {
  type?: 'website' | 'article' | 'product' | 'organization';
  data?: Record<string, any>;
}

/**
 * Structured Data Component for Enhanced SEO
 * 
 * Generates JSON-LD structured data to help search engines
 * better understand your content and improve search results.
 */
export function StructuredData({ type = 'website', data = {} }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.description,
    };

    switch (type) {
      case 'website':
        return {
          ...baseData,
          '@type': 'WebSite',
          publisher: {
            '@type': 'Organization',
            name: siteConfig.name,
            url: siteConfig.url,
            logo: {
              '@type': 'ImageObject',
              url: `${siteConfig.url}/logo.png`,
            },
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: `${siteConfig.url}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
          ...data,
        };

      case 'organization':
        return {
          ...baseData,
          '@type': 'Organization',
          logo: `${siteConfig.url}/logo.png`,
          sameAs: [
            // Add your social media URLs here
            // 'https://twitter.com/yourhandle',
            // 'https://linkedin.com/company/yourcompany',
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            availableLanguage: ['English'],
          },
          ...data,
        };

      case 'article':
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: data.title || siteConfig.name,
          description: data.description || siteConfig.description,
          url: data.url || siteConfig.url,
          datePublished: data.datePublished || new Date().toISOString(),
          dateModified: data.dateModified || new Date().toISOString(),
          author: {
            '@type': 'Organization',
            name: siteConfig.name,
            url: siteConfig.url,
          },
          publisher: {
            '@type': 'Organization',
            name: siteConfig.name,
            url: siteConfig.url,
            logo: {
              '@type': 'ImageObject',
              url: `${siteConfig.url}/logo.png`,
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': data.url || siteConfig.url,
          },
          image: data.image ? {
            '@type': 'ImageObject',
            url: data.image,
          } : undefined,
          ...data,
        };

      case 'product':
        return {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: data.name || siteConfig.name,
          description: data.description || siteConfig.description,
          url: data.url || siteConfig.url,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web Browser',
          offers: data.offers ? {
            '@type': 'Offer',
            ...data.offers,
          } : undefined,
          aggregateRating: data.rating ? {
            '@type': 'AggregateRating',
            ...data.rating,
          } : undefined,
          ...data,
        };

      default:
        return baseData;
    }
  };

  const structuredData = getStructuredData();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
} 