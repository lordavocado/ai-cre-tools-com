'use client';

import { useEffect, useState, useCallback } from 'react';

/**
 * JavaScript Execution Optimizer
 * 
 * Addresses the 4.1s JavaScript execution time by:
 * 1. Deferring non-critical JavaScript execution
 * 2. Breaking up large synchronous operations
 * 3. Using progressive enhancement
 * 4. Monitoring and optimizing execution time
 */
export function JSExecutionOptimizer() {
  const [optimizationComplete, setOptimizationComplete] = useState(false);

  // Break up heavy operations using scheduling
  const scheduleTask = useCallback((task: () => void, priority: 'high' | 'normal' | 'low' = 'normal') => {
    if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
      // Use modern scheduler API if available
      (window as any).scheduler.postTask(task, { priority });
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
      if (window.posthog && typeof window.posthog.init === 'function') {
        // PostHog is already loaded, optimize its execution
        window.posthog.opt_out_capturing();
        window.posthog.opt_in_capturing();
      }
    }, 'low');

    // 4. Optimize image loading
    scheduleTask(() => {
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');
      lazyImages.forEach((img: HTMLImageElement) => {
        if (img.complete && img.naturalHeight !== 0) {
          img.classList.add('loaded');
        } else {
          img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
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
          console.log(`Script execution: ${entry.name} took ${entry.duration}ms`);
          
          // If script takes too long, log for optimization
          if (entry.duration > 100) {
            console.warn(`⚠️ Slow script detected: ${entry.name} (${entry.duration}ms)`);
          }
        }
      });
    });

    observer.observe({ entryTypes: ['measure'] });

    // Mark critical rendering complete
    performance.mark('critical-render-complete');

    return () => observer.disconnect();
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
          console.error('Error in chunked execution:', error);
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

  return null; // This component doesn't render anything
}

/**
 * Script Execution Monitor
 * Provides real-time monitoring of JavaScript execution times
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
 * Enhances components progressively to avoid blocking the main thread
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