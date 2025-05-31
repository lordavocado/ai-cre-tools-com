"use client"; // This page needs client-side state management for selections

import { useState, useEffect, useMemo } from "react";
import type { DirectoryItem } from "@/types";
import { ItemSelector } from "@/components/compare/ItemSelector";
import { ComparisonTable } from "@/components/compare/ComparisonTable";
import { ComparisonSidebar } from "@/components/compare/ComparisonSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RotateCcw, Zap, Gift, Crown, Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";

// Comparison categories
const COMPARISON_CATEGORIES = [
  {
    id: 'custom',
    name: 'Custom Comparison',
    description: 'Compare any tools of your choice',
    icon: Zap,
    color: 'default' as const
  },
  {
    id: 'free',
    name: 'Free Tools Comparison',
    description: 'Compare the best free analytics tools',
    icon: Gift,
    color: 'green' as const
  },
  {
    id: 'enterprise',
    name: 'Enterprise Solutions',
    description: 'Compare enterprise-grade analytics platforms',
    icon: Building2,
    color: 'purple' as const
  },
  {
    id: 'premium',
    name: 'Premium Tools',
    description: 'Compare premium analytics solutions',
    icon: Crown,
    color: 'yellow' as const
  }
];

export default function ComparePageClient() {
  const [allItems, setAllItems] = useState<DirectoryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<DirectoryItem[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAISuggestions, setLoadingAISuggestions] = useState(false);
  const [activeCategory, setActiveCategory] = useState('custom');

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
    // Fetch AI suggestions when selectedItems change (at least 2 items)
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

  // Filter items based on category
  const filteredItems = useMemo(() => {
    switch (activeCategory) {
      case 'free':
        return allItems.filter(item => 
          item.pricing?.toLowerCase().includes('free') || 
          item.pricing?.toLowerCase().includes('$0') ||
          item.tags?.some(tag => tag.toLowerCase().includes('free'))
        );
      case 'enterprise':
        return allItems.filter(item => 
          item.tags?.some(tag => tag.toLowerCase().includes('enterprise')) ||
          item.category?.includes('enterprise') ||
          item.bestFor?.toLowerCase().includes('enterprise')
        );
      case 'premium':
        return allItems.filter(item => {
          const pricing = item.pricing?.toLowerCase() || '';
          return pricing.includes('$') && !pricing.includes('free') && !pricing.includes('$0');
        });
      default:
        return allItems;
    }
  }, [allItems, activeCategory]);

  const handleSelectionChange = (newSelectedItems: DirectoryItem[]) => {
    setSelectedItems(newSelectedItems);
  };

  const handleReset = () => {
    setSelectedItems([]);
    setAiSuggestions([]);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSelectedItems([]); // Reset selections when changing category
    setAiSuggestions([]);
  };

  const itemSelectors = useMemo(() => {
    return Array(3).fill(null).map((_, index) => (
      <ItemSelector
        key={`${activeCategory}-${index}`}
        slotIndex={index}
        allItems={filteredItems}
        selectedItems={selectedItems}
        onSelectionChange={handleSelectionChange}
      />
    ));
  }, [filteredItems, selectedItems, activeCategory]);

  if (loading) {
    return (
      <div className="flex min-h-screen">
        {/* Sidebar Skeleton */}
        <div className="hidden lg:block w-80 border-r bg-muted/30">
          <div className="sticky top-0 h-screen p-6">
            <Skeleton className="h-8 w-3/4 mb-6" />
            <div className="space-y-4">
              {Array(8).fill(null).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content Skeleton */}
        <div className="flex-1 container py-12 md:py-16">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
          </div>
          <Skeleton className="h-12 w-full mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Skeleton className="h-40 rounded-lg" />
            <Skeleton className="h-40 rounded-lg" />
            <Skeleton className="h-40 rounded-lg" />
          </div>
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </div>
    );
  }

  const currentCategory = COMPARISON_CATEGORIES.find(cat => cat.id === activeCategory);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Static Sidebar */}
      <ComparisonSidebar selectedItems={selectedItems} />
      
      {/* Main Content */}
      <div className="flex-1 container py-8 md:py-12 lg:pl-6 xl:pl-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            Compare {siteConfig.categoryName} Side-by-Side
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Select comparison type and up to 3 {siteConfig.categoryName.toLowerCase()} to see a detailed comparison of their features, pricing, and more.
          </p>
        </div>

        {/* Category Selection */}
        <div className="mb-6 border rounded-lg p-6 bg-muted/30">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              {currentCategory && <currentCategory.icon className="h-5 w-5 text-primary" />}
              Comparison Categories
            </h2>
            <p className="text-sm text-muted-foreground">
              Choose a comparison type to filter tools and get targeted insights
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {COMPARISON_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              
              return (
                <Button
                  key={category.id}
                  variant={isActive ? "default" : "outline"}
                  className={`h-auto p-4 flex flex-col items-start gap-2 text-left transition-all ${
                    isActive ? "ring-2 ring-primary ring-offset-2 shadow-md" : "hover:shadow-sm"
                  }`}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <Icon className="h-4 w-4" />
                    <span className="font-semibold text-sm">{category.name}</span>
                    <Badge 
                      variant={isActive ? "secondary" : "outline"} 
                      className="ml-auto text-xs h-5"
                    >
                      {category.id === 'custom' ? allItems.length : filteredItems.length}
                    </Badge>
                  </div>
                  <p className="text-xs opacity-80 text-left leading-relaxed">
                    {category.description}
                  </p>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Tool Selection */}
        <div className="mb-6 border rounded-lg p-6 bg-muted/30">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Select Tools to Compare</h2>
            <p className="text-sm text-muted-foreground">
              {currentCategory ? (
                <>
                  <currentCategory.icon className="inline h-4 w-4 mr-1" />
                  {currentCategory.description} • {filteredItems.length} tools available
                </>
              ) : (
                `Choose up to 3 tools from ${allItems.length} available options`
              )}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {itemSelectors}
          </div>
          
          <div className="flex justify-center mt-6">
            <Button 
              onClick={handleReset} 
              variant="outline" 
              disabled={selectedItems.length === 0}
              className="gap-2 hover:shadow-sm"
            >
              <RotateCcw className="h-4 w-4" /> 
              Reset Comparison
            </Button>
          </div>
        </div>
        
        {/* Comparison Results */}
        <ComparisonTable 
          items={selectedItems} 
          aiSuggestions={loadingAISuggestions ? ["Loading AI suggestions..."] : aiSuggestions}
          category={activeCategory}
        />
      </div>
    </div>
  );
}
