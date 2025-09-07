"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { siteConfig } from "@/config/site";
// Using the same visual style as tool card chips (CategoryChips)
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
    <div className="mx-auto max-w-[1200px] px-6 mb-12">
      <div className="space-y-8">
        {/* Search Section */}
        <div className="max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
            <Input
              id="search-term"
              type="text"
              placeholder="Search by keywords..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-12 pl-12 pr-12 border-neutral-200 text-base bg-white placeholder:text-neutral-400 focus-visible:ring-neutral-900 focus-visible:ring-offset-0 focus-visible:ring-1 transition-colors"
              aria-label="Search directory items"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 hover:bg-neutral-50 text-neutral-400"
                onClick={clearSearch}
                aria-label="Clear search term"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Categories Section */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategories.includes(category.slug) ? "default" : "secondary"}
              className={`
                cursor-pointer px-3 py-1.5 text-xs font-normal rounded-md transition-colors duration-200
                ${selectedCategories.includes(category.slug)
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 border-none'
                  : 'bg-emerald-50 text-emerald-700 border-none hover:bg-emerald-100'
                }
              `}
              onClick={(e) => {
                e.preventDefault();
                toggleCategory(category.slug);
              }}
            >
              {category.name}
            </Badge>
          ))}
        </div>


        {/* Results Count */}
        {totalItems > 0 && (
          <div className="text-sm text-neutral-500">
            {totalItems} {siteConfig.categoryName.toLowerCase()} {totalItems === 1 ? 'found' : 'found'}
          </div>
        )}

        {/* Loading State */}
        {isPending && (
          <div className="text-sm text-neutral-500">
            Loading...
          </div>
        )}
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
