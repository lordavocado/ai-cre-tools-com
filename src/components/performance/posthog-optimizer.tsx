'use client';

import { useEffect } from 'react';

/**
 * PostHog Optimization Component
 * Optimizes PostHog loading and caching to improve performance scores
 */
export function PostHogOptimizer() {
  useEffect(() => {
    // Only optimize in production
    if (process.env.NODE_ENV !== 'production') return;

    // Optimize PostHog script loading
    const optimizePostHogLoading = () => {
      // Find PostHog scripts and optimize their loading
      const posthogScripts = document.querySelectorAll('script[src*="posthog"]');
      
      posthogScripts.forEach(script => {
        // Add async loading to PostHog scripts
        if (!script.hasAttribute('async')) {
          script.setAttribute('async', '');
        }
        
        // Add performance hints
        if (!script.hasAttribute('defer')) {
          script.setAttribute('defer', '');
        }
      });
    };

    // Add service worker for PostHog caching
    const addPostHogServiceWorker = () => {
      if ('serviceWorker' in navigator) {
        const swCode = `
          const POSTHOG_CACHE = 'posthog-cache-v1';
          const POSTHOG_URLS = [
            '/ingest/static/',
            'posthog.com/static/',
            'posthog.js'
          ];

          self.addEventListener('install', (event) => {
            event.waitUntil(
              caches.open(POSTHOG_CACHE).then((cache) => {
                return Promise.all(
                  POSTHOG_URLS.map(url => {
                    return fetch(url).then(response => {
                      if (response.ok) {
                        return cache.put(url, response);
                      }
                    }).catch(() => {
                      // Ignore errors for optional caching
                    });
                  })
                );
              })
            );
          });

          self.addEventListener('fetch', (event) => {
            const url = event.request.url;
            
            // Cache PostHog static assets for 1 year
            if (POSTHOG_URLS.some(pattern => url.includes(pattern))) {
              event.respondWith(
                caches.match(event.request).then((response) => {
                  if (response) {
                    return response;
                  }
                  
                  return fetch(event.request).then((response) => {
                    const responseClone = response.clone();
                    caches.open(POSTHOG_CACHE).then((cache) => {
                      cache.put(event.request, responseClone);
                    });
                    return response;
                  });
                })
              );
            }
          });
        `;

        // Register service worker for PostHog caching
        const blob = new Blob([swCode], { type: 'application/javascript' });
        const swUrl = URL.createObjectURL(blob);
        
        navigator.serviceWorker.register(swUrl)
          .then(() => {
            URL.revokeObjectURL(swUrl);
          })
          .catch(() => {
            // Ignore service worker registration errors
            URL.revokeObjectURL(swUrl);
          });
      }
    };

    // Debounce optimization calls
    const timer = setTimeout(() => {
      optimizePostHogLoading();
      addPostHogServiceWorker();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return null;
}

/**
 * Analytics Performance Monitor
 * Monitors and optimizes analytics script performance
 */
export function AnalyticsPerformanceMonitor() {
  useEffect(() => {
    // Monitor analytics performance
    const monitorAnalyticsPerformance = () => {
      // Check for Core Web Vitals impact
      if ('web-vitals' in window) {
        // @ts-ignore
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = window['web-vitals'];
        
        // Monitor key metrics
        getLCP?.((metric: any) => {
          if (metric.value > 2500) {
            // LCP is slow, potentially due to analytics
            console.warn('LCP affected by analytics:', metric);
          }
        });

        getTTFB?.((metric: any) => {
          if (metric.value > 600) {
            // TTFB is slow
            console.warn('TTFB slow:', metric);
          }
        });
      }
    };

    // Run performance monitoring after analytics load
    const timer = setTimeout(monitorAnalyticsPerformance, 2000);

    return () => clearTimeout(timer);
  }, []);

  return null;
} 