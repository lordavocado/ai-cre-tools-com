
import type { Category } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const IconComponent = category.icon;
  return (
    <Link href={`/categories/${category.slug}`} className="group block">
      <Card className="h-full overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:border-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium group-hover:text-primary transition-colors">
            {category.name}
          </CardTitle>
          {IconComponent && <IconComponent className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />}
        </CardHeader>
        <CardContent>
          {category.imageUrl && (
            <div className="relative aspect-video w-full mb-4 rounded-md overflow-hidden">
              <Image
                src={category.imageUrl}
                alt={category.name}
                layout="fill"
                objectFit="cover"
                data-ai-hint="abstract category icon"
              />
            </div>
          )}
          <CardDescription className="text-sm line-clamp-2 mb-2">{category.description}</CardDescription>
          <div className="text-xs text-muted-foreground">
            {category.itemCount !== undefined ? `${category.itemCount} tool${category.itemCount !== 1 ? 's' : ''}` : 'View tools'}
          </div>
           <div className="mt-3 text-sm font-medium text-primary group-hover:underline flex items-center">
            Explore Category <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
