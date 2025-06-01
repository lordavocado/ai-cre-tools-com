"use client";

import type { DirectoryItem } from "@/types";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ExternalLink, Star, Tag } from "lucide-react";
import { CategoryChips } from "@/components/ui/category-chips";
import { SafeImage } from "@/components/ui/safe-image";
import { FavouriteButton } from "@/components/ui/favourite-button";

interface DirectoryItemCardProps {
  item: DirectoryItem;
}

export function DirectoryItemCard({ item }: DirectoryItemCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative group">
      <CardHeader className="p-4">
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <FavouriteButton toolId={item.id} size="sm" />
        </div>
        <div className="relative w-16 h-16 mx-auto mb-3 rounded-md overflow-hidden flex items-center justify-center bg-background">
          <SafeImage
            src={item.imageUrl}
            alt={item.name}
            website={item.website}
            className="w-16 h-16 object-contain transition-transform duration-300 group-hover:scale-105"
            fallbackText={item.name.charAt(0)}
          />
        </div>
        <CardTitle className="text-lg text-center">
          <Link href={`/${item.slug}`} className="hover:text-primary transition-colors">
            {item.name}
          </Link>
        </CardTitle>
        <CardDescription className="text-base mt-1 text-center">{item.tagline}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Tag className="h-3 w-3 text-muted-foreground" />
          <CategoryChips categories={item.category} variant="secondary" size="sm" />
        </div>
        {item.rating && (
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <span>{item.rating.toFixed(1)}</span>
            {item.reviewCount && <span>({item.reviewCount})</span>}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2 p-4 pt-3 border-t">
        <Button variant="ghost" size="sm" asChild className="w-full sm:w-auto">
          <Link href={item.website} target="_blank" rel="noopener noreferrer">
            Visit Website <ExternalLink className="ml-2 h-3 w-3" />
          </Link>
        </Button>
        <Button size="sm" asChild className="w-full sm:w-auto">
          <Link href={`/${item.slug}`}>
            View Details <ArrowUpRight className="ml-2 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
