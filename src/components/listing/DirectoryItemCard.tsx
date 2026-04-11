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
    <div className="group flex h-full flex-col border-2 border-black bg-white transition-colors hover:bg-slate-50">
      <div className="flex-1 p-5">
        {/* Header: icon + name + favorite */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden border-2 border-black bg-white">
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
                className="font-serif text-lg font-bold leading-tight text-black decoration-2 underline-offset-2 hover:underline"
              >
                {item.name}
              </Link>
              {websiteLabel && (
                <p className="mt-0.5 truncate font-mono text-[10px] text-slate-400">
                  {websiteLabel}
                </p>
              )}
            </div>
          </div>
          <FavoriteButton
            toolId={item.id}
            size="sm"
            className="shrink-0 rounded-none border-2 border-black bg-white shadow-none hover:bg-black hover:text-white"
          />
        </div>

        {/* Tagline */}
        {item.tagline && (
          <p className="mb-3 line-clamp-2 text-sm leading-6 text-slate-600">
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
          <p className="line-clamp-2 text-sm leading-6 text-slate-500">
            {item.description}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 border-t-2 border-black px-5 py-3">
        <Link
          href={`/${item.slug}`}
          className="text-sm font-bold text-black decoration-2 underline-offset-2 hover:underline"
        >
          View profile →
        </Link>
        {item.website ? (
          <Link
            href={item.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-colors hover:text-black"
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
