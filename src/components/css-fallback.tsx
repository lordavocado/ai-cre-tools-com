'use client';

import { useEffect, useState } from 'react';

/**
 * CSS Fallback Component
 * Detects CSS loading failures and provides inline fallback styles
 */
export function CSSFallback() {
  const [cssLoaded, setCssLoaded] = useState(false);
  const [fallbackActive, setFallbackActive] = useState(false);

  useEffect(() => {
    // Check if Tailwind CSS is loaded by testing a known class
    function checkCSSLoaded() {
      const testEl = document.createElement('div');
      testEl.className = 'flex items-center justify-center';
      testEl.style.visibility = 'hidden';
      testEl.style.position = 'absolute';
      document.body.appendChild(testEl);
      
      const computedStyle = window.getComputedStyle(testEl);
      const isFlexLoaded = computedStyle.display === 'flex';
      const isAlignLoaded = computedStyle.alignItems === 'center';
      
      document.body.removeChild(testEl);
      
      if (isFlexLoaded && isAlignLoaded) {
        setCssLoaded(true);
        document.documentElement.classList.add('css-loaded');
      } else {
        setFallbackActive(true);
        console.warn('CSS failed to load, activating fallback styles');
      }
    }

    // Initial check
    setTimeout(checkCSSLoaded, 100);

    // Recheck after 1 second if still not loaded
    const fallbackTimer = setTimeout(() => {
      if (!cssLoaded) {
        checkCSSLoaded();
      }
    }, 1000);

    return () => clearTimeout(fallbackTimer);
  }, [cssLoaded]);

  // If CSS is loaded properly, don't render anything
  if (cssLoaded) return null;

  // Render fallback CSS if main CSS failed to load
  if (fallbackActive) {
    return (
      <style dangerouslySetInnerHTML={{
        __html: `
          /* CSS Fallback Styles */
          .fallback-active {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif !important;
            line-height: 1.6 !important;
            color: #111827 !important;
            background-color: #ffffff !important;
          }
          
          /* Layout utilities */
          .container { max-width: 1200px !important; margin: 0 auto !important; padding: 0 1rem !important; }
          .flex { display: flex !important; }
          .flex-col { flex-direction: column !important; }
          .flex-row { flex-direction: row !important; }
          .items-center { align-items: center !important; }
          .items-start { align-items: flex-start !important; }
          .justify-center { justify-content: center !important; }
          .justify-between { justify-content: space-between !important; }
          .justify-start { justify-content: flex-start !important; }
          .gap-1 { gap: 0.25rem !important; }
          .gap-2 { gap: 0.5rem !important; }
          .gap-4 { gap: 1rem !important; }
          .gap-6 { gap: 1.5rem !important; }
          .gap-8 { gap: 2rem !important; }
          
          /* Spacing */
          .p-2 { padding: 0.5rem !important; }
          .p-4 { padding: 1rem !important; }
          .p-6 { padding: 1.5rem !important; }
          .p-8 { padding: 2rem !important; }
          .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
          .px-6 { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
          .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
          .py-4 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
          .py-8 { padding-top: 2rem !important; padding-bottom: 2rem !important; }
          .m-2 { margin: 0.5rem !important; }
          .m-4 { margin: 1rem !important; }
          .mx-auto { margin-left: auto !important; margin-right: auto !important; }
          .mt-4 { margin-top: 1rem !important; }
          .mt-6 { margin-top: 1.5rem !important; }
          .mb-4 { margin-bottom: 1rem !important; }
          .mb-8 { margin-bottom: 2rem !important; }
          
          /* Sizing */
          .w-full { width: 100% !important; }
          .w-auto { width: auto !important; }
          .h-auto { height: auto !important; }
          .min-h-screen { min-height: 100vh !important; }
          .max-w-4xl { max-width: 56rem !important; }
          .max-w-6xl { max-width: 72rem !important; }
          .flex-1 { flex: 1 1 0% !important; }
          
          /* Position */
          .relative { position: relative !important; }
          .absolute { position: absolute !important; }
          .fixed { position: fixed !important; }
          
          /* Background and borders */
          .bg-white { background-color: #ffffff !important; }
          .bg-gray-50 { background-color: #f9fafb !important; }
          .bg-gray-100 { background-color: #f3f4f6 !important; }
          .bg-blue-50 { background-color: #eff6ff !important; }
          .bg-blue-600 { background-color: #2563eb !important; }
          .border { border: 1px solid #d1d5db !important; }
          .border-gray-200 { border-color: #e5e7eb !important; }
          .rounded { border-radius: 0.375rem !important; }
          .rounded-lg { border-radius: 0.5rem !important; }
          .rounded-xl { border-radius: 0.75rem !important; }
          
          /* Text */
          .text-xs { font-size: 0.75rem !important; line-height: 1rem !important; }
          .text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
          .text-base { font-size: 1rem !important; line-height: 1.5rem !important; }
          .text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
          .text-xl { font-size: 1.25rem !important; line-height: 1.75rem !important; }
          .text-2xl { font-size: 1.5rem !important; line-height: 2rem !important; }
          .text-3xl { font-size: 1.875rem !important; line-height: 2.25rem !important; }
          .text-4xl { font-size: 2.25rem !important; line-height: 2.5rem !important; }
          .font-medium { font-weight: 500 !important; }
          .font-semibold { font-weight: 600 !important; }
          .font-bold { font-weight: 700 !important; }
          .text-center { text-align: center !important; }
          .text-left { text-align: left !important; }
          .text-gray-600 { color: #4b5563 !important; }
          .text-gray-700 { color: #374151 !important; }
          .text-gray-800 { color: #1f2937 !important; }
          .text-gray-900 { color: #111827 !important; }
          .text-white { color: #ffffff !important; }
          .text-blue-600 { color: #2563eb !important; }
          
          /* Buttons */
          .btn-base {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 0.5rem 1rem !important;
            border-radius: 0.375rem !important;
            font-size: 0.875rem !important;
            font-weight: 500 !important;
            transition: all 0.2s ease !important;
            cursor: pointer !important;
            border: none !important;
            text-decoration: none !important;
          }
          .btn-primary {
            background-color: #2563eb !important;
            color: #ffffff !important;
          }
          .btn-primary:hover {
            background-color: #1d4ed8 !important;
          }
          .btn-secondary {
            background-color: #f3f4f6 !important;
            color: #374151 !important;
            border: 1px solid #d1d5db !important;
          }
          .btn-secondary:hover {
            background-color: #e5e7eb !important;
          }
          
          /* Cards */
          .card {
            background-color: #ffffff !important;
            border: 1px solid #e5e7eb !important;
            border-radius: 0.5rem !important;
            padding: 1.5rem !important;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1) !important;
          }
          
          /* Grid */
          .grid { display: grid !important; }
          .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
          .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
          
          /* Responsive */
          @media (min-width: 640px) {
            .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
            .sm\\:px-6 { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
          }
          @media (min-width: 768px) {
            .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
            .md\\:px-8 { padding-left: 2rem !important; padding-right: 2rem !important; }
            .md\\:text-xl { font-size: 1.25rem !important; line-height: 1.75rem !important; }
          }
          @media (min-width: 1024px) {
            .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
            .lg\\:px-8 { padding-left: 2rem !important; padding-right: 2rem !important; }
          }
          
          /* Apply fallback class to body */
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif !important;
            line-height: 1.6 !important;
            color: #111827 !important;
            background-color: #ffffff !important;
          }
          
          /* Show fallback notice */
          .css-fallback-notice {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            background-color: #fbbf24 !important;
            color: #92400e !important;
            padding: 0.5rem !important;
            text-align: center !important;
            font-size: 0.875rem !important;
            z-index: 9999 !important;
          }
        `
      }} />
    );
  }

  return null;
}

/**
 * CSS Loading Monitor
 * Shows loading state until CSS is fully loaded
 */
export function CSSLoadingMonitor() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkLoaded = () => {
      const testEl = document.createElement('div');
      testEl.className = 'flex';
      document.body.appendChild(testEl);
      const loaded = window.getComputedStyle(testEl).display === 'flex';
      document.body.removeChild(testEl);
      
      if (loaded) {
        setIsLoaded(true);
        document.documentElement.classList.add('css-loaded');
      }
    };

    checkLoaded();
    
    // Keep checking every 100ms until loaded
    const interval = setInterval(() => {
      if (!isLoaded) {
        checkLoaded();
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isLoaded]);

  if (isLoaded) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      fontSize: '1rem',
      color: '#374151'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #f3f4f6', 
          borderTop: '4px solid #2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }} />
        Loading styles...
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `
        }} />
      </div>
    </div>
  );
}