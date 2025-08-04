
import { CategoryCard } from "@/components/category/CategoryCard";
import type { Metadata } from 'next';
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `All ${siteConfig.categoryName} Categories`,
  description: `Explore all categories of ${siteConfig.categoryName.toLowerCase()} available in our directory.`,
};

export default async function CategoriesPage() {

  return (
    <div className="container py-12 md:py-16 pl-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Explore {siteConfig.categoryName} Categories
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Explore our comprehensive collection of AI tools organized by specific commercial real estate use cases and functionality.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <CategoryCard category={{
            id: 'development-construction',
            name: 'Development & Construction',
            description: 'Streamline the planning, design, and construction of real estate projects. These tools enhance project management, design efficiency, and construction processes.',
            toolCount: 1,
          }} />
          <CategoryCard category={{
            id: 'investment-portfolio-management',
            name: 'Investment & Portfolio Management',
            description: 'Identify, manage, and optimize real estate investments and portfolios. These tools support financial modeling, performance tracking, and strategies to maximize returns.',
            toolCount: 1,
          }} />
          <CategoryCard category={{
            id: 'legal-compliance',
            name: 'Legal & Compliance',
            description: 'Facilitate legal processes, due diligence, and compliance in real estate. These tools assist with contract analysis, regulatory adherence, and legal risk management.',
            toolCount: 1,
          }} />
          <CategoryCard category={{
            id: 'market-analysis-valuation',
            name: 'Market Analysis & Valuation',
            description: 'Analyze market trends, property values, and investment opportunities with data-driven insights. These tools help users understand current conditions, forecast future trends, and evaluate properties for acquisition or sale.',
            toolCount: 1,
          }} />
          <CategoryCard category={{
            id: 'property-management-operations',
            name: 'Property Management & Operations',
            description: 'Improve day-to-day property management, tenant relations, and operational efficiency. These tools focus on maintenance, lease administration, and tenant satisfaction.',
            toolCount: 1,
          }} />
          <CategoryCard category={{
            id: 'transaction-brokerage',
            name: 'Transaction & Brokerage',
            description: 'Enhance property transactions, marketing, and client relationships. These tools streamline deal execution, property promotion, and client interactions for smoother transactions.',
            toolCount: 1,
          }} />
          <CategoryCard category={{
            id: 'efficiency-general-tools',
            name: 'Efficiency & General Tools',
            description: 'Discover AI tools designed to enhance overall efficiency and provide general utility across various commercial real estate functions. Automate routine tasks, improve data processing, and gain broader insights.',
            toolCount: 1,
          }} />
        </div>
      </div>
    </div>
  );
}
