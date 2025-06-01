"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavouritesContext } from "@/providers/FavouritesProvider";

interface FavouriteButtonProps {
  toolId: string;
  size?: "sm" | "md" | "lg";
  variant?: "icon" | "with-text";
  className?: string;
  iconClassName?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10", 
  lg: "h-12 w-12",
};

const iconSizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function FavouriteButton({
  toolId,
  size = "md",
  variant = "icon",
  className,
  iconClassName,
}: FavouriteButtonProps) {
  const { isFavourite, toggleFavourite, isLoading } = useFavouritesContext();
  
  const isFavourited = isFavourite(toolId);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) {
      toggleFavourite(toolId);
    }
  };

  const tooltipText = isFavourited ? "Remove from favourites" : "Add to favourites";
  const buttonText = isFavourited ? "Remove from favourites" : "Add to favourites";

  if (variant === "with-text") {
    return (
      <Button
        variant={isFavourited ? "default" : "outline"}
        size="sm"
        onClick={handleClick}
        disabled={isLoading}
        className={cn(
          "transition-all duration-200 hover:scale-105",
          className
        )}
      >
        <Star
          className={cn(
            "mr-2 transition-all duration-200",
            iconSizeClasses.sm,
            isFavourited ? "fill-current text-yellow-500" : "text-current",
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
              "transition-all duration-200 hover:scale-110 hover:bg-yellow-50",
              className
            )}
            aria-label={tooltipText}
          >
            <Star
              className={cn(
                "transition-all duration-200",
                iconSizeClasses[size],
                isFavourited 
                  ? "fill-yellow-500 text-yellow-500 animate-in zoom-in-50 duration-200" 
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