
import { CategoryCard } from "@/components/category/CategoryCard";
import type { Metadata } from 'next';
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `All ${siteConfig.categoryName} Categories`,
  description: `Explore all categories of ${siteConfig.categoryName.toLowerCase()} available in our directory.`,
};

import { getCategories } from "@/lib/sheets";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container py-12 md:py-16 pl-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-4">
          Explore {siteConfig.categoryName} Categories
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Explore our comprehensive collection of AI tools organized by specific commercial real estate use cases and functionality.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      {/* Structured Data for Categories Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `All ${siteConfig.categoryName} Categories`,
            description: `Explore all categories of ${siteConfig.categoryName.toLowerCase()} available in our directory.`,
            url: `${siteConfig.url}/categories`,
            mainEntity: {
              "@type": "ItemList",
              name: "CRE AI Tool Categories",
              description: "Directory of AI tool categories for commercial real estate",
              numberOfItems: categories.length,
              itemListElement: categories.map((category, index) => ({
                "@type": "Category",
                position: index + 1,
                name: category.name,
                description: category.description,
                url: `${siteConfig.url}/categories/${category.slug}`,
              }))
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: siteConfig.url
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Categories",
                  item: `${siteConfig.url}/categories`
                }
              ]
            }
          })
        }}
      />
    </div>
  );
}
