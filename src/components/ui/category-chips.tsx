import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { resolveCategoryInfo } from "@/lib/utils";

interface CategoryChipsProps {
  categories: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  size?: "default" | "sm" | "lg";
  className?: string;
  showLinks?: boolean;
}

export function CategoryChips({ 
  categories, 
  variant = "secondary", 
  size = "default",
  className = "",
  showLinks = true 
}: CategoryChipsProps) {
  // Split categories by comma and clean up whitespace
  const categoryList = categories
    .split(',')
    .map(cat => cat.trim())
    .filter(cat => cat.length > 0);

  if (categoryList.length === 0) {
    return null;
  }

  const badgeSize = size === "sm" ? "text-xs" : size === "lg" ? "text-sm" : "text-xs";

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {categoryList.map((categoryValue, index) => {
        const { slug, displayName, hasPage } = resolveCategoryInfo(categoryValue);

        const badgeContent = (
          <Badge
            variant={variant}
            className={`${badgeSize} font-normal px-3 py-1.5 rounded-full bg-stone-100 text-stone-600 border-none hover:bg-brand-50 hover:text-brand-700 transition-colors duration-200`}
          >
            {displayName}
          </Badge>
        );

        const shouldLink = showLinks && hasPage;

        return shouldLink ? (
          <Link
            key={index}
            href={`/categories/${slug}`}
            className="hover:opacity-90 transition-colors duration-200"
          >
            {badgeContent}
          </Link>
        ) : (
          <span key={index}>
            {badgeContent}
          </span>
        );
      })}
    </div>
  );
} 