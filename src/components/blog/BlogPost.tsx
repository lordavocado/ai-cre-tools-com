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

  // Removed table of contents sidebar

  return (
    <article className="max-w-6xl mx-auto px-4 py-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main content */}
        <div className="lg:col-span-12">
          <div
            className="prose prose-lg prose-slate max-w-none mb-12
                       prose-headings:font-semibold prose-headings:tracking-tight
                       prose-h1:text-4xl prose-h1:border-b prose-h1:pb-4
                       prose-h2:text-3xl prose-h2:border-b prose-h2:pb-2
                       prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                       prose-strong:font-semibold prose-code:rounded prose-code:px-1
                       prose-li:my-1 prose-ul:my-2 prose-ol:my-2
                       dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: post.htmlContent }}
          />
        </div>
      </div>

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
