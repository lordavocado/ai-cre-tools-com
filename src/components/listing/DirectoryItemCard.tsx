"use client";

import type { DirectoryItem } from "@/types";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { CategoryChips } from "@/components/ui/category-chips";
import { SafeImage } from "@/components/ui/safe-image";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { ErrorBoundary } from "@/components/ui/error-boundary";

interface DirectoryItemCardProps {
  item: DirectoryItem;
}

function getWebsiteLabel(website: string | undefined) {
  if (!website) return null;
  try {
    return new URL(website).hostname.replace(/^www\./, "");
  } catch {
    return website.replace(/^https?:\/\//, "").replace(/^www\./, "");
  }
}

function DirectoryItemCardContent({ item }: DirectoryItemCardProps) {
  const websiteLabel = getWebsiteLabel(item.website);

  return (
    <div className="group flex h-full flex-col rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:border-gray-300 hover:shadow-md">
      <div className="flex-1 p-5">
        {/* Header: icon + name + favorite */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
              <SafeImage
                src={item.imageUrl}
                alt={item.name}
                website={item.website}
                className="h-8 w-8 object-contain"
                fallbackText={item.name.charAt(0)}
              />
            </div>
            <div className="min-w-0">
              <Link
                href={`/${item.slug}`}
                className="font-semibold leading-tight text-gray-900 hover:text-gray-600 transition-colors"
              >
                {item.name}
              </Link>
              {websiteLabel && (
                <p className="mt-0.5 truncate text-xs text-gray-400">
                  {websiteLabel}
                </p>
              )}
            </div>
          </div>
          <FavoriteButton
            toolId={item.id}
            size="sm"
            className="shrink-0 rounded-lg border border-gray-200 bg-white shadow-none hover:bg-gray-50 hover:border-gray-300"
          />
        </div>

        {/* Tagline */}
        {item.tagline && (
          <p className="mb-3 line-clamp-2 text-sm leading-6 text-gray-600">
            {item.tagline}
          </p>
        )}

        {/* Categories */}
        {item.category && (
          <div className="mb-3">
            <CategoryChips categories={item.category} size="sm" showLinks={true} />
          </div>
        )}

        {/* Description */}
        {item.description && (
          <p className="line-clamp-2 text-sm leading-6 text-gray-400">
            {item.description}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-5 py-3">
        <Link
          href={`/${item.slug}`}
          className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
        >
          View profile →
        </Link>
        {item.website ? (
          <Link
            href={item.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-gray-700"
          >
            Visit site
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export function DirectoryItemCard({ item }: DirectoryItemCardProps) {
  return (
    <ErrorBoundary
      componentName="DirectoryItemCard"
      onError={(error, errorInfo) => {
        console.error("DirectoryItemCard Error:", {
          error: error.message,
          componentStack: errorInfo.componentStack,
          itemId: item?.id,
          itemName: item?.name,
        });
      }}
    >
      <DirectoryItemCardContent item={item} />
    </ErrorBoundary>
  );
}
