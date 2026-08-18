import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategories } from '@/lib/supabase';
import { siteConfig } from '@/config/site';
import {
  getAllGlossarySlugs,
  getGlossaryTerm,
} from '@/config/seo-glossary';
import { getSeoCluster } from '@/config/seo-clusters';
import { getSeoTag } from '@/config/seo-tags';

export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllGlossarySlugs().map((term) => ({ term }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ term: string }>;
}): Promise<Metadata> {
  const { term: slug } = await params;
  const entry = getGlossaryTerm(slug);
  if (!entry) return { title: 'Term Not Found' };

  return {
    title: entry.metaTitle,
    description: entry.metaDescription,
    alternates: { canonical: `${siteConfig.url}/glossary/${slug}` },
    openGraph: {
      title: entry.metaTitle,
      description: entry.metaDescription,
      url: `${siteConfig.url}/glossary/${slug}`,
    },
  };
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ term: string }>;
}) {
  const { term: slug } = await params;
  const entry = getGlossaryTerm(slug);
  if (!entry) notFound();

  const categories = await getCategories(false);
  const relatedCategories = entry.relatedCategorySlugs
    .map((s) => categories.find((c) => c.slug === s))
    .filter((c) => c !== undefined);

  const pageUrl = `${siteConfig.url}/glossary/${slug}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'DefinedTerm',
            name: entry.term,
            description: entry.definition,
            url: pageUrl,
            inDefinedTermSet: {
              '@type': 'DefinedTermSet',
              name: 'AI CRE Tools Glossary',
              url: `${siteConfig.url}/glossary`,
            },
          }),
        }}
      />
      <article className="container px-6 py-16 md:py-20">
        <nav className="mb-8 text-sm text-[#737373]">
          <Link href="/" className="hover:text-[#1f1f1f]">Home</Link>
          <span className="mx-1.5">/</span>
          <Link href="/glossary" className="hover:text-[#1f1f1f]">Glossary</Link>
          <span className="mx-1.5">/</span>
          <span className="text-[#1f1f1f]">{entry.term}</span>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight text-[#1f1f1f] sm:text-4xl">
          {entry.h1}
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-[#1f1f1f]">{entry.definition}</p>

        {entry.faqs.length > 0 && (
          <div className="mt-12 max-w-3xl">
            <h2 className="text-lg font-semibold text-[#1f1f1f]">Related questions</h2>
            {entry.faqs.map((faq) => (
              <div key={faq.question} className="mt-4">
                <h3 className="font-medium text-[#1f1f1f]">{faq.question}</h3>
                <p className="mt-2 text-sm leading-7 text-[#737373]">{faq.answer}</p>
              </div>
            ))}
          </div>
        )}

        {entry.relatedTagSlugs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#737373]">
              Related capabilities
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {entry.relatedTagSlugs.map((tagSlug) => {
                const tag = getSeoTag(tagSlug);
                if (!tag) return null;
                return (
                  <Link
                    key={tagSlug}
                    href={`/tags/${tagSlug}`}
                    className="rounded-full border border-[#e0e0e0] px-3 py-1 text-sm font-medium text-[#1f1f1f] hover:bg-[#fafafa]"
                  >
                    {tag.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {relatedCategories.length > 0 && (
          <div className="mt-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#737373]">
              Browse tools
            </h2>
            <ul className="mt-3 space-y-2">
              {relatedCategories.map((cat) => {
                const cluster = getSeoCluster(cat.slug);
                return (
                  <li key={cat.slug}>
                    <Link
                      href={`/categories/${cat.slug}`}
                      className="text-sm font-medium text-[#629649] hover:underline"
                    >
                      {cluster?.h1 ?? cat.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </article>
    </>
  );
}
