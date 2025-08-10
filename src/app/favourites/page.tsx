import { Metadata } from 'next';
import { siteConfig } from "@/config/site";
import { FavouritesClient } from "@/components/favourites/FavouritesClient";

// SEO metadata for favourites page
export const metadata: Metadata = {
  title: `My Favourite Tools - ${siteConfig.name}`,
  description: `Access your saved and favourite ${siteConfig.categoryName.toLowerCase()} tools. Manage your personalized collection of AI solutions for commercial real estate.`,
  keywords: [
    ...siteConfig.seo.primaryKeywords,
    'favourites',
    'saved tools',
    'bookmarks',
    'personal collection'
  ],
  openGraph: {
    title: `My Favourite Tools - ${siteConfig.name}`,
    description: `Access your saved and favourite ${siteConfig.categoryName.toLowerCase()} tools. Manage your personalized collection of AI solutions for commercial real estate.`,
    url: `${siteConfig.url}/favourites`,
    siteName: siteConfig.seo.openGraph.siteName,
    images: [
      {
        url: siteConfig.seo.openGraph.images.default,
        width: siteConfig.seo.openGraph.images.width,
        height: siteConfig.seo.openGraph.images.height,
        alt: siteConfig.seo.openGraph.images.alt,
      },
    ],
    locale: siteConfig.seo.openGraph.locale,
    type: 'website',
  },
  twitter: {
    card: siteConfig.seo.twitter.card,
    title: `My Favourite Tools - ${siteConfig.name}`,
    description: `Access your saved and favourite ${siteConfig.categoryName.toLowerCase()} tools. Manage your personalized collection of AI solutions for commercial real estate.`,
    site: siteConfig.seo.twitter.site,
    creator: siteConfig.seo.twitter.creator,
    images: [
      {
        url: siteConfig.seo.twitter.images.default,
        width: siteConfig.seo.twitter.images.width,
        height: siteConfig.seo.twitter.images.height,
        alt: siteConfig.seo.twitter.images.alt,
      },
    ],
  },
  alternates: {
    canonical: `${siteConfig.url}/favourites`,
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
};

export default function FavouritesPage() {
  return <FavouritesClient />;
} 