"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { siteConfig } from "@/config/site";
import { CATEGORY_ICONS } from "@/lib/category-icons";
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
  initialCountryFilter?: string;
  initialCityFilter?: string;
  totalItems?: number;
}

function DirectorySearchContent({
  categories,
  initialSearchTerm = "",
  initialCategoryFilter = "",
  initialCountryFilter = "",
  initialCityFilter = "",
  totalItems = 0
}: DirectorySearchProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategoryFilter ? initialCategoryFilter.split(',').map(cat => cat.trim()) : []
  );
  const [selectedCountry, setSelectedCountry] = useState(initialCountryFilter);
  const [selectedCity, setSelectedCity] = useState(initialCityFilter);
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
    if (selectedCountry) {
      queryParams.set('country', selectedCountry);
    }
    if (selectedCity) {
      queryParams.set('city', selectedCity);
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
  }, [searchTerm, selectedCategories, selectedCountry, selectedCity, currentPathname, initialCategoryFilter, mounted, router]);

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

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedCountry("");
    setSelectedCity("");
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
          {categories.map((category) => {
            const IconComponent = CATEGORY_ICONS[category.icon as keyof typeof CATEGORY_ICONS];
            return (
              <Badge
                key={category.id}
                variant={selectedCategories.includes(category.slug) ? "default" : "secondary"}
                className={`
                  cursor-pointer px-4 py-2 text-sm font-medium flex items-center gap-2
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
                {IconComponent && <IconComponent className="h-4 w-4" />}
                {category.name}
              </Badge>
            );
          })}
        </div>

        {/* Location Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="country-filter" className="text-sm font-medium text-neutral-700">
              Country
            </label>
            <select
              id="country-filter"
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="px-3 py-2 border border-neutral-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
            >
              <option value="">All Countries</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Sweden">Sweden</option>
              <option value="Singapore">Singapore</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="city-filter" className="text-sm font-medium text-neutral-700">
              City
            </label>
            <select
              id="city-filter"
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
              className="px-3 py-2 border border-neutral-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
            >
              <option value="">All Cities</option>
              <option value="New York">New York</option>
              <option value="San Francisco">San Francisco</option>
              <option value="London">London</option>
              <option value="Toronto">Toronto</option>
              <option value="Sydney">Sydney</option>
              <option value="Berlin">Berlin</option>
              <option value="Paris">Paris</option>
              <option value="Amsterdam">Amsterdam</option>
              <option value="Stockholm">Stockholm</option>
              <option value="Singapore">Singapore</option>
            </select>
          </div>
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
