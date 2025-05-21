
import type { DirectoryItem } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, XCircle, ExternalLink, Star, DollarSign, Zap, Brain } from "lucide-react";

interface ComparisonTableProps {
  items: DirectoryItem[];
  aiSuggestions?: string[];
}

const FeatureRow: React.FC<{ label: string; values: (string | number | undefined | string[])[] }> = ({ label, values }) => (
  <TableRow>
    <TableHead className="font-semibold text-foreground sticky left-0 bg-background/95 z-10 w-1/4 min-w-[150px]">{label}</TableHead>
    {values.map((value, index) => (
      <TableCell key={index} className="text-sm">
        {Array.isArray(value) ? (
          <ul className="list-disc list-inside space-y-1">
            {value.map((v, i) => <li key={i}>{v || '-'}</li>)}
          </ul>
        ) : typeof value === 'boolean' ? (
          value ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
        ) : (
          value || '-'
        )}
      </TableCell>
    ))}
  </TableRow>
);


export function ComparisonTable({ items, aiSuggestions }: ComparisonTableProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>Select up to 3 tools using the selectors above to compare them.</p>
      </div>
    );
  }

  const maxItems = 3; // Ensure table structure supports up to 3 items even if fewer are selected
  const displayItems = [...items];
  while (displayItems.length < maxItems) {
    displayItems.push({} as DirectoryItem); // Push empty objects for placeholder columns
  }


  const featuresToCompare = [
    { label: "Rating", getValue: (item: DirectoryItem) => item.rating ? `${item.rating.toFixed(1)}/5 (${item.reviewCount || 0} reviews)` : undefined },
    { label: "Pricing", getValue: (item: DirectoryItem) => item.pricing },
    { label: "Key Features", getValue: (item: DirectoryItem) => item.features?.map(f => f.name) },
    { label: "Pros", getValue: (item: DirectoryItem) => item.pros },
    { label: "Cons", getValue: (item: DirectoryItem) => item.cons },
    { label: "Category", getValue: (item: DirectoryItem) => item.category?.replace('-', ' ') },
    { label: "Founded Year", getValue: (item: DirectoryItem) => item.foundedYear },
  ];

  return (
    <Card className="mt-8 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl">Tool Comparison</CardTitle>
        <CardDescription>Side-by-side comparison of selected tools.</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 bg-background/95 z-10 w-1/4 min-w-[150px]">Feature</TableHead>
              {displayItems.map((item, index) => (
                <TableHead key={item.id || `placeholder-${index}`} className="text-center w-1/4 min-w-[200px]">
                  {item.id ? (
                    <div className="flex flex-col items-center gap-2">
                       {item.imageUrl && (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-md object-cover h-20 w-20"
                          data-ai-hint="product logo"
                        />
                      )}
                      <Link href={`/${item.slug}`} className="font-bold text-lg hover:text-primary hover:underline text-center">
                        {item.name}
                      </Link>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={item.website || '#'} target="_blank" rel="noopener noreferrer">
                          Visit Site <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic">Select a tool</span>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {featuresToCompare.map(feature => (
              <FeatureRow 
                key={feature.label}
                label={feature.label}
                values={displayItems.map(item => item.id ? feature.getValue(item) : undefined)}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      {aiSuggestions && aiSuggestions.length > 0 && (
        <CardFooter className="flex-col items-start gap-2 pt-6 border-t">
            <h3 className="text-lg font-semibold flex items-center"><Brain className="mr-2 h-5 w-5 text-primary" /> AI Suggested Key Differences:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {aiSuggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                ))}
            </ul>
            <p className="text-xs text-muted-foreground italic mt-2">Note: AI suggestions are for informational purposes. Actual AI integration for this feature is pending.</p>
        </CardFooter>
      )}
    </Card>
  );
}
