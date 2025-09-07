'use client';

import { useEffect } from 'react';

/**
 * Critical Resource Optimization Component
 * Handles DNS prefetching, resource hints, and critical path optimization
 */
export function CriticalResources() {
  useEffect(() => {
    // Only preload resources that are actually needed and won't cause warnings
    const preloadResources: Array<{
      href: string;
      as: string;
      type?: string;
      crossOrigin?: string;
    }> = [
      // Only preload resources that are used immediately on page load
      // Removed logo and og-image as they're not immediately visible
    ];

    preloadResources.forEach(resource => {
      // Check if resource is already preloaded to prevent duplicates
      const existingLink = document.querySelector(`link[rel="preload"][href="${resource.href}"]`);
      if (existingLink) return;

      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) link.type = resource.type;
      if (resource.crossOrigin) link.crossOrigin = resource.crossOrigin;
      document.head.appendChild(link);
    });

    // DNS prefetch for external domains
    const dnsPrefetchDomains = [
      '//fonts.googleapis.com',
      '//fonts.gstatic.com', 
      '//eu.i.posthog.com',
      '//eu-assets.i.posthog.com',
    ];

    dnsPrefetchDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });

    // Enhanced CSS loading with error handling
    const loadCSS = (href: string, media = 'all') => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      
      let loaded = false;
      
      link.onload = function() {
        if (!loaded) {
          loaded = true;
          // @ts-ignore
          this.onload = null;
          // @ts-ignore
          this.rel = 'stylesheet';
          // @ts-ignore
          this.media = media;
        }
      };

      link.onerror = function() {
        // Try to load directly as stylesheet if preload fails
        const fallbackLink = document.createElement('link');
        fallbackLink.rel = 'stylesheet';
        fallbackLink.href = href;
        fallbackLink.media = media;
        document.head.appendChild(fallbackLink);
      };

      document.head.appendChild(link);
      
      // Multiple fallback strategies
      setTimeout(() => {
        if (link.rel !== 'stylesheet' && !loaded) {
          link.rel = 'stylesheet';
          link.media = media;
        }
      }, 2000);

      // Final fallback - create direct stylesheet link
      setTimeout(() => {
        if (!loaded) {
          const directLink = document.createElement('link');
          directLink.rel = 'stylesheet';
          directLink.href = href;
          directLink.media = media;
          document.head.appendChild(directLink);
        }
      }, 5000);
    };

    // Monitor main CSS loading
    const monitorMainCSS = () => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1 && (node as Element).tagName === 'LINK') {
                const link = node as HTMLLinkElement;
                if (link.rel === 'stylesheet' && link.href.includes('/_next/static/css/')) {
                  // Add error handling to main CSS
                  link.onerror = () => {
                    document.documentElement.classList.add('css-load-error');
                  };
                  
                  link.onload = () => {
                    document.documentElement.classList.add('css-loaded');
                  };
                }
              }
            });
          }
        });
      });

      observer.observe(document.head, {
        childList: true,
        subtree: true
      });

      // Stop observing after 10 seconds
      setTimeout(() => observer.disconnect(), 10000);
    };

    monitorMainCSS();

    return () => {
      // Cleanup if needed
    };
  }, []);

  return null; // This component doesn't render anything
}

/**
 * Font Loading Optimization
 */
export function FontLoader() {
  useEffect(() => {
    // Optimize font loading with font-display: swap
    if ('fonts' in document) {
      // @ts-ignore
      document.fonts.ready.then(() => {
        document.documentElement.classList.add('fonts-loaded');
      });
    }

    // Note: Fonts are loaded via Next.js font optimization
    // No need to preload local font files as they're handled by next/font/google
  }, []);

  return null;
}

/**
 * Critical Path CSS Loader
 * Loads CSS without blocking render
 */
export function CriticalPathCSS() {
  useEffect(() => {
    // Check if critical CSS is already loaded
    const existingStyles = document.querySelectorAll('style[data-critical]');
    if (existingStyles.length > 0) return;

    // Inject critical CSS immediately
    const criticalCSS = `
      /* Critical above-the-fold styles */
      .critical-nav { min-height: 64px; opacity: 1; }
      .critical-hero { min-height: 400px; }
      .critical-loading { 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        min-height: 200px; 
      }
      
      /* Prevent layout shift */
      .skeleton { 
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;
      }
      
      @keyframes skeleton-loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      
      /* Essential layout styles */
      .min-h-screen { min-height: 100vh; }
      .flex { display: flex; }
      .flex-1 { flex: 1 1 0%; }
      .flex-col { flex-direction: column; }
      .relative { position: relative; }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = criticalCSS;
    styleElement.setAttribute('data-critical', 'true');
    document.head.insertBefore(styleElement, document.head.firstChild);
  }, []);

  return null;
} 