import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { getGuides } from '@/lib/markdown';

export const metadata: Metadata = {
  title: 'Guides - Learn CRE AI | AI CRE Tools',
  description: 'In-depth guides to help commercial real estate professionals learn and apply AI tools effectively.',
  openGraph: {
    title: 'Guides - Learn CRE AI',
    description: 'In-depth guides to help commercial real estate professionals learn and apply AI tools effectively.',
    url: `${siteConfig.url}/guides`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guides - Learn CRE AI',
    description: 'In-depth guides to help commercial real estate professionals learn and apply AI tools effectively.',
  },
};

export default async function GuidesPage() {
  const guides = await getGuides();

  return (
    <div className="container mx-auto px-6 py-16 md:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-serif tracking-tight mb-6">Guides</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Learn how to evaluate, implement, and get results from Commercial Real Estate AI tools.
        </p>
      </div>

      {guides.length === 0 ? (
        <div className="text-center text-muted-foreground">No guides published yet.</div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <Link key={guide.slug} href={`/guides/${guide.slug}`} className="group border rounded-lg p-6 hover:shadow-md transition-all">
              <div className="text-sm text-muted-foreground mb-2">
                {new Date(guide.publishedDate).toLocaleDateString()}
                {guide.readingTime ? ` • ${guide.readingTime}` : ''}
              </div>
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{guide.title}</h2>
              <p className="text-muted-foreground">{guide.excerpt}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

