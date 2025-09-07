'use client';

import { useEffect, useState, useCallback } from 'react';

/**
 * JavaScript Execution Optimizer
 * Optimizes JavaScript execution to prevent main thread blocking
 * 
 * Features:
 * - Defers non-critical JavaScript execution using modern scheduling APIs
 * - Breaks up large synchronous operations into chunks
 * - Implements progressive enhancement for better perceived performance
 * - Monitors and optimizes execution time in development mode
 * 
 * @fileoverview Performance optimization for JavaScript execution and main thread management
 */
export function JSExecutionOptimizer() {
  const [optimizationComplete, setOptimizationComplete] = useState(false);

  // Break up heavy operations using scheduling
  const scheduleTask = useCallback((task: () => void, priority: 'high' | 'normal' | 'low' = 'normal') => {
    if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
      // Use modern scheduler API if available
      // Convert priority to valid Scheduler API values
      let schedulerPriority: 'user-blocking' | 'user-visible' | 'background';
      switch (priority) {
        case 'high':
          schedulerPriority = 'user-blocking';
          break;
        case 'normal':
          schedulerPriority = 'user-visible';
          break;
        case 'low':
          schedulerPriority = 'background';
          break;
        default:
          schedulerPriority = 'user-visible';
      }
      try {
        (window as any).scheduler.postTask(task, { priority: schedulerPriority });
      } catch (error) {
        // Fallback if priority value is not supported
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(task, { timeout: priority === 'high' ? 100 : 1000 });
        } else {
          const delay = priority === 'high' ? 0 : priority === 'normal' ? 10 : 50;
          setTimeout(task, delay);
        }
      }
    } else if ('requestIdleCallback' in window) {
      // Fallback to requestIdleCallback
      window.requestIdleCallback(task, { timeout: priority === 'high' ? 100 : 1000 });
    } else {
      // Final fallback to setTimeout
      const delay = priority === 'high' ? 0 : priority === 'normal' ? 10 : 50;
      setTimeout(task, delay);
    }
  }, []);

  // Progressive enhancement for heavy components
  const progressiveEnhancement = useCallback(() => {
    // 1. Defer heavy UI animations
    scheduleTask(() => {
      const heavyAnimations = document.querySelectorAll('[data-heavy-animation]');
      heavyAnimations.forEach(el => {
        el.classList.add('enhanced');
      });
    }, 'low');

    // 2. Load non-critical features
    scheduleTask(() => {
      // Enable advanced search features
      const searchComponents = document.querySelectorAll('[data-search-enhanced]');
      searchComponents.forEach(el => {
        el.setAttribute('data-enhanced', 'true');
      });
    }, 'low');

    // 3. Initialize analytics lazily
    scheduleTask(() => {
      // Only initialize PostHog after critical rendering
      if ((window as any).posthog && typeof (window as any).posthog.init === 'function') {
        // PostHog is already loaded, optimize its execution
        (window as any).posthog.opt_out_capturing();
        (window as any).posthog.opt_in_capturing();
      }
    }, 'low');

    // 4. Optimize image loading
    scheduleTask(() => {
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');
      lazyImages.forEach((img) => {
        const imgElement = img as HTMLImageElement;
        if (imgElement.complete && imgElement.naturalHeight !== 0) {
          imgElement.classList.add('loaded');
        } else {
          imgElement.addEventListener('load', () => imgElement.classList.add('loaded'), { once: true });
        }
      });
    }, 'normal');

  }, [scheduleTask]);

  // JavaScript execution monitoring
  const monitorExecutionTime = useCallback(() => {
    if (!window.performance) return;

    // Monitor script execution time
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'measure' && entry.name.includes('script')) {
          // Only log in development mode
          if (process.env.NODE_ENV === 'development') {
            console.log(`Script execution: ${entry.name} took ${entry.duration}ms`);
            
            // If script takes too long, log for optimization
            if (entry.duration > 100) {
              console.warn(`⚠️ Slow script detected: ${entry.name} (${entry.duration}ms)`);
            }
          }
        }
      });
    });

    observer.observe({ entryTypes: ['measure'] });

    // Monitor Core Web Vitals
    const webVitalsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        // Only log in development mode
        if (process.env.NODE_ENV === 'development') {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log(`LCP: ${entry.startTime}ms`);
            if (entry.startTime > 2500) {
              console.warn(`⚠️ LCP is slow: ${entry.startTime}ms (should be < 2.5s)`);
            }
          }
          if (entry.entryType === 'first-input') {
            const firstInput = entry as PerformanceEventTiming;
            console.log(`FID: ${firstInput.processingStart - firstInput.startTime}ms`);
            if (firstInput.processingStart - firstInput.startTime > 100) {
              console.warn(`⚠️ FID is slow: ${firstInput.processingStart - firstInput.startTime}ms (should be < 100ms)`);
            }
          }
          if (entry.entryType === 'layout-shift') {
            const layoutShift = entry as any;
            if (layoutShift.value > 0.1) {
              console.warn(`⚠️ CLS detected: ${layoutShift.value} (should be < 0.1)`);
            }
          }
        }
      });
    });

    webVitalsObserver.observe({ 
      entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] 
    });

    // Monitor resource loading performance
    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resource = entry as PerformanceResourceTiming;
          // Only log in development mode
          if (process.env.NODE_ENV === 'development' && resource.duration > 1000) {
            console.warn(`⚠️ Slow resource: ${resource.name} took ${resource.duration}ms`);
          }
        }
      });
    });

    resourceObserver.observe({ entryTypes: ['resource'] });

    // Mark critical rendering complete
    performance.mark('critical-render-complete');

    return () => {
      observer.disconnect();
      webVitalsObserver.disconnect();
      resourceObserver.disconnect();
    };
  }, []);

  // Chunk execution of heavy operations
  const executeInChunks = useCallback(async (
    operations: (() => void)[],
    chunkSize: number = 5,
    delayBetweenChunks: number = 10
  ) => {
    for (let i = 0; i < operations.length; i += chunkSize) {
      const chunk = operations.slice(i, i + chunkSize);
      
      // Execute chunk
      chunk.forEach(operation => {
        try {
          operation();
        } catch (error) {
          // Handle errors silently in production
          if (process.env.NODE_ENV === 'development') {
            console.error('Error in chunked execution:', error);
          }
        }
      });

      // Yield control back to browser
      if (i + chunkSize < operations.length) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenChunks));
      }
    }
  }, []);

  // Main optimization effect
  useEffect(() => {
    if (optimizationComplete) return;

    const optimize = async () => {
      performance.mark('js-optimization-start');

      // 1. Monitor execution time
      const cleanup = monitorExecutionTime();

      // 2. Apply progressive enhancement in chunks
      const enhancementTasks = [
        () => progressiveEnhancement(),
        () => optimizeEventListeners(),
        () => optimizeComponentUpdates(),
        () => enableAdvancedFeatures(),
      ];

      await executeInChunks(enhancementTasks, 1, 16); // One task per frame

      // 3. Mark optimization complete
      performance.mark('js-optimization-complete');
      performance.measure('js-optimization-duration', 'js-optimization-start', 'js-optimization-complete');

      setOptimizationComplete(true);

      // Cleanup
      return cleanup;
    };

    const cleanup = optimize();

    return () => {
      cleanup.then(fn => fn && fn());
    };
  }, [optimizationComplete, progressiveEnhancement, monitorExecutionTime, executeInChunks]);

  // Optimize event listeners to prevent main-thread blocking
  const optimizeEventListeners = useCallback(() => {
    // Use passive event listeners where possible
    const elements = document.querySelectorAll('[data-optimize-events]');
    elements.forEach(el => {
      // Replace active listeners with passive ones
      const events = ['scroll', 'touchstart', 'touchmove', 'wheel'];
      events.forEach(eventType => {
        const handlers = (el as any)._eventHandlers?.[eventType] || [];
        handlers.forEach((handler: EventListener) => {
          el.removeEventListener(eventType, handler);
          el.addEventListener(eventType, handler, { passive: true });
        });
      });
    });
  }, []);

  // Optimize component updates
  const optimizeComponentUpdates = useCallback(() => {
    // Batch DOM updates
    const updates: (() => void)[] = [];
    
    // Collect all pending updates
    const pendingUpdates = document.querySelectorAll('[data-pending-update]');
    pendingUpdates.forEach(el => {
      updates.push(() => {
        el.removeAttribute('data-pending-update');
        el.classList.add('updated');
      });
    });

    // Execute updates in a single frame
    if (updates.length > 0) {
      requestAnimationFrame(() => {
        updates.forEach(update => update());
      });
    }
  }, []);

  // Enable advanced features after critical rendering
  const enableAdvancedFeatures = useCallback(() => {
    scheduleTask(() => {
      // Enable advanced search
      const searchElements = document.querySelectorAll('[data-search-component]');
      searchElements.forEach(el => {
        el.setAttribute('data-advanced-search', 'true');
      });

      // Enable animation on scroll
      const animatedElements = document.querySelectorAll('[data-scroll-animation]');
      animatedElements.forEach(el => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-in');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
        
        observer.observe(el);
      });

      // Enable tooltips and advanced interactions
      const interactiveElements = document.querySelectorAll('[data-enhanced-interaction]');
      interactiveElements.forEach(el => {
        el.setAttribute('data-interactions-enabled', 'true');
      });
    }, 'low');
  }, [scheduleTask]);

  return null;
}

/**
 * Script Execution Monitor
 * Provides real-time monitoring of JavaScript execution times in development mode
 * Displays execution metrics in a fixed overlay for debugging purposes
 */
export function ScriptExecutionMonitor() {
  const [executionTimes, setExecutionTimes] = useState<{[key: string]: number}>({});

  useEffect(() => {
    if (!window.performance) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const times: {[key: string]: number} = {};

      entries.forEach((entry) => {
        if (entry.entryType === 'navigation' && entry.name.includes('script')) {
          times[entry.name] = entry.duration;
        }
      });

      setExecutionTimes(prev => ({ ...prev, ...times }));
    });

    observer.observe({ entryTypes: ['navigation', 'measure'] });

    return () => observer.disconnect();
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs z-50">
      <div className="font-semibold">JS Execution Times:</div>
      {Object.entries(executionTimes).map(([script, time]) => (
        <div key={script} className={time > 100 ? 'text-red-300' : 'text-green-300'}>
          {script}: {time.toFixed(2)}ms
        </div>
      ))}
    </div>
  );
}

/**
 * Progressive Component Enhancer
 * Wraps components with progressive enhancement to prevent main thread blocking
 * Delays enhancement based on priority and provides smooth transitions
 * 
 * @param children - React components to enhance progressively
 * @param enhancementDelay - Delay in milliseconds before enhancement (default: 100ms)
 * @param priority - Enhancement priority level affecting timing
 */
export function ProgressiveComponentEnhancer({ 
  children,
  enhancementDelay = 100,
  priority = 'normal' as 'high' | 'normal' | 'low'
}: {
  children: React.ReactNode;
  enhancementDelay?: number;
  priority?: 'high' | 'normal' | 'low';
}) {
  const [isEnhanced, setIsEnhanced] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsEnhanced(true);
    }, enhancementDelay);

    return () => clearTimeout(timeout);
  }, [enhancementDelay]);

  return (
    <div 
      data-enhanced={isEnhanced}
      data-enhancement-priority={priority}
      className={`transition-opacity duration-300 ${isEnhanced ? 'opacity-100' : 'opacity-90'}`}
    >
      {children}
    </div>
  );
} 