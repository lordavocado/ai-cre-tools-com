import Link from "next/link";
import { Badge } from "@/components/ui/badge";

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
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {categoryList.map((category, index) => {
        const displayName = category.replace('-', ' ');
        
        const badgeContent = (
          <Badge 
            variant={variant} 
            className={`capitalize ${badgeSize}`}
          >
            {displayName}
          </Badge>
        );

        return showLinks ? (
          <Link 
            key={index} 
            href={`/categories/${category}`}
            className="hover:opacity-80 transition-opacity"
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