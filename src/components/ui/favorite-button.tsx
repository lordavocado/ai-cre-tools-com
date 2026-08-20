"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavoritesContext } from "@/providers/FavoritesProvider";
import { useHydrationMismatchDetector, useRenderTracker, devLog } from "@/lib/dev-debug";

interface FavoriteButtonProps {
  toolId: string;
  size?: "sm" | "md" | "lg";
  variant?: "icon" | "with-text";
  className?: string;
  iconClassName?: string;
}

const sizeClasses = {
  sm: "h-10 w-10",
  md: "h-10 w-10", 
  lg: "h-12 w-12",
};

const iconSizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function FavoriteButton({
  toolId,
  size = "md",
  variant = "icon",
  className,
  iconClassName,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, isLoading } = useFavoritesContext();
  const [mounted, setMounted] = useState(false);

  // Development debugging utilities
  useHydrationMismatchDetector(`FavoriteButton-${toolId}`);
  useRenderTracker(`FavoriteButton-${toolId}`, [toolId, isLoading]);

  // Prevent hydration mismatch by ensuring consistent server/client rendering
  useEffect(() => {
    setMounted(true);
    devLog.log(`⭐ FavoriteButton for ${toolId} mounted`);
  }, [toolId]);

  const isFavorited = isFavorite(toolId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) {
      toggleFavorite(toolId);
    }
  };

  const tooltipText = isFavorited ? "Remove from favorites" : "Add to favorites";
  const buttonText = isFavorited ? "Remove from favorites" : "Add to favorites";

  // Show loading placeholder during hydration to prevent mismatches
  if (!mounted || isLoading) {
    if (variant === "with-text") {
      return (
        <Button
          variant="outline"
          size="sm"
          disabled
          className={cn("transition-[color,background-color,border-color,transform] duration-200", className)}
        >
          <Star
            className={cn(
              "mr-2 transition-[color,fill,transform] duration-200",
              iconSizeClasses.sm,
              "text-muted-foreground",
              iconClassName
            )}
          />
          Add to favorites
        </Button>
      );
    }

    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        className={cn(sizeClasses[size], className)}
        aria-label="Loading favorites"
      >
        <Star className={cn(iconSizeClasses[size], "text-muted-foreground", iconClassName)} />
      </Button>
    );
  }

  if (variant === "with-text") {
    return (
      <Button
        variant={isFavorited ? "default" : "outline"}
        size="sm"
        onClick={handleClick}
        disabled={isLoading}
        className={cn(
          "transition-[color,background-color,border-color,transform] duration-200",
          className
        )}
      >
        <Star
          className={cn(
            "mr-2 transition-[color,fill,transform] duration-200",
            iconSizeClasses.sm,
            isFavorited ? "fill-current text-yellow-500" : "text-current",
            iconClassName
          )}
        />
        {buttonText}
      </Button>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClick}
            disabled={isLoading}
            className={cn(
              sizeClasses[size],
              "transition-[color,background-color,transform] duration-200 hover:bg-yellow-50",
              className
            )}
            aria-label={tooltipText}
          >
            <Star
              className={cn(
                "transition-[color,fill,transform] duration-200",
                iconSizeClasses[size],
                isFavorited 
                  ? "fill-yellow-500 text-yellow-500 motion-safe:animate-in motion-safe:zoom-in-50 duration-200"
                  : "text-muted-foreground hover:text-yellow-500",
                iconClassName
              )}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
