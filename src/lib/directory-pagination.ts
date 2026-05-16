const DEFAULT_ITEMS_PER_PAGE = 12;

export function getDirectoryItemsPerPage(): number {
  return DEFAULT_ITEMS_PER_PAGE;
}

export function parseDirectoryPage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function getDirectoryPageSlice<T>(
  items: T[],
  currentPage: number,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE
): { currentItems: T[]; totalPages: number; currentPage: number } {
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;

  return {
    currentItems: items.slice(startIndex, startIndex + itemsPerPage),
    totalPages,
    currentPage: safePage,
  };
}

export function buildDirectoryPageUrl(
  basePath: string,
  page: number,
  query?: Record<string, string | undefined>
): string {
  const params = new URLSearchParams();

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value) {
        params.set(key, value);
      }
    }
  }

  if (page > 1) {
    params.set("page", String(page));
  } else {
    params.delete("page");
  }

  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}
