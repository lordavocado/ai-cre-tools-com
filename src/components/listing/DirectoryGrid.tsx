"use client";

import type { DirectoryItem } from "@/types";
import { DirectoryItemCard } from "./DirectoryItemCard";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Pagination } from "@/components/ui/pagination";
import { useState } from "react";

interface DirectoryGridProps {
  items: DirectoryItem[];
}

export function DirectoryGrid({ items }: DirectoryGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  if (items.length === 0) {
    return (
      <Alert className="mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Tools Found</AlertTitle>
        <AlertDescription>
          We couldn't find any tools matching your criteria. Try adjusting your search or filters.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentItems.map((item) => (
          <DirectoryItemCard key={item.id} item={item} />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
