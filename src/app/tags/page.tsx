import type { Metadata } from 'next';
import Link from 'next/link';
import { getDirectoryItems } from '@/lib/supabase';
import { siteConfig } from '@/config/site';
import { getIndexableTags } from '@/lib/seo-pages';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Browse CRE AI Tools by Capability | AI CRE Tools',
  description:
    'Explore commercial real estate AI tools by capability — lease abstraction, underwriting, deal sourcing, portfolio analytics, and more.',
  alternates: { canonical: `${siteConfig.url}/tags` },
};

export default async function TagsHubPage() {
  const items = await getDirectoryItems();
  const indexableTags = getIndexableTags(items);

  return (
    <div className="container px-6 py-16 md:py-20">
      <div className="mb-12 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-[#1f1f1f] md:text-4xl">
          Browse by capability
        </h1>
        <p className="mt-3 text-base leading-7 text-[#737373]">
          Curated workflow tags for commercial real estate AI software. Each page lists tools
          matched to real product capabilities in our directory.
        </p>
      </div>

      {indexableTags.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {indexableTags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/tags/${tag.slug}`}
              className="group flex flex-col gap-2 rounded-[8px] border border-[#e0e0e0] bg-[#fafafa] p-5 transition-colors hover:border-[rgba(98,150,73,0.4)] hover:bg-white"
            >
              <h2 className="text-lg font-semibold text-[#1f1f1f] group-hover:text-[#629649]">
                {tag.label}
              </h2>
              <p className="line-clamp-2 text-sm text-[#737373]">{tag.intro}</p>
              <p className="mt-auto text-xs font-medium text-[#737373]">
                {tag.toolCount} {tag.toolCount === 1 ? 'tool' : 'tools'}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#737373]">
          Capability pages appear when enough tools match each workflow. Browse{' '}
          <Link href="/categories" className="font-medium text-[#1f1f1f] underline">
            categories
          </Link>{' '}
          in the meantime.
        </p>
      )}
    </div>
  );
}
