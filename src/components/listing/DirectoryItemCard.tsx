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
      className="flex flex-col bg-white border border-[#e0e0e0] rounded-[8px] p-6 gap-4 transition-all duration-100 hover:border-[#c8c8c8] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
    >
      {/* Header row: favicon + name + domain */}
      <div className="flex items-start gap-3.5">
        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-[8px] border border-[#f0f0f0]">
          <SafeImage
            src={item.imageUrl}
            alt={item.name}
            website={item.website}
            className="h-full w-full object-contain"
            fallbackText={item.name.charAt(0)}
          />
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold leading-snug text-[#1f1f1f]">{item.name}</p>
          {domainLabel && (
            <p className="mt-0.5 text-xs text-[#a0a0a0] truncate">{domainLabel}</p>
          )}
        </div>
      </div>

      {/* One-liner tagline — 3 lines so cards have consistent height */}
      {item.tagline && (
        <p className="flex-1 text-sm leading-relaxed text-[#737373] line-clamp-3">
          {item.tagline}
        </p>
      )}

      {/* Use-case tags — max 2, pinned to card bottom */}
      {item.features && item.features.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.features.slice(0, 2).map((feature) => (
            <span
              key={feature.name}
              className="rounded-[6px] border border-[#e8e8e8] bg-[#fafafa] px-2 py-0.5 text-[11px] text-[#737373]"
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
