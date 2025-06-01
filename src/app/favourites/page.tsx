"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Search, Star } from "lucide-react";
import Link from "next/link";
import { DirectoryItemCard } from "@/components/listing/DirectoryItemCard";
import { useFavouritesContext } from "@/providers/FavouritesProvider";
import { useEffect, useState } from "react";
import React from "react";
import type { DirectoryItem } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";

export default function FavouritesPage() {
  const { favourites, isLoading } = useFavouritesContext();
  const [favouriteTools, setFavouriteTools] = useState<DirectoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch favourite tools data
  useEffect(() => {
    if (!isLoading && favourites.length > 0) {
      const fetchFavouriteTools = async () => {
        try {
          const response = await fetch('/api/sheets?type=items');
          if (response.ok) {
            const allTools: DirectoryItem[] = await response.json();
            const favTools = allTools.filter(tool => favourites.includes(tool.id));
            setFavouriteTools(favTools);
          }
        } catch (error) {
          console.error('Failed to fetch favourite tools:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchFavouriteTools();
    } else {
      setLoading(false);
    }
  }, [favourites, isLoading]);

  // Filter tools based on search
  const filteredTools = favouriteTools.filter(tool => 
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
          <p className="text-muted-foreground">Loading your favourites...</p>
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
          <h1 className="text-3xl md:text-4xl font-bold">My Favourite Tools</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your personal collection of saved analytics tools
        </p>
        {favourites.length > 0 && (
          <Badge variant="secondary" className="mt-4">
            {favourites.length} tool{favourites.length !== 1 ? 's' : ''} saved
          </Badge>
        )}
      </div>

      {/* Empty State */}
      {favourites.length === 0 ? (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-12 text-center">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-4">No favourites yet</h2>
            <p className="text-muted-foreground mb-6">
              Start building your collection by clicking the star icon on any tool card or tool page.
            </p>
            <Button asChild>
              <Link href="/">
                Browse Tools
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Search Bar */}
          {favouriteTools.length > 6 && (
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your favourites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          )}

          {/* Tools Grid */}
          {filteredTools.length === 0 && searchTerm ? (
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  No favourite tools match your search term "{searchTerm}"
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {currentTools.map((tool) => (
                  <DirectoryItemCard key={tool.id} item={tool} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}

          {/* Browse More Tools CTA */}
          {favouriteTools.length > 0 && (
            <div className="text-center mt-12 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-2">Discover more tools</h3>
              <p className="text-muted-foreground mb-4">
                Explore our directory to find more analytics tools for your needs
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button variant="outline" asChild>
                  <Link href="/">Browse All Tools</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/categories">Browse Categories</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/compare">Compare Tools</Link>
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 