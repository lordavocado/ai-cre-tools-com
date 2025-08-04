"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { siteConfig } from "@/config/site";

export interface DirectorySearchCategory {
  id: string;
  slug: string;
  name: string;
}

interface DirectorySearchProps {
  categories: DirectorySearchCategory[];
  initialSearchTerm?: string;
  initialCategoryFilter?: string;
  totalItems?: number;
}

export function DirectorySearch({ 
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
  const router = useRouter();
  const currentPathname = usePathname();

  useEffect(() => {
    const handler = setTimeout(() => {
      startTransition(() => {
        const queryParams = new URLSearchParams();
        if (searchTerm) {
          queryParams.set('search', searchTerm);
        }

        let targetPathname = currentPathname;

        if (currentPathname.startsWith('/categories/')) {
          // If we're on a category page and no categories are selected, go to homepage
          if (selectedCategories.length === 0) {
            targetPathname = '/';
          } 
          // If we're on a category page and multiple categories are selected, go to homepage with category filter
          else if (selectedCategories.length > 1) {
            targetPathname = '/';
            queryParams.set('category', selectedCategories.join(','));
          }
          // If we're on a category page and one category is selected (different from current), navigate to that category
          else if (selectedCategories.length === 1 && selectedCategories[0] !== initialCategoryFilter) {
            targetPathname = `/categories/${selectedCategories[0]}`;
          }
          // If we're on a category page and the same category is still selected, stay on the same page
          else if (selectedCategories.length === 1 && selectedCategories[0] === initialCategoryFilter) {
            // Stay on current category page, just apply search if any
            targetPathname = currentPathname;
          }
        } else {
          // We're on homepage or other page, use category filter in query params
          if (selectedCategories.length > 0) {
            queryParams.set('category', selectedCategories.join(','));
          }
        }
        
        const queryString = queryParams.toString();
        const newUrl = queryString ? `${targetPathname}?${queryString}` : targetPathname;
        
        // Prevent scroll and update URL
        const currentScrollY = window.scrollY;
        router.replace(newUrl, { scroll: false });
        
        // Ensure scroll position is maintained
        setTimeout(() => {
          window.scrollTo(0, currentScrollY);
        }, 0);
      });
    }, 100);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, selectedCategories, router, currentPathname, initialCategoryFilter]);

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
              className="h-12 pl-12 pr-12 border-neutral-200 text-base bg-white placeholder:text-neutral-400 focus-visible:ring-neutral-900 transition-colors"
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
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategories.includes(category.slug) ? "default" : "secondary"}
              className={`
                cursor-pointer px-4 py-2 text-sm font-medium
                transition-colors duration-200
                ${selectedCategories.includes(category.slug)
                  ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
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
