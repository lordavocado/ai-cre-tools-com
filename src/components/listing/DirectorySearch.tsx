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

  useEffect(() => {
    setSearchTerm(initialSearchTerm);
    setSelectedCategories(
      initialCategoryFilter ? initialCategoryFilter.split(',').map((category) => category.trim()) : []
    );
  }, [initialSearchTerm, initialCategoryFilter]);

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
    } else if (searchTerm || selectedCategories.length > 0) {
      targetPathname = "/search";
      if (selectedCategories.length > 0) {
        queryParams.set("category", selectedCategories.join(","));
      }
    } else if (currentPathname === "/search") {
      targetPathname = "/";
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
  }, [searchTerm, selectedCategories, currentPathname, initialSearchTerm, initialCategoryFilter, mounted, router]);

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
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search tools, capabilities, workflows…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search directory"
            className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-12 text-base text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30 sm:text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-1 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="hidden h-11 shrink-0 items-center rounded-lg border border-border bg-background px-4 text-sm text-muted-foreground tabular-nums md:inline-flex" role="status" aria-live="polite">
          {isPending ? "Updating…" : `${totalItems} tools`}
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm text-muted-foreground transition-[color,background-color,border-color,transform] motion-safe:active:scale-[0.97] hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
            className={`shrink-0 rounded-md px-3 py-3 text-sm font-medium transition-[color,background-color,border-color,transform] motion-safe:active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:py-2 ${
              selectedCategories.length === 0
                ? "bg-foreground text-background"
                : "border border-border bg-secondary text-foreground hover:border-foreground/20 hover:bg-secondary"
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
                className={`shrink-0 rounded-md px-3 py-3 text-sm font-medium transition-[color,background-color,border-color,transform] motion-safe:active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:py-2 ${
                  isActive
                    ? "border-transparent bg-foreground text-background"
                    : "border border-border bg-secondary text-foreground hover:border-foreground/20 hover:bg-secondary"
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
