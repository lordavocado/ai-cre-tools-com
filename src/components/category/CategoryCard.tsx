import type { Category } from "@/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORY_ICONS } from "@/lib/category-icons";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const IconComponent = category.icon ? CATEGORY_ICONS[category.icon as keyof typeof CATEGORY_ICONS] : null;

  return (
    <Link href={`/categories/${category.slug}`} className="group block h-full">
      <div className="relative flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:border-gray-300 hover:shadow-md">
        {/* Icon + count */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 text-gray-600">
            {IconComponent ? <IconComponent className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
          </div>
          {category.itemCount !== undefined && (
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
              {category.itemCount} tool{category.itemCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Text */}
        <div className="flex-1 space-y-2">
          <h3 className="font-semibold leading-tight text-gray-900 transition-colors group-hover:text-gray-600">
            {category.name}
          </h3>
          <p className="line-clamp-3 text-sm leading-6 text-gray-500">
            {category.description}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center gap-1 text-sm font-medium text-gray-900">
          <span>Explore</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
