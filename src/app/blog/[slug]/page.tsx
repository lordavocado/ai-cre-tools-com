import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogPost } from '@/components/blog/BlogPost';
import { getBlogPost, getAllBlogPosts } from '@/lib/blog';
import { siteConfig } from '@/config/site';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

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
      url: `https://aicretools.com/blog/${post.slug}`,
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
    }
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return <BlogPost post={post} />;
}
