import type { DirectoryItem } from "@/types";
import { DirectoryItemCard } from "./DirectoryItemCard";
import { DirectoryPagination } from "./DirectoryPagination";
import { AlertCircle } from "lucide-react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { getDirectoryPageSlice } from "@/lib/directory-pagination";

interface DirectoryGridProps {
  items: DirectoryItem[];
  currentPage?: number;
  basePath?: string;
  query?: Record<string, string | undefined>;
}

function DirectoryGridContent({
  items,
  currentPage = 1,
  basePath = "/",
  query,
}: DirectoryGridProps) {
  const { currentItems, totalPages, currentPage: safePage } = getDirectoryPageSlice(
    items,
    currentPage
  );

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

      <DirectoryPagination
        currentPage={safePage}
        totalPages={totalPages}
        basePath={basePath}
        query={query}
      />
    </div>
  );
}

export function DirectoryGrid(props: DirectoryGridProps) {
  return (
    <ErrorBoundary componentName="DirectoryGrid">
      <DirectoryGridContent {...props} />
    </ErrorBoundary>
  );
}
