"use client";

import type { DirectoryItem } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ExternalLink, Star, Tag } from "lucide-react";
import { useState } from "react";

interface DirectoryItemCardProps {
  item: DirectoryItem;
}

export function DirectoryItemCard({ item }: DirectoryItemCardProps) {
  const [imgSrc, setImgSrc] = useState(item.imageUrl || "/favicon.svg");

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-4">
        <div className="relative aspect-[16/9] w-full mb-3 rounded-md overflow-hidden">
          <Image
            src={imgSrc}
            alt={item.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="software interface product"
            onError={() => setImgSrc("/favicon.svg")}
          />
        </div>
        <CardTitle className="text-lg">
          <Link href={`/${item.slug}`} className="hover:text-primary transition-colors">
            {item.name}
          </Link>
        </CardTitle>
        <CardDescription className="text-base mt-1">{item.tagline}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
        <div className="flex items-center gap-2">
          <Tag className="h-3 w-3 text-muted-foreground" />
          <Badge variant="secondary" className="capitalize text-xs">{item.category.replace('-', ' ')}</Badge>
        </div>
        {item.rating && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <span>{item.rating.toFixed(1)}</span>
            {item.reviewCount && <span>({item.reviewCount})</span>}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2 p-4 pt-0 border-t">
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
