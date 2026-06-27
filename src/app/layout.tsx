import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { siteConfig, getAllSEOKeywords } from '@/config/site';
import { LazyPostHogProvider } from '@/providers/LazyPostHogProvider';
import { FavoritesProvider } from '@/providers/FavoritesProvider';

const GOOGLE_TAG_MANAGER_ID = 'GTM-K9T6242L';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Best AI Real Estate Tools Directory`,
    // Pages set full titles (keyword + brand). Avoid duplicating "| AI CRE Tools".
    template: '%s',
  },
  description: siteConfig.description,
  keywords: getAllSEOKeywords(),
  authors: [{ name: `${siteConfig.name} Team` }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  openGraph: {
    title: `AI CRE Tools — Best AI Real Estate Tools for Commercial Property`,
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
  twitter: {
    card: 'summary_large_image',
    title: `AI CRE Tools — Best AI Real Estate Tools Directory`,
    description: siteConfig.description,
    site: siteConfig.seo.twitter.site,
    creator: siteConfig.seo.twitter.creator,
    images: [siteConfig.seo.openGraph.images.default],
  },
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
  alternates: {
    canonical: siteConfig.url,
    languages: {
      'en-US': siteConfig.url,
      'en-GB': siteConfig.url,
    },
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [
      { url: '/ai-cre-tools-logo.jpg', sizes: '180x180', type: 'image/jpeg' },
      { url: '/ai-cre-tools-logo.jpg', sizes: '152x152', type: 'image/jpeg' },
      { url: '/ai-cre-tools-logo.jpg', sizes: '120x120', type: 'image/jpeg' },
    ],
    shortcut: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1410' },
  ],
};

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  inLanguage: 'en-US',
  publisher: {
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/ai-cre-tools-logo.jpg`,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteConfig.url}/?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/ai-cre-tools-logo.jpg`,
  description: siteConfig.description,
  sameAs: siteConfig.social
    ? Object.values(siteConfig.social).map((handle) =>
        handle.includes('@')
          ? `https://twitter.com/${handle}`
          : handle.includes('company/')
            ? `https://linkedin.com/${handle}`
            : `https://github.com/${handle}`
      )
    : [],
  knowsAbout: [
    'AI Real Estate Tools',
    'Best AI Real Estate Tools',
    'Commercial Real Estate',
    'AI Tools',
    'PropTech',
    'Real Estate Analytics',
    'Property Management Software',
    'Investment Analysis',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          spaceGrotesk.variable
        )}
      >
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),
                  dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GOOGLE_TAG_MANAGER_ID}');
            `,
          }}
        />
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
              <iframe src="https://www.googletagmanager.com/ns.html?id=${GOOGLE_TAG_MANAGER_ID}"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `,
          }}
        />
        <LazyPostHogProvider>
          <FavoritesProvider>
            <div className="relative flex min-h-dvh flex-col bg-background">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </FavoritesProvider>
        </LazyPostHogProvider>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
        />
      </body>
    </html>
  );
}
