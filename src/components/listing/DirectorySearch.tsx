"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export interface DirectorySearchCategory {
  id: string;
  slug: string;
  name: string;
  icon?: any;
}

interface DirectorySearchProps {
  categories: DirectorySearchCategory[];
  initialSearchTerm?: string;
  initialCategoryFilter?: string;
  totalItems?: number;
}

function DirectorySearchContent({
  categories,
  initialSearchTerm = "",
  initialCategoryFilter = "",
  totalItems = 0,
}: DirectorySearchProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategoryFilter ? initialCategoryFilter.split(",").map((c) => c.trim()) : []
  );
  const [showCategories, setShowCategories] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const currentPathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateUrl = useCallback(() => {
    if (!mounted) return;

    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.set("search", searchTerm);

    let targetPathname = currentPathname;

    if (currentPathname.startsWith("/categories/")) {
      if (selectedCategories.length === 0) {
        targetPathname = "/";
      } else if (selectedCategories.length > 1) {
        targetPathname = "/";
        queryParams.set("category", selectedCategories.join(","));
      } else if (selectedCategories.length === 1 && selectedCategories[0] !== initialCategoryFilter) {
        targetPathname = `/categories/${selectedCategories[0]}`;
      } else {
        targetPathname = currentPathname;
      }
    } else {
      if (selectedCategories.length > 0) {
        queryParams.set("category", selectedCategories.join(","));
      }
    }

    const queryString = queryParams.toString();
    const newUrl = queryString ? `${targetPathname}?${queryString}` : targetPathname;
    const currentUrl = window.location.pathname + (window.location.search || "");

    if (newUrl !== currentUrl) {
      startTransition(() => {
        router.replace(newUrl, { scroll: false });
      });
    }
  }, [searchTerm, selectedCategories, currentPathname, initialCategoryFilter, mounted, router]);

  useEffect(() => {
    if (!mounted) return;
    const timeoutId = setTimeout(updateUrl, 300);
    return () => clearTimeout(timeoutId);
  }, [updateUrl, mounted]);

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  };

  const clearAll = () => {
    setSearchTerm("");
    setSelectedCategories([]);
  };

  const hasFilters = searchTerm || selectedCategories.length > 0;

  return (
    <div className="mb-8">
      {/* Search bar row */}
      <div className="flex items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search tools, capabilities, workflows…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search directory"
            className="h-11 w-full rounded-lg border border-stone-200 bg-white pl-10 pr-10 text-sm text-gray-900 placeholder:text-stone-400 outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filters toggle */}
        <button
          onClick={() => setShowCategories((v) => !v)}
          className={`inline-flex h-11 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-all ${
            showCategories || selectedCategories.length > 0
              ? "border-brand-600 bg-brand-600 text-white"
              : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50"
          }`}
          aria-expanded={showCategories}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
          {selectedCategories.length > 0 && (
            <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-xs font-semibold">
              {selectedCategories.length}
            </span>
          )}
        </button>

        {/* Order by (placeholder — matches OpenAlternative pattern) */}
        <div className="hidden md:inline-flex h-11 items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-4 text-sm text-stone-500">
          {isPending ? "Updating…" : `${totalItems} tools`}
        </div>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={clearAll}
            className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 text-sm text-stone-500 hover:text-stone-900 transition-colors"
            aria-label="Clear all filters"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Category chips panel */}
      {showCategories && (
        <div className="mt-3 rounded-xl border border-stone-200 bg-white p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-stone-400">
            Browse by category
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isActive = selectedCategories.includes(category.slug);
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => toggleCategory(category.slug)}
                  aria-pressed={isActive}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-brand-600 text-white"
                      : "border border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50"
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function DirectorySearch(props: DirectorySearchProps) {
  return (
    <ErrorBoundary componentName="DirectorySearch">
      <DirectorySearchContent {...props} />
    </ErrorBoundary>
  );
}
