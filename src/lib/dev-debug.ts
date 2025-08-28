/**
 * Development debugging utilities for SSR and hydration issues
 * These utilities are only active in development mode
 */

import { useEffect, useRef } from 'react';

// Development-only hydration mismatch detector
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

// Component render tracker for development
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

// SSR-safe console wrapper
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

// Hydration timing tracker
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

// Memory usage tracker for development
export function useMemoryTracker(componentName: string) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      // Check memory usage if available
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

// Development error boundary hook
export function useErrorTracker(componentName: string) {
  return (error: Error, errorInfo: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error in ${componentName}`);
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Stack:', error.stack);
      console.groupEnd();

      // Report to error tracking service in production
      // reportError(error, { component: componentName, ...errorInfo });
    }
  };
}

// SSR detection utility
export const ssrUtils = {
  isBrowser: typeof window !== 'undefined',
  isServer: typeof window === 'undefined',

  // Safe localStorage access
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

  // Safe sessionStorage access
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

// Performance monitoring for hydration
export function useHydrationPerformance() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      // Measure hydration performance
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

// Global hydration tracker
let hydrationStartTime: number | null = null;
let hydrationCompleteTime: number | null = null;

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

// Hydration warning utility
export function reportHydrationWarning(componentName: string, details: any) {
  if (process.env.NODE_ENV === 'development') {
    console.group(`⚠️ Hydration Warning in ${componentName}`);
    console.warn('Details:', details);
    console.warn('This may cause layout shifts or performance issues');
    console.groupEnd();
  }
}

// Development performance reporter
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

// Export all utilities
export {
  useHydrationMismatchDetector,
  useRenderTracker,
  useHydrationTimer,
  useMemoryTracker,
  useErrorTracker,
  devLog,
  ssrUtils,
  useHydrationPerformance,
  globalHydrationTracker,
  reportHydrationWarning,
  createPerformanceReport
};
