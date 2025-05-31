"use client"

import { ReactNode, useEffect, useState } from "react";
import { SheetsErrorFallback } from "./SheetsErrorFallback";

interface SheetsDataWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorInfo {
  error: Error;
  timestamp: number;
}

export function SheetsDataWrapper({ 
  children, 
  fallback 
}: SheetsDataWrapperProps) {
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);

  // Reset error after 2 minutes (quota limits reset every minute)
  useEffect(() => {
    if (errorInfo) {
      const timer = setTimeout(() => {
        setErrorInfo(null);
      }, 2 * 60 * 1000); // 2 minutes

      return () => clearTimeout(timer);
    }
  }, [errorInfo]);

  const resetError = () => {
    setErrorInfo(null);
    // Optionally refresh the page to reload data
    window.location.reload();
  };

  if (errorInfo) {
    return fallback || (
      <SheetsErrorFallback 
        error={errorInfo.error} 
        reset={resetError}
      />
    );
  }

  return <>{children}</>;
}

// Error catching hook for use in async components
export function useSheetsErrorHandler() {
  const [error, setError] = useState<Error | null>(null);

  const handleError = (error: Error) => {
    console.error('Sheets data error:', error);
    setError(error);
  };

  const resetError = () => {
    setError(null);
  };

  return { error, handleError, resetError };
} 