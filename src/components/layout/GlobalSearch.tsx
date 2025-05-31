"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, FileText, Folder, Wrench } from "lucide-react";
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

      // Add tool results
      tools.slice(0, 5).forEach(tool => {
        searchResults.push({
          type: 'tool',
          id: tool.id,
          title: tool.name,
          description: tool.tagline,
          url: `/${tool.slug}`,
          category: tool.category
        });
      });

      // Add category results (filter by search term)
      const filteredCategories = categories.filter(category => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return category.name.toLowerCase().includes(lowerSearchTerm) ||
               category.description.toLowerCase().includes(lowerSearchTerm);
      });

      filteredCategories.slice(0, 3).forEach(category => {
        searchResults.push({
          type: 'category',
          id: category.id,
          title: category.name,
          description: category.description,
          url: `/categories/${category.slug}`
        });
      });

      // Add guide results
      guides.slice(0, 4).forEach(guide => {
        searchResults.push({
          type: 'guide',
          id: guide.id,
          title: guide.title,
          description: guide.excerpt,
          url: `/guides/${guide.slug}`,
          category: guide.category
        });
      });

      setResults(searchResults);
      setIsOpen(searchResults.length > 0);
      setSelectedIndex(-1);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
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
        return <Wrench className="h-4 w-4 text-blue-500" />;
      case 'category':
        return <Folder className="h-4 w-4 text-green-500" />;
      case 'guide':
        return <FileText className="h-4 w-4 text-purple-500" />;
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

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="pl-8 pr-10"
          aria-label="Global search"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
        />
        {isLoading && (
          <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto shadow-lg">
          <CardContent className="p-0">
            <div role="listbox" aria-label="Search results">
              {results.map((result, index) => (
                <Button
                  key={`${result.type}-${result.id}`}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start p-3 h-auto text-left rounded-none border-b border-border/50 last:border-b-0",
                    selectedIndex === index && "bg-accent"
                  )}
                  onClick={() => handleResultClick(result)}
                  role="option"
                  aria-selected={selectedIndex === index}
                >
                  <div className="flex items-start gap-3 w-full">
                    {getResultIcon(result.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-medium text-sm truncate">{result.title}</span>
                        <Badge variant="outline" className="text-xs shrink-0">
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
                      <p className="text-xs text-muted-foreground line-clamp-2">
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