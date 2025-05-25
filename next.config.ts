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
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'companieslogo.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'brandfetch.com',
        port: '',
        pathname: '/**',
      },
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
      {
        protocol: 'https',
        hostname: 'seeklogo.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.kameleoon.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.geteppo.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.kissmetrics.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'countly.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'snowplow.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'matomo.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'piwik.pro',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'clicky.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.foxmetrics.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'june.so',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.smartlook.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'datafa.st',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'usefathom.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plausible.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.goatcounter.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pirsch.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'simpleanalytics.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'counter.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'statcounter.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'awstats.sourceforge.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.openwebanalytics.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'panelbear.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.prismreplay.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.g2crowd.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
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
