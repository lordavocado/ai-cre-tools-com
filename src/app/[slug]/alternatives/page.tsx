import { notFound, permanentRedirect } from 'next/navigation';
import { getDirectoryItemBySlug, getDirectoryItems } from '@/lib/supabase';
import { hasEnoughAlternatives } from '@/config/seo-alternatives';
import { getToolAlternativesPath, withSearchParams } from '@/lib/tool-routes';
import { isValidSlug, isValidSlugFormat } from '@/lib/routing-utils-client';

/** Permanently redirects historical alternatives URLs to their canonical path. */
export default async function LegacyToolAlternativesPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;

  if (!isValidSlugFormat(slug) || !isValidSlug(slug)) notFound();

  const tool = await getDirectoryItemBySlug(slug);
  if (!tool) notFound();

  const allTools = await getDirectoryItems();
  if (!hasEnoughAlternatives(tool, allTools)) notFound();

  permanentRedirect(withSearchParams(getToolAlternativesPath(tool.slug), await searchParams));
}
