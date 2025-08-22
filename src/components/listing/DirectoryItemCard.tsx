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
    <Card className="flex flex-col h-full overflow-hidden border border-neutral-200 hover:border-neutral-300 transition-colors duration-200 relative group rounded-xl shadow-sm hover:shadow-md">
      <CardHeader className="p-6">
        <div className="absolute top-4 right-4 z-10">
          <FavouriteButton toolId={item.id} size="sm" />
        </div>
        <div className="relative w-16 h-16 mb-4 rounded-md overflow-hidden flex items-center justify-center bg-neutral-50 ring-1 ring-neutral-100">
          <SafeImage
            src={item.imageUrl}
            alt={item.name}
            website={item.website}
            className="w-16 h-16 object-contain"
            fallbackText={item.name.charAt(0)}
          />
        </div>
        <CardTitle className="text-xl font-serif mb-1">
          <Link href={`/${item.slug}`} className="hover:text-neutral-600 transition-colors">
            {item.name}
          </Link>
        </CardTitle>
        {item.tagline && (
          <CardDescription className="text-[0.95rem] leading-relaxed text-neutral-600 line-clamp-2">
            {item.tagline}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow px-6 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <CategoryChips categories={item.category} variant="secondary" size="sm" />
        </div>
        {item.rating && (
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Star className="h-4 w-4 text-neutral-900" />
            <span>{item.rating.toFixed(1)}</span>
            {item.reviewCount && <span className="text-neutral-400">({item.reviewCount} reviews)</span>}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-3 px-6 pb-6">
        <Button
          variant="outline"
          size="lg"
          asChild
          className="w-full bg-white border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-colors"
        >
          <Link href={item.website} target="_blank" rel="noopener noreferrer">
            Visit Website <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button
          size="lg"
          asChild
          className="w-full bg-neutral-900 hover:bg-neutral-800 transition-colors"
        >
          <Link href={`/${item.slug}`}>
            View Details <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
