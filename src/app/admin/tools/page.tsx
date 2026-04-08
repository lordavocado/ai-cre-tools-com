import { requireAdminPageAuth } from '@/lib/admin-auth';
import { getCategories } from '@/lib/supabase';
import ToolsDashboard from './tools-dashboard';

type AdminToolsPageProps = {
  searchParams: Promise<{
    slug?: string;
  }>;
};

export default async function AdminToolsPage({ searchParams }: AdminToolsPageProps) {
  await requireAdminPageAuth('/admin/tools');

  const categories = await getCategories(false);
  const resolvedSearchParams = await searchParams;

  return (
    <ToolsDashboard
      categories={categories.map((category) => ({
        slug: category.slug,
        name: category.name,
      }))}
      initialSlug={resolvedSearchParams.slug}
    />
  );
}
