import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { getGuideBySlug, getGuides } from '@/lib/markdown';
import { markdownToHtml, generateTableOfContents } from '@/lib/markdown-renderer';

interface GuidePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const guides = await getGuides();
  return guides.map(g => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) return {};
  return {
    title: `${guide.title} | AI CRE Tools`,
    description: guide.excerpt,
    openGraph: {
      title: guide.title,
      description: guide.excerpt,
      url: `${siteConfig.url}/guides/${guide.slug}`,
      type: 'article',
      images: guide.imageUrl ? [{ url: guide.imageUrl } as any] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description: guide.excerpt,
      images: guide.imageUrl ? [guide.imageUrl] : undefined,
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) return notFound();

  const html = await markdownToHtml(guide.content);
  const toc = generateTableOfContents(guide.content);

  return (
    <div className="container mx-auto px-6 py-16 md:py-24">
      <article className="mx-auto max-w-3xl">
        <header className="mb-10">
          <div className="text-sm text-muted-foreground mb-2">
            {new Date(guide.publishedDate).toLocaleDateString()} {guide.readingTime ? `• ${guide.readingTime}` : ''}
          </div>
          <h1 className="text-3xl md:text-5xl font-serif tracking-tight mb-4">{guide.title}</h1>
          {guide.excerpt && <p className="text-lg text-muted-foreground">{guide.excerpt}</p>}
        </header>

        {toc.length > 2 && (
          <aside className="border rounded-md p-4 mb-8 bg-muted/30">
            <h2 className="text-sm font-semibold mb-3">On this page</h2>
            <ul className="text-sm space-y-2">
              {toc.map(item => (
                <li key={item.id} className="ml-0" style={{ marginLeft: (item.level - 1) * 12 }}>
                  <a className="text-primary hover:underline" href={`#${item.id}`}>{item.text}</a>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <div className="prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </div>
  );
}

