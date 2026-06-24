import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDirectoryItems } from '@/lib/supabase';
import { siteConfig } from '@/config/site';
import { getSeoCluster } from '@/config/seo-clusters';
import {
  getComparisonBySlug,
  getResolvableComparisonSlugs,
} from '@/config/seo-comparisons';
import { buildFaqStructuredData } from '@/lib/seo-pages';
import { getCategoryLabel } from '@/config/design-tokens';
import { ExternalLink } from 'lucide-react';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getResolvableComparisonSlugs();
  return slugs.map((pair) => ({ pair }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string }>;
}): Promise<Metadata> {
  const { pair } = await params;
  const items = await getDirectoryItems();
  const comparison = getComparisonBySlug(pair, items);
  if (!comparison) return { title: 'Comparison Not Found' };

  return {
    title: comparison.metaTitle,
    description: comparison.metaDescription,
    alternates: { canonical: `${siteConfig.url}/compare/${pair}` },
    openGraph: {
      title: comparison.metaTitle,
      description: comparison.metaDescription,
      url: `${siteConfig.url}/compare/${pair}`,
    },
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ pair: string }>;
}) {
  const { pair } = await params;
  const items = await getDirectoryItems();
  const comparison = getComparisonBySlug(pair, items);
  if (!comparison) notFound();

  const cluster = getSeoCluster(comparison.relatedCategorySlug);
  const { toolA, toolB } = comparison;

  const rows = [
    { label: 'Tagline', a: toolA.tagline, b: toolB.tagline },
    { label: 'Category', a: getCategoryLabel(toolA.category.split(',')[0]?.trim() ?? ''), b: getCategoryLabel(toolB.category.split(',')[0]?.trim() ?? '') },
    {
      label: 'Key features',
      a: toolA.features?.slice(0, 4).map((f) => f.name).join(', ') || '—',
      b: toolB.features?.slice(0, 4).map((f) => f.name).join(', ') || '—',
    },
    { label: 'Pricing', a: toolA.pricing || 'Contact vendor', b: toolB.pricing || 'Contact vendor' },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildFaqStructuredData(comparison.faqs)),
        }}
      />

      <section className="border-b border-[#e0e0e0] bg-white py-12 md:py-16">
        <div className="container px-6">
          <nav className="mb-6 text-sm text-[#737373]">
            <Link href="/" className="hover:text-[#1f1f1f]">Home</Link>
            <span className="mx-1.5">/</span>
            <Link href="/compare" className="hover:text-[#1f1f1f]">Comparisons</Link>
            <span className="mx-1.5">/</span>
            <span className="text-[#1f1f1f]">{toolA.name} vs {toolB.name}</span>
          </nav>

          <h1 className="text-3xl font-bold tracking-tight text-[#1f1f1f] sm:text-4xl">
            {comparison.h1}
          </h1>
          <p className="mt-2 text-lg text-[#737373]">
            {toolA.name} vs {toolB.name}
          </p>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#737373]">{comparison.verdict}</p>
        </div>
      </section>

      <section className="border-b border-[#e0e0e0] py-12">
        <div className="container overflow-x-auto px-6">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#e0e0e0]">
                <th className="py-3 pr-4 font-semibold text-[#737373]"> </th>
                <th className="py-3 pr-4 font-semibold text-[#1f1f1f]">
                  <Link href={`/${toolA.slug}`} className="hover:text-[#629649]">{toolA.name}</Link>
                </th>
                <th className="py-3 font-semibold text-[#1f1f1f]">
                  <Link href={`/${toolB.slug}`} className="hover:text-[#629649]">{toolB.name}</Link>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-[#e0e0e0]">
                  <th className="py-3 pr-4 font-medium text-[#737373]">{row.label}</th>
                  <td className="py-3 pr-4 text-[#1f1f1f]">{row.a}</td>
                  <td className="py-3 text-[#1f1f1f]">{row.b}</td>
                </tr>
              ))}
              <tr>
                <th className="py-3 pr-4 font-medium text-[#737373]">Website</th>
                <td className="py-3 pr-4">
                  {toolA.website ? (
                    <a href={toolA.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#1f1f1f] hover:underline">
                      Visit <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : '—'}
                </td>
                <td className="py-3">
                  {toolB.website ? (
                    <a href={toolB.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#1f1f1f] hover:underline">
                      Visit <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : '—'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="border-b border-[#e0e0e0] bg-[#fafafa] py-12">
        <div className="container px-6">
          <h2 className="text-xl font-semibold text-[#1f1f1f]">When to choose each</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-[8px] border border-[#e0e0e0] bg-white p-5">
              <h3 className="font-semibold text-[#1f1f1f]">{toolA.name}</h3>
              <p className="mt-2 text-sm leading-7 text-[#737373]">{comparison.whenChooseA}</p>
              <Link href={`/${toolA.slug}/alternatives`} className="mt-3 inline-block text-sm font-medium text-[#629649] hover:underline">
                More {toolA.name} alternatives
              </Link>
            </div>
            <div className="rounded-[8px] border border-[#e0e0e0] bg-white p-5">
              <h3 className="font-semibold text-[#1f1f1f]">{toolB.name}</h3>
              <p className="mt-2 text-sm leading-7 text-[#737373]">{comparison.whenChooseB}</p>
              <Link href={`/${toolB.slug}/alternatives`} className="mt-3 inline-block text-sm font-medium text-[#629649] hover:underline">
                More {toolB.name} alternatives
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-xl font-semibold text-[#1f1f1f]">FAQ</h2>
            <div className="mt-8 divide-y divide-[#e0e0e0]">
              {comparison.faqs.map((faq) => (
                <div key={faq.question} className="py-5 first:pt-0">
                  <h3 className="font-semibold text-[#1f1f1f]">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#737373]">{faq.answer}</p>
                </div>
              ))}
            </div>
            {cluster && (
              <Link
                href={`/categories/${comparison.relatedCategorySlug}`}
                className="mt-8 inline-block text-sm font-medium text-[#1f1f1f] hover:underline"
              >
                Browse all {cluster.h1}
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
