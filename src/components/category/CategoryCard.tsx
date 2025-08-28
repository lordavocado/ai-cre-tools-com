
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
      <Card className="h-full overflow-hidden border border-neutral-200 hover:border-neutral-300 transition-colors duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6">
          <CardTitle className="text-xl font-serif text-neutral-900 group-hover:text-neutral-600 transition-colors">
            {category.name}
          </CardTitle>
          {IconComponent && <IconComponent className="h-6 w-6 text-neutral-400 group-hover:text-neutral-600 transition-colors" />}
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {category.imageUrl && (
            <div className="relative aspect-[4/3] w-full rounded-md overflow-hidden bg-neutral-50">
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
          <div className="space-y-4">
            <CardDescription className="text-base text-neutral-600 line-clamp-2">
              {category.description}
            </CardDescription>
            <div className="flex items-center justify-between">
              <div className="text-sm text-neutral-500">
                {category.itemCount !== undefined ? `${category.itemCount} tool${category.itemCount !== 1 ? 's' : ''}` : 'View tools'}
              </div>
              <div className="flex items-center text-sm font-medium text-neutral-900">
                Explore <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
