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
import { ErrorBoundary } from "@/components/ui/error-boundary";

interface DirectoryItemCardProps {
  item: DirectoryItem;
}

function DirectoryItemCardContent({ item }: DirectoryItemCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden border border-slate-200/60 hover:border-blue-300/40 transition-all duration-300 relative group rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1 bg-gradient-to-br from-white via-blue-50/30 to-slate-50/50">
      <CardHeader className="p-6 relative">
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <FavouriteButton toolId={item.id} size="sm" />
        </div>
        
        {/* Enhanced logo container */}
        <div className="relative w-20 h-20 mb-4 rounded-2xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-50 ring-1 ring-blue-100/50 shadow-inner group-hover:ring-blue-200/80 transition-all duration-300">
          <SafeImage
            src={item.imageUrl}
            alt={item.name}
            website={item.website}
            className="w-16 h-16 object-contain drop-shadow-sm"
            fallbackText={item.name.charAt(0)}
          />
        </div>

        {/* Category chips moved to top for better hierarchy */}
        <div className="flex items-center gap-2 mb-3">
          <CategoryChips categories={item.category} variant="secondary" size="sm" />
        </div>

        {/* Tool name */}
        <CardTitle className="text-xl font-semibold mb-2 leading-tight">
          <Link href={`/${item.slug}`} className="hover:text-blue-600 transition-colors duration-200 group-hover:text-blue-700">
            {item.name}
          </Link>
        </CardTitle>

        {/* Enhanced tagline with better styling */}
        {item.tagline && (
          <CardDescription className="text-sm leading-relaxed text-slate-600 line-clamp-2 group-hover:text-slate-700 transition-colors duration-200 mb-4 font-medium italic">
            "{item.tagline}"
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-grow px-6 pb-4">
        {/* Rating section with enhanced styling */}
        {item.rating && (
          <div className="flex items-center gap-2 text-sm text-slate-600 bg-gradient-to-r from-amber-50/80 to-yellow-50/60 px-3 py-2 rounded-xl border border-amber-100/50 shadow-sm">
            <Star className="h-4 w-4 text-amber-500 fill-amber-400" />
            <span className="font-semibold text-slate-700">{item.rating.toFixed(1)}</span>
            {item.reviewCount && <span className="text-slate-500">({item.reviewCount} reviews)</span>}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-3 px-6 pb-6 pt-0">
        <Button
          variant="outline"
          size="lg"
          asChild
          className="w-full bg-white/80 border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 hover:shadow-md backdrop-blur-sm font-medium"
        >
          <Link href={item.website} target="_blank" rel="noopener noreferrer">
            Visit Website <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button
          size="lg"
          asChild
          className="w-full bg-gradient-to-r from-slate-800 to-slate-900 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:shadow-lg hover:shadow-blue-200/30 text-white border-0 font-semibold"
        >
          <Link href={`/${item.slug}`}>
            View Details <ArrowUpRight className="ml-2 h-4 w-4" />
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
