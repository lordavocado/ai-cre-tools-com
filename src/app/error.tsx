"use client"

import { useEffect, useState } from "react";
import { SheetsErrorFallback } from "@/components/sheets/SheetsErrorFallback";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [resetCount, setResetCount] = useState(0);
  const [isInfiniteLoop, setIsInfiniteLoop] = useState(false);

  useEffect(() => {
    // Detect potential infinite re-render loops
    if (resetCount > 3) {
      setIsInfiniteLoop(true);
      console.error('🚨 Potential infinite loop detected. Disabling auto-retry.');
    }
  }, [resetCount]);

  const handleReset = () => {
    if (isInfiniteLoop) {
      // Force page reload instead of component reset
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
      return;
    }
    setResetCount(prev => prev + 1);
    reset();
  };
  useEffect(() => {
    // Log the error with more context for debugging
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Application Error Details');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Error digest:', error.digest);
      console.error('Full error object:', error);
      console.groupEnd();
    } else {
      // In production, log minimal error info
      console.error('Application error:', error.message, { digest: error.digest });
    }
  }, [error]);

  // Check if this is a database related error (Supabase or legacy Google Sheets)
  const isDatabaseError = error.message.includes('Google Sheet') ||
                         error.message.includes('Quota exceeded') ||
                         error.message.includes('sheets.googleapis.com') ||
                         error.message.includes('429') ||
                         error.message.includes('Supabase') ||
                         error.message.includes('not properly configured') ||
                         error.message.includes('NEXT_PUBLIC_SUPABASE_URL');

  if (isDatabaseError) {
    return (
      <SheetsErrorFallback 
        error={error} 
        reset={reset}
      />
    );
  }

  // Generic error fallback for other errors
  return (
    <div className="container mx-auto py-16 px-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-muted-foreground mb-6">
        An unexpected error occurred. Please try again.
      </p>
      <div className="space-y-2">
        <button
          onClick={handleReset}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          {isInfiniteLoop ? 'Reload Page' : 'Try again'}
        </button>
        {resetCount > 0 && !isInfiniteLoop && (
          <p className="text-sm text-muted-foreground">
            Retry attempt: {resetCount}/3
          </p>
        )}
        {isInfiniteLoop && (
          <p className="text-sm text-red-600">
            Multiple errors detected. Click to reload the page.
          </p>
        )}
      </div>
    </div>
  );
} 