"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "../ui/button";
import { siteConfig } from "@/config/site";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export interface DirectorySearchCategory {
  id: string;
  slug: string;
  name: string;
  icon?: any; // Lucide icon component
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
  totalItems = 0
}: DirectorySearchProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategoryFilter ? initialCategoryFilter.split(',').map(cat => cat.trim()) : []
  );
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const currentPathname = usePathname();

  // Prevent SSR issues by only running navigation logic after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Simplified navigation logic with better dependency management
  const updateUrl = useCallback(() => {
    if (!mounted) return; // Don't run during SSR

    const queryParams = new URLSearchParams();
    if (searchTerm) {
      queryParams.set('search', searchTerm);
    }

    let targetPathname = currentPathname;

    if (currentPathname.startsWith('/categories/')) {
      if (selectedCategories.length === 0) {
        targetPathname = '/';
      } else if (selectedCategories.length > 1) {
        targetPathname = '/';
        queryParams.set('category', selectedCategories.join(','));
      } else if (selectedCategories.length === 1 && selectedCategories[0] !== initialCategoryFilter) {
        targetPathname = `/categories/${selectedCategories[0]}`;
      } else {
        targetPathname = currentPathname;
      }
    } else {
      if (selectedCategories.length > 0) {
        queryParams.set('category', selectedCategories.join(','));
      }
    }

    const queryString = queryParams.toString();
    const newUrl = queryString ? `${targetPathname}?${queryString}` : targetPathname;

    startTransition(() => {
      router.replace(newUrl, { scroll: false });
    });
  }, [searchTerm, selectedCategories, currentPathname, initialCategoryFilter, mounted, router]);

  // Debounced URL update to prevent excessive navigation
  useEffect(() => {
    if (!mounted) return;

    const timeoutId = setTimeout(updateUrl, 300); // Increased debounce time
    return () => clearTimeout(timeoutId);
  }, [updateUrl, mounted]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleCategory = (categorySlug: string) => {
    setSelectedCategories(prev => 
      prev.includes(categorySlug)
        ? prev.filter(c => c !== categorySlug)
        : [...prev, categorySlug]
    );
  };


  const clearSearch = () => {
    setSearchTerm("");
    setSelectedCategories([]);
  };

  return (
    <div className="mx-auto mb-12 max-w-[1200px] px-6">
      <div className="space-y-6 rounded-[28px] border border-slate-200/80 bg-white/95 p-5 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.4)] md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Search and filter
            </div>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
              Narrow the directory by company, capability, or workflow.
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 md:text-base">
              Start broad, then refine by category to find the right commercial real estate software faster.
            </p>
          </div>
          <div className="text-sm text-slate-500 md:pt-1">
            {isPending ? "Updating results..." : `${totalItems} tools in this view`}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              id="search-term"
              type="text"
              placeholder="Search company names, workflows, or software capabilities"
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-14 rounded-2xl border-slate-200 bg-slate-50 pl-12 pr-12 text-base placeholder:text-slate-400 focus-visible:border-sky-300 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-sky-100 focus-visible:ring-offset-0"
              aria-label="Search directory items"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full text-slate-400 hover:bg-white hover:text-slate-700"
                onClick={clearSearch}
                aria-label="Clear search term"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={clearSearch}
            disabled={!searchTerm && selectedCategories.length === 0}
            className="h-14 rounded-2xl border-slate-200 px-5 text-sm font-semibold text-slate-700"
          >
            Clear all filters
          </Button>
        </div>

        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Browse by category
          </div>
          <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              type="button"
              variant={selectedCategories.includes(category.slug) ? "default" : "outline"}
              aria-pressed={selectedCategories.includes(category.slug)}
              className={`
                h-auto rounded-full px-4 py-2 text-sm font-medium transition-all duration-200
                ${selectedCategories.includes(category.slug)
                  ? 'border-slate-950 bg-slate-950 text-white hover:bg-slate-800'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-900'
                }
              `}
              onClick={(e) => {
                e.preventDefault();
                toggleCategory(category.slug);
              }}
            >
              {category.name}
            </Button>
          ))}
          </div>
        </div>

        {(selectedCategories.length > 0 || searchTerm) && (
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <span className="font-medium text-slate-900">Active filters</span>
            {searchTerm ? <span className="rounded-full bg-white px-3 py-1">Search: {searchTerm}</span> : null}
            {selectedCategories.map((categorySlug) => {
              const category = categories.find((entry) => entry.slug === categorySlug);
              return (
                <span key={categorySlug} className="rounded-full bg-white px-3 py-1">
                  {category?.name ?? categorySlug}
                </span>
              );
            })}
          </div>
        )}

        <div className="text-sm text-slate-500">
          Search across {siteConfig.categoryName.toLowerCase()} with filters that keep the page context intact while the
          results update.
        </div>
      </div>
    </div>
  );
}

export function DirectorySearch(props: DirectorySearchProps) {
  return (
    <ErrorBoundary
      componentName="DirectorySearch"
      onError={(error, errorInfo) => {
        // Log specific DirectorySearch errors for monitoring
        console.error('DirectorySearch Error:', {
          error: error.message,
          componentStack: errorInfo.componentStack,
          categoriesCount: props.categories?.length,
          searchTerm: props.initialSearchTerm
        });
      }}
    >
      <DirectorySearchContent {...props} />
    </ErrorBoundary>
  );
}
