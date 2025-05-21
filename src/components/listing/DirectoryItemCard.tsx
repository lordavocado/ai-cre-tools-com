
import type { DirectoryItem } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ExternalLink, Star, Tag } from "lucide-react";

interface DirectoryItemCardProps {
  item: DirectoryItem;
}

export function DirectoryItemCard({ item }: DirectoryItemCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="relative aspect-[16/9] w-full mb-4 rounded-md overflow-hidden">
          <Image
            src={item.imageUrl || "https://placehold.co/600x400.png"}
            alt={item.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="software interface product"
          />
        </div>
        <CardTitle className="text-xl">
          <Link href={`/${item.slug}`} className="hover:text-primary transition-colors">
            {item.name}
          </Link>
        </CardTitle>
        <CardDescription className="text-sm">{item.tagline}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{item.description}</p>
        <div className="flex items-center gap-2 mb-3">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <Badge variant="secondary" className="capitalize">{item.category.replace('-', ' ')}</Badge>
        </div>
        {item.rating && (
           <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span>{item.rating.toFixed(1)}</span>
            {item.reviewCount && <span>({item.reviewCount} reviews)</span>}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-4 border-t">
        <Button variant="ghost" size="sm" asChild className="w-full sm:w-auto">
          <Link href={item.website} target="_blank" rel="noopener noreferrer">
            Visit Website <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button size="sm" asChild className="w-full sm:w-auto">
          <Link href={`/${item.slug}`}>
            View Details <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
