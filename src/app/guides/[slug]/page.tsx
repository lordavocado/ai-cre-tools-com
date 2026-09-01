import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { getGuides, getGuideBySlug } from '@/lib/markdown';
import { markdownToHtml } from '@/lib/markdown-renderer';

export async function generateStaticParams() {
  const guides = await getGuides();
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) {
    return { title: 'Guide Not Found' };
  }
  return {
    title: `${guide.title} | ${siteConfig.name}`,
    description: guide.excerpt,
    openGraph: {
      title: guide.title,
      description: guide.excerpt,
      url: `${siteConfig.url}/guides/${guide.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description: guide.excerpt,
    },
    alternates: {
      canonical: `${siteConfig.url}/guides/${guide.slug}`,
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) notFound();
  const html = await markdownToHtml(guide.content);
  const guides = await getGuides();
  const position = guides.findIndex((candidate) => candidate.slug === slug);
  const adjacentGuides = [guides[position - 1], guides[position + 1]].filter(Boolean);

  return (
    <main className="container pl-6 py-12">
      <div className="mb-6">
        <Link href="/guides" className="text-sm text-muted-foreground hover:underline">← All guides</Link>
      </div>
      <h1 className="text-4xl font-bold mb-4">{guide.title}</h1>
      <p className="text-lg text-muted-foreground mb-8">{guide.excerpt}</p>
      <article className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: html }} />
      {adjacentGuides.length > 0 && (
        <nav aria-label="More guides" className="mt-12 border-t pt-8">
          <h2 className="text-xl font-semibold">More practical guides</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {adjacentGuides.map((candidate) => (
              <li key={candidate.slug}>
                <Link href={`/guides/${candidate.slug}`} className="underline-offset-2 hover:underline">
                  {candidate.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </main>
  );
}
