import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  serverExternalPackages: ['@mailchimp/mailchimp_marketing'],

  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-avatar',
      '@radix-ui/react-select',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-accordion',
      '@radix-ui/react-popover',
      'clsx',
      'class-variance-authority',
    ],
    optimizeServerReact: true,
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  transpilePackages: ['posthog-js'],

  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  // Trim standalone trace — dev/build tools not needed at runtime
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@swc/core-linux-x64-gnu/**',
      'node_modules/@swc/core-linux-x64-musl/**',
      'node_modules/@esbuild/**',
      'node_modules/webpack/**',
      'node_modules/terser/**',
      'node_modules/@next/swc-linux-x64-gnu/**',
      'node_modules/@next/swc-linux-x64-musl/**',
      'node_modules/canvas/**',
      'node_modules/puppeteer/**',
      'node_modules/puppeteer-core/**',
      'node_modules/lighthouse/**',
      'node_modules/genkit-cli/**',
      'node_modules/typescript/**',
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.posthog.com *.google.com *.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              "font-src 'self' fonts.gstatic.com",
              "img-src 'self' data: blob: https: *.posthog.com *.google-analytics.com sgaejkzumgooaxqmildg.supabase.co *.supabase.co",
              "connect-src 'self' *.posthog.com *.google.com *.googleapis.com *.googletagmanager.com *.google-analytics.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      {
        source: '/ingest/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'inline',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'logo.clearbit.com', pathname: '/**' },
      { protocol: 'https', hostname: 'upload.wikimedia.org', pathname: '/**' },
      { protocol: 'https', hostname: 'www.google.com', pathname: '/**' },
      { protocol: 'https', hostname: 't1.gstatic.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'via.placeholder.com', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      { protocol: 'https', hostname: 'fazier.com', pathname: '/**' },
      { protocol: 'https', hostname: 'startupfa.me', pathname: '/**' },
      { protocol: 'https', hostname: 'api.producthunt.com', pathname: '/**' },
      {
        protocol: 'https',
        hostname: 'sgaejkzumgooaxqmildg.supabase.co',
        pathname: '/storage/v1/object/sign/**',
      },
      {
        protocol: 'https',
        hostname: 'sgaejkzumgooaxqmildg.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://eu-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://eu.i.posthog.com/:path*',
      },
      {
        source: '/ingest/decide',
        destination: 'https://eu.i.posthog.com/decide',
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/categories/investment-portfolio-management',
        destination: '/categories/asset-portfolio-management',
        permanent: true,
      },
      {
        source: '/categories/transaction-brokerage',
        destination: '/categories/transactions-brokerage',
        permanent: true,
      },
      {
        source: '/categories/market-analysis-valuation',
        destination: '/categories/property-analysis-valuation',
        permanent: true,
      },
      {
        source: '/categories/legal-compliance',
        destination: '/categories/legal-compliance-due-diligence',
        permanent: true,
      },
    ];
  },

  skipTrailingSlashRedirect: true,

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }
    return config;
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);
