import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_ICONS } from "@/lib/category-icons";
import { resolveCategoryInfo } from "@/lib/utils";

interface CategoryChipsWithIconsProps {
  categories: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  size?: "default" | "sm" | "lg";
  className?: string;
  showLinks?: boolean;
}

export function CategoryChipsWithIcons({
  categories,
  variant = "secondary",
  size = "default",
  className = "",
  showLinks = true
}: CategoryChipsWithIconsProps) {
  // Split categories by comma and clean up whitespace
  const categoryList = categories
    .split(',')
    .map(cat => cat.trim())
    .filter(cat => cat.length > 0);

  if (categoryList.length === 0) {
    return null;
  }

  const badgeSize = size === "sm" ? "text-xs" : size === "lg" ? "text-sm" : "text-xs";
  const iconSize = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-4 w-4" : "h-3 w-3";

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {categoryList.map((categoryValue, index) => {
        const { slug, displayName, hasPage } = resolveCategoryInfo(categoryValue);

        // Find the icon for this category
        const IconComponent = CATEGORY_ICONS[slug as keyof typeof CATEGORY_ICONS];
        
        const badgeContent = (
          <Badge 
            variant={variant} 
            className={`capitalize ${badgeSize} font-medium px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 hover:border-emerald-200 transition-all duration-200 shadow-sm flex items-center gap-1.5`}
          >
            {IconComponent && <IconComponent className={iconSize} />}
            {displayName}
          </Badge>
        );

        const shouldLink = showLinks && hasPage;

        return shouldLink ? (
          <Link
            key={index}
            href={`/categories/${slug}`}
            className="hover:opacity-90 transition-all duration-200 hover:scale-105"
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