import { getGuideBySlug, getGuides } from "@/lib/markdown";
import { getDirectoryItems } from "@/lib/sheets";
import type { Metadata, ResolvingMetadata } from 'next';
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, UserCircle, Clock, Tag, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { DirectoryItemCard } from "@/components/listing/DirectoryItemCard";
import { GuideImage } from "@/components/guide/GuideImage";

// Basic Markdown to HTML (very simple, consider a library for complex needs)
function markdownToHtml(markdown: string): string {
  return markdown
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mt-6 mb-3">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-5 mb-2">$1</h3>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" class="text-primary hover:underline">$1</a>')
    .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
    .replace(/^\s*<li/gm, '<ul><li') // Wrap LIs in ULs (simple heuristic)
    .replace(/<\/li>\s*([^\s<])/gm, '</li></ul>$1') // Close ULs
    .replace(/\n/g, '<br />')
    .replace(/<br \/><ul>/g, '<ul>') // Clean up extra breaks before lists
    .replace(/<\/ul><br \/>/g, '</ul>');
}


type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const guides = await getGuides();
  return guides.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const guide = await getGuideBySlug(params.slug);

  if (!guide) {
    return {
      title: "Guide Not Found",
    };
  }

  return {
    title: guide.title,
    description: guide.excerpt,
    openGraph: {
      title: guide.title,
      description: guide.excerpt,
      images: guide.imageUrl ? [{ url: guide.imageUrl }] : [],
      type: 'article',
      publishedTime: guide.publishedDate,
      authors: guide.author ? [guide.author] : [],
    },
    // twitter: { // Add if you have twitter specific images/creator
    //   card: 'summary_large_image',
    //   title: guide.title,
    //   description: guide.excerpt,
    //   images: guide.imageUrl ? [guide.imageUrl] : [],
    // },
  };
}

// Revalidate every hour
export const revalidate = 3600;

export default async function GuidePage({ params }: Props) {
  const guide = await getGuideBySlug(params.slug);

  if (!guide) {
    notFound();
  }

  const relatedItemsData = guide.relatedItemSlugs 
    ? (await getDirectoryItems()).filter(item => guide.relatedItemSlugs?.includes(item.slug))
    : [];

  const htmlContent = markdownToHtml(guide.content);

  return (
    <div className="container py-12 md:py-16 pl-6">
      <article className="max-w-3xl mx-auto">
        <header className="mb-8">
          {guide.category && (
            <Link href={`/categories/${guide.category}`}>
              <Badge variant="secondary" className="mb-3 capitalize">{guide.category.replace('-', ' ')}</Badge>
            </Link>
          )}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{guide.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">{guide.excerpt}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CalendarDays className="mr-1.5 h-4 w-4" />
              Published on {format(new Date(guide.publishedDate), "MMMM d, yyyy")}
            </div>
            {guide.author && (
              <div className="flex items-center">
                <UserCircle className="mr-1.5 h-4 w-4" />
                By {guide.author}
              </div>
            )}
            {guide.readingTime && (
              <div className="flex items-center">
                <Clock className="mr-1.5 h-4 w-4" />
                {guide.readingTime}
              </div>
            )}
          </div>
        </header>

        {guide.imageUrl && (
          <GuideImage src={guide.imageUrl} alt={guide.title} />
        )}

        <Separator className="my-8" />

        <div 
          className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-primary hover:prose-a:underline prose-img:rounded-md prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />

        {relatedItemsData.length > 0 && (
          <section className="mt-16">
            <Separator className="my-8" />
            <h2 className="text-2xl font-semibold mb-6">Related Tools Mentioned</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedItemsData.map(item => (
                <DirectoryItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}
        
        <div className="mt-12 text-center">
            <Button asChild variant="outline">
                <Link href="/guides">
                    Back to All Guides <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>

      </article>
    </div>
  );
}
