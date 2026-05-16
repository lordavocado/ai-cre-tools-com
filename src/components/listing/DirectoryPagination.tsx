import Link from "next/link";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { buildDirectoryPageUrl } from "@/lib/directory-pagination";
import { cn } from "@/lib/utils";

interface DirectoryPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  query?: Record<string, string | undefined>;
  className?: string;
}

export function DirectoryPagination({
  currentPage,
  totalPages,
  basePath,
  query,
  className,
}: DirectoryPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const getVisiblePages = () => {
    const delta = 2;
    const rangeWithDots: Array<number | "..."> = [];

    if (currentPage > delta + 1) {
      rangeWithDots.push(1);
      if (currentPage > delta + 2) {
        rangeWithDots.push("...");
      }
    }

    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      rangeWithDots.push(i);
    }

    if (currentPage < totalPages - delta) {
      if (currentPage < totalPages - delta - 1) {
        rangeWithDots.push("...");
      }
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();
  const pageLinkClass = (isCurrentPage: boolean) =>
    cn(
      "inline-flex h-8 min-w-8 items-center justify-center rounded-[6px] px-2 text-sm font-medium transition-colors",
      isCurrentPage
        ? "bg-primary text-primary-foreground"
        : "text-[#737373] hover:bg-[#fafafa] hover:text-[#1f1f1f]"
    );

  return (
    <nav
      role="navigation"
      aria-label="Directory pagination"
      className={cn("flex items-center justify-center gap-1 py-4", className)}
    >
      {currentPage > 1 ? (
        <Link
          href={buildDirectoryPageUrl(basePath, currentPage - 1, query)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] text-[#737373] transition-colors hover:bg-[#fafafa] hover:text-[#1f1f1f]"
          aria-label="Go to previous page"
          rel={currentPage === 2 ? undefined : "prev"}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : (
        <span
          className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] text-[#d4d4d4]"
          aria-hidden="true"
        >
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      <div className="mx-2 flex items-center gap-1">
        {visiblePages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex h-8 w-8 items-center justify-center text-[#a0a0a0]"
                aria-hidden="true"
              >
                <MoreHorizontal className="h-4 w-4" />
              </span>
            );
          }

          const pageNumber = page;
          const isCurrentPage = pageNumber === currentPage;

          return (
            <Link
              key={pageNumber}
              href={buildDirectoryPageUrl(basePath, pageNumber, query)}
              className={pageLinkClass(isCurrentPage)}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={isCurrentPage ? "page" : undefined}
            >
              {pageNumber}
            </Link>
          );
        })}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={buildDirectoryPageUrl(basePath, currentPage + 1, query)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] text-[#737373] transition-colors hover:bg-[#fafafa] hover:text-[#1f1f1f]"
          aria-label="Go to next page"
          rel="next"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : (
        <span
          className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] text-[#d4d4d4]"
          aria-hidden="true"
        >
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
