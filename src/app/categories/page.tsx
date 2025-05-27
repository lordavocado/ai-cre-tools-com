
import { getCategories } from "@/lib/sheets";
import { CategoryCard } from "@/components/category/CategoryCard";
import type { Metadata } from 'next';
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `All ${siteConfig.categoryName} Categories`,
  description: `Explore all categories of ${siteConfig.categoryName.toLowerCase()} available in our directory.`,
};

// Revalidate every hour
export const revalidate = 3600;

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container py-12 md:py-16 pl-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Explore {siteConfig.categoryName} Categories
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Discover the complete spectrum of {siteConfig.categoryName.toLowerCase()}, organized into 9 specialized categories covering everything from data collection to advanced analytics and insights.
        </p>
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
