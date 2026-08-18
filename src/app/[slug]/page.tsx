import { notFound, permanentRedirect } from 'next/navigation';
import { getDirectoryItemBySlug } from '@/lib/supabase';
import { getToolPath, withSearchParams } from '@/lib/tool-routes';
import { isValidSlug, isValidSlugFormat } from '@/lib/routing-utils-client';

/** Permanently redirects historical root-level tool URLs to their canonical path. */
export default async function LegacyToolPage({
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

  permanentRedirect(withSearchParams(getToolPath(tool.slug), await searchParams));
}
