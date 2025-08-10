'use client';

import { useEffect, useCallback, useState } from 'react';

interface PerformanceMetrics {
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
  fcp: number | null;
}

interface PerformanceMonitorProps {
  enableConsoleLogging?: boolean;
  enableRealUserMonitoring?: boolean;
  thresholdWarnings?: boolean;
}

export function PerformanceMonitor({
  enableConsoleLogging = true,
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
          
          if (enableConsoleLogging) {
            console.log(`📊 LCP: ${lcp.toFixed(0)}ms`);
          }
          
          if (thresholdWarnings && lcp > 2500) {
            console.warn(`⚠️ LCP is slow: ${lcp.toFixed(0)}ms (should be < 2.5s)`);
          }
        }
        
        if (entry.entryType === 'first-input') {
          const fid = entry.processingStart - entry.startTime;
          setMetrics(prev => ({ ...prev, fid }));
          
          if (enableConsoleLogging) {
            console.log(`📊 FID: ${fid.toFixed(0)}ms`);
          }
          
          if (thresholdWarnings && fid > 100) {
            console.warn(`⚠️ FID is slow: ${fid.toFixed(0)}ms (should be < 100ms)`);
          }
        }
        
        if (entry.entryType === 'layout-shift') {
          const layoutShift = entry as any;
          const cls = layoutShift.value;
          setMetrics(prev => ({ ...prev, cls }));
          
          if (enableConsoleLogging) {
            console.log(`📊 CLS: ${cls.toFixed(3)}`);
          }
          
          if (thresholdWarnings && cls > 0.1) {
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

  // Monitor resource loading and navigation timing
  const monitorResourcePerformance = useCallback(() => {
    if (!window.performance) return;

    // Monitor resource loading
    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resource = entry as PerformanceResourceTiming;
          
          if (enableConsoleLogging && resource.duration > 1000) {
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
      
      if (enableConsoleLogging) {
        console.log(`📊 TTFB: ${ttfb.toFixed(0)}ms`);
        console.log(`📊 FCP: ${fcp.toFixed(0)}ms`);
      }
      
      if (thresholdWarnings) {
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

  // Real User Monitoring - send metrics to analytics
  const sendMetricsToAnalytics = useCallback((metrics: PerformanceMetrics) => {
    if (!enableRealUserMonitoring) return;

    // Send to PostHog or other analytics
    if (window.posthog) {
      window.posthog.capture('performance_metrics', {
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
    if (window.gtag) {
      window.gtag('event', 'performance_metrics', {
        event_category: 'Performance',
        event_label: window.location.href,
        value: Math.round((metrics.lcp || 0) + (metrics.fid || 0) * 10 + (metrics.cls || 0) * 1000)
      });
    }
  }, [enableRealUserMonitoring]);

  // Monitor long tasks that block the main thread
  const monitorLongTasks = useCallback(() => {
    if (!window.PerformanceObserver) return;

    const longTaskObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (entry.entryType === 'longtask') {
          const longTask = entry as any;
          
          if (enableConsoleLogging) {
            console.warn(`🚨 Long task detected: ${longTask.duration.toFixed(0)}ms`);
          }
          
          if (thresholdWarnings && longTask.duration > 50) {
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

  return null; // This component doesn't render anything
}

// Hook for accessing performance metrics in components
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
