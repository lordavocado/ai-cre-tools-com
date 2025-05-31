"use client"; // This page needs client-side state management for selections

import { useState, useEffect } from "react";
import type { DirectoryItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RotateCcw, BarChart3, ExternalLink, Star, Brain, CheckCircle2, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import Link from "next/link";
import { ItemSelector } from "@/components/compare/ItemSelector";

// Comprehensive list of analytics features to check for
const ANALYTICS_FEATURES = [
  "Real-time Analytics",
  "Custom Events",
  "Funnel Analysis", 
  "Cohort Analysis",
  "User Segmentation",
  "A/B Testing",
  "Heat Maps",
  "Session Recordings",
  "Conversion Tracking",
  "Attribution Modeling",
  "Custom Dashboards",
  "API Access",
  "Data Export",
  "Mobile Analytics",
  "E-commerce Tracking",
  "Goal Setting",
  "User Journey Mapping",
  "Predictive Analytics",
  "Behavioral Analytics",
  "Cross-platform Tracking"
];

// Helper function to get favicon URL from website
const getFaviconUrl = (website: string): string => {
  if (!website) return "/product-analytics-tools-logo.png";
  
  try {
    // Clean up the website URL
    let cleanUrl = website;
    if (!cleanUrl.startsWith('http')) {
      cleanUrl = `https://${cleanUrl}`;
    }
    
    const domain = new URL(cleanUrl).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return "/product-analytics-tools-logo.png";
  }
};

// Helper function to get the best available icon
const getItemIcon = (item: DirectoryItem): string => {
  // First try the provided imageUrl
  if (item.imageUrl && item.imageUrl !== "/product-analytics-tools-logo.png") {
    return item.imageUrl;
  }
  
  // Fallback to favicon from website
  if (item.website) {
    return getFaviconUrl(item.website);
  }
  
  // Final fallback
  return "/product-analytics-tools-logo.png";
};

export default function ComparePageClient() {
  const [allItems, setAllItems] = useState<DirectoryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<DirectoryItem[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAISuggestions, setLoadingAISuggestions] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch('/api/sheets?type=items');
        const items = await response.json();
        setAllItems(items);
      } catch (error) {
        console.error("Failed to fetch directory items:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchAISuggestions() {
      if (selectedItems.length >= 2) {
        setLoadingAISuggestions(true);
        try {
          const itemIds = selectedItems.map(item => item.id).join(',');
          const response = await fetch(`/api/sheets?type=ai-suggestions&itemIds=${itemIds}`);
          const suggestions = await response.json();
          setAiSuggestions(suggestions);
        } catch (error) {
          console.error("Failed to fetch AI suggestions:", error);
          setAiSuggestions(["Error fetching AI suggestions."]);
        } finally {
          setLoadingAISuggestions(false);
        }
      } else {
        setAiSuggestions([]);
      }
    }
    fetchAISuggestions();
  }, [selectedItems]);

  const handleSelectionChange = (newSelectedItems: DirectoryItem[]) => {
    setSelectedItems(newSelectedItems);
  };

  const handleReset = () => {
    setSelectedItems([]);
    setAiSuggestions([]);
  };

  // Check if a tool has a specific feature
  const hasFeature = (item: DirectoryItem, featureName: string): boolean => {
    if (!item.features) return false;
    
    return item.features.some(feature => {
      const normalizedFeature = feature.name.toLowerCase().trim();
      const normalizedTarget = featureName.toLowerCase().trim();
      
      // Exact match
      if (normalizedFeature === normalizedTarget) return true;
      
      // Partial matches for common variations
      if (normalizedTarget.includes('real-time') && normalizedFeature.includes('real')) return true;
      if (normalizedTarget.includes('custom events') && (normalizedFeature.includes('event') || normalizedFeature.includes('custom'))) return true;
      if (normalizedTarget.includes('funnel') && normalizedFeature.includes('funnel')) return true;
      if (normalizedTarget.includes('cohort') && normalizedFeature.includes('cohort')) return true;
      if (normalizedTarget.includes('segmentation') && normalizedFeature.includes('segment')) return true;
      if (normalizedTarget.includes('a/b testing') && (normalizedFeature.includes('a/b') || normalizedFeature.includes('test'))) return true;
      if (normalizedTarget.includes('heat') && normalizedFeature.includes('heat')) return true;
      if (normalizedTarget.includes('recording') && normalizedFeature.includes('record')) return true;
      if (normalizedTarget.includes('conversion') && normalizedFeature.includes('conversion')) return true;
      if (normalizedTarget.includes('attribution') && normalizedFeature.includes('attribution')) return true;
      if (normalizedTarget.includes('dashboard') && normalizedFeature.includes('dashboard')) return true;
      if (normalizedTarget.includes('api') && normalizedFeature.includes('api')) return true;
      if (normalizedTarget.includes('export') && normalizedFeature.includes('export')) return true;
      if (normalizedTarget.includes('mobile') && normalizedFeature.includes('mobile')) return true;
      if (normalizedTarget.includes('e-commerce') && (normalizedFeature.includes('ecommerce') || normalizedFeature.includes('e-commerce'))) return true;
      if (normalizedTarget.includes('goal') && normalizedFeature.includes('goal')) return true;
      if (normalizedTarget.includes('journey') && normalizedFeature.includes('journey')) return true;
      if (normalizedTarget.includes('predictive') && normalizedFeature.includes('predictive')) return true;
      if (normalizedTarget.includes('behavioral') && normalizedFeature.includes('behavior')) return true;
      if (normalizedTarget.includes('cross-platform') && (normalizedFeature.includes('cross') || normalizedFeature.includes('platform'))) return true;
      
      return false;
    });
  };

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto py-12 md:py-16 px-6">
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </div>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto py-8 md:py-12 px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Compare {siteConfig.categoryName}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Select up to 3 tools and get a comprehensive side-by-side feature comparison
          </p>
        </div>

        {/* Feature Matrix Section */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="border-b bg-gradient-to-r from-background to-muted/30">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-2xl md:text-3xl">Feature Matrix</CardTitle>
                <CardDescription className="text-base mt-1">
                  Compare analytics capabilities across tools • {allItems.length} tools available
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {/* Tool Selection */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {Array(3).fill(null).map((_, index) => (
                  <ItemSelector
                    key={index}
                    slotIndex={index}
                    allItems={allItems}
                    selectedItems={selectedItems}
                    onSelectionChange={handleSelectionChange}
                  />
                ))}
              </div>
              
              {/* Selection Status */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant={selectedItems.length > 0 ? "default" : "outline"} className="h-8 px-3">
                    {selectedItems.length}/3 Selected
                  </Badge>
                  {selectedItems.length > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {selectedItems.map(item => item.name).join(', ')}
                    </span>
                  )}
                </div>
                <Button 
                  onClick={handleReset} 
                  variant="outline" 
                  disabled={selectedItems.length === 0}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" /> 
                  Reset Selection
                </Button>
              </div>
            </div>

            {/* Feature Matrix Table */}
            {selectedItems.length > 0 ? (
              <div className="overflow-x-auto">
                <Table className="min-w-[800px]">
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="sticky left-0 bg-muted/80 backdrop-blur-sm z-10 w-1/4 min-w-[200px] border-r font-bold">
                        Features
                      </TableHead>
                      {selectedItems.map((item, index) => (
                        <TableHead key={item.id} className="text-center w-1/4 min-w-[250px] p-4">
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-2">
                              <Image
                                src={getItemIcon(item)}
                                alt={item.name}
                                width={24}
                                height={24}
                                className="rounded object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  // Try favicon fallback first, then final fallback
                                  if (target.src !== getFaviconUrl(item.website) && item.website) {
                                    target.src = getFaviconUrl(item.website);
                                  } else {
                                    target.src = "/product-analytics-tools-logo.png";
                                  }
                                }}
                              />
                              <span className="font-semibold">{item.name}</span>
                            </div>
                            {item.rating && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                <span>{item.rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  
                  <TableBody>
                    {ANALYTICS_FEATURES.map((feature) => (
                      <TableRow key={feature} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium sticky left-0 bg-background/95 backdrop-blur-sm z-10 border-r py-4">
                          {feature}
                        </TableCell>
                        {selectedItems.map((item) => (
                          <TableCell key={`${item.id}-${feature}`} className="py-4 px-4 text-center">
                            {hasFeature(item, feature) ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-400 mx-auto" />
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ready to Compare?</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Select analytics tools above to see their detailed feature comparison matrix.
                </p>
              </div>
            )}

            {/* Additional Info Section - Only show when tools are selected */}
            {selectedItems.length > 0 && (
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                <div className="overflow-x-auto">
                  <Table className="min-w-[800px]">
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="sticky left-0 bg-muted/80 backdrop-blur-sm z-10 w-1/4 min-w-[200px] border-r font-bold">
                          Details
                        </TableHead>
                        {selectedItems.map((item) => (
                          <TableHead key={item.id} className="text-center w-1/4 min-w-[250px] p-4 font-semibold">
                            {item.name}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    
                    <TableBody>
                      <TableRow className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium sticky left-0 bg-background/95 backdrop-blur-sm z-10 border-r py-4">
                          Category
                        </TableCell>
                        {selectedItems.map((item) => (
                          <TableCell key={`${item.id}-category`} className="py-4 px-4 text-center">
                            <Badge variant="outline">{item.category}</Badge>
                          </TableCell>
                        ))}
                      </TableRow>
                      
                      <TableRow className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium sticky left-0 bg-background/95 backdrop-blur-sm z-10 border-r py-4">
                          Pricing
                        </TableCell>
                        {selectedItems.map((item) => (
                          <TableCell key={`${item.id}-pricing`} className="py-4 px-4 text-center">
                            <span className="text-sm text-green-600 font-semibold">
                              {item.pricing || 'Not specified'}
                            </span>
                          </TableCell>
                        ))}
                      </TableRow>
                      
                      <TableRow className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium sticky left-0 bg-background/95 backdrop-blur-sm z-10 border-r py-4">
                          Best For
                        </TableCell>
                        {selectedItems.map((item) => (
                          <TableCell key={`${item.id}-bestfor`} className="py-4 px-4 text-center">
                            <span className="text-sm">
                              {item.bestFor || 'General analytics'}
                            </span>
                          </TableCell>
                        ))}
                      </TableRow>
                      
                      <TableRow className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium sticky left-0 bg-background/95 backdrop-blur-sm z-10 border-r py-4">
                          Website
                        </TableCell>
                        {selectedItems.map((item) => (
                          <TableCell key={`${item.id}-website`} className="py-4 px-4 text-center">
                            {item.website ? (
                              <Link 
                                href={item.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline flex items-center justify-center gap-1"
                              >
                                Visit Site <ExternalLink className="h-3 w-3" />
                              </Link>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>

          {/* AI Suggestions */}
          {aiSuggestions && aiSuggestions.length > 0 && selectedItems.length >= 2 && (
            <div className="border-t bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 p-6">
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
          )}
        </Card>
      </div>
    </div>
  );
}
