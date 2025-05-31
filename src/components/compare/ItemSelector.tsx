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
    const newSelection = [...selectedItems];
    
    // Place the item in the current slot
    newSelection[slotIndex] = item;
    
    // Remove any undefined slots and ensure we don't exceed maxSelection
    const filteredSelection = newSelection.filter(Boolean).slice(0, maxSelection);
    
    onSelectionChange(filteredSelection);
    setOpen(false);
  };

  const handleRemove = () => {
    const newSelection = selectedItems.filter((_, index) => index !== slotIndex);
    onSelectionChange(newSelection);
  };

  // Filter out items already selected in OTHER slots
  const availableItems = allItems.filter(
    item => !selectedItems.some((selItem, idx) => selItem?.id === item.id && idx !== slotIndex)
  );

  return (
    <div className="flex flex-col items-center gap-2 p-4 border rounded-lg bg-card min-h-[180px] justify-center hover:shadow-sm transition-shadow">
      {currentItemInSlot ? (
        <div className="text-center w-full">
          {currentItemInSlot.imageUrl && (
            <Image
              src={currentItemInSlot.imageUrl}
              alt={currentItemInSlot.name}
              width={64}
              height={64}
              className="mx-auto mb-2 rounded-md object-cover h-16 w-16"
              data-ai-hint="product logo"
            />
          )}
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
                        {item.imageUrl && (
                           <Image src={item.imageUrl} alt={item.name} width={24} height={24} className="rounded-sm h-6 w-6 object-cover" data-ai-hint="tiny logo"/>
                        )}
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
