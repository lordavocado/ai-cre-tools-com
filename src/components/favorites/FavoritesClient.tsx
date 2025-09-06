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
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Directory
            </Link>
          </Button>
        </div>
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
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
        <div className="flex items-center justify-center gap-3 mb-6">
          <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">My Favorite Tools</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Your personal collection of saved AI CRE tools
        </p>
        {favorites.length > 0 && (
          <Badge variant="secondary" className="mt-6 px-4 py-2 text-sm">
            {favorites.length} tool{favorites.length !== 1 ? 's' : ''} saved
          </Badge>
        )}
      </div>

      {/* Empty State */}
      {favorites.length === 0 ? (
        <Card className="max-w-3xl mx-auto border-dashed border-2 bg-muted/20">
          <CardContent className="p-16 text-center">
            <div className="mb-8">
              <Heart className="h-20 w-20 text-muted-foreground/60 mx-auto mb-4" />
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-muted-foreground/20 to-transparent mx-auto"></div>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-foreground">No Favorites Yet</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
              Start building your collection by exploring our directory and saving tools you like.
            </p>
            <Button size="lg" asChild className="px-8 py-3">
              <Link href="/">
                <Search className="h-4 w-4 mr-2" />
                Explore Tools
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Search Bar */}
          <div className="max-w-lg mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search your favorites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg border-2 focus:border-primary rounded-xl"
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
            <Card className="max-w-3xl mx-auto border-dashed border-2 bg-muted/20">
              <CardContent className="p-16 text-center">
                <div className="mb-8">
                  <Search className="h-20 w-20 text-muted-foreground/60 mx-auto mb-4" />
                  <div className="w-24 h-1 bg-gradient-to-r from-transparent via-muted-foreground/20 to-transparent mx-auto"></div>
                </div>
                <h2 className="text-3xl font-bold mb-4">No Results Found</h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                  No tools match your search criteria. Try adjusting your search terms.
                </p>
                <Button variant="outline" size="lg" onClick={() => setSearchTerm("")} className="px-8 py-3">
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
