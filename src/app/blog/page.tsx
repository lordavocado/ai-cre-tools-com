import type { Metadata } from 'next';
import { BlogList } from '@/components/blog/BlogList';
import { getAllBlogPosts, type BlogPost } from '@/lib/blog';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'CRE AI Blog - Insights & Trends | AI CRE Tools',
  description: 'Latest AI trends in commercial real estate. Expert insights, tool reviews & guides for CRE professionals.',
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
    title: 'CRE AI Blog - Insights & Trends | AI CRE Tools',
    description: 'Latest AI trends in commercial real estate. Expert insights, tool reviews & guides for CRE professionals.',
    url: `${siteConfig.url}/blog`,
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
    title: 'CRE AI Blog | AI CRE Tools',
    description: 'Latest AI trends in commercial real estate. Expert insights & tool reviews for CRE pros.',
    site: siteConfig.seo.twitter.site,
    creator: siteConfig.seo.twitter.creator,
    images: [siteConfig.seo.openGraph.images.default]
  },
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  }
};

export default async function BlogPage() {
  // Get blog posts on the server side to avoid file system access issues
  let posts: BlogPost[];
  try {
    posts = await getAllBlogPosts();
  } catch (error) {
    console.error('Failed to load blog posts:', error);
    posts = [];
  }

  // Generate structured data for blog listing page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "AI CRE Tools Blog",
    "description": "Expert insights on AI in commercial real estate. From property management to investment strategies, practical guides for real estate professionals.",
    "url": `${siteConfig.url}/blog`,
    "publisher": {
      "@type": "Organization", 
      "name": "AI CRE Tools",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.url}/ai-cre-tools-logo.jpg`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog`
    },
    "blogPost": posts.slice(0, 5).map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "url": `${siteConfig.url}/blog/${post.slug}`,
      "datePublished": post.publishedDate,
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "image": post.imageUrl || siteConfig.seo.openGraph.images.default
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="mb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Blog</p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">AI CRE Tools Blog</h1>
          <p className="mt-4 text-sm text-gray-500 max-w-2xl leading-6">
            Expert insights on AI in commercial real estate. From property management to investment strategies,
            practical guides for real estate professionals.
          </p>
        </div>

        <BlogList posts={posts} />
      </div>
    </>
  );
}
