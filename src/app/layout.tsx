import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { siteConfig, getAllSEOKeywords } from '@/config/site';
import { PostHogProvider } from '@/providers/PostHogProvider';
import { FavouritesProvider } from '@/providers/FavouritesProvider';
import { StructuredData } from '@/components/seo/structured-data';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - Find & Compare the Best ${siteConfig.categoryName}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: getAllSEOKeywords(),
  authors: [{ name: `${siteConfig.name} Team` }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  
  // Enhanced Open Graph metadata for better social sharing
  openGraph: {
    title: `${siteConfig.name} - Find & Compare the Best ${siteConfig.categoryName}`,
    description: siteConfig.description,
    url: siteConfig.url,
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
    type: siteConfig.seo.openGraph.type,
    alternateLocale: ['en_GB', 'en_AU', 'en_CA'],
  },
  
  // Enhanced Twitter/X Cards
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} - The Ultimate ${siteConfig.categoryName} Directory`,
    description: siteConfig.description,
    site: siteConfig.seo.twitter.site,
    creator: siteConfig.seo.twitter.creator,
    images: [siteConfig.seo.openGraph.images.default],
  },
  
  // Additional social platforms
  other: {
    'og:image:width': siteConfig.seo.openGraph.images.width.toString(),
    'og:image:height': siteConfig.seo.openGraph.images.height.toString(),
    'og:image:type': 'image/png',
    'article:author': `${siteConfig.name} Team`,
    'article:section': 'Technology',
    'og:updated_time': new Date().toISOString(),
  },
  
  // Verification tags for social platforms
  verification: {
    google: 'your-google-verification-code', // Replace with actual code
    // facebook: 'your-facebook-verification-code', // Add if needed
    // twitter: 'your-twitter-verification-code', // Add if needed
  },
  
  // Enhanced robots for better crawling
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  
  // Canonical and alternates
  alternates: {
    canonical: siteConfig.url,
    languages: {
      'en-US': siteConfig.url,
      'en-GB': siteConfig.url,
    },
  },
  
  // Additional SEO metadata
  category: 'Technology',
  classification: 'Software Directory',
  referrer: 'origin-when-cross-origin',
  
  // Enhanced favicon and app icons
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/product-analytics-tools-logo.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/product-analytics-tools-logo.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  
  // Web app manifest
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Enhanced Structured Data for Better SEO */}
        <StructuredData type="website" />
        <StructuredData type="organization" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <PostHogProvider>
          <FavouritesProvider>
            <div className="relative flex min-h-dvh flex-col bg-background">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </FavouritesProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}