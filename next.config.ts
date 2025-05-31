import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
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
  webpack: (config, { isServer }) => {
    if (!isServer) {
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
    }
    return config;
  },
};

export default nextConfig;
