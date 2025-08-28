import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/ui/hero';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { siteConfig, getAllSEOKeywords } from '@/config/site';
import { PostHogProvider } from '@/providers/PostHogProvider';
import { FavouritesProvider } from '@/providers/FavouritesProvider';
import { StructuredData } from '@/components/seo/structured-data';
import { PostHogOptimizer, AnalyticsPerformanceMonitor } from '@/components/performance/posthog-optimizer';
import { JSExecutionOptimizer, ScriptExecutionMonitor } from '@/components/performance/js-execution-optimizer';
import { CSSFallback, CSSLoadingMonitor } from '@/components/css-fallback';
import { CriticalResources } from '@/components/performance/critical-resources';
import { PerformanceMonitor } from '@/components/performance/performance-monitor';


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
  
  // Enhanced favicon and app icons for mobile optimization
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/ai-cre-tools-logo.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/ai-cre-tools-logo.png', sizes: '180x180', type: 'image/png' },
      { url: '/ai-cre-tools-logo.png', sizes: '152x152', type: 'image/png' },
      { url: '/ai-cre-tools-logo.png', sizes: '120x120', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },

  // Mobile-specific viewport optimization
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover',
  },

  // Theme color for mobile browsers
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' },
  ],
  
  // Web app manifest
  manifest: '/site.webmanifest',
};

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Critical inline styles for immediate rendering */}
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --background: 0 0% 100%;
              --foreground: 0 0% 9%;
              --primary: 0 0% 9%;
              --primary-foreground: 0 0% 98%;
              --secondary: 0 0% 96%;
              --secondary-foreground: 0 0% 9%;
              --muted: 0 0% 96%;
              --muted-foreground: 0 0% 45%;
              --border: 0 0% 90%;
              --ring: 0 0% 9%;
              --radius: 0.5rem;
            }
            * { box-sizing: border-box; }
            html { height: 100%; scroll-behavior: smooth; }
            body { 
              margin: 0; 
              padding: 0; 
              font-family: 'Inter', system-ui, -apple-system, sans-serif; 
              line-height: 1.6; 
              color: hsl(0 0% 9%); 
              background-color: hsl(0 0% 100%);
              min-height: 100vh;
              font-feature-settings: "rlig" 1, "calt" 1;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            .flex { display: flex; }
            .flex-col { flex-direction: column; }
            .min-h-screen { min-height: 100vh; }
            .min-h-dvh { min-height: 100dvh; }
            .flex-1 { flex: 1 1 0%; }
            .relative { position: relative; }
            .bg-background { background-color: hsl(var(--background)); }
            .text-foreground { color: hsl(var(--foreground)); }
            .container { 
              width: 100%; 
              max-width: 1200px; 
              margin: 0 auto; 
              padding: 0 1rem; 
            }
            .btn {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              white-space: nowrap;
              border-radius: calc(var(--radius) - 2px);
              font-size: 0.875rem;
              font-weight: 500;
              transition: all 0.2s ease;
              border: 1px solid hsl(var(--border));
              background-color: hsl(var(--background));
              color: hsl(var(--foreground));
              padding: 0.5rem 1rem;
              cursor: pointer;
            }
            .btn:hover {
              background-color: hsl(var(--secondary));
            }
            .btn-primary {
              background-color: hsl(var(--primary));
              color: hsl(var(--primary-foreground));
              border-color: hsl(var(--primary));
            }
            .btn-primary:hover {
              background-color: hsl(var(--primary) / 0.9);
            }
            .loading-skeleton {
              background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
              background-size: 200% 100%;
              animation: skeleton-loading 1.5s infinite;
            }
            @keyframes skeleton-loading {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
            .hide-no-css { display: none; }
            .show-no-css { 
              display: block; 
              text-align: center; 
              padding: 2rem; 
              background: #f8f9fa; 
              border: 2px solid #e9ecef; 
              margin: 1rem;
              border-radius: 8px;
            }
            .css-loaded .hide-no-css { display: block; }
            .css-loaded .show-no-css { display: none; }
          `
        }} />
        
        {/* DNS prefetch for external domains - Core Web Vitals optimization */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//eu.i.posthog.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />

        {/* Preconnect to critical origins for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://eu.i.posthog.com" />

        {/* Resource hints for performance */}
        <link rel="prefetch" href="/categories" />
        <link rel="prefetch" href="/blog" />
        <link rel="prefetch" href="/about" />
        
        {/* CSS loading detection */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              function checkCSSLoaded() {
                var testEl = document.createElement('div');
                testEl.className = 'flex';
                document.body.appendChild(testEl);
                var isLoaded = window.getComputedStyle(testEl).display === 'flex';
                document.body.removeChild(testEl);
                if (isLoaded) {
                  document.documentElement.classList.add('css-loaded');
                } else {
                  setTimeout(checkCSSLoaded, 100);
                }
              }
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', checkCSSLoaded);
              } else {
                checkCSSLoaded();
              }
            })();
          `
        }} />
      </head>
      <body
        className={cn(
          'min-h-screen bg-white font-sans antialiased',
          inter.variable
        )}
      >
        <CSSFallback />
        <CSSLoadingMonitor />
        <CriticalResources />
        <PostHogProvider>
          <FavouritesProvider>
            {process.env.NEXT_PUBLIC_POSTHOG_KEY && (
              <>
                <PostHogOptimizer />
                <AnalyticsPerformanceMonitor />
              </>
            )}
            <JSExecutionOptimizer />
            <ScriptExecutionMonitor />
            <PerformanceMonitor 
              enableConsoleLogging={process.env.NODE_ENV === 'development'}
              enableRealUserMonitoring={true}
              thresholdWarnings={true}
            />
            <div className="relative flex min-h-dvh flex-col bg-background">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </FavouritesProvider>
        </PostHogProvider>
        
        {/* Enhanced Structured Data for Better SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: siteConfig.name,
              url: siteConfig.url,
              description: siteConfig.description,
              inLanguage: "en-US",
              publisher: {
                "@type": "Organization",
                name: siteConfig.name,
                url: siteConfig.url,
                logo: `${siteConfig.url}/ai-cre-tools-logo.png`,
              },
              potentialAction: {
                "@type": "SearchAction",
                target: `${siteConfig.url}/?search={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteConfig.name,
              url: siteConfig.url,
              logo: `${siteConfig.url}/ai-cre-tools-logo.png`,
              description: siteConfig.description,
              sameAs: siteConfig.social ? Object.values(siteConfig.social).map(handle =>
                handle.includes('@') ? `https://twitter.com/${handle}` :
                handle.includes('company/') ? `https://linkedin.com/${handle}` :
                `https://github.com/${handle}`
              ) : [],
              knowsAbout: [
                "Commercial Real Estate",
                "AI Tools",
                "PropTech",
                "Real Estate Analytics",
                "Property Management Software",
                "Investment Analysis"
              ],
            }),
          }}
        />

        <StructuredData type="website" />
        <StructuredData type="organization" />
      </body>
    </html>
  );
}