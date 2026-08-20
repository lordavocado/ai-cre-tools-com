import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { BlogPost } from '@/lib/blog';

interface BlogListProps {
  posts: BlogPost[];
}

export function BlogList({ posts }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">No blog posts yet</h3>
        <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
          We're working on bringing you the latest insights in commercial real estate AI.
          Check back soon for new content!
        </p>
        <Link
          href="/categories"
          className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
        >
          Explore AI Tools Instead
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Featured Post */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Featured Article</h2>
        <div className="overflow-hidden rounded-xl border border-border bg-background transition-[border-color,box-shadow,transform] duration-200 hover:border-foreground/20 hover:shadow-md">
          <div className="md:flex">
            {posts[0].imageUrl && (
              <div className="md:w-1/3">
                <Image
                  src={posts[0].imageUrl}
                  alt={posts[0].title}
                  width={400}
                  height={250}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
            )}
            <div className="md:w-2/3 p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{posts[0].category}</Badge>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 hover:text-gray-600 transition-colors">
                <Link href={`/blog/${posts[0].slug}`}>
                  {posts[0].title}
                </Link>
              </h3>
              <p className="text-sm text-gray-500 mb-6 line-clamp-3 leading-6">
                {posts[0].excerpt}
              </p>
              <div className="flex items-center gap-5 text-xs text-gray-400 mb-6">
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  <span>{posts[0].author}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{new Date(posts[0].publishedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{posts[0].readingTime}</span>
                </div>
              </div>
              <Link
                href={`/blog/${posts[0].slug}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
              >
                Read More <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* All Posts */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-8">All Articles</h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(1).map((post) => (
            <div
              key={post.id}
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-background transition-[border-color,box-shadow,transform] duration-200 hover:border-foreground/20 hover:shadow-md"
            >
              {post.imageUrl && (
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {post.category}
                  </Badge>
                </div>
                <h3 className="font-semibold text-gray-900 leading-tight mb-3 hover:text-gray-600 transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
                <p className="text-sm text-gray-500 mb-5 line-clamp-3 leading-6 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-5">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date(post.publishedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{post.readingTime}</span>
                  </div>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:border-gray-300"
                >
                  Read Article
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
