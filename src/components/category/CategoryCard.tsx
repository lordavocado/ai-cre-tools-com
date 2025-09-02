
import type { Category } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { CATEGORY_ICONS } from "@/lib/category-icons";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const IconComponent = category.icon ? CATEGORY_ICONS[category.icon as keyof typeof CATEGORY_ICONS] : null;
  return (
    <Link href={`/categories/${category.slug}`} className="group block">
      <Card className="h-full overflow-hidden border border-neutral-200 hover:border-neutral-300 hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
          <CardTitle className="text-lg font-serif text-neutral-900 group-hover:text-neutral-600 transition-colors leading-tight">
            {category.name}
          </CardTitle>
          {IconComponent && <IconComponent className="h-6 w-6 text-neutral-400 group-hover:text-neutral-600 transition-colors flex-shrink-0" />}
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {category.imageUrl && (
            <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-neutral-50 mb-3">
              <Image
                src={category.imageUrl}
                alt={category.name}
                layout="fill"
                objectFit="cover"
                data-ai-hint="abstract category icon"
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}
          <div className="space-y-3">
            <CardDescription className="text-sm text-neutral-600 line-clamp-2 leading-snug">
              {category.description}
            </CardDescription>
            <div className="flex items-center justify-between pt-1">
              <div className="text-xs text-neutral-500">
                {category.itemCount !== undefined ? `${category.itemCount} tool${category.itemCount !== 1 ? 's' : ''}` : 'View tools'}
              </div>
              <div className="flex items-center text-xs font-medium text-neutral-900">
                Explore <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
