import { getGuides } from "@/lib/markdown";
import { GuideCard } from "@/components/guide/GuideCard";
import { WebsiteStructuredData } from "@/components/seo/StructuredData";
import { siteConfig } from "@/config/site";
import type { Metadata } from 'next';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
// Placeholder for a future search component if needed
// import { GuidesSearch } from "@/components/guide/GuidesSearch";

export const metadata: Metadata = {
  title: `Guides & Tutorials | ${siteConfig.name}`,
  description: 'Explore our comprehensive collection of product analytics guides, tutorials, and expert insights. Learn how to implement, optimize, and get the most value from analytics tools and strategies.',
  keywords: 'product analytics guides, analytics tutorials, data analysis guides, analytics implementation, product metrics guide, user behavior analysis, analytics best practices, data-driven insights',
  
  // OpenGraph metadata
  openGraph: {
    title: `Product Analytics Guides & Tutorials | ${siteConfig.name}`,
    description: 'Comprehensive guides and tutorials on product analytics tools, implementation strategies, and best practices for data-driven decision making.',
    url: `${siteConfig.url}/guides`,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/og-guides.png`,
        width: 1200,
        height: 630,
        alt: 'Product Analytics Guides and Tutorials',
      },
    ],
    type: 'website',
  },

  // Twitter metadata
  twitter: {
    card: 'summary_large_image',
    title: `Product Analytics Guides & Tutorials | ${siteConfig.name}`,
    description: 'Learn product analytics with our comprehensive guides and tutorials. Expert insights on implementation, optimization, and best practices.',
    creator: siteConfig.social?.twitter || '@productanalyticstools',
    site: siteConfig.social?.twitter || '@productanalyticstools',
    images: [
      {
        url: `${siteConfig.url}/twitter-guides.png`,
        alt: 'Product Analytics Guides and Tutorials',
      },
    ],
  },

  // Additional metadata
  alternates: {
    canonical: `${siteConfig.url}/guides`,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Revalidate every hour
export const revalidate = 3600;

interface GuidesPageProps {
  searchParams: {
    q?: string;
  };
}

export default async function GuidesPage({ searchParams }: GuidesPageProps) {
  const { q } = await searchParams;
  const searchTerm = q || "";
  const guides = await getGuides(searchTerm);

  return (
    <>
      {/* Structured Data for search functionality */}
      <WebsiteStructuredData searchUrl={`${siteConfig.url}/guides`} />
      
      <div className="container py-12 md:py-16 pl-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Our Guides & Insights
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Deep dive into expert articles, tutorials, and resources. Stay informed and learn new skills.
        </p>
      </div>
      
      {/* Simple search form for now - could be extracted to a client component for debouncing */}
      <form method="GET" action="/guides" className="mb-10 max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            name="q"
            placeholder="Search guides..."
            defaultValue={searchTerm}
            className="pl-10 w-full"
            aria-label="Search guides"
          />
        </div>
      </form>

      {guides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          {searchTerm ? `No guides found for "${searchTerm}".` : "No guides available at the moment. Check back soon!"}
        </p>
      )}
    </div>
    </>
  );
}
