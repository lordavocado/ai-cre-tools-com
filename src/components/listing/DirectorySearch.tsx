
"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { Button } from "../ui/button";

export interface DirectorySearchCategory {
  id: string;
  slug: string;
  name: string;
}

interface DirectorySearchProps {
  categories: DirectorySearchCategory[];
  initialSearchTerm?: string;
  initialCategoryFilter?: string;
}

export function DirectorySearch({ categories, initialSearchTerm = "", initialCategoryFilter = "" }: DirectorySearchProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [categoryFilter, setCategoryFilter] = useState(initialCategoryFilter);
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
          // On a specific category page (e.g., /categories/cat-a)
          // initialCategoryFilter is the slug of cat-a
          if (categoryFilter && categoryFilter !== initialCategoryFilter) {
            // User selected a *different* category in the dropdown
            targetPathname = `/categories/${categoryFilter}`;
          } else if (categoryFilter === "") { // User selected "All Categories"
            targetPathname = '/'; 
          }
          // If categoryFilter matches initialCategoryFilter or is cleared to imply current page's category,
          // targetPathname remains currentPathname, and no 'category' query param is needed.
        } else {
          // On a non-category-specific page (e.g., home page '/')
          if (categoryFilter) {
            queryParams.set('category', categoryFilter);
          }
        }
        
        const queryString = queryParams.toString();
        router.push(queryString ? `${targetPathname}?${queryString}` : targetPathname);
      });
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, categoryFilter, router, currentPathname, initialCategoryFilter, startTransition]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value === "all" ? "" : value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="mb-8 p-6 bg-card rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="md:col-span-2 relative">
          <label htmlFor="search-term" className="block text-sm font-medium text-foreground mb-1">
            Search Tools
          </label>
          <Search className="absolute left-3 top-1/2 mt-px h-5 w-5 text-muted-foreground transform -translate-y-1/2" />
          <Input
            id="search-term"
            type="text"
            placeholder="e.g., 'Productivity App' or 'CRM'"
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-10 w-full"
            aria-label="Search directory items"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 mt-px h-7 w-7 transform -translate-y-1/2"
              onClick={clearSearch}
              aria-label="Clear search term"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div>
          <label htmlFor="category-filter" className="block text-sm font-medium text-foreground mb-1">
            Filter by Category
          </label>
          <Select value={categoryFilter || "all"} onValueChange={handleCategoryChange}>
            <SelectTrigger id="category-filter" aria-label="Filter by category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {isPending && <p className="text-sm text-muted-foreground mt-2">Loading...</p>}
    </div>
  );
}
