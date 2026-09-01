
import { CategoryCard } from "@/components/category/CategoryCard";
import type { Metadata } from 'next';
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `All ${siteConfig.categoryName} Categories`,
  description: 'Browse AI tools for commercial real estate by category, from property management and investment analysis to leasing, brokerage, and construction.',
  alternates: {
    canonical: `${siteConfig.url}/categories`,
  },
};

import { getCategories } from "@/lib/supabase";

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
      <div className="container py-16 md:py-20 px-6">
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Browse by category
          </h1>
          <p className="mt-2 text-base text-gray-500 max-w-2xl">
            Organized by CRE workflow — not generic SaaS labels.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-7xl mx-auto">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
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
