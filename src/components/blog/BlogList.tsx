import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { BlogPost } from '@/lib/blog';

interface BlogListProps {
  posts: BlogPost[];
}

export function BlogList({ posts }: BlogListProps) {

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-4">No blog posts yet</h3>
        <p className="text-gray-600 mb-6">
          We're working on bringing you the latest insights in commercial real estate AI.
          Check back soon for new content!
        </p>
        <Link href="/categories">
          <Button>Explore AI Tools Instead</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Featured Post */}
      {posts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Article</h2>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="md:flex">
              {posts[0].imageUrl && (
                <div className="md:w-1/3">
                  <Image
                    src={posts[0].imageUrl}
                    alt={posts[0].title}
                    width={400}
                    height={250}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
              )}
              <div className="md:w-2/3 p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary">{posts[0].category}</Badge>
                </div>
                <h3 className="text-2xl font-bold mb-3 hover:text-blue-600">
                  <Link href={`/blog/${posts[0].slug}`}>
                    {posts[0].title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {posts[0].excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{posts[0].author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(posts[0].publishedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{posts[0].readingTime}</span>
                  </div>
                </div>
                <Link href={`/blog/${posts[0].slug}`}>
                  <Button>Read More</Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* All Posts */}
      <div>
        <h2 className="text-2xl font-bold mb-6">All Articles</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(1).map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                {post.imageUrl && (
                  <div className="mb-3">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      width={300}
                      height={200}
                      className="w-full h-32 object-cover rounded"
                    />
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {post.category}
                  </Badge>
                </div>
                <h3 className="font-bold text-lg leading-tight hover:text-blue-600">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(post.publishedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{post.readingTime}</span>
                    </div>
                  </div>
                </div>
                <Link href={`/blog/${post.slug}`} className="mt-3 inline-block">
                  <Button variant="outline" size="sm" className="w-full">
                    Read Article
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
