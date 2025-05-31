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
    // Create a new array with up to maxSelection slots
    const newSelection = Array(maxSelection).fill(null);
    
    // Copy existing items to their positions
    selectedItems.forEach((selectedItem, index) => {
      if (index < maxSelection && selectedItem) {
        newSelection[index] = selectedItem;
      }
    });
    
    // Place the new item in the current slot
    newSelection[slotIndex] = item;
    
    // Convert to a clean array without null values for the parent component
    const cleanedSelection = newSelection.filter(item => item !== null);
    
    onSelectionChange(cleanedSelection);
    setOpen(false);
  };

  const handleRemove = () => {
    // Create a new array and remove the item from this slot
    const newSelection = [...selectedItems];
    newSelection.splice(slotIndex, 1);
    
    onSelectionChange(newSelection);
  };

  // Filter out items already selected in any slot
  const availableItems = allItems.filter(
    item => !selectedItems.some(selItem => selItem?.id === item.id)
  );

  return (
    <div className="flex flex-col items-center gap-2 p-4 border rounded-lg bg-card min-h-[180px] justify-center hover:shadow-sm transition-shadow">
      {currentItemInSlot ? (
        <div className="text-center w-full">
          <div className="w-16 h-16 mx-auto mb-2 rounded-md bg-background flex items-center justify-center">
            <Image
              src={currentItemInSlot.imageUrl || "/product-analytics-tools-logo.png"}
              alt={currentItemInSlot.name}
              width={64}
              height={64}
              className="rounded-md object-contain h-16 w-16"
              data-ai-hint="product logo"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/product-analytics-tools-logo.png";
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
              className="w-full justify-between text-muted-foreground hover:bg-muted/50"
            >
              Select Tool...
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Search tool..." />
              <CommandList>
                <CommandEmpty>No tool found.</CommandEmpty>
                <CommandGroup>
                  {availableItems.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.name}
                      onSelect={() => handleSelect(item)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-sm bg-background flex items-center justify-center shrink-0">
                          <Image 
                            src={item.imageUrl || "/product-analytics-tools-logo.png"} 
                            alt={item.name} 
                            width={24} 
                            height={24} 
                            className="rounded-sm h-6 w-6 object-contain" 
                            data-ai-hint="tiny logo"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/product-analytics-tools-logo.png";
                            }}
                          />
                        </div>
                        <span className="truncate">{item.name}</span>
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
