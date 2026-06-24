import type { Metadata } from 'next';
import Link from 'next/link';
import { getDirectoryItems } from '@/lib/supabase';
import { siteConfig } from '@/config/site';
import { getResolvedComparisons } from '@/config/seo-comparisons';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'CRE AI Tool Comparisons | AI CRE Tools',
  description:
    'Side-by-side comparisons of commercial real estate AI tools. Compare diligence, underwriting, PM, and brokerage platforms.',
  alternates: { canonical: `${siteConfig.url}/compare` },
};

export default async function CompareHubPage() {
  const items = await getDirectoryItems();
  const comparisons = getResolvedComparisons(items);

  return (
    <div className="container px-6 py-16 md:py-20">
      <div className="mb-12 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-[#1f1f1f] md:text-4xl">
          CRE AI tool comparisons
        </h1>
        <p className="mt-3 text-base leading-7 text-[#737373]">
          Curated head-to-head comparisons for commercial real estate software. Each page compares
          two directory tools from the same workflow category.
        </p>
      </div>

      {comparisons.length > 0 ? (
        <ul className="divide-y divide-[#e0e0e0] border-y border-[#e0e0e0]">
          {comparisons.map((comparison) => (
            <li key={comparison.slug}>
              <Link
                href={`/compare/${comparison.slug}`}
                className="flex flex-col gap-1 py-5 transition-colors hover:bg-[#fafafa] sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-[#1f1f1f]">{comparison.h1}</p>
                  <p className="mt-1 text-sm text-[#737373]">
                    {comparison.toolA.name} vs {comparison.toolB.name}
                  </p>
                </div>
                <span className="text-sm font-medium text-[#629649]">View comparison</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[#737373]">Comparisons appear when enough tools exist per category.</p>
      )}
    </div>
  );
}
