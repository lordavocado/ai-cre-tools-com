
import { getCategories, getCategoryBySlug, getDirectoryItems } from "@/lib/sheets";
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from "next/navigation";
import { DirectorySearch } from "@/components/listing/DirectorySearch";
import { DirectoryGrid } from "@/components/listing/DirectoryGrid";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  params: { category: string };
  searchParams: {
    search?: string;
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
  const category = await getCategoryBySlug(params.category);

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
  const categorySlug = params.category;
  const searchTerm = searchParams.search || "";
  
  const category = await getCategoryBySlug(categorySlug);
  if (!category) {
    notFound();
  }

  const itemsInCategory = await getDirectoryItems(searchTerm, categorySlug);
  const allCategories = await getCategories(); // For search filter, though it will be pre-filled

  return (
    <div className="container py-12 md:py-16">
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
        categories={allCategories} 
        onSearch={async (s, c) => { /* Server-side filtering */ }} 
        initialSearchTerm={searchTerm}
        initialCategoryFilter={categorySlug}
      />
      <DirectoryGrid items={itemsInCategory} />
    </div>
  );
}
