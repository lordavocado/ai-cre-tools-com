import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { QualifiedToolCollectionPage } from '@/components/seo/QualifiedToolCollectionPage';
import { siteConfig } from '@/config/site';
import { getIndexableAssetPage, getIndexableAssetPages } from '@/lib/seo-market-pages';
import { getDirectoryItems } from '@/lib/supabase';

export const revalidate = 3600;

export async function generateStaticParams() {
  return getIndexableAssetPages(await getDirectoryItems()).map((page) => ({ assetClass: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ assetClass: string }> }): Promise<Metadata> {
  const { assetClass } = await params;
  const page = getIndexableAssetPage(await getDirectoryItems(), assetClass);
  if (!page) return { title: 'Asset Class Not Found' };
  const title = `${page.label} Real Estate AI Software (${page.tools.length} Tools) | AI CRE Tools`;
  return {
    title,
    description: page.description,
    alternates: { canonical: `${siteConfig.url}${page.path}` },
    openGraph: { title, description: page.description, url: `${siteConfig.url}${page.path}` },
  };
}

export default async function AssetClassPage({ params }: { params: Promise<{ assetClass: string }> }) {
  const { assetClass } = await params;
  const page = getIndexableAssetPage(await getDirectoryItems(), assetClass);
  if (!page) notFound();
  return <QualifiedToolCollectionPage page={page} hubPath="/asset-classes" hubLabel="Asset classes" eyebrow="Property-type software" />;
}
