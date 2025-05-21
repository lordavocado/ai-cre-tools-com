
import { getGuides } from "@/lib/sheets";
import { GuideCard } from "@/components/guide/GuideCard";
import type { Metadata } from 'next';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
// Placeholder for a future search component if needed
// import { GuidesSearch } from "@/components/guide/GuidesSearch";

export const metadata: Metadata = {
  title: 'Guides & Tutorials',
  description: 'Explore our collection of guides, tutorials, and insights to help you make the most of various tools and strategies.',
};

// Revalidate every hour
export const revalidate = 3600;

interface GuidesPageProps {
  searchParams: {
    q?: string;
  };
}

export default async function GuidesPage({ searchParams }: GuidesPageProps) {
  const searchTerm = searchParams.q || "";
  const guides = await getGuides(searchTerm);

  return (
    <div className="container py-12 md:py-16">
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
  );
}
