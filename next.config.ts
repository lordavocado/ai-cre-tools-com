import type {NextConfig} from 'next';

// Bundle analyzer for performance debugging
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Performance optimizations to eliminate render-blocking resources
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
    // Turbo mode for faster development
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    // More aggressive tree shaking
    optimizeServerReact: true,
  },
  
  // Modern JavaScript compilation to eliminate legacy polyfills
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
    // SWC settings for modern compilation
    styledComponents: false,
  },
  
  // Transpile packages for modern browsers only
  transpilePackages: ['posthog-js'],
  
  // Enable compression
  compress: true,
  
  // Advanced performance settings
  poweredByHeader: false, // Remove x-powered-by header
  generateEtags: false, // Disable ETags for better caching control
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.posthog.com *.google.com",
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              "font-src 'self' fonts.gstatic.com",
              "img-src 'self' data: blob: https: *.posthog.com",
              "connect-src 'self' *.posthog.com *.google.com *.googleapis.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      // PostHog static assets with long cache
      {
        source: '/ingest/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Static assets cache optimization
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // CSS cache optimization
      {
        source: '/css/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  images: {
    // Enable modern image formats
    formats: ['image/webp', 'image/avif'],
    
    // Add quality and size optimizations
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Optimize images more aggressively
    minimumCacheTTL: 31536000, // 1 year cache
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    
    remotePatterns: [
      // Essential logo and image sources
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      // Google services
      {
        protocol: 'https',
        hostname: 'www.google.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 't1.gstatic.com',
        port: '',
        pathname: '/**',
      },
      // Wildcard patterns for common TLDs (covers most tool domains)
      {
        protocol: 'https',
        hostname: '*.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.so',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.pro',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.st',
        port: '',
        pathname: '/**',
      }
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
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      // Client-side optimizations
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        events: false,
        process: false,
        util: false,
      };
      
              // Basic chunk splitting - simplified for bundle analysis
        config.optimization.splitChunks = {
          ...config.optimization.splitChunks,
          chunks: 'all',
          minSize: 20000,
          maxSize: 100000,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            
            // Core React libraries
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 50,
              enforce: true,
            },
            
            // Radix UI components
            radix: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              name: 'radix-ui',
              chunks: 'all',
              priority: 40,
              enforce: true,
            },
            
            // Lucide icons
            icons: {
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              name: 'icons',
              chunks: 'all',
              priority: 35,
              enforce: true,
            },
            
            // PostHog analytics
            posthog: {
              test: /[\\/]node_modules[\\/]posthog-js[\\/]/,
              name: 'posthog',
              chunks: 'all',
              priority: 45,
              enforce: true,
              reuseExistingChunk: true,
            },
            
            // Other vendor libraries
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
              minChunks: 2,
            },
            
            // Default
            default: {
              minChunks: 2,
              priority: -10,
              reuseExistingChunk: true,
              minSize: 10000,
            },
          },
        };
      
      // Enhanced tree shaking and dead code elimination
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      config.optimization.providedExports = true;
      
      // Module concatenation for better minification
      config.optimization.concatenateModules = true;
      
      // Better module resolution for tree shaking
      config.resolve.mainFields = ['es2015', 'module', 'main'];
      
             // Terser optimization for main-thread performance
       if (config.optimization.minimizer) {
         config.optimization.minimizer.forEach((minimizer: any) => {
           if (minimizer.constructor.name === 'TerserPlugin') {
            minimizer.options.terserOptions = {
              ...minimizer.options.terserOptions,
              parse: {
                ecma: 8,
              },
              compress: {
                ecma: 5,
                warnings: false,
                comparisons: false,
                inline: 2,
                drop_console: !dev, // Remove console logs in production
                drop_debugger: !dev,
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                unsafe_Function: true,
                unsafe_math: true,
                unsafe_symbols: true,
                unsafe_methods: true,
                unsafe_proto: true,
                unsafe_regexp: true,
                unsafe_undefined: true,
                unused: true,
              },
              mangle: {
                safari10: true,
              },
              output: {
                ecma: 5,
                comments: false,
                ascii_only: true,
              },
            };
          }
        });
      }
    }
    
    // Ensure modern browser targeting (no polyfills needed)
    if (!isServer) {
      config.target = ['web', 'es2020'];
    }
    
    // Add SVG support if not already present
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
