import type { SeoFaq } from '@/config/seo-clusters';
import type { DirectoryItem } from '@/types';

export function itemMatchesCategory(item: DirectoryItem, categorySlug: string): boolean {
  const itemCategories = item.category.split(',').map((cat) => cat.trim());
  return itemCategories.includes(categorySlug);
}

export function filterItemsByCategorySlug(
  items: DirectoryItem[],
  categorySlug: string
): DirectoryItem[] {
  return items.filter((item) => itemMatchesCategory(item, categorySlug));
}

export function filterItemsByCategories(
  items: DirectoryItem[],
  categorySlugs: string[]
): DirectoryItem[] {
  const slugSet = new Set(categorySlugs);
  return items.filter((item) => {
    const itemCategories = item.category.split(',').map((cat) => cat.trim());
    return itemCategories.some((cat) => slugSet.has(cat));
  });
}

/** First N tools — callers should pass items already sorted by display_order, name. */
export function getFeaturedTools(items: DirectoryItem[], limit = 3): DirectoryItem[] {
  return items.slice(0, limit);
}

export function buildFaqStructuredData(faqs: SeoFaq[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
