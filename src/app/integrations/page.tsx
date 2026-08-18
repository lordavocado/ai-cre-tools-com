import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { getIndexableIntegrationPages } from '@/lib/seo-market-pages';
import { getDirectoryItems } from '@/lib/supabase';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'CRE Software Integrations Directory | AI CRE Tools',
  description: 'Find commercial real estate software that works with Yardi, MRI, RealPage, Salesforce, HubSpot, Excel, and other systems.',
  alternates: { canonical: `${siteConfig.url}/integrations` },
};

export default async function IntegrationsPage() {
  const pages = getIndexableIntegrationPages(await getDirectoryItems());
  return (
    <main className="container px-6 py-16 md:py-20">
      <div className="max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#629649]">Integration directory</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#1f1f1f] md:text-5xl">Find CRE tools that fit your existing stack</h1>
        <p className="mt-5 text-base leading-7 text-[#737373]">Pages appear only when at least three eligible tools have documented support for the same platform.</p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <Link key={page.path} href={page.path} className="group rounded-[8px] border border-[#e0e0e0] bg-[#fafafa] p-5 hover:border-[rgba(98,150,73,0.45)] hover:bg-white">
            <h2 className="font-semibold text-[#1f1f1f] group-hover:text-[#629649]">Software that integrates with {page.label}</h2>
            <p className="mt-2 text-sm leading-6 text-[#737373]">{page.tools.length} documented tools</p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#629649]">Compare tools <ArrowRight className="h-3.5 w-3.5" /></span>
          </Link>
        ))}
      </div>
    </main>
  );
}
