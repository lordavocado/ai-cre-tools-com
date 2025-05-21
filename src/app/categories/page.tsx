
import { getCategories } from "@/lib/sheets";
import { CategoryCard } from "@/components/category/CategoryCard";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Categories',
  description: 'Explore all categories of tools and services available in our directory.',
};

// Revalidate every hour
export const revalidate = 3600;

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Explore Our Categories
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover a wide range of tools and services, neatly organized into categories to help you find exactly what you're looking for.
        </p>
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No categories found.</p>
      )}
    </div>
  );
}
