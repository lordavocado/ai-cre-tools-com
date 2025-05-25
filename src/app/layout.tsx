
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - ${siteConfig.categoryName} Directory`,
    template: `%s | ${siteConfig.categoryName}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
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
  // twitter: { // Add twitter specific card
  //   card: 'summary_large_image',
  //   title: 'Sheet2Site Pro - Build SEO-Optimized Directories with Google Sheets',
  //   description: 'Create powerful, SEO-friendly directories using Google Sheets as your database.',
  //   creator: '@yourtwitterhandle', // Replace with your Twitter handle
  //   images: ['https://yourdomain.com/twitter-image.png'], // Replace
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
          "min-h-screen bg-background font-sans antialiased",
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <div className="relative flex min-h-dvh flex-col bg-background">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
