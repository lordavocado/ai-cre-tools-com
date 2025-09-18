"use client";

import type { DirectoryItem } from "@/types";
import { DirectoryItemCard } from "./DirectoryItemCard";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Pagination } from "@/components/ui/pagination";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useState } from "react";
import Link from "next/link";

interface DirectoryGridProps {
  items: DirectoryItem[];
}

function DirectoryGridContent({ items }: DirectoryGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="flex flex-col items-center justify-center text-center space-y-4 border border-neutral-200 rounded-lg py-12">
          <AlertCircle className="h-8 w-8 text-neutral-400" />
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-neutral-900">No Tools Found</h3>
            <p className="text-neutral-600">
              We couldn't find any tools matching your criteria. Try adjusting your search or filters.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-6 space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentItems.map((item) => (
          <DirectoryItemCard key={item.id} item={item} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center py-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {items.length > itemsPerPage && (
        <section className="space-y-4 border-t border-neutral-200 pt-8" aria-label="All tools in this listing">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-neutral-900">Browse every tool in this list</h2>
            <p className="text-sm text-neutral-600">
              Jump directly to any tool featured in this directory view. All links are organized alphabetically for easy
              scanning.
            </p>
          </div>
          <nav aria-label="Alphabetical list of tools">
            <ul className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-2 text-sm">
              {items
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((item) => (
                  <li key={`index-${item.id}`} className="break-inside-avoid">
                    <Link
                      href={`/${item.slug}`}
                      className="text-primary hover:text-primary/80 hover:underline focus-visible:underline"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        </section>
      )}
    </div>
  );
}

export function DirectoryGrid({ items }: DirectoryGridProps) {
  return (
    <ErrorBoundary
      componentName="DirectoryGrid"
      onError={(error, errorInfo) => {
        // Log specific DirectoryGrid errors for monitoring
        console.error('DirectoryGrid Error:', {
          error: error.message,
          componentStack: errorInfo.componentStack,
          itemsCount: items?.length
        });
      }}
    >
      <DirectoryGridContent items={items} />
    </ErrorBoundary>
  );
}
