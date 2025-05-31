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
    <div className="mb-8 p-6 bg-card rounded-lg shadow-md">
      <div className="space-y-4">
        {/* Header with total items */}
        <div className="flex items-center justify-start">
          {totalItems > 0 && (
            <span className="text-sm text-muted-foreground">
              {totalItems} {siteConfig.categoryName.toLowerCase()} {totalItems === 1 ? 'found' : 'found'}
            </span>
          )}
        </div>

        {/* Categories Section */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategories.includes(category.slug) ? "default" : "secondary"}
              className={`
                cursor-pointer px-4 py-1.5 text-sm font-medium
                transition-all duration-200
                ${selectedCategories.includes(category.slug)
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-secondary/50 hover:bg-secondary text-secondary-foreground'
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

        {/* Search Section */}
        <div className="flex items-center gap-2 w-full max-w-md">
          <Search className="h-5 w-5 text-muted-foreground" />
          <div className="relative flex-1">
            <Input
              id="search-term"
              type="text"
              placeholder="Search by keywords..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pr-9 h-9"
              aria-label="Search directory items"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                onClick={clearSearch}
                aria-label="Clear search term"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      {isPending && <p className="text-sm text-muted-foreground mt-2">Loading...</p>}
    </div>
  );
}
