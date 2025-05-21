
import type { Category } from "@/types";
import { Hero } from "@/components/landing/Hero";
import { DirectorySearch, type DirectorySearchCategory } from "@/components/listing/DirectorySearch";
import { DirectoryGrid } from "@/components/listing/DirectoryGrid";
import { CategoryCard } from "@/components/category/CategoryCard";
import { GuideCard } from "@/components/guide/GuideCard";
import { getDirectoryItems, getCategories, getGuides, getFeaturedItems, getRecentGuides, getTopCategories } from "@/lib/sheets";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// Revalidate every hour
export const revalidate = 3600; 

interface HomeProps {
  searchParams: {
    search?: string;
    category?: string;
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const searchTerm = searchParams.search || "";
  const categoryFilter = searchParams.category || "";

  const initialItems = await getDirectoryItems(searchTerm, categoryFilter);
  const categoriesFromSheet: Category[] = await getCategories(); 
  const topCategories = await getTopCategories(4); 
  const recentGuides = await getRecentGuides(3);

  const searchCategories: DirectorySearchCategory[] = categoriesFromSheet.map(
    ({ id, slug, name }) => ({ id, slug, name })
  );

  return (
    <>
      <Hero />

      <section id="directory" className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Discover Top Tools
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Explore our curated directory of tools and services. Use the filters below to find exactly what you need.
          </p>
          <DirectorySearch 
            categories={searchCategories} 
            initialSearchTerm={searchTerm}
            initialCategoryFilter={categoryFilter}
          />
          <DirectoryGrid items={initialItems} />
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Browse by Category
              </h2>
              <p className="text-lg text-muted-foreground mb-4 md:mb-0">
                Find tools tailored to specific needs across various categories.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/categories">
                View All Categories <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
           <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Latest Guides & Insights
              </h2>
              <p className="text-lg text-muted-foreground mb-4 md:mb-0">
                Read our expert articles to get the most out of your tools and strategies.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/guides">
                View All Guides <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentGuides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
