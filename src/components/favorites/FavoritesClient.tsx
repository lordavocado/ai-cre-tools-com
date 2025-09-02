"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Search, Star } from "lucide-react";
import Link from "next/link";
import { DirectoryItemCard } from "@/components/listing/DirectoryItemCard";
import { useFavoritesContext } from "@/providers/FavoritesProvider";
import { useEffect, useState } from "react";
import React from "react";
import type { DirectoryItem } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";

export function FavoritesClient() {
  const { favorites, isLoading } = useFavoritesContext();
  const [favoriteTools, setFavoriteTools] = useState<DirectoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Fetch favorite tools data
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
        } catch (error) {
          console.error('Failed to fetch favorite tools:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchFavoriteTools();
    } else {
      setLoading(false);
    }
  }, [favorites, isLoading]);

  // Filter tools based on search
  const filteredTools = favoriteTools.filter(tool => 
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredTools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTools = filteredTools.slice(startIndex, endIndex);

  // Reset pagination when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading || isLoading) {
    return (
      <div className="container pl-6 py-16 md:py-24">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Directory
            </Link>
          </Button>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container pl-6 py-16 md:py-24">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Directory
          </Link>
        </Button>
      </div>

      {/* Page Title */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
          <h1 className="text-3xl md:text-4xl font-serif">My Favorite Tools</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your personal collection of saved analytics tools
        </p>
        {favorites.length > 0 && (
          <Badge variant="secondary" className="mt-4">
            {favorites.length} tool{favorites.length !== 1 ? 's' : ''} saved
          </Badge>
        )}
      </div>

      {/* Empty State */}
      {favorites.length === 0 ? (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-12 text-center">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-serif mb-4">No Favorites Yet</h2>
            <p className="text-muted-foreground mb-6">
              Start building your collection by exploring our directory and saving tools you like.
            </p>
            <Button asChild>
              <Link href="/">
                Explore Tools
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search your favorites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Search Results */}
          {searchTerm && (
            <div className="text-center mb-6">
              <p className="text-muted-foreground">
                Found {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} matching "{searchTerm}"
              </p>
            </div>
          )}

          {/* Tools Grid */}
          {filteredTools.length > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-12 text-center">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h2 className="text-2xl font-serif mb-4">No Results Found</h2>
                <p className="text-muted-foreground mb-6">
                  No tools match your search criteria. Try adjusting your search terms.
                </p>
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
