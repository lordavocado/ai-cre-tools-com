"use client";

import type { DirectoryListItem } from "@/types";
import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { getToolPath } from "@/lib/tool-routes";

/** Props for DirectoryItemCard */
interface DirectoryItemCardProps {
  /** The directory item to display */
  item: DirectoryListItem;
}

/**
 * Extracts a clean domain label from a website URL for display.
 * @param website - The full website URL
 * @returns The hostname without www prefix, or null if unavailable
 */
function getDomainLabel(website: string | undefined): string | null {
  if (!website) return null;
  try {
    return new URL(website).hostname.replace(/^www\./, "");
  } catch {
    return website.replace(/^https?:\/\//, "").replace(/^www\./, "");
  }
}

/**
 * Inner card content — separated to enable ErrorBoundary wrapping.
 * @component
 */
function DirectoryItemCardContent({ item }: DirectoryItemCardProps) {
  const domainLabel = getDomainLabel(item.website);
  const tags = item.tags ?? item.features?.map((feature) => feature.name) ?? [];

  return (
    <Link
      href={getToolPath(item.slug)}
      className="flex flex-col gap-3 rounded-lg border border-border bg-background p-5 transition-[border-color,box-shadow,transform] duration-150 motion-safe:active:scale-[0.99] hover:border-foreground/20 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {/* Header row: favicon + name + domain */}
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-background ring-1 ring-inset ring-black/10">
          <SafeImage
            src={item.imageUrl}
            alt={item.name}
            website={item.website}
            className="h-full w-full object-contain"
            fallbackText={item.name.charAt(0)}
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[17px] font-semibold leading-tight tracking-[-0.005em] text-foreground">{item.name}</p>
          {domainLabel && (
            <p className="mt-1 truncate text-xs text-muted-foreground">{domainLabel}</p>
          )}
        </div>
      </div>

      {/* One-liner tagline — 2 lines for tighter card rhythm */}
      {item.tagline && (
        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {item.tagline}
        </p>
      )}

      {/* Use-case tags — max 2, pinned to card bottom */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="whitespace-nowrap rounded-md border border-border bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

/**
 * A card component for displaying a directory item with favicon, name, domain,
 * tagline, and up to two capability tags. Wrapped in an ErrorBoundary.
 * @component
 * @example
 * ```tsx
 * <DirectoryItemCard item={directoryItem} />
 * ```
 */
export function DirectoryItemCard({ item }: DirectoryItemCardProps) {
  return (
    <ErrorBoundary componentName="DirectoryItemCard">
      <DirectoryItemCardContent item={item} />
    </ErrorBoundary>
  );
}
