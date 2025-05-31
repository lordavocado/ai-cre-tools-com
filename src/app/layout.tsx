import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { PostHogProvider } from '@/providers/PostHogProvider';

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - ${siteConfig.categoryName} Directory`,
    template: `%s | ${siteConfig.categoryName}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords], // Convert readonly array to mutable array
  authors: [{ name: `${siteConfig.name} Team` }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  openGraph: {
    title: `${siteConfig.name} - ${siteConfig.categoryName} Directory`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.categoryName,
    // images: [ // Add a default OG image
    //   {
    //     url: 'https://yourdomain.com/og-image.png',
    //     width: 1200,
    //     height: 630,
    //   },
    // ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} - ${siteConfig.categoryName} Directory`,
    description: siteConfig.description,
    creator: '@productanalyticstools',
    images: [`${siteConfig.url}/og-image.png`],
  },
  // },
  // icons: { // Add favicon links
  //   icon: '/favicon.ico',
  //   shortcut: '/favicon-16x16.png',
  //   apple: '/apple-touch-icon.png',
  // },
  // manifest: '/site.webmanifest', // Add manifest for PWA
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <PostHogProvider>
          <div className="relative flex min-h-dvh flex-col bg-background">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </PostHogProvider>
      </body>
    </html>
  );
}