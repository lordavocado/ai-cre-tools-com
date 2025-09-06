import { useState } from "react";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

interface WebsiteFaviconProps {
  website?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  fallback?: React.ReactNode;
}

export function WebsiteFavicon({ 
  website, 
  className, 
  size = "md", 
  fallback 
}: WebsiteFaviconProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!website) {
    return fallback || <Globe className={cn("text-muted-foreground", className)} />;
  }

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-6 w-6"
  };

  try {
    const url = new URL(website);
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=32`;

    if (hasError) {
      return fallback || <Globe className={cn("text-muted-foreground", sizeClasses[size], className)} />;
    }

    return (
      <img
        src={faviconUrl}
        alt={`${url.hostname} favicon`}
        className={cn("rounded-sm", sizeClasses[size], className)}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoading(false)}
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    );
  } catch (error) {
    return fallback || <Globe className={cn("text-muted-foreground", sizeClasses[size], className)} />;
  }
}