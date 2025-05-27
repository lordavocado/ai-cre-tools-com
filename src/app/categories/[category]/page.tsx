import type { Category } from "@/types";
import { getCategories, getCategoryBySlug, getDirectoryItems } from "@/lib/sheets";
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from "next/navigation";
import { DirectorySearch, type DirectorySearchCategory } from "@/components/listing/DirectorySearch";
import { DirectoryGrid } from "@/components/listing/DirectoryGrid";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  params: { category: string }; // This is the category slug from the path
  searchParams: {
    search?: string;
    // category?: string; // This would be from query params, potentially overriding path
  };
};

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.name} Tools`,
    description: category.description || `Find the best tools in the ${category.name} category.`,
    openGraph: {
      title: `${category.name} Tools`,
      description: category.description,
      images: category.imageUrl ? [{ url: category.imageUrl }] : [],
    },
  };
}

// Revalidate every hour
export const revalidate = 3600;

export default async function CategoryDetailPage({ params, searchParams }: Props) {
  const { category: categorySlugFromPath } = await params;
  const { search } = await searchParams;
  const searchTerm = search || "";
  // const categoryFilterFromQuery = searchParams.category; // Not directly used for fetching items on this page, path slug is primary.

  const category = await getCategoryBySlug(categorySlugFromPath);
  if (!category) {
    notFound();
  }

  // Items are always fetched based on the category slug from the path for this page.
  // Search term applies within this path-defined category.
  const itemsInCategory = await getDirectoryItems(searchTerm, categorySlugFromPath);
  
  const allCategoriesForSearch: Category[] = await getCategories(); 
  const searchCategories: DirectorySearchCategory[] = allCategoriesForSearch.map(
    ({ id, slug, name }) => ({ id, slug, name })
  );

  return (
    <div className="container py-12 md:py-16 pl-6">
      <header className="mb-12 text-center">
        {category.imageUrl && (
           <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-lg border-4 border-primary/20">
            <Image 
              src={category.imageUrl} 
              alt={category.name} 
              layout="fill" 
              objectFit="cover"
              data-ai-hint="category icon badge"
            />
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">{category.name}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{category.description}</p>
      </header>

      {category.longDescription && (
        <Card className="mb-12 shadow-sm">
          <CardContent className="pt-6">
            <div className="prose prose-sm sm:prose-base max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: category.longDescription }} />
          </CardContent>
        </Card>
      )}

      <DirectorySearch 
        categories={searchCategories} 
        initialSearchTerm={searchTerm}
        initialCategoryFilter={categorySlugFromPath}
        totalItems={itemsInCategory.length}
      />
      <DirectoryGrid items={itemsInCategory} />
    </div>
  );
}
