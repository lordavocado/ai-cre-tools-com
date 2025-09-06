"use client";

import type { DirectoryItem } from "@/types";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { CategoryChips } from "@/components/ui/category-chips";
import { SafeImage } from "@/components/ui/safe-image";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { ErrorBoundary } from "@/components/ui/error-boundary";

interface DirectoryItemCardProps {
  item: DirectoryItem;
}

function DirectoryItemCardContent({ item }: DirectoryItemCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden border border-neutral-200 hover:border-neutral-300 transition-colors duration-200 relative group rounded-lg bg-white">
      <CardHeader className="p-4 relative">
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <FavoriteButton toolId={item.id} size="sm" />
        </div>
        
        {/* Logo container */}
        <div className="relative w-16 h-16 mb-3 rounded-lg overflow-hidden flex items-center justify-center bg-neutral-50 border border-neutral-100">
          <SafeImage
            src={item.imageUrl}
            alt={item.name}
            website={item.website}
            className="w-12 h-12 object-contain"
            fallbackText={item.name.charAt(0)}
          />
        </div>

        {/* Tool name */}
        <CardTitle className="text-lg font-medium mb-1 leading-tight">
          <Link href={`/${item.slug}`} className="hover:text-neutral-600 transition-colors duration-200">
            {item.name}
          </Link>
        </CardTitle>

        {/* Tagline */}
        {item.tagline && (
          <CardDescription className="text-sm leading-relaxed text-neutral-600 line-clamp-2 mb-2">
            {item.tagline}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-grow px-4 pb-2">
        {/* Rating section */}
        {item.rating && (
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Star className="h-4 w-4 text-amber-500 fill-amber-400" />
            <span className="font-medium">{item.rating.toFixed(1)}</span>
            {item.reviewCount && <span className="text-neutral-500">({item.reviewCount} reviews)</span>}
          </div>
        )}
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-0 flex flex-col gap-3">
        {/* Category chips */}
        {item.category && (
          <div className="w-full">
            <CategoryChips 
              categories={item.category}
              size="sm"
              showLinks={true}
              className=""
            />
          </div>
        )}
        
        <Button
          size="sm"
          asChild
          className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium"
        >
          <Link href={`/${item.slug}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function DirectoryItemCard({ item }: DirectoryItemCardProps) {
  return (
    <ErrorBoundary
      componentName="DirectoryItemCard"
      onError={(error, errorInfo) => {
        // Log specific DirectoryItemCard errors for monitoring
        console.error('DirectoryItemCard Error:', {
          error: error.message,
          componentStack: errorInfo.componentStack,
          itemId: item?.id,
          itemName: item?.name
        });
      }}
    >
      <DirectoryItemCardContent item={item} />
    </ErrorBoundary>
  );
}
