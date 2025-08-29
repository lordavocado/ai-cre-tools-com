"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, FileText, Folder, Wrench, Sparkles, TrendingUp, Hash, ExternalLink, Star, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  tags?: string[];
  website?: string;
  pricing?: string;
  isFeatured?: boolean;
  isNew?: boolean;
}

interface GlobalSearchProps {
  className?: string;
  placeholder?: string;
}

export function GlobalSearch({ className, placeholder = "Search tools, categories, blog... (⌘K)" }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  
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

  // Load recent searches on mount
  useEffect(() => {
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch(query.trim());
        setShowRecentSearches(false);
      } else {
        setResults([]);
        setIsOpen(query.trim().length === 0 && recentSearches.length > 0);
        setShowRecentSearches(query.trim().length === 0 && recentSearches.length > 0);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, recentSearches]);

  const performSearch = async (searchTerm: string) => {
    setIsLoading(true);
    try {
      const [toolsResponse, categoriesResponse, blogResponse] = await Promise.all([
        fetch(`/api/sheets?type=items&search=${encodeURIComponent(searchTerm)}`),
        fetch(`/api/sheets?type=categories`),
        fetch(`/api/blog?search=${encodeURIComponent(searchTerm)}`)
      ]);

      const [tools, categories, blogPosts]: [DirectoryItem[], Category[], any[]] = await Promise.all([
        toolsResponse.json(),
        categoriesResponse.json(),
        blogResponse.json()
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
            relevanceScore,
            tags: tool.tags,
            website: tool.website,
            pricing: tool.pricing,
            isFeatured: false, // Not available in current data structure
            isNew: false // Not available in current data structure
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

      // Enhanced blog search
      blogPosts.forEach(post => {
        const relevanceScore = calculateRelevanceScore(post, searchTerm);
        if (relevanceScore > 0) {
          searchResults.push({
            type: 'guide',
            id: post.id,
            title: post.title,
            description: post.excerpt,
            url: `/blog/${post.slug}`,
            category: post.category,
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
      
      // Save successful searches to recent searches
      if (sortedResults.length > 0) {
        const updatedRecent = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
        setRecentSearches(updatedRecent);
        localStorage.setItem('recent-searches', JSON.stringify(updatedRecent));
      }
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
    if (results.length > 0 || (query.trim().length === 0 && recentSearches.length > 0)) {
      setIsOpen(true);
      setShowRecentSearches(query.trim().length === 0 && recentSearches.length > 0);
    }
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    inputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent-searches');
  };

  // Highlight matching text in search results
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim() || !text) return text;
    
    const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
    let highlightedText = text;
    
    searchTerms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 text-yellow-900 px-1 py-0.5 rounded-sm">$1</mark>');
    });
    
    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
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
        return 'Blog';
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
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="pl-12 pr-12 h-12 text-base bg-white/80 backdrop-blur-sm border-2 border-neutral-200 hover:border-neutral-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50 rounded-xl shadow-sm hover:shadow-md search-input-enhanced"
          aria-label="Global search"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
        />
        {isLoading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-blue-500" />
        )}
        {!isLoading && query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-neutral-100"
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
              inputRef.current?.focus();
            }}
          >
            <Search className="h-4 w-4 rotate-45" />
          </Button>
        )}
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-3 z-50 max-h-[600px] overflow-hidden shadow-2xl border-2 border-neutral-100 rounded-2xl bg-white/95 backdrop-blur-md">
          {showRecentSearches && recentSearches.length > 0 ? (
            <>
              <CardHeader className="px-6 py-4 border-b border-neutral-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-gray-700">Recent Searches</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearRecentSearches}
                    className="text-xs text-muted-foreground hover:text-gray-700 p-1 h-auto"
                  >
                    Clear
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="py-2">
                  {recentSearches.map((search, index) => (
                    <Button
                      key={search}
                      variant="ghost"
                      className="w-full justify-start px-6 py-3 rounded-none hover:bg-neutral-50 text-left"
                      onClick={() => handleRecentSearchClick(search)}
                    >
                      <div className="flex items-center gap-3">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-gray-700">{search}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </>
          ) : results.length > 0 ? (
            <CardContent className="p-0">
              <div className="max-h-[550px] overflow-y-auto">
                <div role="listbox" aria-label="Search results" className="py-2">
                  {results.map((result, index) => (
                    <Button
                      key={`${result.type}-${result.id}`}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start p-6 h-auto text-left rounded-none border-b border-neutral-50 last:border-b-0 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/30 search-result-item group",
                        selectedIndex === index && "bg-gradient-to-r from-blue-50/80 to-purple-50/50 border-blue-200/50"
                      )}
                      onClick={() => handleResultClick(result)}
                      role="option"
                      aria-selected={selectedIndex === index}
                    >
                      <div className="flex items-start gap-4 w-full">
                        <div className="flex-shrink-0 mt-1">
                          <div className={cn(
                            "p-2 rounded-lg transition-colors group-hover:scale-105 duration-200",
                            result.type === 'tool' && "bg-blue-100 text-blue-700 group-hover:bg-blue-200",
                            result.type === 'category' && "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200",
                            result.type === 'guide' && "bg-violet-100 text-violet-700 group-hover:bg-violet-200"
                          )}>
                            {getResultIcon(result.type)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3 flex-wrap min-w-0">
                              <span className="font-semibold text-base text-gray-900 truncate group-hover:text-gray-700">
                                {highlightMatch(result.title, query)}
                              </span>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge 
                                  variant="outline" 
                                  className={cn(
                                    "text-xs font-medium border transition-colors",
                                    getResultTypeColor(result.type)
                                  )}
                                >
                                  {getResultTypeLabel(result.type)}
                                </Badge>
                              </div>
                            </div>
                            {result.website && (
                              <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3 group-hover:text-gray-700">
                            {highlightMatch(result.description, query)}
                          </p>
                          <div className="flex items-center gap-3 flex-wrap">
                            {result.category && (
                              <CategoryChips 
                                categories={result.category} 
                                variant="secondary" 
                                size="sm" 
                                showLinks={false}
                              />
                            )}
                            {result.pricing && (
                              <span className="text-xs text-muted-foreground bg-neutral-100 px-2 py-1 rounded-md">
                                {result.pricing}
                              </span>
                            )}
                            {result.tags && result.tags.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Hash className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {result.tags.slice(0, 2).join(', ')}
                                  {result.tags.length > 2 && ` +${result.tags.length - 2}`}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
              {results.length === 8 && (
                <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50">
                  <p className="text-xs text-muted-foreground text-center">
                    Showing top 8 results. Refine your search for more specific results.
                  </p>
                </div>
              )}
            </CardContent>
          ) : null}
        </Card>
      )}
    </div>
  );
} 