import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllGlossaryTerms } from '@/config/seo-glossary';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'CRE & AI Glossary | AI CRE Tools',
  description:
    'Definitions for commercial real estate and AI software terms—lease abstraction, underwriting, NOI, cap rates, and more.',
  alternates: { canonical: `${siteConfig.url}/glossary` },
};

export default function GlossaryHubPage() {
  const terms = getAllGlossaryTerms();

  return (
    <div className="container px-6 py-16 md:py-20">
      <div className="mb-12 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-[#1f1f1f] md:text-4xl">
          CRE &amp; AI glossary
        </h1>
        <p className="mt-3 text-base leading-7 text-[#737373]">
          Plain-language definitions for commercial real estate workflows and AI software concepts,
          with links to related tools and capability pages.
        </p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {terms.map((term) => (
          <li key={term.slug}>
            <Link
              href={`/glossary/${term.slug}`}
              className="block rounded-[8px] border border-[#e0e0e0] bg-[#fafafa] p-5 transition-colors hover:border-[rgba(98,150,73,0.4)] hover:bg-white"
            >
              <h2 className="font-semibold text-[#1f1f1f]">{term.term}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-[#737373]">{term.definition}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
