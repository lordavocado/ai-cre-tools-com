
"use client"; // This page needs client-side state management for selections

import { useState, useEffect, useMemo } from "react";
import type { DirectoryItem } from "@/types";
import { ItemSelector } from "@/components/compare/ItemSelector";
import { ComparisonTable } from "@/components/compare/ComparisonTable";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";

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

  const handleSelectionChange = (newSelectedItems: DirectoryItem[]) => {
    setSelectedItems(newSelectedItems);
  };

  const handleReset = () => {
    setSelectedItems([]);
    setAiSuggestions([]);
  };

  const itemSelectors = useMemo(() => {
    return Array(3).fill(null).map((_, index) => (
      <ItemSelector
        key={index}
        slotIndex={index}
        allItems={allItems}
        selectedItems={selectedItems}
        onSelectionChange={handleSelectionChange}
      />
    ));
  }, [allItems, selectedItems]); // eslint-disable-line react-hooks/exhaustive-deps 
  // onSelectionChange can be memoized if needed, but for now this is fine.

  if (loading) {
    return (
      <div className="container py-12 md:py-16">
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
        </div>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }


  return (
    <div className="container py-12 md:py-16 pl-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Compare {siteConfig.categoryName} Side-by-Side
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select up to 3 {siteConfig.categoryName.toLowerCase()} from our directory to see a detailed comparison of their features, pricing, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        {itemSelectors}
      </div>

      <div className="text-center mb-8">
        <Button onClick={handleReset} variant="outline" disabled={selectedItems.length === 0}>
          <RotateCcw className="mr-2 h-4 w-4" /> Reset Comparison
        </Button>
      </div>
      
      <ComparisonTable items={selectedItems} aiSuggestions={loadingAISuggestions ? ["Loading AI suggestions..."] : aiSuggestions} />
    </div>
  );
}
