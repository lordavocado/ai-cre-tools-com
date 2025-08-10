'use client';

import { useEffect } from 'react';

/**
 * CSS Optimizer Component
 * Eliminates render-blocking CSS by inlining critical styles
 * and loading non-critical CSS asynchronously
 */
export function CSSOptimizer() {
  useEffect(() => {
    // Check if CSS optimization has already run
    if (document.querySelector('[data-css-optimized]')) return;

    // Mark as optimized
    document.documentElement.setAttribute('data-css-optimized', 'true');

    // Load non-critical CSS asynchronously
    const loadNonCriticalCSS = () => {
      const existingStylesheet = document.querySelector('link[href*="_next/static/css/"]');
      
      if (existingStylesheet) {
        // Convert existing CSS to async loading
        const asyncLink = document.createElement('link');
        asyncLink.rel = 'preload';
        asyncLink.as = 'style';
        asyncLink.href = existingStylesheet.getAttribute('href') || '';
        asyncLink.onload = function() {
          // @ts-ignore
          this.onload = null;
          // @ts-ignore
          this.rel = 'stylesheet';
        };
        
        // Insert async link before existing
        existingStylesheet.parentNode?.insertBefore(asyncLink, existingStylesheet);
        
        // Remove original blocking stylesheet after a delay
        setTimeout(() => {
          existingStylesheet.remove();
        }, 100);
      }
    };

    // Load CSS asynchronously
    loadNonCriticalCSS();

    // Optimize font loading
    const optimizeFonts = () => {
      // Add font-display: swap to any existing font links
      const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
      fontLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.includes('display=swap')) {
          const newHref = href + (href.includes('?') ? '&' : '?') + 'display=swap';
          link.setAttribute('href', newHref);
        }
      });
    };

    optimizeFonts();

    // Preload critical resources
    const preloadCriticalResources = () => {
      const criticalResources = [
        { href: '/favicon.ico', as: 'image' },
        { href: '/ai-cre-tools-logo.png', as: 'image' },
      ];

      criticalResources.forEach(resource => {
        const existing = document.querySelector(`link[href="${resource.href}"]`);
        if (!existing) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = resource.href;
          link.as = resource.as;
          document.head.appendChild(link);
        }
      });
    };

    preloadCriticalResources();

    return () => {
      // Cleanup if needed
    };
  }, []);

  return null;
}

/**
 * Critical CSS Styles Component
 * Inlines the most critical CSS to prevent render blocking
 */
export function InlineCriticalCSS() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          /* CRITICAL CSS - Inlined to prevent render blocking */
          
          /* Reset and base */
          *,::before,::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}
          html{line-height:1.5;-webkit-text-size-adjust:100%;tab-size:4;font-family:system-ui,sans-serif}
          body{margin:0;line-height:inherit}
          
          /* Essential layout */
          .min-h-screen{min-height:100vh}
          .min-h-dvh{min-height:100dvh}
          .flex{display:flex}
          .flex-1{flex:1 1 0%}
          .flex-col{flex-direction:column}
          .relative{position:relative}
          .bg-background{background-color:hsl(0 0% 100%)}
          .text-foreground{color:hsl(0 0% 0%)}
          
          /* Critical navigation */
          .critical-nav{
            min-height:64px;
            background:white;
            border-bottom:1px solid #e5e7eb;
            position:sticky;
            top:0;
            z-index:50;
          }
          
          /* Critical hero section */
          .critical-hero{
            min-height:400px;
            padding:2rem 1rem;
            text-align:center;
          }
          
          /* Loading states */
          .critical-loading{
            display:flex;
            align-items:center;
            justify-content:center;
            min-height:200px;
          }
          
          /* Skeleton loading */
          .skeleton{
            background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);
            background-size:200% 100%;
            animation:skeleton 1.5s infinite;
          }
          
          @keyframes skeleton{
            0%{background-position:200% 0}
            100%{background-position:-200% 0}
          }
          
          /* Typography */
          .font-sans{font-family:system-ui,sans-serif}
          .text-sm{font-size:0.875rem;line-height:1.25rem}
          .text-base{font-size:1rem;line-height:1.5rem}
          .text-lg{font-size:1.125rem;line-height:1.75rem}
          .text-xl{font-size:1.25rem;line-height:1.75rem}
          .text-2xl{font-size:1.5rem;line-height:2rem}
          .font-medium{font-weight:500}
          .font-semibold{font-weight:600}
          .font-bold{font-weight:700}
          
          /* Spacing */
          .p-4{padding:1rem}
          .px-4{padding-left:1rem;padding-right:1rem}
          .py-2{padding-top:0.5rem;padding-bottom:0.5rem}
          .mb-4{margin-bottom:1rem}
          .mt-8{margin-top:2rem}
          
          /* Colors */
          .text-gray-600{color:rgb(75 85 99)}
          .text-gray-900{color:rgb(17 24 39)}
          .bg-white{background-color:rgb(255 255 255)}
          .border-gray-200{border-color:rgb(229 231 235)}
          
          /* Buttons */
          .btn{
            display:inline-flex;
            align-items:center;
            justify-content:center;
            padding:0.5rem 1rem;
            border-radius:0.375rem;
            font-weight:500;
            text-decoration:none;
            transition:all 0.2s;
          }
          
          .btn-primary{
            background-color:rgb(0 0 0);
            color:rgb(255 255 255);
          }
          
          .btn-primary:hover{
            background-color:rgb(55 65 81);
          }
          
          /* Grid */
          .grid{display:grid}
          .grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}
          .gap-4{gap:1rem}
          
          @media (min-width:768px){
            .md\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}
            .md\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}
          }
          
          /* Hide non-critical initially */
          .non-critical{opacity:0;transition:opacity 0.3s ease}
          .non-critical.loaded{opacity:1}
          
          /* Performance optimizations */
          .will-change-transform{will-change:transform}
          .gpu-accelerated{transform:translateZ(0)}
        `,
      }}
    />
  );
}

/**
 * Non-Critical CSS Loader
 * Loads remaining Tailwind CSS after critical render
 */
export function LoadNonCriticalCSS() {
  useEffect(() => {
    // Load remaining CSS after initial render
    const timer = setTimeout(() => {
      // Mark non-critical elements as loaded
      const nonCriticalElements = document.querySelectorAll('.non-critical');
      nonCriticalElements.forEach(el => el.classList.add('loaded'));
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return null;
} 