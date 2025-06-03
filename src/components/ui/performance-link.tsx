'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface PerformanceLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean;
  preloadOnHover?: boolean;
}

/**
 * Performance-optimized Link component
 * 
 * - Preloads heavy routes only on hover
 * - Reduces initial JavaScript bundle size
 * - Improves Core Web Vitals scores
 */
export function PerformanceLink({ 
  href, 
  children, 
  className, 
  prefetch = false,
  preloadOnHover = true,
  ...props 
}: PerformanceLinkProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  // Heavy routes that should be lazy-loaded
  const heavyRoutes = ['/compare', '/admin', '/guides'];
  const isHeavyRoute = heavyRoutes.some(route => href.startsWith(route));

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (preloadOnHover && isHeavyRoute) {
      // Preload the route when user hovers
      router.prefetch(href);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Link
      href={href}
      className={className}
      prefetch={isHeavyRoute ? false : prefetch} // Don't prefetch heavy routes by default
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </Link>
  );
} 