/**
 * Development debugging utilities for SSR and hydration issues
 * These utilities are only active in development mode and provide
 * performance monitoring, error tracking, and hydration diagnostics.
 * 
 * @fileoverview Development-only utilities for Next.js SSR debugging
 */

import { useEffect, useRef } from 'react';

/**
 * Detects hydration mismatches in development mode
 * @param componentName - Name of the component to track
 * @example
 * ```tsx
 * function MyComponent() {
 *   useHydrationMismatchDetector('MyComponent');
 *   return <div>Content</div>;
 * }
 * ```
 */
export function useHydrationMismatchDetector(componentName: string) {
  const isHydrated = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (isHydrated.current) {
        console.warn(`🔄 Hydration Warning: ${componentName} is re-rendering after hydration. This may indicate a hydration mismatch.`);
      }
      isHydrated.current = true;
    }
  }, [componentName]);
}

/**
 * Tracks component render count and warns about excessive re-renders
 * @param componentName - Name of the component to track
 * @param deps - Dependencies to log with render information
 * @example
 * ```tsx
 * function MyComponent({ data }) {
 *   useRenderTracker('MyComponent', [data]);
 *   return <div>{data}</div>;
 * }
 * ```
 */
export function useRenderTracker(componentName: string, deps: any[] = []) {
  const renderCount = useRef(0);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      renderCount.current += 1;
      console.log(`📦 ${componentName} rendered (${renderCount.current})`, deps.length > 0 ? deps : '');

      // Warn if excessive renders
      if (renderCount.current > 5) {
        console.warn(`⚠️ Performance Warning: ${componentName} has rendered ${renderCount.current} times. Consider optimizing.`);
      }
    }
  });
}

/**
 * SSR-safe console wrapper that only logs in development mode on the client
 * Prevents console logs during server-side rendering
 * @example
 * ```tsx
 * devLog.log('This only logs in development on client');
 * devLog.warn('Warning message');
 * devLog.error('Error message');
 * ```
 */
export const devLog = {
  log: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      console.error(...args);
    }
  }
};

/**
 * Tracks hydration timing performance for components
 * @param componentName - Name of the component to track
 * @returns Object with getHydrationTime method
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { getHydrationTime } = useHydrationTimer('MyComponent');
 *   return <div>Content</div>;
 * }
 * ```
 */
export function useHydrationTimer(componentName: string) {
  const startTime = useRef<number | null>(null);
  const hydratedTime = useRef<number | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!startTime.current) {
        startTime.current = performance.now();
        devLog.log(`⏱️ ${componentName} mounted at ${startTime.current}ms`);
      }

      // Check if we're hydrated
      if (typeof window !== 'undefined' && !hydratedTime.current) {
        hydratedTime.current = performance.now();
        const hydrationTime = hydratedTime.current - (startTime.current || 0);
        devLog.log(`💧 ${componentName} hydrated in ${hydrationTime.toFixed(2)}ms`);
      }
    }
  });

  return {
    getHydrationTime: () => {
      if (hydratedTime.current && startTime.current) {
        return hydratedTime.current - startTime.current;
      }
      return null;
    }
  };
}

/**
 * Tracks memory usage for components (Chrome/Edge only)
 * @param componentName - Name of the component to track
 * @example
 * ```tsx
 * function MyComponent() {
 *   useMemoryTracker('MyComponent');
 *   return <div>Content</div>;
 * }
 * ```
 */
export function useMemoryTracker(componentName: string) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      if ('memory' in performance) {
        const memInfo = (performance as any).memory;
        devLog.log(`🧠 ${componentName} memory usage:`, {
          used: `${(memInfo.usedJSHeapSize / 1048576).toFixed(2)} MB`,
          total: `${(memInfo.totalJSHeapSize / 1048576).toFixed(2)} MB`,
          limit: `${(memInfo.jsHeapSizeLimit / 1048576).toFixed(2)} MB`
        });
      }
    }
  });
}

/**
 * Creates an error tracker for development debugging
 * @param componentName - Name of the component to track errors for
 * @returns Error handler function for use in error boundaries
 * @example
 * ```tsx
 * function MyErrorBoundary() {
 *   const handleError = useErrorTracker('MyErrorBoundary');
 *   // Use in componentDidCatch or error boundary
 * }
 * ```
 */
export function useErrorTracker(componentName: string) {
  return (error: Error, errorInfo: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error in ${componentName}`);
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Stack:', error.stack);
      console.groupEnd();
    }
  };
}

/**
 * SSR-safe utilities for browser/server detection and storage access
 * @example
 * ```tsx
 * if (ssrUtils.isBrowser) {
 *   // Browser-only code
 * }
 * const data = ssrUtils.getLocalStorage('key', defaultValue);
 * ```
 */
export const ssrUtils = {
  isBrowser: typeof window !== 'undefined',
  isServer: typeof window === 'undefined',

  /**
   * Safe localStorage access that works during SSR
   * @param key - Storage key
   * @param defaultValue - Default value if key doesn't exist
   * @returns Parsed value or default
   */
  getLocalStorage: (key: string, defaultValue: any = null) => {
    if (ssrUtils.isBrowser) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  },

  /**
   * Safe sessionStorage access that works during SSR
   * @param key - Storage key
   * @param defaultValue - Default value if key doesn't exist
   * @returns Parsed value or default
   */
  getSessionStorage: (key: string, defaultValue: any = null) => {
    if (ssrUtils.isBrowser) {
      try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  }
};

/**
 * Monitors hydration and navigation performance metrics
 * Only active in development mode
 * @example
 * ```tsx
 * function App() {
 *   useHydrationPerformance();
 *   return <div>App content</div>;
 * }
 * ```
 */
export function useHydrationPerformance() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            devLog.log('🚀 Navigation Performance:', {
              domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
              totalTime: navEntry.loadEventEnd - navEntry.fetchStart
            });
          }
        }
      });

      observer.observe({ entryTypes: ['navigation'] });
      return () => observer.disconnect();
    }
  }, []);
}

let hydrationStartTime: number | null = null;
let hydrationCompleteTime: number | null = null;

/**
 * Global hydration tracking utility for measuring app-wide hydration performance
 * @example
 * ```tsx
 * // In _app.tsx or root component
 * globalHydrationTracker.start();
 * // Later, when hydration is complete
 * globalHydrationTracker.complete();
 * ```
 */
export const globalHydrationTracker = {
  start: () => {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      hydrationStartTime = performance.now();
      devLog.log('🚀 Global hydration tracking started');
    }
  },

  complete: () => {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      hydrationCompleteTime = performance.now();
      if (hydrationStartTime) {
        const duration = hydrationCompleteTime - hydrationStartTime;
        devLog.log(`💧 Global hydration completed in ${duration.toFixed(2)}ms`);

        // Report slow hydration
        if (duration > 1000) {
          devLog.warn(`🐌 Slow hydration detected: ${duration.toFixed(2)}ms. Consider optimizing.`);
        }
      }
    }
  },

  getStats: () => ({
    startTime: hydrationStartTime,
    completeTime: hydrationCompleteTime,
    duration: hydrationStartTime && hydrationCompleteTime ? hydrationCompleteTime - hydrationStartTime : null
  })
};

/**
 * Reports hydration warnings with detailed information
 * @param componentName - Name of the component with hydration issues
 * @param details - Additional details about the hydration warning
 * @example
 * ```tsx
 * reportHydrationWarning('MyComponent', { reason: 'State mismatch' });
 * ```
 */
export function reportHydrationWarning(componentName: string, details: any) {
  if (process.env.NODE_ENV === 'development') {
    console.group(`⚠️ Hydration Warning in ${componentName}`);
    console.warn('Details:', details);
    console.warn('This may cause layout shifts or performance issues');
    console.groupEnd();
  }
}

/**
 * Creates a comprehensive performance report for development debugging
 * @returns Performance report object or null in production
 * @example
 * ```tsx
 * const report = createPerformanceReport();
 * if (report) {
 *   // Use report data for debugging
 * }
 * ```
 */
export function createPerformanceReport() {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    const report = {
      timestamp: new Date().toISOString(),
      hydration: globalHydrationTracker.getStats(),
      memory: 'memory' in performance ? (performance as any).memory : null,
      navigation: performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming,
      resources: performance.getEntriesByType('resource').length,
      marks: performance.getEntriesByType('mark').length,
      measures: performance.getEntriesByType('measure').length
    };

    devLog.log('📊 Performance Report:', report);
    return report;
  }
  return null;
}