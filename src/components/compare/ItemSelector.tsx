"use client";

import type { DirectoryItem } from "@/types";
import { useState, useEffect } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, PlusCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ItemSelectorProps {
  allItems: DirectoryItem[];
  selectedItems: DirectoryItem[];
  onSelectionChange: (newSelectedItems: DirectoryItem[]) => void;
  maxSelection?: number;
  slotIndex: number; // To identify which selector this is (0, 1, or 2)
}

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

export function ItemSelector({
  allItems,
  selectedItems,
  onSelectionChange,
  maxSelection = 3,
  slotIndex,
}: ItemSelectorProps) {
  const [open, setOpen] = useState(false);
  const currentItemInSlot = selectedItems[slotIndex];

  const handleSelect = (item: DirectoryItem) => {
    console.log('Selecting item:', item.name, 'for slot:', slotIndex); // Debug log
    
    // Create a new array with the selected items
    const newSelection = [...selectedItems];
    
    // Add the item to the correct slot, extending the array if needed
    while (newSelection.length <= slotIndex) {
      newSelection.push(null as any);
    }
    newSelection[slotIndex] = item;
    
    // Remove any null/undefined values and ensure we don't exceed maxSelection
    const cleanedSelection = newSelection.filter(item => item != null).slice(0, maxSelection);
    
    console.log('New selection:', cleanedSelection); // Debug log
    onSelectionChange(cleanedSelection);
    setOpen(false);
  };

  const handleRemove = () => {
    console.log('Removing item from slot:', slotIndex); // Debug log
    
    // Create a new array and remove the item from this slot
    const newSelection = selectedItems.filter((_, index) => index !== slotIndex);
    
    console.log('After removal:', newSelection); // Debug log
    onSelectionChange(newSelection);
  };

  // Filter out items already selected in any slot
  const availableItems = allItems.filter(
    item => !selectedItems.some(selItem => selItem?.id === item.id)
  );

  console.log('Available items for slot', slotIndex, ':', availableItems.length, 'out of', allItems.length); // Debug log

  return (
    <div className="flex flex-col items-center gap-2 p-4 border rounded-lg bg-card min-h-[180px] justify-center hover:shadow-sm transition-shadow">
      {currentItemInSlot ? (
        <div className="text-center w-full">
          <div className="w-16 h-16 mx-auto mb-2 rounded-md bg-background flex items-center justify-center">
            <Image
              src={getItemIcon(currentItemInSlot)}
              alt={currentItemInSlot.name}
              width={64}
              height={64}
              className="rounded-md object-contain h-16 w-16"
              data-ai-hint="product logo"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                // Try favicon fallback first, then final fallback
                if (target.src !== getFaviconUrl(currentItemInSlot.website) && currentItemInSlot.website) {
                  target.src = getFaviconUrl(currentItemInSlot.website);
                } else {
                  target.src = "/product-analytics-tools-logo.png";
                }
              }}
            />
          </div>
          <p className="font-semibold text-sm truncate w-full" title={currentItemInSlot.name}>{currentItemInSlot.name}</p>
          <p className="text-xs text-muted-foreground truncate w-full" title={currentItemInSlot.tagline}>{currentItemInSlot.tagline}</p>
          <Button variant="ghost" size="sm" onClick={handleRemove} className="mt-2 text-destructive hover:text-destructive-foreground hover:bg-destructive">
            <XCircle className="mr-1 h-4 w-4" /> Remove
          </Button>
        </div>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between hover:bg-muted/50"
            >
              <span className="text-foreground">Select Tool...</span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search tool..." />
              <CommandList>
                <CommandEmpty>
                  {allItems.length === 0 ? "Loading tools..." : "No tool found."}
                </CommandEmpty>
                <CommandGroup>
                  {availableItems.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.name}
                      onSelect={() => handleSelect(item)}
                      className="flex items-center justify-between cursor-pointer hover:bg-accent"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-sm bg-background flex items-center justify-center shrink-0">
                          <Image 
                            src={getItemIcon(item)}
                            alt={item.name} 
                            width={24} 
                            height={24} 
                            className="rounded-sm h-6 w-6 object-contain" 
                            data-ai-hint="tiny logo"
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
                        </div>
                        <span className="truncate text-foreground">{item.name}</span>
                      </div>
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          currentItemInSlot?.id === item.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
