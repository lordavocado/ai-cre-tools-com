import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BlogPost as BlogPostType } from '@/lib/blog';
import { Card, CardContent } from '@/components/ui/card';

interface BlogPostProps {
  post: BlogPostType;
}

export function BlogPost({ post }: BlogPostProps) {
  const getCategoryLink = (category: string) => {
    const categoryMap: Record<string, string> = {
      'Property Management': '/categories/property-management-operations',
      'Real Estate Investment': '/categories/investment-portfolio-management',
      'Brokerage': '/categories/transaction-brokerage',
      'Market Analysis': '/categories/market-analysis-valuation',
      'Development': '/categories/development-construction',
      'Legal': '/categories/legal-compliance'
    };
    return categoryMap[category] || '/categories';
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Back to Blog Link */}
      <div className="mb-8">
        <Link href="/blog">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <header className="mb-12">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="text-sm">
            {post.category}
          </Badge>
        </div>

        <h1 className="text-4xl font-bold mb-6 leading-tight">
          {post.title}
        </h1>

        <p className="text-xl text-gray-600 mb-6 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(post.publishedDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{post.readingTime}</span>
          </div>
        </div>

        {/* Featured Image */}
        {post.imageUrl && (
          <div className="mb-8">
            <Image
              src={post.imageUrl}
              alt={post.title}
              width={800}
              height={400}
              className="w-full h-64 md:h-80 object-cover rounded-lg"
            />
          </div>
        )}
      </header>

      {/* Content */}
      <div
        className="prose prose-lg prose-neutral max-w-none mb-12 
                   prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-gray-900
                   prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-12 prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-4
                   prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-10 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2
                   prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-gray-800
                   prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-6 prose-h4:text-gray-800
                   prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                   prose-ul:my-4 prose-ul:space-y-1 prose-ol:my-4 prose-ol:space-y-1
                   prose-li:text-gray-700 prose-li:leading-relaxed prose-li:my-1
                   prose-li:marker:text-blue-600
                   prose-strong:text-gray-900 prose-strong:font-semibold
                   prose-em:text-gray-700 prose-em:italic
                   prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:py-2
                   prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:bg-blue-50 prose-blockquote:rounded-r
                   prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-gray-800
                   prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4
                   prose-a:text-blue-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline hover:prose-a:text-blue-700
                   prose-hr:border-gray-200 prose-hr:my-8
                   dark:prose-invert dark:prose-neutral 
                   dark:prose-headings:text-white dark:prose-p:text-gray-300 dark:prose-li:text-gray-300
                   dark:prose-strong:text-white dark:prose-em:text-gray-300
                   dark:prose-blockquote:border-blue-400 dark:prose-blockquote:text-gray-400 dark:prose-blockquote:bg-blue-950
                   dark:prose-code:bg-gray-800 dark:prose-code:text-gray-200
                   dark:prose-a:text-blue-400 hover:dark:prose-a:text-blue-300
                   dark:prose-hr:border-gray-700
                   dark:prose-h1:border-gray-700 dark:prose-h2:border-gray-700"
        dangerouslySetInnerHTML={{ __html: post.htmlContent }}
      />

      {/* Category CTA */}
      <Card className="mt-12">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-3">
              Ready to explore {post.category.toLowerCase()} tools?
            </h3>
            <p className="text-gray-600 mb-4">
              Discover the best AI tools for {post.category.toLowerCase()} and transform your workflow.
            </p>
            <Link href={getCategoryLink(post.category)}>
              <Button>
                Explore {post.category} Tools
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
