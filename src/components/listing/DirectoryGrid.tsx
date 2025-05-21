
import type { DirectoryItem } from "@/types";
import { DirectoryItemCard } from "./DirectoryItemCard";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DirectoryGridProps {
  items: DirectoryItem[];
}

export function DirectoryGrid({ items }: DirectoryGridProps) {
  if (items.length === 0) {
    return (
      <Alert className="mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Tools Found</AlertTitle>
        <AlertDescription>
          We couldn't find any tools matching your criteria. Try adjusting your search or filters.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <DirectoryItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
