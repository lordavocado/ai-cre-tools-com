"use client"

import { AlertTriangle, RefreshCw, Clock } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface SheetsErrorFallbackProps {
  error: Error;
  reset?: () => void;
  showRetryButton?: boolean;
}

export function SheetsErrorFallback({ 
  error, 
  reset, 
  showRetryButton = true 
}: SheetsErrorFallbackProps) {
  const isQuotaError = error.message.includes('429') || 
                      error.message.includes('Quota exceeded') ||
                      error.message.includes('rate limit');
  
  const isNetworkError = error.message.includes('Failed to load') ||
                        error.message.includes('network') ||
                        error.message.includes('fetch');

  return (
    <div className="container mx-auto py-16 px-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-8 w-8 text-orange-500" />
            <div>
              <h2 className="text-2xl font-bold">
                {isQuotaError ? "Service Temporarily Unavailable" : "Unable to Load Data"}
              </h2>
              <p className="text-muted-foreground">
                {isQuotaError 
                  ? "We're experiencing high traffic. Please try again in a few minutes."
                  : "There was an issue connecting to our data source."
                }
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {isQuotaError && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertTitle>API Rate Limit Reached</AlertTitle>
              <AlertDescription>
                Our Google Sheets integration has temporarily reached its usage limit. 
                This helps ensure reliable service for all users. The limit resets every minute, 
                so please try refreshing the page in a moment.
              </AlertDescription>
            </Alert>
          )}

          {isNetworkError && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Connection Issue</AlertTitle>
              <AlertDescription>
                Unable to connect to our data source. Please check your internet connection 
                and try again.
              </AlertDescription>
            </Alert>
          )}

          {!isQuotaError && !isNetworkError && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>
                {error.message || "An unexpected error occurred while loading the data."}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold">What you can do:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {isQuotaError ? (
                <>
                  <li>• Wait 1-2 minutes and refresh the page</li>
                  <li>• The service will be restored automatically</li>
                  <li>• Try again during off-peak hours for faster response</li>
                </>
              ) : (
                <>
                  <li>• Check your internet connection</li>
                  <li>• Refresh the page to try again</li>
                  <li>• Contact support if the issue persists</li>
                </>
              )}
            </ul>
          </div>

          {showRetryButton && reset && (
            <div className="flex justify-center pt-4">
              <Button 
                onClick={reset} 
                variant="outline" 
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 