"use client";

import { ArrowLeft, Heart, Search, Star } from "lucide-react";
import Link from "next/link";
import { DirectoryItemCard } from "@/components/listing/DirectoryItemCard";
import { useFavoritesContext } from "@/providers/FavoritesProvider";
import { useEffect, useMemo, useState } from "react";
import type { DirectoryItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";

export function FavoritesClient() {
  const { favorites, isLoading } = useFavoritesContext();
  const [favoriteTools, setFavoriteTools] = useState<DirectoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    if (!isLoading && favorites.length > 0) {
      const fetchFavoriteTools = async () => {
        try {
          const response = await fetch('/api/sheets?type=items');
          if (response.ok) {
            const allTools: DirectoryItem[] = await response.json();
            const favTools = allTools.filter(tool => favorites.includes(tool.id));
            setFavoriteTools(favTools);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchFavoriteTools();
    } else {
      setLoading(false);
    }
  }, [favorites, isLoading]);

  const filteredTools = useMemo(
    () => favoriteTools.filter(tool => {
      const term = searchTerm.toLowerCase();
      return (
        tool.name.toLowerCase().includes(term) ||
        tool.tagline.toLowerCase().includes(term) ||
        tool.category.toLowerCase().includes(term)
      );
    }),
    [favoriteTools, searchTerm]
  );

  const totalPages = Math.ceil(filteredTools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTools = filteredTools.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading || isLoading) {
    return (
      <div className="container px-6 py-12 md:py-16">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Directory
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-gray-900 mb-4" />
          <p className="text-sm text-gray-500">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-6 py-12 md:py-16">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Directory
        </Link>
      </div>

      {/* Page Title */}
      <div className="mb-10">
        <div className="flex items-center gap-2.5 mb-3">
          <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">My Favorite Tools</h1>
        </div>
        <p className="text-sm text-gray-500">Your personal collection of saved AI CRE tools</p>
        {favorites.length > 0 && (
          <Badge variant="secondary" className="mt-4 px-3 py-1 text-xs">
            {favorites.length} tool{favorites.length !== 1 ? 's' : ''} saved
          </Badge>
        )}
      </div>

      {/* Empty State */}
      {favorites.length === 0 ? (
        <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-12 text-center">
          <Heart className="h-10 w-10 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No Favorites Yet</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto leading-6">
            Start building your collection by exploring our directory and saving tools you like.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
          >
            <Search className="h-3.5 w-3.5" />
            Explore Tools
          </Link>
        </div>
      ) : (
        <>
          {/* Search Bar */}
          <div className="max-w-sm mb-8">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search your favorites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 h-10 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors"
              />
            </div>
          </div>

          {/* Search Results */}
          {searchTerm && (
            <p className="text-xs text-gray-400 mb-6">
              {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} matching &ldquo;{searchTerm}&rdquo;
            </p>
          )}

          {/* Tools Grid */}
          {filteredTools.length > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {currentTools.map((tool) => (
                  <DirectoryItemCard key={tool.id} item={tool} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-lg mx-auto rounded-xl border border-gray-200 bg-white p-12 text-center">
              <Search className="h-10 w-10 text-gray-300 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h2>
              <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto leading-6">
                No tools match your search. Try adjusting your search terms.
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Clear Search
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
