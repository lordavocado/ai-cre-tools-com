"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

/** Minimal category shape needed for the hero chip row */
export interface HeroCategory {
  /** Unique identifier */
  id: string;
  /** URL-safe slug used as the query param value */
  slug: string;
  /** Display label */
  name: string;
}

/**
 * Props for the Hero component
 * @interface HeroProps
 */
interface HeroProps {
  /** Total number of directory items — used for the search placeholder count */
  totalItems: number;
  /** Category list rendered as filter chips below the search bar */
  categories?: HeroCategory[];
}

/**
 * Search-first centered hero section for the homepage.
 * Renders a heading, search bar, and category filter chips.
 * Search and category chip clicks navigate to the directory section.
 * @component
 * @example
 * ```tsx
 * <Hero totalItems={120} categories={categories} />
 * ```
 */
/** Sentinel value representing the "All categories" chip */
const ALL_SLUG = "all";

export function Hero({ totalItems, categories = [] }: HeroProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(ALL_SLUG);

  /** Navigate to the directory section with an optional search query */
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    const params = new URLSearchParams();
    if (trimmedQuery) params.set("search", trimmedQuery);
    const url = params.toString() ? `/?${params.toString()}#directory` : "/#directory";
    router.push(url);
  };

  /** Mark the chip active and navigate to the directory section filtered by the given category */
  const handleCategoryClick = (slug: string) => {
    setActiveCategory(slug);
    if (slug === ALL_SLUG) {
      router.push("/#directory");
    } else {
      const params = new URLSearchParams({ category: slug });
      router.push(`/?${params.toString()}#directory`);
    }
  };

  const placeholderCount = totalItems > 0 ? `${totalItems}+` : "100+";

  return (
    <section className="relative overflow-hidden bg-white py-[80px]">
      {/* Architectural grid texture */}
      <div className="hero-grid-texture absolute inset-0" aria-hidden="true" />
      {/* Bottom fade into page background */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-white to-transparent"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1088px] px-8 text-center">
        <h1 className="text-[48px] font-semibold tracking-[-1.2px] leading-[1] text-[#1f1f1f]">
          Find the Best AI Tools for{" "}
          <br className="hidden sm:block" />
          Commercial Real Estate
        </h1>
        <p className="mt-4 text-[16px] text-[#737373] max-w-lg mx-auto">
          Discover and compare AI-powered tools built for CRE professionals —
          brokers, asset managers, developers, and operators.
        </p>

        {/* Search bar */}
        <div className="mt-8 mx-auto max-w-2xl">
          <form onSubmit={handleSearchSubmit}>
            <label htmlFor="hero-search" className="sr-only">
              Search commercial real estate AI tools
            </label>
            <div className="flex items-center h-12 border border-[#e0e0e0] rounded-[8px] bg-white px-4 focus-within:border-[#629649] focus-within:ring-1 focus-within:ring-[#629649] transition-colors">
              <Search
                className="h-5 w-5 shrink-0 text-[#737373]"
                aria-hidden="true"
              />
              <input
                id="hero-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${placeholderCount} CRE AI tools...`}
                className="flex-1 bg-transparent pl-3 text-sm text-[#1f1f1f] outline-none placeholder:text-[#737373]"
              />
            </div>
          </form>
        </div>

        {/* Category chips */}
        {categories.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {/* "All" chip — active by default */}
            <button
              key={ALL_SLUG}
              type="button"
              onClick={() => handleCategoryClick(ALL_SLUG)}
              className={`rounded-[6px] px-3 py-1.5 text-sm transition-colors cursor-pointer ${
                activeCategory === ALL_SLUG
                  ? "bg-[#629649] text-white border border-transparent"
                  : "bg-[#fafafa] border border-[#e0e0e0] text-[#1f1f1f] hover:bg-[#f0f9f0]"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => handleCategoryClick(cat.slug)}
                className={`rounded-[6px] px-3 py-1.5 text-sm transition-colors cursor-pointer ${
                  activeCategory === cat.slug
                    ? "bg-[#629649] text-white border border-transparent"
                    : "bg-[#fafafa] border border-[#e0e0e0] text-[#1f1f1f] hover:bg-[#f0f9f0]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
