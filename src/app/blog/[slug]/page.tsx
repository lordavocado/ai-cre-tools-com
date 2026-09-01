import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BlogPost } from '@/components/blog/BlogPost';
import { getBlogPost, getAllBlogPosts } from '@/lib/blog';
import { siteConfig } from '@/config/site';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found | AI CRE Tools Blog',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} | AI CRE Tools Blog`,
    description: post.excerpt,
    keywords: [
      'commercial real estate AI',
      'CRE technology',
      'real estate blog',
      post.category.toLowerCase(),
      'AI tools',
      'property management',
      'real estate investment'
    ],
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${siteConfig.url}/blog/${post.slug}`,
      siteName: siteConfig.seo.openGraph.siteName,
      type: 'article',
      authors: [post.author],
      images: [{
        url: post.imageUrl || siteConfig.seo.openGraph.images.default,
        width: 1200,
        height: 630,
        alt: post.title
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.imageUrl || siteConfig.seo.openGraph.images.default]
    },
    alternates: {
      canonical: `${siteConfig.url}/blog/${post.slug}`,
    }
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const posts = await getAllBlogPosts();
  const position = posts.findIndex((entry) => entry.slug === slug);
  const adjacentPosts = [posts[position - 1], posts[position + 1]].filter(Boolean);

  // Generate structured data for blog post
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "AI CRE Tools",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.url}/ai-cre-tools-logo.jpg`
      }
    },
    "datePublished": post.publishedDate,
    "dateModified": post.publishedDate,
    "image": post.imageUrl || siteConfig.seo.openGraph.images.default,
    "url": `${siteConfig.url}/blog/${post.slug}`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${post.slug}`
    },
    "articleSection": post.category,
    "keywords": [
      "commercial real estate AI",
      "CRE technology", 
      post.category.toLowerCase(),
      "AI tools",
      "property management",
      "real estate investment"
    ].join(", ")
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <BlogPost post={post} />
      {adjacentPosts.length > 0 && (
        <nav aria-label="More articles" className="mx-auto max-w-6xl px-4 pb-12">
          <h2 className="text-xl font-semibold">More CRE insights</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {adjacentPosts.map((entry) => (
              <li key={entry.slug}>
                <Link href={`/blog/${entry.slug}`} className="underline-offset-2 hover:underline">{entry.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
