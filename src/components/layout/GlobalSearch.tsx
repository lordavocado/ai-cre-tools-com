"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, FileText, Folder, Wrench, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DirectoryItem, Category } from "@/types";
import { WebsiteFavicon } from "@/components/ui/website-favicon";
import { getToolPath } from "@/lib/tool-routes";

/** Minimal shape required for relevance scoring across tools, categories, and blog posts */
interface SearchableItem {
  id?: string;
  name?: string;
  title?: string;
  description?: string;
  one_liner?: string;
  slug?: string;
  tagline?: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  [key: string]: unknown;
}

function calculateRelevanceScore(item: DirectoryItem | Category | SearchableItem, searchTerm: string): number {
  const i = item as SearchableItem;
  const lowerSearchTerm = searchTerm.toLowerCase();
  const searchTerms = lowerSearchTerm.split(/\s+/).filter(term => term.length > 0);

  let score = 0;

  if (i.name?.toLowerCase().includes(lowerSearchTerm)) score += 100;
  if (i.title?.toLowerCase().includes(lowerSearchTerm)) score += 100;

  searchTerms.forEach(term => {
    if (i.name?.toLowerCase().includes(term)) score += 50;
    if (i.title?.toLowerCase().includes(term)) score += 50;
    if (i.tagline?.toLowerCase().includes(term)) score += 30;
    if (i.excerpt?.toLowerCase().includes(term)) score += 30;
    if (i.description?.toLowerCase().includes(term)) score += 20;
    if (i.category?.toLowerCase().includes(term)) score += 40;
    if (i.tags?.some((tag: string) => tag.toLowerCase().includes(term))) score += 25;
  });

  return score;
}

/** Shape of a single search result */
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

/**
 * Props for the GlobalSearch component
 * @component
 */
interface GlobalSearchProps {
  /** Additional class names for the trigger input wrapper */
  className?: string;
  /** Placeholder text shown in the trigger input */
  placeholder?: string;
  /** When true, programmatically opens the search overlay and focuses the input */
  isOpen?: boolean;
  /** Called when the search overlay requests to be closed */
  onClose?: () => void;
}

/**
 * Full-screen search overlay with debounced search, keyboard navigation,
 * relevance scoring, and localStorage recent searches.
 * @component
 */
export function GlobalSearch({ className, placeholder = "Search tools... (⌘K)", isOpen: isOpenProp, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);

  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recentSearchesRef = useRef(recentSearches);
  recentSearchesRef.current = recentSearches;

  const performSearch = useCallback(async (searchTerm: string) => {
    setIsLoading(true);
    try {
      const [toolsResponse, categoriesResponse, blogResponse] = await Promise.all([
        fetch(`/api/sheets?type=items&search=${encodeURIComponent(searchTerm)}`),
        fetch(`/api/sheets?type=categories`),
        fetch(`/api/blog?search=${encodeURIComponent(searchTerm)}`)
      ]);

      const [tools, categories, blogPosts]: [DirectoryItem[], Category[], SearchableItem[]] = await Promise.all([
        toolsResponse.json(),
        categoriesResponse.json(),
        blogResponse.json()
      ]);

      const searchResults: SearchResult[] = [];

      // Tools with relevance scoring
      tools.forEach(tool => {
        const relevanceScore = calculateRelevanceScore(tool, searchTerm);
        if (relevanceScore > 0) {
          searchResults.push({
            type: 'tool',
            id: tool.id,
            title: tool.name,
            description: tool.tagline,
            url: getToolPath(tool.slug),
            category: tool.category,
            relevanceScore,
            tags: tool.tags,
            website: tool.website,
            pricing: tool.pricing,
            isFeatured: false,
            isNew: false
          });
        }
      });

      // Categories
      const filteredCategories = categories.filter(category => {
        const lower = searchTerm.toLowerCase();
        return category.name.toLowerCase().includes(lower) ||
               category.description.toLowerCase().includes(lower);
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

      // Blog / guides
      blogPosts.forEach(post => {
        const relevanceScore = calculateRelevanceScore(post, searchTerm);
        if (relevanceScore > 0) {
          searchResults.push({
            type: 'guide',
            id: post.id ?? '',
            title: post.title ?? '',
            description: post.excerpt ?? '',
            url: `/blog/${post.slug ?? ''}`,
            category: post.category,
            relevanceScore
          });
        }
      });

      const sortedResults = searchResults
        .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
        .slice(0, 8);

      setResults(sortedResults);
      setIsOpen(true);
      setSelectedIndex(-1);

      // Persist successful searches
      if (sortedResults.length > 0) {
        const prevRecent = recentSearchesRef.current;
        const updatedRecent = [searchTerm, ...prevRecent.filter(s => s !== searchTerm)].slice(0, 5);
        setRecentSearches(updatedRecent);
        localStorage.setItem('recent-searches', JSON.stringify(updatedRecent));
      }
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleResultClick = useCallback((result: SearchResult) => {
    router.push(result.url);
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
    onClose?.();
  }, [router, onClose]);

  /** Close overlay when clicking the backdrop (outside the search container) */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
        onClose?.();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  /** Global keyboard shortcuts: ⌘K to open, arrow keys / Enter / Escape inside overlay */
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Global shortcut to open search (Cmd+K or Ctrl+K)
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
          onClose?.();
          break;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, handleResultClick]);

  /** Load recent searches from localStorage on mount */
  useEffect(() => {
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  /** Sync controlled open prop — focus the input when the parent opens the overlay */
  useEffect(() => {
    if (isOpenProp) {
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpenProp]);

  /** Debounced search — fires 300ms after the user stops typing */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch(query.trim());
        setShowRecentSearches(false);
      } else {
        setResults([]);
        if (query.trim().length === 0) {
          setShowRecentSearches(false);
        }
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, performSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleInputFocus = () => {
    if (results.length > 0) {
      setIsOpen(true);
    } else if (query.trim().length === 0 && recentSearches.length > 0) {
      setIsOpen(true);
      setShowRecentSearches(true);
    }
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    inputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent-searches');
    setShowRecentSearches(false);
  };

  const closeOverlay = () => {
    setIsOpen(false);
    setSelectedIndex(-1);
    setQuery("");
    setResults([]);
    onClose?.();
  };

  /**
   * Wraps matched substrings with a green highlight span.
   * @param text - Source text to search within
   * @param searchQuery - The current query string
   * @returns JSX with highlighted matches or plain text
   */
  const highlightMatch = (text: string, searchQuery: string) => {
    if (!searchQuery.trim() || !text) return text;

    const searchTerms = searchQuery.toLowerCase().split(/\s+/).filter(term => term.length > 0);
    let highlightedText = text;

    searchTerms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedText = highlightedText.replace(
        regex,
        '<mark class="bg-[#f0f9f0] text-[#629649] px-0.5 rounded-sm not-italic">$1</mark>'
      );
    });

    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  /**
   * Returns the icon element for a given result type.
   * @param type - The result type: tool, category, or guide
   */
  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'tool':
        return <Wrench className="h-4 w-4" />;
      case 'category':
        return <Folder className="h-4 w-4" />;
      case 'guide':
        return <FileText className="h-4 w-4" />;
    }
  };

  /**
   * Returns the human-readable label for a result type badge.
   * @param type - The result type
   */
  const getResultTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'tool': return 'Tool';
      case 'category': return 'Category';
      case 'guide': return 'Blog';
    }
  };

  const showOverlay = isOpen || Boolean(isOpenProp);
  // When used with external isOpen/onClose (e.g. from Header), skip rendering
  // the built-in trigger input — the caller provides its own trigger.
  const isExternallyControlled = Boolean(onClose);

  return (
    <>
      {/* Trigger input — only rendered when NOT externally controlled */}
      {!isExternallyControlled && (
        <div className={cn("relative", className)}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className="pl-9 pr-4 h-9 w-full text-sm bg-white border border-[#e0e0e0] hover:border-[#c8c8c8] focus:border-[#629649] focus:outline-none focus:ring-1 focus:ring-[#629649]/30 rounded-lg truncate placeholder:text-[#a0a0a0]"
            aria-label="Open global search"
            aria-haspopup="dialog"
            readOnly
            onClick={() => {
              setIsOpen(true);
              setTimeout(() => inputRef.current?.focus(), 0);
            }}
          />
        </div>
      )}

      {/* Full-screen overlay */}
      {showOverlay && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-white/95 backdrop-blur-sm">
          {/* Click-outside backdrop */}
          <div className="absolute inset-0" onClick={closeOverlay} aria-hidden="true" />

          {/* Search container */}
          <div
            ref={overlayRef}
            className="relative max-w-2xl w-full border-[1.25px] border-[#e0e0e0] rounded-[8px] bg-white shadow-lg overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Search"
          >
            {/* Input row */}
            <div className="flex items-center px-4 py-3 border-b border-[#e0e0e0]">
              <Search className="h-5 w-5 text-[#a0a0a0] flex-shrink-0 mr-3" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search tools..."
                value={query}
                onChange={handleInputChange}
                className="flex-1 text-[18px] text-[#1f1f1f] placeholder:text-[#a0a0a0] bg-transparent border-none outline-none"
                aria-label="Search"
                aria-autocomplete="list"
                aria-haspopup="listbox"
                autoComplete="off"
              />
              {isLoading && (
                <Loader2 className="h-4 w-4 animate-spin text-[#a0a0a0] flex-shrink-0 ml-2" />
              )}
              {!isLoading && query && (
                <button
                  className="ml-2 flex-shrink-0 text-[#a0a0a0] hover:text-[#1f1f1f] transition-colors"
                  onClick={() => { setQuery(""); setResults([]); inputRef.current?.focus(); }}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                className="ml-3 flex-shrink-0 text-[#a0a0a0] hover:text-[#1f1f1f] transition-colors text-xs"
                onClick={closeOverlay}
                aria-label="Close search"
              >
                Esc
              </button>
            </div>

            {/* Recent searches */}
            {showRecentSearches && recentSearches.length > 0 && results.length === 0 && (
              <div>
                <div className="flex items-center justify-between px-4 pt-3 pb-1">
                  <span className="text-[#737373] text-xs font-medium uppercase tracking-wide flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    Recent
                  </span>
                  <button
                    className="text-xs text-[#737373] hover:text-[#1f1f1f] transition-colors"
                    onClick={clearRecentSearches}
                    aria-label="Clear recent searches"
                  >
                    Clear
                  </button>
                </div>
                <ul className="py-1">
                  {recentSearches.map((search) => (
                    <li key={search}>
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#fafafa] text-left transition-colors"
                        onClick={() => handleRecentSearchClick(search)}
                      >
                        <Search className="h-4 w-4 text-[#a0a0a0] flex-shrink-0" />
                        <span className="text-sm text-[#1f1f1f]">{search}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Results list */}
            {results.length > 0 && (
              <ul
                role="listbox"
                aria-label="Search results"
                className="max-h-[420px] overflow-y-auto py-1"
              >
                {results.map((result, index) => (
                  <li key={`${result.type}-${result.id}`} role="option" aria-selected={selectedIndex === index}>
                    <button
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-t border-[#e0e0e0] first:border-t-0",
                        selectedIndex === index ? "bg-[#fafafa]" : "hover:bg-[#fafafa]"
                      )}
                      onClick={() => handleResultClick(result)}
                    >
                      {/* Icon / favicon */}
                      <div className="flex-shrink-0 p-1.5 bg-[#f0f9f0] text-[#629649] rounded-[6px] flex items-center justify-center">
                        {result.type === 'tool' && result.website ? (
                          <WebsiteFavicon
                            website={result.website}
                            size="sm"
                            fallback={getResultIcon(result.type)}
                          />
                        ) : (
                          getResultIcon(result.type)
                        )}
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[#1f1f1f] font-medium text-sm truncate">
                            {highlightMatch(result.title, query)}
                          </span>
                          <span className="flex-shrink-0 bg-[#f0f9f0] text-[#629649] text-xs rounded-[6px] px-2 py-0.5">
                            {getResultTypeLabel(result.type)}
                          </span>
                        </div>
                        {result.description && (
                          <p className="text-[#737373] text-sm truncate mt-0.5">
                            {highlightMatch(result.description, query)}
                          </p>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* No results */}
            {!isLoading && query.trim().length >= 2 && results.length === 0 && (
              <div className="text-[#737373] text-sm text-center py-8">
                No results for &ldquo;{query}&rdquo;
              </div>
            )}

            {/* Footer hint when max results shown */}
            {results.length === 8 && (
              <div className="px-4 py-3 border-t border-[#e0e0e0]">
                <p className="text-xs text-[#737373] text-center">
                  Showing top 8 results — refine your search for more specific results.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
