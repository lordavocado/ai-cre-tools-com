"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, FileText, Folder, Loader2, Search, Wrench, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { WebsiteFavicon } from "@/components/ui/website-favicon";
import { getToolPath } from "@/lib/tool-routes";
import { cn } from "@/lib/utils";
import type { Category, DirectoryItem } from "@/types";

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

function calculateRelevanceScore(
  item: DirectoryItem | Category | SearchableItem,
  searchTerm: string
): number {
  const searchable = item as SearchableItem;
  const lowerSearchTerm = searchTerm.toLowerCase();
  const searchTerms = lowerSearchTerm.split(/\s+/).filter(Boolean);
  let score = 0;

  if (searchable.name?.toLowerCase().includes(lowerSearchTerm)) score += 100;
  if (searchable.title?.toLowerCase().includes(lowerSearchTerm)) score += 100;
  searchTerms.forEach((term) => {
    if (searchable.name?.toLowerCase().includes(term)) score += 50;
    if (searchable.title?.toLowerCase().includes(term)) score += 50;
    if (searchable.tagline?.toLowerCase().includes(term)) score += 30;
    if (searchable.excerpt?.toLowerCase().includes(term)) score += 30;
    if (searchable.description?.toLowerCase().includes(term)) score += 20;
    if (searchable.category?.toLowerCase().includes(term)) score += 40;
    if (searchable.tags?.some((tag) => tag.toLowerCase().includes(term))) score += 25;
  });
  return score;
}

interface SearchResult {
  type: "tool" | "category" | "guide";
  id: string;
  title: string;
  description: string;
  url: string;
  category?: string;
  relevanceScore?: number;
  tags?: string[];
  website?: string;
  pricing?: string;
}

interface GlobalSearchProps {
  /** Additional classes for the built-in trigger. */
  className?: string;
  /** Prompt shown in the built-in trigger. */
  placeholder?: string;
  /** Programmatically controls the dialog when supplied by a parent. */
  isOpen?: boolean;
  /** Called when an externally controlled dialog closes. */
  onClose?: () => void;
}

/** Search dialog with debounced results, recent searches, and keyboard navigation. */
export function GlobalSearch({
  className,
  placeholder = "Search tools… (⌘K)",
  isOpen: isOpenProp,
  onClose,
}: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const recentSearchesRef = useRef(recentSearches);
  const resultsId = useId();
  const router = useRouter();
  recentSearchesRef.current = recentSearches;

  const performSearch = useCallback(async (searchTerm: string) => {
    setIsLoading(true);
    try {
      const [toolsResponse, categoriesResponse, blogResponse] = await Promise.all([
        fetch(`/api/sheets?type=items&search=${encodeURIComponent(searchTerm)}`),
        fetch("/api/sheets?type=categories"),
        fetch(`/api/blog?search=${encodeURIComponent(searchTerm)}`),
      ]);
      if (!toolsResponse.ok || !categoriesResponse.ok || !blogResponse.ok) {
        throw new Error("Search request failed");
      }

      const [tools, categories, blogPosts]: [DirectoryItem[], Category[], SearchableItem[]] =
        await Promise.all([
          toolsResponse.json(),
          categoriesResponse.json(),
          blogResponse.json(),
        ]);
      const searchResults: SearchResult[] = [];

      tools.forEach((tool) => {
        const relevanceScore = calculateRelevanceScore(tool, searchTerm);
        if (relevanceScore > 0) {
          searchResults.push({
            type: "tool",
            id: tool.id,
            title: tool.name,
            description: tool.tagline,
            url: getToolPath(tool.slug),
            category: tool.category,
            relevanceScore,
            tags: tool.tags,
            website: tool.website,
            pricing: tool.pricing,
          });
        }
      });

      categories
        .filter((category) => {
          const term = searchTerm.toLowerCase();
          return category.name.toLowerCase().includes(term) || category.description.toLowerCase().includes(term);
        })
        .forEach((category) => {
          searchResults.push({
            type: "category",
            id: category.id,
            title: category.name,
            description: category.description,
            url: `/categories/${category.slug}`,
            relevanceScore: calculateRelevanceScore(category, searchTerm),
          });
        });

      blogPosts.forEach((post) => {
        const relevanceScore = calculateRelevanceScore(post, searchTerm);
        if (relevanceScore > 0) {
          searchResults.push({
            type: "guide",
            id: post.id ?? "",
            title: post.title ?? "",
            description: post.excerpt ?? "",
            url: `/blog/${post.slug ?? ""}`,
            category: post.category,
            relevanceScore,
          });
        }
      });

      const sortedResults = searchResults
        .sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0))
        .slice(0, 8);
      setResults(sortedResults);
      setSelectedIndex(-1);

      if (sortedResults.length > 0) {
        const updatedRecent = [
          searchTerm,
          ...recentSearchesRef.current.filter((value) => value !== searchTerm),
        ].slice(0, 5);
        setRecentSearches(updatedRecent);
        localStorage.setItem("recent-searches", JSON.stringify(updatedRecent));
      }
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setSelectedIndex(-1);
    setQuery("");
    setResults([]);
    setShowRecentSearches(false);
    onClose?.();
  }, [onClose]);

  const handleResultClick = useCallback(
    (result: SearchResult) => {
      router.push(result.url);
      closeSearch();
    },
    [closeSearch, router]
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem("recent-searches");
      if (saved) setRecentSearches(JSON.parse(saved).slice(0, 5));
    } catch {
      localStorage.removeItem("recent-searches");
    }
  }, []);

  useEffect(() => {
    if (isOpenProp) setIsOpen(true);
  }, [isOpenProp]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (query.trim().length >= 2) {
        void performSearch(query.trim());
        setShowRecentSearches(false);
      } else {
        setResults([]);
      }
    }, 300);
    return () => window.clearTimeout(timeoutId);
  }, [performSearch, query]);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setIsOpen(true);
      window.setTimeout(() => inputRef.current?.focus(), 0);
      return;
    }
    closeSearch();
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeSearch();
      return;
    }
    if (results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((index) => (index < results.length - 1 ? index + 1 : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((index) => (index > 0 ? index - 1 : results.length - 1));
    } else if (event.key === "Enter" && selectedIndex >= 0) {
      event.preventDefault();
      handleResultClick(results[selectedIndex]);
    }
  };

  const highlightMatch = (text: string, searchQuery: string) => {
    const terms = searchQuery.trim().split(/\s+/).filter(Boolean);
    if (!text || terms.length === 0) return text;
    const escapedTerms = terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const expression = new RegExp(`(${escapedTerms.join("|")})`, "gi");
    const lowerTerms = new Set(terms.map((term) => term.toLowerCase()));

    return text.split(expression).map((part, index) =>
      lowerTerms.has(part.toLowerCase()) ? (
        <mark key={`${part}-${index}`} className="rounded-sm bg-[#edf6f0] px-0.5 text-primary">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const getResultIcon = (type: SearchResult["type"]) => {
    if (type === "tool") return <Wrench className="h-4 w-4" />;
    if (type === "category") return <Folder className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const resultTypeLabel: Record<SearchResult["type"], string> = {
    tool: "Tool",
    category: "Category",
    guide: "Guide",
  };
  const showDialog = isOpen || Boolean(isOpenProp);
  const isExternallyControlled = Boolean(onClose);

  return (
    <Dialog open={showDialog} onOpenChange={handleOpenChange}>
      {!isExternallyControlled && (
        <DialogTrigger asChild>
          <button
            type="button"
            className={cn(
              "group flex h-12 w-full items-center gap-3 rounded-xl border border-border bg-background px-4 text-left text-base text-muted-foreground shadow-sm transition-[color,background-color,border-color,box-shadow,transform] duration-150 motion-safe:active:scale-[0.99] hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              className
            )}
            aria-label="Open search"
          >
            <Search className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate">{placeholder}</span>
            <kbd className="hidden shrink-0 rounded border border-border bg-secondary px-2 py-1 text-[11px] font-medium text-muted-foreground sm:inline-flex">
              ⌘K
            </kbd>
          </button>
        </DialogTrigger>
      )}

      <DialogContent
        hideCloseButton
        className="top-[10vh] block w-[calc(100%-2rem)] max-w-2xl translate-y-0 gap-0 overflow-hidden rounded-xl border-border bg-background p-0 shadow-2xl sm:top-[14vh]"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <DialogTitle className="sr-only">Search AI CRE Tools</DialogTitle>
        <div className="flex min-h-14 items-center border-b border-border px-3 sm:px-4">
          <Search className="mr-3 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => {
              if (!query.trim() && recentSearches.length > 0) setShowRecentSearches(true);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Search tools, capabilities, or workflows…"
            className="min-w-0 flex-1 border-0 bg-transparent py-4 text-base text-foreground outline-none placeholder:text-muted-foreground sm:text-lg"
            aria-label="Search tools, categories, and guides"
            aria-autocomplete="list"
            aria-expanded={results.length > 0}
            aria-controls={resultsId}
            aria-activedescendant={selectedIndex >= 0 ? `${resultsId}-${selectedIndex}` : undefined}
            autoComplete="off"
          />
          {isLoading && (
            <Loader2 className="ml-2 h-4 w-4 shrink-0 text-muted-foreground motion-safe:animate-spin" aria-label="Searching" />
          )}
          {!isLoading && query && (
            <button
              type="button"
              className="ml-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => {
                setQuery("");
                setResults([]);
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            className="ml-1 inline-flex h-10 min-w-10 shrink-0 items-center justify-center rounded-md px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={closeSearch}
            aria-label="Close search"
          >
            Esc
          </button>
        </div>

        <p className="sr-only" role="status" aria-live="polite">
          {isLoading ? "Searching" : `${results.length} results available`}
        </p>

        {showRecentSearches && recentSearches.length > 0 && results.length === 0 && (
          <div>
            <div className="flex items-center justify-between px-4 pb-1 pt-3">
              <span className="flex items-center gap-1.5 whitespace-nowrap text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                Recent searches
              </span>
              <button
                type="button"
                className="min-h-10 rounded-md px-2 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => {
                  setRecentSearches([]);
                  localStorage.removeItem("recent-searches");
                  setShowRecentSearches(false);
                }}
              >
                Clear recent searches
              </button>
            </div>
            <ul className="py-1">
              {recentSearches.map((search) => (
                <li key={search}>
                  <button
                    type="button"
                    className="flex min-h-11 w-full items-center gap-3 px-4 text-left text-sm text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                    onClick={() => {
                      setQuery(search);
                      inputRef.current?.focus();
                    }}
                  >
                    <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    {search}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {results.length > 0 && (
          <ul id={resultsId} role="listbox" aria-label="Search results" className="max-h-[420px] overflow-y-auto py-1">
            {results.map((result, index) => (
              <li key={`${result.type}-${result.id}`} role="none">
                <button
                  id={`${resultsId}-${index}`}
                  type="button"
                  role="option"
                  tabIndex={-1}
                  aria-selected={selectedIndex === index}
                  className={cn(
                    "flex min-h-16 w-full items-center gap-3 border-t border-border px-4 py-3 text-left transition-colors first:border-t-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                    selectedIndex === index ? "bg-secondary" : "hover:bg-secondary/70"
                  )}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#edf6f0] text-primary">
                    {result.type === "tool" && result.website ? (
                      <WebsiteFavicon website={result.website} size="sm" fallback={getResultIcon(result.type)} />
                    ) : (
                      getResultIcon(result.type)
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-foreground">
                        {highlightMatch(result.title, query)}
                      </span>
                      <span className="shrink-0 whitespace-nowrap rounded-md bg-[#edf6f0] px-2 py-0.5 text-xs text-primary">
                        {resultTypeLabel[result.type]}
                      </span>
                    </div>
                    {result.description && (
                      <p className="mt-0.5 truncate text-sm text-muted-foreground">
                        {highlightMatch(result.description, query)}
                      </p>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}

        {!isLoading && query.trim().length >= 2 && results.length === 0 && (
          <div className="px-6 py-10 text-center">
            <p className="text-sm font-medium text-foreground">No matching tools yet</p>
            <p className="mt-1 text-pretty text-sm text-muted-foreground">
              Try a capability such as “underwriting” or browse the category filters below the directory.
            </p>
          </div>
        )}

        {results.length === 8 && (
          <div className="border-t border-border px-4 py-3">
            <p className="text-center text-xs text-muted-foreground tabular-nums">
              Showing the top 8 results — refine your search for a narrower list.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
