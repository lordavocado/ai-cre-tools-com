import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { getGuides } from '@/lib/markdown';

export const metadata: Metadata = {
  title: `Guides | ${siteConfig.name}`,
  description: 'Practical guides and tutorials for AI in commercial real estate.',
};

export default async function GuidesIndexPage() {
  const guides = await getGuides();

  return (
    <main className="container pl-6 py-12">
      <h1 className="text-4xl font-bold mb-6">Guides</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Actionable, no-fluff guides on AI tools and workflows for CRE.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <Link key={guide.slug} href={`/guides/${guide.slug}`} className="block border rounded-lg p-5 hover:bg-muted/40">
            <h2 className="text-xl font-semibold mb-2">{guide.title}</h2>
            <p className="text-sm text-muted-foreground line-clamp-3">{guide.excerpt}</p>
            <div className="mt-3 text-xs text-neutral-500">
              {new Date(guide.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              {guide.readingTime ? ` · ${guide.readingTime}` : null}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

