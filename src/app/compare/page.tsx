"use client"; // This page needs client-side state management for selections

import { useState, useEffect } from "react";
import type { DirectoryItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RotateCcw, BarChart3, ExternalLink, Star, Brain, Plus, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import Link from "next/link";
import { ItemSelector } from "@/components/compare/ItemSelector";

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

  // Comparison fields to display
  const comparisonFields = [
    { key: 'name', label: 'Tool Name', type: 'name' },
    { key: 'tagline', label: 'One-liner', type: 'text' },
    { key: 'website', label: 'Website', type: 'link' },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'key_features', label: 'Key Features', type: 'features' },
    { key: 'bestFor', label: 'Best For', type: 'text' },
    { key: 'pricing', label: 'Pricing', type: 'text' },
    { key: 'rating', label: 'Rating', type: 'rating' },
  ];

  const renderCellContent = (item: DirectoryItem | null, field: any) => {
    if (!item) {
      return <span className="text-muted-foreground italic">-</span>;
    }

    switch (field.type) {
      case 'name':
        return (
          <div className="flex items-center gap-3">
            {item.imageUrl && (
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={32}
                height={32}
                className="rounded-md object-cover h-8 w-8"
              />
            )}
            <div>
              <Link 
                href={`/${item.slug}`} 
                className="font-semibold hover:text-primary hover:underline transition-colors"
              >
                {item.name}
              </Link>
            </div>
          </div>
        );
      case 'link':
        return item.website ? (
          <Link 
            href={item.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center gap-1"
          >
            Visit Site <ExternalLink className="h-3 w-3" />
          </Link>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      case 'features':
        return item.features && item.features.length > 0 ? (
          <div className="space-y-1">
            {item.features.slice(0, 3).map((feature, idx) => (
              <div key={idx} className="text-sm bg-muted/50 px-2 py-1 rounded">
                {feature.name}
              </div>
            ))}
            {item.features.length > 3 && (
              <div className="text-xs text-muted-foreground">
                +{item.features.length - 3} more
              </div>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      case 'rating':
        return item.rating ? (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="font-semibold">{item.rating.toFixed(1)}/5</span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      default:
        const value = item[field.key as keyof DirectoryItem];
        return value && typeof value === 'string' ? value : <span className="text-muted-foreground">-</span>;
    }
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

        {/* Feature Comparison Section */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="border-b bg-gradient-to-r from-background to-muted/30">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-2xl md:text-3xl">Feature Comparison</CardTitle>
                <CardDescription className="text-base mt-1">
                  Select tools above and compare their features, pricing, and capabilities • {allItems.length} tools available
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

            {/* Comparison Table */}
            {selectedItems.length > 0 ? (
              <div className="overflow-x-auto">
                <Table className="min-w-[800px]">
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="sticky left-0 bg-muted/80 backdrop-blur-sm z-10 w-1/4 min-w-[200px] border-r font-bold">
                        Feature
                      </TableHead>
                      {Array(3).fill(null).map((_, index) => (
                        <TableHead key={index} className="text-center w-1/4 min-w-[250px] p-4">
                          {selectedItems[index] ? (
                            <div className="font-semibold">Tool {index + 1}</div>
                          ) : (
                            <div className="text-muted-foreground italic">Tool {index + 1}</div>
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  
                  <TableBody>
                    {comparisonFields.map((field) => (
                      <TableRow key={field.key} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium sticky left-0 bg-background/95 backdrop-blur-sm z-10 border-r py-4">
                          {field.label}
                        </TableCell>
                        {Array(3).fill(null).map((_, index) => (
                          <TableCell key={`${index}-${field.key}`} className="py-4 px-4">
                            {renderCellContent(selectedItems[index] || null, field)}
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
                  Select analytics tools above to see their detailed comparison across all features.
                </p>
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
