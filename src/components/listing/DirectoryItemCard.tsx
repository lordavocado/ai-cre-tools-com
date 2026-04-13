"use client";

import type { DirectoryItem } from "@/types";
import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import { ErrorBoundary } from "@/components/ui/error-boundary";

/** Props for DirectoryItemCard */
interface DirectoryItemCardProps {
  /** The directory item to display */
  item: DirectoryItem;
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

  return (
    <Link
      href={`/${item.slug}`}
      className="block bg-white border border-[#e0e0e0] rounded-[8px] p-5 transition-colors duration-100 hover:border-[rgba(98,150,73,0.5)] hover:shadow-sm"
    >
      {/* Header row: favicon + name + domain */}
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-[8px]">
          <SafeImage
            src={item.imageUrl}
            alt={item.name}
            website={item.website}
            className="h-full w-full object-contain"
            fallbackText={item.name.charAt(0)}
          />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#1f1f1f]">{item.name}</p>
          {domainLabel && (
            <p className="text-xs text-[#737373] truncate">{domainLabel}</p>
          )}
        </div>
      </div>

      {/* One-liner tagline */}
      {item.tagline && (
        <p className="text-sm text-[#737373] line-clamp-2 mt-2">
          {item.tagline}
        </p>
      )}

      {/* Use-case tags — sourced from features, max 2 shown */}
      {item.features && item.features.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.features.slice(0, 2).map((feature) => (
            <span
              key={feature.name}
              className="rounded-[6px] bg-[#f0f9f0] px-2 py-1 text-xs text-[#629649]"
            >
              {feature.name}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

/**
 * A card component for displaying a directory item with favicon, name, domain,
 * tagline, and up to two feature tags. Wrapped in an ErrorBoundary.
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
