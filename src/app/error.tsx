"use client"

import { useEffect } from "react";
import { SheetsErrorFallback } from "@/components/sheets/SheetsErrorFallback";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  // Check if this is a Google Sheets related error
  const isSheetsError = error.message.includes('Google Sheet') ||
                       error.message.includes('Quota exceeded') ||
                       error.message.includes('sheets.googleapis.com') ||
                       error.message.includes('429');

  if (isSheetsError) {
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
      <button
        onClick={reset}
        className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  );
} 