"use client";

import type { DirectoryItem } from "@/types";
import { DirectoryItemCard } from "./DirectoryItemCard";
import { AlertCircle } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useState } from "react";

interface DirectoryGridProps {
  items: DirectoryItem[];
}

function DirectoryGridContent({ items }: DirectoryGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <AlertCircle className="h-6 w-6 text-[#737373]" />
        <p className="text-sm font-medium text-[#1f1f1f]">No tools found</p>
        <p className="text-sm text-[#737373]">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentItems.map((item) => (
          <DirectoryItemCard key={item.id} item={item} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center py-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
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
