import type { Metadata } from 'next';
import { BlogList } from '@/components/blog/BlogList';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'AI CRE Tools Blog - Insights for Commercial Real Estate Professionals | AI CRE Tools',
  description: 'Stay updated with the latest AI trends in commercial real estate. Expert insights, tool reviews, and practical guides for property managers, investors, and brokers.',
  keywords: [
    'commercial real estate blog',
    'CRE AI insights',
    'real estate technology trends',
    'property management AI',
    'real estate investment AI',
    'brokerage AI tools',
    'CRE technology news',
    'AI in real estate'
  ],
  openGraph: {
    title: 'AI CRE Tools Blog - Insights for Commercial Real Estate Professionals',
    description: 'Stay updated with the latest AI trends in commercial real estate. Expert insights, tool reviews, and practical guides for property managers, investors, and brokers.',
    url: 'https://aicretools.com/blog',
    siteName: siteConfig.seo.openGraph.siteName,
    type: 'website',
    images: [{
      url: siteConfig.seo.openGraph.images.default,
      width: siteConfig.seo.openGraph.images.width,
      height: siteConfig.seo.openGraph.images.height,
      alt: 'AI CRE Tools Blog'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI CRE Tools Blog - CRE AI Insights',
    description: 'Stay updated with the latest AI trends in commercial real estate. Expert insights, tool reviews, and practical guides.',
    site: siteConfig.seo.twitter.site,
    creator: siteConfig.seo.twitter.creator,
    images: [siteConfig.seo.openGraph.images.default]
  }
};

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">AI CRE Tools Blog</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Stay ahead of the curve with expert insights on AI in commercial real estate.
          From property management hacks to investment strategies, we bring you practical
          guides tailored for real estate professionals.
        </p>
      </div>

      <BlogList />
    </div>
  );
}
