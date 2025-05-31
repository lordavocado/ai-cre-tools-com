import type { DirectoryItem } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ExternalLink, Star, DollarSign, Zap, Brain, Gift, Building2, Crown } from "lucide-react";

interface ComparisonTableProps {
  items: DirectoryItem[];
  aiSuggestions?: string[];
  category?: string;
}

const FeatureRow: React.FC<{ label: string; values: (string | number | undefined | string[])[] }> = ({ label, values }) => (
  <TableRow className="hover:bg-muted/30 transition-colors">
    <TableHead className="font-semibold text-foreground sticky left-0 bg-background/95 backdrop-blur-sm z-10 w-1/4 min-w-[150px] border-r">{label}</TableHead>
    {values.map((value, index) => (
      <TableCell key={index} className="text-sm">
        {Array.isArray(value) ? (
          <ul className="list-disc list-inside space-y-1">
            {value.map((v, i) => <li key={i}>{v || '-'}</li>)}
          </ul>
        ) : typeof value === 'boolean' ? (
          value ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
        ) : (
          value || <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
    ))}
  </TableRow>
);

const CategoryIcon = ({ category }: { category?: string }) => {
  switch (category) {
    case 'free':
      return <Gift className="h-5 w-5 text-green-600" />;
    case 'enterprise':
      return <Building2 className="h-5 w-5 text-purple-600" />;
    case 'premium':
      return <Crown className="h-5 w-5 text-yellow-600" />;
    default:
      return <Zap className="h-5 w-5 text-blue-600" />;
  }
};

const getCategoryTitle = (category?: string) => {
  switch (category) {
    case 'free':
      return 'Free Tools Comparison';
    case 'enterprise':
      return 'Enterprise Solutions Comparison';
    case 'premium':
      return 'Premium Tools Comparison';
    default:
      return 'Custom Tool Comparison';
  }
};

const getCategoryDescription = (category?: string) => {
  switch (category) {
    case 'free':
      return 'Comparing the best free analytics tools with no upfront cost';
    case 'enterprise':
      return 'Enterprise-grade solutions for large-scale analytics needs';
    case 'premium':
      return 'Premium paid tools with advanced features and support';
    default:
      return 'Side-by-side comparison of your selected tools';
  }
};

export function ComparisonTable({ items, aiSuggestions, category }: ComparisonTableProps) {
  if (items.length === 0) {
    return (
      <Card className="mt-8">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="text-center space-y-4">
            <CategoryIcon category={category} />
            <div>
              <h3 className="text-xl font-semibold mb-2">Ready to Compare?</h3>
              <p className="text-muted-foreground max-w-md">
                Select up to 3 tools using the selectors above to see a detailed comparison of their features, pricing, and more.
              </p>
            </div>
            {category && category !== 'custom' && (
              <Badge variant="outline" className="mt-4">
                <CategoryIcon category={category} />
                <span className="ml-1">{getCategoryTitle(category)}</span>
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxItems = 3; // Ensure table structure supports up to 3 items even if fewer are selected
  const displayItems = [...items];
  while (displayItems.length < maxItems) {
    displayItems.push({} as DirectoryItem); // Push empty objects for placeholder columns
  }

  const featuresToCompare = [
    { 
      label: "Overall Rating", 
      getValue: (item: DirectoryItem) => item.rating ? `${item.rating.toFixed(1)}/5` : undefined,
      getSecondaryValue: (item: DirectoryItem) => item.reviewCount ? `${item.reviewCount} reviews` : undefined
    },
    { 
      label: "Pricing Model", 
      getValue: (item: DirectoryItem) => item.pricing,
      highlight: category === 'free' || category === 'premium'
    },
    { 
      label: "Key Features", 
      getValue: (item: DirectoryItem) => item.features?.map(f => f.name) 
    },
    { 
      label: "Best Use Cases", 
      getValue: (item: DirectoryItem) => item.bestFor 
    },
    { 
      label: "Advantages", 
      getValue: (item: DirectoryItem) => item.pros 
    },
    { 
      label: "Limitations", 
      getValue: (item: DirectoryItem) => item.cons 
    },
    { 
      label: "Category", 
      getValue: (item: DirectoryItem) => item.category?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) 
    },
    { 
      label: "Company Founded", 
      getValue: (item: DirectoryItem) => item.foundedYear 
    },
  ];

  return (
    <Card className="mt-8 shadow-xl border-0 bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="border-b bg-gradient-to-r from-background to-muted/30">
        <div className="flex items-center gap-3">
          <CategoryIcon category={category} />
          <div>
            <CardTitle className="text-2xl md:text-3xl">{getCategoryTitle(category)}</CardTitle>
            <CardDescription className="text-base mt-1">
              {getCategoryDescription(category)}
            </CardDescription>
          </div>
        </div>
        {items.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {items.map((item, index) => (
              <Badge key={item.id} variant="secondary" className="text-xs">
                #{index + 1} {item.name}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <Table className="min-w-[800px]">
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="sticky left-0 bg-muted/80 backdrop-blur-sm z-10 w-1/4 min-w-[150px] border-r font-bold">Feature</TableHead>
              {displayItems.map((item, index) => (
                <TableHead key={item.id || `placeholder-${index}`} className="text-center w-1/4 min-w-[200px] p-4">
                  {item.id ? (
                    <div className="flex flex-col items-center gap-3">
                       {item.imageUrl && (
                        <div className="relative">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="rounded-lg object-cover h-20 w-20 border shadow-sm"
                            data-ai-hint="product logo"
                          />
                          {item.rating && (
                            <Badge 
                              variant="secondary" 
                              className="absolute -top-2 -right-2 text-xs min-w-[2rem] h-6 rounded-full"
                            >
                              <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                              {item.rating.toFixed(1)}
                            </Badge>
                          )}
                        </div>
                      )}
                      <Link 
                        href={`/${item.slug}`} 
                        className="font-bold text-lg hover:text-primary hover:underline text-center transition-colors"
                      >
                        {item.name}
                      </Link>
                      {item.tagline && (
                        <p className="text-xs text-muted-foreground text-center leading-tight">
                          {item.tagline}
                        </p>
                      )}
                      <Button variant="outline" size="sm" asChild className="w-full">
                        <Link href={item.website || '#'} target="_blank" rel="noopener noreferrer">
                          Visit Site <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 py-4">
                      <div className="h-20 w-20 rounded-lg bg-muted/50 border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">#{index + 1}</span>
                      </div>
                      <span className="text-muted-foreground italic text-sm">Select a tool</span>
                    </div>
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
        <CardFooter className="flex-col items-start gap-4 pt-6 border-t bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
          <div className="w-full">
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
              💡 AI suggestions are generated based on the tools' features and characteristics. Always verify information with official sources.
            </p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
