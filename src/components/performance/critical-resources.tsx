'use client';

import { useEffect } from 'react';

/**
 * Critical Resource Optimization Component
 * Handles DNS prefetching, resource hints, and critical path optimization
 */
export function CriticalResources() {
  useEffect(() => {
    // Preload critical resources
    const preloadResources = [
      { href: '/chunks/react.js', as: 'script' },
      { href: '/chunks/posthog.js', as: 'script' },
      { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
    ];

    preloadResources.forEach(resource => {
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

    // Load non-critical CSS asynchronously
    const loadCSS = (href: string, media = 'all') => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      link.onload = function() {
        // @ts-ignore
        this.onload = null;
        // @ts-ignore
        this.rel = 'stylesheet';
        // @ts-ignore
        this.media = media;
      };
      document.head.appendChild(link);
      
      // Fallback for old browsers
      setTimeout(() => {
        if (link.rel !== 'stylesheet') {
          link.rel = 'stylesheet';
          link.media = media;
        }
      }, 3000);
    };

    // Load non-critical styles
    loadCSS('/css/non-critical.css');

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

    // Preload critical font files
    const fontFiles = [
      '/fonts/inter-var.woff2',
      '/fonts/inter-latin.woff2',
    ];

    fontFiles.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = font;
      document.head.appendChild(link);
    });
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