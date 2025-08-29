import type { Metadata } from 'next';
import { BlogList } from '@/components/blog/BlogList';
import { getAllBlogPosts, type BlogPost } from '@/lib/blog';
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
  // Get blog posts on the server side to avoid file system access issues
  let posts: BlogPost[];
  try {
    posts = getAllBlogPosts();
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
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-serif tracking-tight mb-6">AI CRE Tools Blog</h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Stay ahead of the curve with expert insights on AI in commercial real estate.
            From property management hacks to investment strategies, we bring you practical
            guides tailored for real estate professionals.
          </p>
        </div>

        <BlogList posts={posts} />
      </div>
    </>
  );
}
