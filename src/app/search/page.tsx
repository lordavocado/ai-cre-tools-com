import type { Metadata } from 'next';
import { Suspense } from 'react';
import { HomeDirectory } from '@/components/listing/HomeDirectory';
import { getCategories, getDirectoryListItems } from '@/lib/supabase';
import type { DirectorySearchCategory } from '@/components/listing/DirectorySearch';
import { siteConfig } from '@/config/site';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Search AI CRE Tools',
  description: 'Search the AI CRE Tools directory by tool, workflow, or category.',
  robots: { index: false, follow: true },
  alternates: { canonical: siteConfig.url },
};

export default async function SearchPage() {
  const [items, categories] = await Promise.all([
    getDirectoryListItems(),
    getCategories(false),
  ]);
  const searchCategories: DirectorySearchCategory[] = categories.map(({ id, slug, name, icon }) => ({
    id,
    slug,
    name,
    icon,
  }));

  return (
    <section className="bg-[#fafafa] py-16 md:py-20">
      <div className="container px-6">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#999999]">Directory search</p>
          <h1 className="mt-1 text-[28px] font-medium tracking-[-0.01em] text-[#1f1f1f] sm:text-[32px]">Find AI CRE tools</h1>
        </div>
        <Suspense fallback={<div className="py-12 text-center text-sm text-[#737373]">Loading directory…</div>}>
          <HomeDirectory items={items} categories={searchCategories} />
        </Suspense>
      </div>
    </section>
  );
}
