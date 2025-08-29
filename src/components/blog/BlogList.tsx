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
      <div className="text-center py-20">
        <h3 className="text-2xl font-semibold mb-6">No blog posts yet</h3>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          We're working on bringing you the latest insights in commercial real estate AI.
          Check back soon for new content!
        </p>
        <Link href="/categories">
          <Button size="lg">Explore AI Tools Instead</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Featured Post */}
      {posts.length > 0 && (
        <div className="mb-20">
          <h2 className="text-3xl font-serif mb-8">Featured Article</h2>
          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
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
                <h3 className="text-3xl font-serif mb-4 hover:text-blue-600 transition-colors">
                  <Link href={`/blog/${posts[0].slug}`}>
                    {posts[0].title}
                  </Link>
                </h3>
                <p className="text-muted-foreground mb-6 line-clamp-3 text-lg leading-relaxed">
                  {posts[0].excerpt}
                </p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{posts[0].author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(posts[0].publishedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{posts[0].readingTime}</span>
                  </div>
                </div>
                <Link href={`/blog/${posts[0].slug}`}>
                  <Button size="lg">Read More</Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* All Posts */}
      <div>
        <h2 className="text-3xl font-serif mb-10">All Articles</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(1).map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                {post.imageUrl && (
                  <div className="mb-4">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      width={300}
                      height={200}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {post.category}
                  </Badge>
                </div>
                <h3 className="font-bold text-xl leading-tight hover:text-blue-600 transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-base mb-6 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.publishedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.readingTime}</span>
                    </div>
                  </div>
                </div>
                <Link href={`/blog/${post.slug}`} className="mt-4 inline-block w-full">
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
