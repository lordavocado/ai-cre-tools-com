
import type { Category } from "@/types";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { CATEGORY_ICONS } from "@/lib/category-icons";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const IconComponent = category.icon ? CATEGORY_ICONS[category.icon as keyof typeof CATEGORY_ICONS] : null;

  return (
    <Link href={`/categories/${category.slug}`} className="group block h-full">
      <Card className="relative flex h-full overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_18px_70px_-52px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_24px_90px_-46px_rgba(15,23,42,0.45)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-sky-400 to-cyan-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <CardContent className="flex h-full flex-col p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
              {IconComponent ? <IconComponent className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {category.itemCount !== undefined ? `${category.itemCount} tool${category.itemCount !== 1 ? "s" : ""}` : "View tools"}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <CardTitle className="text-xl font-semibold leading-tight tracking-tight text-slate-950 transition-colors duration-200 group-hover:text-slate-700">
              {category.name}
            </CardTitle>
            <CardDescription className="line-clamp-3 text-sm leading-6 text-slate-600">
              {category.description}
            </CardDescription>
          </div>

          <div className="mt-auto flex items-center justify-between pt-8 text-sm font-semibold text-slate-900">
            <span>Explore category</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
