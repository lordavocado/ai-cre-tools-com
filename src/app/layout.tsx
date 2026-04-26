import type { Metadata, Viewport } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { siteConfig, getAllSEOKeywords } from '@/config/site';
import { PostHogProvider } from '@/providers/PostHogProvider';
import { FavoritesProvider } from '@/providers/FavoritesProvider';
import { StructuredData } from '@/components/seo/structured-data';
import { PostHogOptimizer, AnalyticsPerformanceMonitor } from '@/components/performance/posthog-optimizer';
import { JSExecutionOptimizer, ScriptExecutionMonitor } from '@/components/performance/js-execution-optimizer';
import { CSSFallback } from '@/components/css-fallback';
import { CriticalResources } from '@/components/performance/critical-resources';
import { PerformanceMonitor } from '@/components/performance/performance-monitor';
import { HydrationTracker } from '@/components/performance/hydration-tracker';

const GOOGLE_TAG_MANAGER_ID = 'GTM-K9T6242L';


export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Best AI Real Estate Tools Directory`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: getAllSEOKeywords(),
  authors: [{ name: `${siteConfig.name} Team` }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  
  // Enhanced Open Graph metadata for better social sharing
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
  
  // Enhanced Twitter/X Cards
  twitter: {
    card: 'summary_large_image',
    title: `AI CRE Tools — Best AI Real Estate Tools Directory`,
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
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/ai-cre-tools-logo.jpg', sizes: '180x180', type: 'image/jpeg' },
      { url: '/ai-cre-tools-logo.jpg', sizes: '152x152', type: 'image/jpeg' },
      { url: '/ai-cre-tools-logo.jpg', sizes: '120x120', type: 'image/jpeg' },
    ],
    shortcut: '/favicon.svg',
  },
  
  // Web app manifest
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <script
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
        {/* End Google Tag Manager */}

        {/* Critical inline styles for immediate rendering */}
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --background: 0 0% 100%;
              --foreground: 222.2 47.4% 11.2%;
              --primary: 142 42% 32%;
              --primary-foreground: 0 0% 100%;
              --secondary: 210 40% 98%;
              --secondary-foreground: 222.2 47.4% 11.2%;
              --muted: 210 40% 97%;
              --muted-foreground: 215.4 16.3% 46.9%;
              --border: 214.3 31.8% 91.4%;
              --ring: 142 42% 32%;
              --radius: 0.5rem;
            }
            * { box-sizing: border-box; }
            html { height: 100%; scroll-behavior: smooth; }
            body { 
              margin: 0; 
              padding: 0; 
              font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif; 
              line-height: 1.6; 
              color: hsl(222.2 47.4% 11.2%);
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
        {/* Removed hero background preload (hero image no longer used) */}
        
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
          'min-h-screen bg-background font-sans antialiased',
          spaceGrotesk.variable
        )}
      >
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
              <iframe src="https://www.googletagmanager.com/ns.html?id=${GOOGLE_TAG_MANAGER_ID}"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `,
          }}
        />
        <CSSFallback />
        <CriticalResources />
        <PostHogProvider>
          <FavoritesProvider>
            {process.env.NEXT_PUBLIC_POSTHOG_KEY && (
              <>
                <PostHogOptimizer />
                <AnalyticsPerformanceMonitor />
              </>
            )}
            {process.env.NODE_ENV === 'development' && (
              <>
                <JSExecutionOptimizer />
                <ScriptExecutionMonitor />
              </>
            )}
            <PerformanceMonitor
              enableConsoleLogging={process.env.NODE_ENV === 'development'}
              enableRealUserMonitoring={true}
              thresholdWarnings={true}
            />
            <HydrationTracker />
            <div className="relative flex min-h-dvh flex-col bg-background">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </FavoritesProvider>
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
                logo: `${siteConfig.url}/ai-cre-tools-logo.jpg`,
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
              logo: `${siteConfig.url}/ai-cre-tools-logo.jpg`,
              description: siteConfig.description,
              sameAs: siteConfig.social ? Object.values(siteConfig.social).map(handle =>
                handle.includes('@') ? `https://twitter.com/${handle}` :
                handle.includes('company/') ? `https://linkedin.com/${handle}` :
                `https://github.com/${handle}`
              ) : [],
              knowsAbout: [
                "AI Real Estate Tools",
                "Best AI Real Estate Tools",
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
