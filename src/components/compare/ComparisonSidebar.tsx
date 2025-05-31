"use client";

import type { DirectoryItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Star, 
  DollarSign, 
  Zap, 
  ThumbsUp, 
  ThumbsDown, 
  Tag, 
  Calendar,
  CheckCircle2,
  Info,
  BarChart3
} from "lucide-react";
import Image from "next/image";

interface ComparisonSidebarProps {
  selectedItems: DirectoryItem[];
}

const COMPARISON_FEATURES = [
  {
    id: 'rating',
    label: 'Rating & Reviews',
    icon: Star,
    description: 'User ratings and review counts'
  },
  {
    id: 'pricing',
    label: 'Pricing',
    icon: DollarSign,
    description: 'Cost structure and plans'
  },
  {
    id: 'features',
    label: 'Key Features',
    icon: Zap,
    description: 'Core functionality and capabilities'
  },
  {
    id: 'pros',
    label: 'Advantages',
    icon: ThumbsUp,
    description: 'Strengths and benefits'
  },
  {
    id: 'cons',
    label: 'Limitations',
    icon: ThumbsDown,
    description: 'Weaknesses and drawbacks'
  },
  {
    id: 'category',
    label: 'Category',
    icon: Tag,
    description: 'Tool classification'
  },
  {
    id: 'founded',
    label: 'Founded Year',
    icon: Calendar,
    description: 'Company establishment date'
  },
  {
    id: 'bestFor',
    label: 'Best For',
    icon: CheckCircle2,
    description: 'Ideal use cases'
  }
];

export function ComparisonSidebar({ selectedItems }: ComparisonSidebarProps) {
  return (
    <div className="hidden lg:block w-80 border-r bg-background">
      <div className="sticky top-0 h-screen">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Comparison Guide
              </h2>
              <p className="text-sm text-muted-foreground">
                Track selections & comparison points
              </p>
            </div>

            {/* Selected Tools */}
            <div className="border rounded-lg p-4 bg-muted/30">
              <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                Selected Tools ({selectedItems.length}/3)
              </h3>
              <div className="space-y-3">
                {selectedItems.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="text-muted-foreground text-sm">
                      No tools selected yet
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Choose up to 3 tools to compare
                    </div>
                  </div>
                ) : (
                  selectedItems.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-background border hover:shadow-sm transition-all">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-md bg-background flex items-center justify-center">
                          <Image
                            src={item.imageUrl || "/product-analytics-tools-logo.png"}
                            alt={item.name}
                            width={32}
                            height={32}
                            className="rounded-md object-contain h-8 w-8"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/product-analytics-tools-logo.png";
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {item.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {item.tagline}
                        </div>
                      </div>
                      <Badge variant="default" className="text-xs h-6 w-6 rounded-full p-0 flex items-center justify-center">
                        {index + 1}
                      </Badge>
                    </div>
                  ))
                )}
                
                {/* Add placeholder slots */}
                {Array(3 - selectedItems.length).fill(null).map((_, index) => (
                  <div key={`placeholder-${index}`} className="flex items-center gap-3 p-3 rounded-lg border-2 border-dashed border-muted hover:border-muted-foreground/50 transition-colors">
                    <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                      <span className="text-xs text-muted-foreground font-medium">
                        {selectedItems.length + index + 1}
                      </span>
                    </div>
                    <div className="flex-1 text-sm text-muted-foreground">
                      Select tool #{selectedItems.length + index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison Features */}
            <div className="border rounded-lg p-4 bg-muted/30">
              <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                Comparison Points
              </h3>
              <div className="space-y-2">
                {COMPARISON_FEATURES.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-background/80 transition-colors">
                      <div className="flex-shrink-0 mt-0.5">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">
                          {feature.label}
                        </div>
                        <div className="text-xs text-muted-foreground leading-relaxed">
                          {feature.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Info */}
            <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200/50 dark:border-blue-800/50">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-1">
                    AI-Powered Insights
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                    Get intelligent comparisons and recommendations when you select 2+ tools
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
} 