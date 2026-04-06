"use client";

import type { DirectoryItem } from "@/types";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Globe2, Star } from "lucide-react";
import { CategoryChips } from "@/components/ui/category-chips";
import { SafeImage } from "@/components/ui/safe-image";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { ErrorBoundary } from "@/components/ui/error-boundary";

interface DirectoryItemCardProps {
  item: DirectoryItem;
}

function getWebsiteLabel(website: string | undefined) {
  if (!website) {
    return null;
  }

  try {
    return new URL(website).hostname.replace(/^www\./, "");
  } catch {
    return website.replace(/^https?:\/\//, "").replace(/^www\./, "");
  }
}

function DirectoryItemCardContent({ item }: DirectoryItemCardProps) {
  const websiteLabel = getWebsiteLabel(item.website);

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_20px_70px_-50px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_26px_90px_-46px_rgba(15,23,42,0.45)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <CardHeader className="space-y-4 p-5 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)] shadow-sm">
              <SafeImage
                src={item.imageUrl}
                alt={item.name}
                website={item.website}
                className="h-12 w-12 object-contain"
                fallbackText={item.name.charAt(0)}
              />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-xl font-semibold leading-tight tracking-tight text-slate-950">
                <Link href={`/${item.slug}`} className="transition-colors duration-200 hover:text-slate-700">
                  {item.name}
                </Link>
              </CardTitle>
              {websiteLabel ? (
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  <Globe2 className="h-3.5 w-3.5" />
                  {websiteLabel}
                </div>
              ) : null}
            </div>
          </div>

          <FavoriteButton
            toolId={item.id}
            size="sm"
            className="border border-slate-200 bg-white shadow-sm hover:bg-white"
          />
        </div>

        {item.tagline && (
          <CardDescription className="line-clamp-3 text-sm leading-6 text-slate-600">
            {item.tagline}
          </CardDescription>
        )}

        <div className="flex flex-wrap gap-2">
          {item.rating ? (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
              {item.rating.toFixed(1)}
              {item.reviewCount ? <span className="text-amber-600/80">({item.reviewCount})</span> : null}
            </div>
          ) : null}
          {item.bestFor ? (
            <div className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800">
              Best for {item.bestFor}
            </div>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="flex-grow px-5 pb-5 pt-0">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
          {item.category && (
            <div className="w-full">
              <CategoryChips categories={item.category} size="sm" showLinks={true} className="" />
            </div>
          )}
          {item.description ? (
            <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{item.description}</p>
          ) : (
            <p className="mt-4 text-sm leading-6 text-slate-500">
              Open the full profile to review fit, positioning, and software details.
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="mt-auto flex items-center gap-3 px-5 pb-5 pt-0">
        <Button
          size="sm"
          asChild
          className="h-11 flex-1 rounded-xl bg-slate-950 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Link href={`/${item.slug}`}>View profile</Link>
        </Button>

        {item.website ? (
          <Button
            size="sm"
            variant="outline"
            asChild
            className="h-11 rounded-xl border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700"
          >
            <Link href={item.website} target="_blank" rel="noopener noreferrer">
              Website
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 px-4 py-2 text-sm text-slate-400">
            No website listed
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

export function DirectoryItemCard({ item }: DirectoryItemCardProps) {
  return (
    <ErrorBoundary
      componentName="DirectoryItemCard"
      onError={(error, errorInfo) => {
        // Log specific DirectoryItemCard errors for monitoring
        console.error('DirectoryItemCard Error:', {
          error: error.message,
          componentStack: errorInfo.componentStack,
          itemId: item?.id,
          itemName: item?.name
        });
      }}
    >
      <DirectoryItemCardContent item={item} />
    </ErrorBoundary>
  );
}
