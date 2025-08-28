import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_ICONS } from "@/lib/category-icons";

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
      {categoryList.map((category, index) => {
        const displayName = category.replace('-', ' ');

        // Find the icon for this category
        const IconComponent = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS];
        
        const badgeContent = (
          <Badge 
            variant={variant} 
            className={`capitalize ${badgeSize} font-medium px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100/60 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-200 transition-all duration-200 shadow-sm flex items-center gap-1.5`}
          >
            {IconComponent && <IconComponent className={iconSize} />}
            {displayName}
          </Badge>
        );

        return showLinks ? (
          <Link 
            key={index} 
            href={`/categories/${category}`}
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