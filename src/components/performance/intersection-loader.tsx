'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface IntersectionLoaderProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  className?: string;
}

/**
 * Intersection Observer Loader for Main-Thread Optimization
 * 
 * Only loads children when they come into viewport, reducing initial JavaScript execution.
 * Perfect for heavy components that are below the fold.
 */
export function IntersectionLoader({
  children,
  fallback,
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true,
  className = '',
}: IntersectionLoaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasLoaded(true);
          
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  const defaultFallback = (
    <div className={`flex items-center justify-center p-8 min-h-[200px] ${className}`}>
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400 mx-auto mb-2" />
        <p className="text-sm text-slate-500">Loading content...</p>
      </div>
    </div>
  );

  return (
    <div ref={ref} className={className}>
      {(isVisible || hasLoaded) ? children : (fallback || defaultFallback)}
    </div>
  );
}

/**
 * Hook for intersection observer functionality
 */
export function useIntersectionObserver({
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
} = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isVisible] as const;
}

/**
 * Lazy component loader with intersection observer
 */
export function withIntersectionLoading<T extends React.ComponentType<any>>(
  Component: T,
  options: {
    fallback?: ReactNode;
    threshold?: number;
    rootMargin?: string;
  } = {}
) {
  return function IntersectionLoadedComponent(props: React.ComponentProps<T>) {
    const [ref, isVisible] = useIntersectionObserver({
      threshold: options.threshold,
      rootMargin: options.rootMargin,
    });

    const defaultFallback = (
      <div className="flex items-center justify-center p-8 min-h-[200px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-500">Loading component...</p>
        </div>
      </div>
    );

    return (
      <div ref={ref as React.RefObject<HTMLDivElement>}>
        {isVisible ? <Component {...props} /> : (options.fallback || defaultFallback)}
      </div>
    );
  };
} 