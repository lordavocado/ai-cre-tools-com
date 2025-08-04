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
    <div>Test</div>
  );
}
