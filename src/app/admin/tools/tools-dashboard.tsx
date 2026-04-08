"use client";

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ExternalLink, Loader2, Pencil, RefreshCw, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { isValidSlug, isValidSlugFormat } from '@/lib/routing-utils-client';
import { resolveCategoryInfo } from '@/lib/utils';
import type { AdminTool } from '@/types';

type CategoryOption = {
  slug: string;
  name: string;
};

type ToolEditorState = {
  originalSlug: string;
  slug: string;
  name: string;
  websiteUrl: string;
  category: string;
  featuresText: string;
  oneLiner: string;
  description: string;
  country: string;
  city: string;
  iconUrl: string;
  displayOrder: string;
};

function getInitialToolEditorState(tool: AdminTool): ToolEditorState {
  return {
    originalSlug: tool.slug,
    slug: tool.slug,
    name: tool.name,
    websiteUrl: tool.websiteUrl,
    category: tool.category,
    featuresText: tool.features.join('\n'),
    oneLiner: tool.oneLiner,
    description: tool.description,
    country: tool.country,
    city: tool.city,
    iconUrl: tool.iconUrl,
    displayOrder: String(tool.displayOrder),
  };
}

function getToolSlugValidationError(slug: string, originalSlug: string, tools: AdminTool[]) {
  if (!slug) {
    return 'Slug is required.';
  }

  if (!isValidSlugFormat(slug)) {
    return 'Use lowercase letters, numbers, and hyphens only.';
  }

  if (!isValidSlug(slug)) {
    return 'This slug conflicts with a reserved site route.';
  }

  const duplicate = tools.find((tool) => tool.slug === slug && tool.slug !== originalSlug);

  if (duplicate) {
    return `This slug is already used by ${duplicate.name}.`;
  }

  return null;
}

export default function ToolsDashboard({
  categories,
  initialSlug,
}: {
  categories: CategoryOption[];
  initialSlug?: string;
}) {
  const { toast } = useToast();
  const [tools, setTools] = useState<AdminTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<AdminTool | null>(null);
  const [toolEditor, setToolEditor] = useState<ToolEditorState | null>(null);
  const [savingTool, setSavingTool] = useState(false);
  const [hasTriedInitialSlug, setHasTriedInitialSlug] = useState(false);

  const loadTools = useCallback(async (options?: { background?: boolean }) => {
    const background = options?.background ?? false;

    if (background) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await fetch('/api/admin/tools', { cache: 'no-store' });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to load live tools');
      }

      const nextTools = Array.isArray(data) ? data : [];
      setTools(nextTools);
      setErrorMessage(null);
    } catch (error) {
      console.error('Error loading live tools:', error);
      const message = error instanceof Error ? error.message : 'Failed to load live tools';
      setTools([]);
      setErrorMessage(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      if (background) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, [toast]);

  useEffect(() => {
    loadTools();
  }, [loadTools]);

  useEffect(() => {
    if (!initialSlug || hasTriedInitialSlug || tools.length === 0) {
      return;
    }

    const initialTool = tools.find((tool) => tool.slug === initialSlug);
    setHasTriedInitialSlug(true);

    if (!initialTool) {
      return;
    }

    setSelectedTool(initialTool);
    setToolEditor(getInitialToolEditorState(initialTool));
  }, [hasTriedInitialSlug, initialSlug, tools]);

  const filteredTools = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    if (!normalizedSearchTerm) {
      return tools;
    }

    return tools.filter((tool) => (
      tool.name.toLowerCase().includes(normalizedSearchTerm)
      || tool.slug.toLowerCase().includes(normalizedSearchTerm)
      || tool.websiteUrl.toLowerCase().includes(normalizedSearchTerm)
    ));
  }, [searchTerm, tools]);

  const toolSlugValidationError = toolEditor
    ? getToolSlugValidationError(toolEditor.slug, toolEditor.originalSlug, tools)
    : null;

  const openToolEditor = (tool: AdminTool) => {
    setSelectedTool(tool);
    setToolEditor(getInitialToolEditorState(tool));
  };

  const handleSaveTool = async () => {
    if (!toolEditor) {
      return;
    }

    if (toolSlugValidationError) {
      toast({
        title: 'Invalid slug',
        description: toolSlugValidationError,
        variant: 'destructive',
      });
      return;
    }

    const displayOrder = Number(toolEditor.displayOrder);

    if (!Number.isInteger(displayOrder)) {
      toast({
        title: 'Invalid display order',
        description: 'Display order must be a whole number.',
        variant: 'destructive',
      });
      return;
    }

    setSavingTool(true);

    try {
      const response = await fetch('/api/admin/tools', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalSlug: toolEditor.originalSlug,
          slug: toolEditor.slug,
          name: toolEditor.name,
          websiteUrl: toolEditor.websiteUrl,
          category: toolEditor.category,
          features: toolEditor.featuresText
            .split('\n')
            .map((feature) => feature.trim())
            .filter(Boolean),
          oneLiner: toolEditor.oneLiner,
          description: toolEditor.description,
          country: toolEditor.country,
          city: toolEditor.city,
          iconUrl: toolEditor.iconUrl,
          displayOrder,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to save live tool');
      }

      const updatedTool = data as AdminTool;

      setTools((currentTools) => currentTools.map((tool) => (
        tool.slug === toolEditor.originalSlug ? updatedTool : tool
      )));
      setSelectedTool(updatedTool);
      setToolEditor(getInitialToolEditorState(updatedTool));

      toast({
        title: 'Saved',
        description: 'The live tool record was updated.',
      });
    } catch (error) {
      console.error('Error saving live tool:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save live tool',
        variant: 'destructive',
      });
    } finally {
      setSavingTool(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto flex items-center justify-center px-4 py-8">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
          <p>Loading live tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Live Tools</h1>
          <p className="text-gray-600">
            These are the actual records in the live directory. Edit them here after a submission has been accepted and published.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/admin/submissions">Back to Submissions</Link>
          </Button>
          <form action="/api/admin/logout" method="post">
            <Button type="submit" variant="outline">Sign Out</Button>
          </form>
        </div>
      </div>

      {errorMessage && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-900">Live editor unavailable</CardTitle>
            <CardDescription className="text-amber-800">{errorMessage}</CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Published Directory Records</CardTitle>
          <CardDescription>
            Search by name, slug, or website, then open a record to edit the live content.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search live tools"
              className="pl-9"
            />
          </div>
          <Button
            onClick={() => loadTools({ background: true })}
            variant="outline"
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Display Order</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTools.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-gray-500">
                    No live tools found.
                  </TableCell>
                </TableRow>
              ) : filteredTools.map((tool) => (
                <TableRow key={tool.slug}>
                  <TableCell className="font-medium">{tool.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{tool.slug}</Badge>
                  </TableCell>
                  <TableCell>
                    <a
                      href={tool.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex max-w-[260px] items-center gap-2 truncate text-blue-600 hover:underline"
                    >
                      <ExternalLink className="h-4 w-4 shrink-0" />
                      <span className="truncate">{tool.websiteUrl}</span>
                    </a>
                  </TableCell>
                  <TableCell>{resolveCategoryInfo(tool.category).displayName}</TableCell>
                  <TableCell>{tool.displayOrder}</TableCell>
                  <TableCell>{new Date(tool.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button onClick={() => openToolEditor(tool)} variant="outline" size="sm">
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedTool} onOpenChange={(open) => {
        if (!open) {
          setSelectedTool(null);
          setToolEditor(null);
        }
      }}>
        <DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto">
          {selectedTool && toolEditor && (
            <>
              <DialogHeader>
                <DialogTitle>Edit Live Tool</DialogTitle>
                <DialogDescription>
                  Changes here update the live directory record immediately.
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tool-name">Name</Label>
                  <Input
                    id="tool-name"
                    value={toolEditor.name}
                    onChange={(event) => setToolEditor({ ...toolEditor, name: event.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tool-slug">Slug</Label>
                  <Input
                    id="tool-slug"
                    value={toolEditor.slug}
                    onChange={(event) => setToolEditor({ ...toolEditor, slug: event.target.value })}
                  />
                  {toolSlugValidationError && (
                    <p className="text-sm text-red-600">{toolSlugValidationError}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="tool-website">Website</Label>
                  <Input
                    id="tool-website"
                    type="url"
                    value={toolEditor.websiteUrl}
                    onChange={(event) => setToolEditor({ ...toolEditor, websiteUrl: event.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tool-category">Category</Label>
                  <Select
                    value={toolEditor.category}
                    onValueChange={(value) => setToolEditor({ ...toolEditor, category: value })}
                  >
                    <SelectTrigger id="tool-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.slug} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tool-display-order">Display Order</Label>
                  <Input
                    id="tool-display-order"
                    inputMode="numeric"
                    value={toolEditor.displayOrder}
                    onChange={(event) => setToolEditor({ ...toolEditor, displayOrder: event.target.value })}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="tool-tagline">Tagline</Label>
                  <Input
                    id="tool-tagline"
                    value={toolEditor.oneLiner}
                    onChange={(event) => setToolEditor({ ...toolEditor, oneLiner: event.target.value })}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="tool-features">Features</Label>
                  <Textarea
                    id="tool-features"
                    rows={5}
                    value={toolEditor.featuresText}
                    onChange={(event) => setToolEditor({ ...toolEditor, featuresText: event.target.value })}
                    placeholder="One feature per line"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="tool-description">Description</Label>
                  <Textarea
                    id="tool-description"
                    rows={8}
                    value={toolEditor.description}
                    onChange={(event) => setToolEditor({ ...toolEditor, description: event.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tool-country">Country</Label>
                  <Input
                    id="tool-country"
                    value={toolEditor.country}
                    onChange={(event) => setToolEditor({ ...toolEditor, country: event.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tool-city">City</Label>
                  <Input
                    id="tool-city"
                    value={toolEditor.city}
                    onChange={(event) => setToolEditor({ ...toolEditor, city: event.target.value })}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="tool-icon">Icon URL</Label>
                  <Input
                    id="tool-icon"
                    type="url"
                    value={toolEditor.iconUrl}
                    onChange={(event) => setToolEditor({ ...toolEditor, iconUrl: event.target.value })}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setSelectedTool(null);
                  setToolEditor(null);
                }}>
                  Close
                </Button>
                <Button onClick={handleSaveTool} disabled={savingTool}>
                  {savingTool ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Pencil className="mr-2 h-4 w-4" />
                  )}
                  Save Live Tool
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
