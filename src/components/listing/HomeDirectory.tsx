'use client';

import { useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { DirectoryGrid } from '@/components/listing/DirectoryGrid';
import {
  DirectorySearch,
  type DirectorySearchCategory,
} from '@/components/listing/DirectorySearch';
import { parseDirectoryPage } from '@/lib/directory-pagination';
import type { DirectoryListItem } from '@/types';

interface HomeDirectoryProps {
  items: DirectoryListItem[];
  categories: DirectorySearchCategory[];
}

function itemMatchesSearch(item: DirectoryListItem, searchTerm: string): boolean {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  if (!normalizedSearch) return true;

  return [
    item.name,
    item.tagline,
    item.category,
    ...(item.tags ?? []),
    ...(item.features?.map((feature) => feature.name) ?? []),
  ]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(normalizedSearch));
}

function itemMatchesCategories(item: DirectoryListItem, categoryFilter: string): boolean {
  const selectedCategories = categoryFilter
    .split(',')
    .map((category) => category.trim())
    .filter(Boolean);

  if (selectedCategories.length === 0) return true;

  const itemCategories = item.category.split(',').map((category) => category.trim());
  return selectedCategories.some((category) => itemCategories.includes(category));
}

/**
 * Keeps the homepage static while preserving URL-driven directory filtering.
 * The complete, cached directory is supplied by the server; filtering and pagination
 * respond instantly to query-string changes without re-rendering the route on demand.
 */
export function HomeDirectory({ items, categories }: HomeDirectoryProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const searchTerm = searchParams.get('search') ?? '';
  const categoryFilter = searchParams.get('category') ?? '';
  const currentPage = parseDirectoryPage(searchParams.get('page') ?? undefined);

  const filteredItems = useMemo(
    () =>
      items.filter(
        (item) =>
          itemMatchesSearch(item, searchTerm) && itemMatchesCategories(item, categoryFilter)
      ),
    [items, searchTerm, categoryFilter]
  );

  return (
    <>
      <DirectorySearch
        categories={categories}
        initialSearchTerm={searchTerm}
        initialCategoryFilter={categoryFilter}
        totalItems={filteredItems.length}
      />
      <DirectoryGrid
        items={filteredItems}
        currentPage={currentPage}
        basePath={pathname === '/search' ? '/search' : '/'}
        query={{
          search: searchTerm || undefined,
          category: categoryFilter || undefined,
        }}
      />
    </>
  );
}
