import type { DirectoryItem } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ExternalLink, Star, Brain, BarChart3 } from "lucide-react";
import { useMemo } from "react";

interface ComparisonTableProps {
  items: DirectoryItem[];
  aiSuggestions?: string[];
}

// Get all unique features from all items to create dynamic feature matrix
const getAllAvailableFeatures = (allItems: DirectoryItem[]): string[] => {
  const featureSet = new Set<string>();
  
  allItems.forEach(item => {
    if (item.features) {
      item.features.forEach(feature => {
        featureSet.add(feature.name);
      });
    }
  });
  
  return Array.from(featureSet).sort();
};

// Check if a tool has a specific feature
const hasFeature = (item: DirectoryItem, featureName: string): boolean => {
  if (!item.features) return false;
  
  return item.features.some(feature => 
    feature.name === featureName
  );
};

export function ComparisonTable({ items, aiSuggestions }: ComparisonTableProps) {
  const maxSlots = 3;

  // Get all available features from selected items (or show message if no items selected)
  const availableFeatures = useMemo(() => {
    if (items.length === 0) return [];
    
    // For now, get features from selected items only
    // If you want to show all possible features, you'd need to pass allItems as a prop
    const featureSet = new Set<string>();
    items.forEach(item => {
      if (item.features) {
        item.features.forEach(feature => {
          featureSet.add(feature.name);
        });
      }
    });
    
    return Array.from(featureSet).sort();
  }, [items]);

  return (
    <Card className="mt-8 shadow-xl border-0 bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="border-b bg-gradient-to-r from-background to-muted/30">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-primary" />
          <div>
            <CardTitle className="text-2xl md:text-3xl">Feature Comparison</CardTitle>
            <CardDescription className="text-base mt-1">
              {items.length > 0 
                ? `Comparing ${items.length} selected tools across ${availableFeatures.length} features` 
                : 'Select tools above to see their features compared side by side'
              }
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Ready to Compare Tools?</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Select analytics tools above to see their detailed comparison information.
            </p>
          </div>
        )}
        
        {/* Additional Info Section - Only show when items are selected */}
        {items.length > 0 && (
          <div className="p-6 border-t bg-muted/20">
            <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
            <div className="grid gap-4">
              {/* Ratings Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="font-medium">Overall Rating</div>
                {Array(maxSlots).fill(null).map((_, index) => {
                  const item = items[index];
                  return (
                    <div key={`rating-${index}`} className="text-center">
                      {item?.rating ? (
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="font-semibold">{item.rating.toFixed(1)}/5</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Best For Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="font-medium">Best For</div>
                {Array(maxSlots).fill(null).map((_, index) => {
                  const item = items[index];
                  return (
                    <div key={`bestfor-${index}`} className="text-center text-sm">
                      {item?.bestFor || <span className="text-muted-foreground">-</span>}
                    </div>
                  );
                })}
              </div>

              {/* Pricing Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="font-medium">Pricing</div>
                {Array(maxSlots).fill(null).map((_, index) => {
                  const item = items[index];
                  return (
                    <div key={`pricing-${index}`} className="text-center text-sm">
                      {item?.pricing || <span className="text-muted-foreground">-</span>}
                    </div>
                  );
                })}
              </div>

              {/* Category Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="font-medium">Category</div>
                {Array(maxSlots).fill(null).map((_, index) => {
                  const item = items[index];
                  return (
                    <div key={`category-${index}`} className="text-center text-sm">
                      {item?.category || <span className="text-muted-foreground">-</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      {aiSuggestions && aiSuggestions.length > 0 && items.length >= 2 && (
        <CardFooter className="flex-col items-start gap-4 pt-6 border-t bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
          <div className="w-full">
            <h3 className="text-lg font-semibold flex items-center mb-3">
              <Brain className="mr-2 h-5 w-5 text-primary" /> 
              AI-Powered Insights
            </h3>
            <div className="grid gap-3">
              {aiSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-background/80 border">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-medium text-primary">{index + 1}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{suggestion}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground italic mt-4 text-center">
              💡 AI suggestions are generated based on the tools' actual features and data. Always verify information with official sources.
            </p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
