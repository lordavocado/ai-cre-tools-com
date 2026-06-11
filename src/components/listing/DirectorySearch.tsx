"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import type React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export interface DirectorySearchCategory {
  id: string;
  slug: string;
  name: string;
  icon?: string | React.ComponentType<{ className?: string }>;
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

    const currentParams = new URLSearchParams(window.location.search);
    const currentPage = currentParams.get("page");
    const filtersUnchanged =
      searchTerm === initialSearchTerm &&
      selectedCategories.join(",") === (initialCategoryFilter || "");
    if (currentPage && currentPage !== "1" && filtersUnchanged) {
      queryParams.set("page", currentPage);
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

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
  };

  const hasFilters = searchTerm || selectedCategories.length > 0;

  return (
    <div className="mb-8 space-y-3">
      {/* Search bar row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999999]" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search tools, capabilities, workflows…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search directory"
            className="h-11 w-full rounded-[8px] border-[1.25px] border-[#e0e0e0] bg-white pl-10 pr-10 text-sm text-[#1f1f1f] placeholder:text-[#999999] outline-none focus:border-[#629649] focus:ring-1 focus:ring-[#629649] transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0a0a0] hover:text-[#737373] transition-colors"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="hidden md:inline-flex h-11 shrink-0 items-center rounded-[8px] border-[1.25px] border-[#e0e0e0] bg-white px-4 text-sm text-[#737373]">
          {isPending ? "Updating…" : `${totalItems} tools`}
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-[8px] border-[1.25px] border-[#e0e0e0] bg-white px-3 text-sm text-[#737373] hover:text-[#1f1f1f] transition-colors"
            aria-label="Clear all filters"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Category chips — always visible, horizontally scrollable */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategories([])}
            aria-pressed={selectedCategories.length === 0}
            className={`shrink-0 rounded-[6px] px-3 py-3 md:py-1.5 text-sm font-medium transition-colors ${
              selectedCategories.length === 0
                ? "bg-[#1f1f1f] text-white"
                : "border border-[#e0e0e0] bg-[#fafafa] text-[#1f1f1f] hover:bg-[#efefef] hover:border-[#c8c8c8]"
            }`}
          >
            All
          </button>
          {categories.map((category) => {
            const isActive = selectedCategories.includes(category.slug);
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => toggleCategory(category.slug)}
                aria-pressed={isActive}
                className={`shrink-0 rounded-[6px] px-3 py-3 md:py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#1f1f1f] text-white border-transparent"
                    : "border border-[#e0e0e0] bg-[#fafafa] text-[#1f1f1f] hover:bg-[#efefef] hover:border-[#c8c8c8]"
                }`}
              >
                {category.name}
              </button>
            );
          })}
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
