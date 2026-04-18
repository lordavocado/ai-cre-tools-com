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
      <div className="relative flex h-full flex-col rounded-[8px] border-[1.25px] border-[#e0e0e0] bg-[#fafafa] p-5 transition-colors duration-100 hover:border-[#c8c8c8]">
        {/* Icon + count */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-white border border-[#e0e0e0] text-[#1f1f1f]">
            {IconComponent ? <IconComponent className="h-5 w-5" strokeWidth={1.5} /> : <ArrowRight className="h-5 w-5" strokeWidth={1.5} />}
          </div>
          {category.itemCount !== undefined && (
            <span className="rounded-[6px] border border-[#e0e0e0] bg-white px-2 py-0.5 text-xs text-[#737373]">
              {category.itemCount} tool{category.itemCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Text */}
        <div className="flex-1 space-y-2">
          <h3 className="font-semibold leading-tight text-[#1f1f1f]">
            {category.name}
          </h3>
          <p className="line-clamp-3 text-sm leading-6 text-[#737373]">
            {category.description}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center gap-1 text-sm font-medium text-[#1f1f1f]">
          <span>Explore</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
