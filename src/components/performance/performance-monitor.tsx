'use client';

import { useEffect, useCallback, useState } from 'react';

/**
 * Performance metrics interface for Core Web Vitals
 */
interface PerformanceMetrics {
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
  fcp: number | null; // First Contentful Paint
}

/**
 * Configuration options for performance monitoring
 */
interface PerformanceMonitorProps {
  enableConsoleLogging?: boolean;
  enableRealUserMonitoring?: boolean;
  thresholdWarnings?: boolean;
}

/**
 * Performance Monitor Component
 * Tracks Core Web Vitals and performance metrics
 * 
 * @param enableConsoleLogging - Whether to log metrics to console (development only)
 * @param enableRealUserMonitoring - Whether to send metrics to analytics
 * @param thresholdWarnings - Whether to warn about poor performance thresholds
 */
export function PerformanceMonitor({
  enableConsoleLogging = false,
  enableRealUserMonitoring = true,
  thresholdWarnings = true
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    fcp: null
  });

  // Monitor Core Web Vitals
  const monitorWebVitals = useCallback(() => {
    if (!window.performance || !window.PerformanceObserver) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
          const lcp = entry.startTime;
          setMetrics(prev => ({ ...prev, lcp }));
          
          if (enableConsoleLogging && process.env.NODE_ENV === 'development') {
            console.log(`📊 LCP: ${lcp.toFixed(0)}ms`);
          }
          
          if (thresholdWarnings && lcp > 2500 && process.env.NODE_ENV === 'development') {
            console.warn(`⚠️ LCP is slow: ${lcp.toFixed(0)}ms (should be < 2.5s)`);
          }
        }
        
        if (entry.entryType === 'first-input') {
          const firstInput = entry as PerformanceEventTiming;
          const fid = firstInput.processingStart - firstInput.startTime;
          setMetrics(prev => ({ ...prev, fid }));
          
          if (enableConsoleLogging && process.env.NODE_ENV === 'development') {
            console.log(`📊 FID: ${fid.toFixed(0)}ms`);
          }
          
          if (thresholdWarnings && fid > 100 && process.env.NODE_ENV === 'development') {
            console.warn(`⚠️ FID is slow: ${fid.toFixed(0)}ms (should be < 100ms)`);
          }
        }
        
        if (entry.entryType === 'layout-shift') {
          const layoutShift = entry as any;
          const cls = layoutShift.value;
          setMetrics(prev => ({ ...prev, cls }));
          
          if (enableConsoleLogging && process.env.NODE_ENV === 'development') {
            console.log(`📊 CLS: ${cls.toFixed(3)}`);
          }
          
          if (thresholdWarnings && cls > 0.1 && process.env.NODE_ENV === 'development') {
            console.warn(`⚠️ CLS detected: ${cls.toFixed(3)} (should be < 0.1)`);
          }
        }
      });
    });

    observer.observe({ 
      entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] 
    });

    return () => observer.disconnect();
  }, [enableConsoleLogging, thresholdWarnings]);

  /**
   * Monitor resource loading performance and navigation timing
   * Tracks slow resources and calculates TTFB and FCP metrics
   */
  const monitorResourcePerformance = useCallback(() => {
    if (!window.performance) return;

    // Monitor resource loading
    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resource = entry as PerformanceResourceTiming;
          
          if (enableConsoleLogging && resource.duration > 1000 && process.env.NODE_ENV === 'development') {
            console.warn(`🐌 Slow resource: ${resource.name} took ${resource.duration.toFixed(0)}ms`);
          }
        }
      });
    });

    resourceObserver.observe({ entryTypes: ['resource'] });

    // Get navigation timing metrics
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const ttfb = navigation.responseStart - navigation.requestStart;
      const fcp = navigation.domContentLoadedEventEnd - navigation.fetchStart;
      
      setMetrics(prev => ({ ...prev, ttfb, fcp }));
      
      if (enableConsoleLogging && process.env.NODE_ENV === 'development') {
        console.log(`📊 TTFB: ${ttfb.toFixed(0)}ms`);
        console.log(`📊 FCP: ${fcp.toFixed(0)}ms`);
      }
      
      if (thresholdWarnings && process.env.NODE_ENV === 'development') {
        if (ttfb > 600) {
          console.warn(`⚠️ TTFB is slow: ${ttfb.toFixed(0)}ms (should be < 600ms)`);
        }
        if (fcp > 1800) {
          console.warn(`⚠️ FCP is slow: ${fcp.toFixed(0)}ms (should be < 1.8s)`);
        }
      }
    }

    return () => resourceObserver.disconnect();
  }, [enableConsoleLogging, thresholdWarnings]);

  /**
   * Send performance metrics to analytics services
   * Supports PostHog and Google Analytics integration
   */
  const sendMetricsToAnalytics = useCallback((metrics: PerformanceMetrics) => {
    if (!enableRealUserMonitoring) return;

    // Send to PostHog or other analytics
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('performance_metrics', {
        lcp: metrics.lcp,
        fid: metrics.fid,
        cls: metrics.cls,
        ttfb: metrics.ttfb,
        fcp: metrics.fcp,
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    }

    // Send to Google Analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_metrics', {
        event_category: 'Performance',
        event_label: window.location.href,
        value: Math.round((metrics.lcp || 0) + (metrics.fid || 0) * 10 + (metrics.cls || 0) * 1000)
      });
    }
  }, [enableRealUserMonitoring]);

  /**
   * Monitor long tasks that block the main thread
   * Long tasks over 50ms can cause poor user experience
   */
  const monitorLongTasks = useCallback(() => {
    if (!window.PerformanceObserver) return;

    const longTaskObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (entry.entryType === 'longtask') {
          const longTask = entry as any;
          
          if (enableConsoleLogging && process.env.NODE_ENV === 'development') {
            console.warn(`🚨 Long task detected: ${longTask.duration.toFixed(0)}ms`);
          }
          
          if (thresholdWarnings && longTask.duration > 50 && process.env.NODE_ENV === 'development') {
            console.error(`❌ Main thread blocked for ${longTask.duration.toFixed(0)}ms`);
          }
        }
      });
    });

    longTaskObserver.observe({ entryTypes: ['longtask'] });

    return () => longTaskObserver.disconnect();
  }, [enableConsoleLogging, thresholdWarnings]);

  useEffect(() => {
    const cleanup = [
      monitorWebVitals(),
      monitorResourcePerformance(),
      monitorLongTasks()
    ].filter(Boolean);

    return () => {
      cleanup.forEach(fn => fn && fn());
    };
  }, [monitorWebVitals, monitorResourcePerformance, monitorLongTasks]);

  // Send metrics to analytics when they change
  useEffect(() => {
    if (Object.values(metrics).some(m => m !== null)) {
      sendMetricsToAnalytics(metrics);
    }
  }, [metrics, sendMetricsToAnalytics]);

  // Development mode: show metrics in console
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && enableConsoleLogging) {
      const interval = setInterval(() => {
        const hasMetrics = Object.values(metrics).some(m => m !== null);
        if (hasMetrics) {
          console.group('📊 Performance Metrics');
          console.table(metrics);
          console.groupEnd();
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [metrics, enableConsoleLogging]);

  return null;
}

/**
 * Hook for accessing performance metrics in components
 * Provides current Core Web Vitals and navigation timing metrics
 * @returns PerformanceMetrics object with current values
 */
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    fcp: null
  });

  useEffect(() => {
    const updateMetrics = () => {
      if (window.performance) {
        // Get current metrics from performance API
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          setMetrics(prev => ({
            ...prev,
            ttfb: navigation.responseStart - navigation.requestStart,
            fcp: navigation.domContentLoadedEventEnd - navigation.fetchStart
          }));
        }
      }
    };

    updateMetrics();
    window.addEventListener('load', updateMetrics);
    
    return () => window.removeEventListener('load', updateMetrics);
  }, []);

  return metrics;
}
