"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, FileText, Folder, Wrench, Sparkles, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DirectoryItem, Category, Guide } from "@/types";
import { CategoryChips } from "@/components/ui/category-chips";

interface SearchResult {
  type: 'tool' | 'category' | 'guide';
  id: string;
  title: string;
  description: string;
  url: string;
  category?: string;
  relevanceScore?: number;
}

interface GlobalSearchProps {
  className?: string;
  placeholder?: string;
}

export function GlobalSearch({ className, placeholder = "Search tools, categories, guides... (⌘K)" }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation and shortcuts
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Global shortcut to focus search (Cmd+K or Ctrl+K)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        return;
      }

      if (!isOpen || results.length === 0) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          event.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
          break;
        case "Enter":
          event.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < results.length) {
            handleResultClick(results[selectedIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch(query.trim());
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const performSearch = async (searchTerm: string) => {
    setIsLoading(true);
    try {
      const [toolsResponse, categoriesResponse, guidesResponse] = await Promise.all([
        fetch(`/api/sheets?type=items&search=${encodeURIComponent(searchTerm)}`),
        fetch(`/api/sheets?type=categories`),
        fetch(`/api/sheets?type=guides&search=${encodeURIComponent(searchTerm)}`)
      ]);

      const [tools, categories, guides]: [DirectoryItem[], Category[], Guide[]] = await Promise.all([
        toolsResponse.json(),
        categoriesResponse.json(),
        guidesResponse.json()
      ]);

      const searchResults: SearchResult[] = [];

      // Enhanced tool search with relevance scoring
      tools.forEach(tool => {
        const relevanceScore = calculateRelevanceScore(tool, searchTerm);
        if (relevanceScore > 0) {
          searchResults.push({
            type: 'tool',
            id: tool.id,
            title: tool.name,
            description: tool.tagline,
            url: `/${tool.slug}`,
            category: tool.category,
            relevanceScore
          });
        }
      });

      // Enhanced category search
      const filteredCategories = categories.filter(category => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return category.name.toLowerCase().includes(lowerSearchTerm) ||
               category.description.toLowerCase().includes(lowerSearchTerm);
      });

      filteredCategories.forEach(category => {
        const relevanceScore = calculateRelevanceScore(category, searchTerm);
        searchResults.push({
          type: 'category',
          id: category.id,
          title: category.name,
          description: category.description,
          url: `/categories/${category.slug}`,
          relevanceScore
        });
      });

      // Enhanced guide search
      guides.forEach(guide => {
        const relevanceScore = calculateRelevanceScore(guide, searchTerm);
        if (relevanceScore > 0) {
          searchResults.push({
            type: 'guide',
            id: guide.id,
            title: guide.title,
            description: guide.excerpt,
            url: `/guides/${guide.slug}`,
            category: guide.category,
            relevanceScore
          });
        }
      });

      // Sort by relevance score and limit results
      const sortedResults = searchResults
        .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
        .slice(0, 8);

      setResults(sortedResults);
      setIsOpen(sortedResults.length > 0);
      setSelectedIndex(-1);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced relevance scoring algorithm
  const calculateRelevanceScore = (item: any, searchTerm: string): number => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const searchTerms = lowerSearchTerm.split(/\s+/).filter(term => term.length > 0);
    
    let score = 0;
    
    // Exact matches get highest score
    if (item.name?.toLowerCase().includes(lowerSearchTerm)) score += 100;
    if (item.title?.toLowerCase().includes(lowerSearchTerm)) score += 100;
    
    // Partial word matches
    searchTerms.forEach(term => {
      // Name/title matches
      if (item.name?.toLowerCase().includes(term)) score += 50;
      if (item.title?.toLowerCase().includes(term)) score += 50;
      
      // Tagline/excerpt matches
      if (item.tagline?.toLowerCase().includes(term)) score += 30;
      if (item.excerpt?.toLowerCase().includes(term)) score += 30;
      
      // Description matches
      if (item.description?.toLowerCase().includes(term)) score += 20;
      
      // Category matches
      if (item.category?.toLowerCase().includes(term)) score += 40;
      
      // Tag matches
      if (item.tags?.some((tag: string) => tag.toLowerCase().includes(term))) score += 25;
    });
    
    return score;
  };

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url);
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleInputFocus = () => {
    if (results.length > 0) {
      setIsOpen(true);
    }
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'tool':
        return <Wrench className="h-4 w-4 text-blue-600" />;
      case 'category':
        return <Folder className="h-4 w-4 text-emerald-600" />;
      case 'guide':
        return <FileText className="h-4 w-4 text-violet-600" />;
    }
  };

  const getResultTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'tool':
        return 'Tool';
      case 'category':
        return 'Category';
      case 'guide':
        return 'Guide';
    }
  };

  const getResultTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'tool':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800';
      case 'category':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800';
      case 'guide':
        return 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-300 dark:border-violet-800';
    }
  };

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="pl-10 pr-10 h-10 search-input-enhanced transition-all duration-200"
          aria-label="Global search"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-blue-500" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-search-dropdown max-h-[500px] overflow-y-auto search-dropdown-enhanced">
          <CardContent className="p-0">
            <div role="listbox" aria-label="Search results" className="py-2">
              {results.map((result, index) => (
                <Button
                  key={`${result.type}-${result.id}`}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start p-4 h-auto text-left rounded-none border-b border-gray-100 last:border-b-0 hover:bg-gray-50/80 transition-colors duration-150",
                    selectedIndex === index && "bg-blue-50/80 border-blue-200"
                  )}
                  onClick={() => handleResultClick(result)}
                  role="option"
                  aria-selected={selectedIndex === index}
                >
                  <div className="flex items-start gap-4 w-full">
                    <div className="flex-shrink-0 mt-0.5">
                      {getResultIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="font-semibold text-sm text-gray-900 truncate">
                          {result.title}
                        </span>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs shrink-0 font-medium",
                            getResultTypeColor(result.type)
                          )}
                        >
                          {getResultTypeLabel(result.type)}
                        </Badge>
                        {result.category && (
                          <CategoryChips 
                            categories={result.category} 
                            variant="secondary" 
                            size="sm" 
                            showLinks={false}
                          />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {result.description}
                      </p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 