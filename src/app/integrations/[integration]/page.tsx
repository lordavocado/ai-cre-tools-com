import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { QualifiedToolCollectionPage } from '@/components/seo/QualifiedToolCollectionPage';
import { siteConfig } from '@/config/site';
import { getIndexableIntegrationPage, getIndexableIntegrationPages } from '@/lib/seo-market-pages';
import { getDirectoryItems } from '@/lib/supabase';

export const revalidate = 3600;

export async function generateStaticParams() {
  return getIndexableIntegrationPages(await getDirectoryItems()).map((page) => ({ integration: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ integration: string }> }): Promise<Metadata> {
  const { integration } = await params;
  const page = getIndexableIntegrationPage(await getDirectoryItems(), integration);
  if (!page) return { title: 'Integration Not Found' };
  const title = `CRE Software That Integrates with ${page.label} (${page.tools.length} Tools)`;
  return {
    title,
    description: page.description,
    alternates: { canonical: `${siteConfig.url}${page.path}` },
    openGraph: { title, description: page.description, url: `${siteConfig.url}${page.path}` },
  };
}

export default async function IntegrationPage({ params }: { params: Promise<{ integration: string }> }) {
  const { integration } = await params;
  const page = getIndexableIntegrationPage(await getDirectoryItems(), integration);
  if (!page) notFound();
  return <QualifiedToolCollectionPage page={page} hubPath="/integrations" hubLabel="Integrations" eyebrow="Stack compatibility" />;
}
