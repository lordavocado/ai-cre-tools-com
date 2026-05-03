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
import {
  AdminContent,
  AdminHero,
  AdminSignOutButton,
  adminCardClass,
  adminInputClass,
  adminSelectTriggerClass,
  adminTextareaClass,
} from '@/components/admin/AdminChrome';
import { isValidSlug, isValidSlugFormat } from '@/lib/routing-utils-client';
import { cn, resolveCategoryInfo } from '@/lib/utils';
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
      <div className="flex min-h-[40vh] items-center justify-center px-6 py-16">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-[#629649]" />
          <p className="text-sm text-[#737373]">Loading live tools…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminHero
        kicker="Directory"
        title="Live tools"
        description="Rows in the public directory (ecosystem_apps). Edits apply to production immediately after save."
        actions={(
          <>
            <Button asChild variant="outline" className="rounded-[8px] border-[#e0e0e0]">
              <Link href="/admin/submissions">Submissions</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-[8px] border-[#e0e0e0]">
              <Link href="/admin">Admin home</Link>
            </Button>
            <AdminSignOutButton />
          </>
        )}
      />

      <AdminContent>
        {errorMessage && (
          <Card className={cn(adminCardClass, 'mb-6 border-amber-200 bg-amber-50')}>
            <CardHeader>
              <CardTitle className="text-lg text-amber-900">Live editor unavailable</CardTitle>
              <CardDescription className="text-amber-800">{errorMessage}</CardDescription>
            </CardHeader>
          </Card>
        )}

        <Card className={cn(adminCardClass, 'mb-6')}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#0f172a]">Published records</CardTitle>
            <CardDescription className="text-[#737373]">
              Search by name, slug, or website, then open a row to edit.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999999]" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search live tools"
                className={cn(adminInputClass, 'pl-9')}
              />
            </div>
            <Button
              onClick={() => loadTools({ background: true })}
              variant="outline"
              disabled={refreshing}
              className="rounded-[8px] border-[#e0e0e0]"
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

        <Card className={cn(adminCardClass, 'overflow-hidden p-0')}>
          <CardContent className="p-0">
            <Table>
            <TableHeader>
              <TableRow className="border-[#e0e0e0] bg-[#fafafa] hover:bg-[#fafafa]">
                <TableHead className="text-[#737373]">Name</TableHead>
                <TableHead className="text-[#737373]">Slug</TableHead>
                <TableHead className="text-[#737373]">Website</TableHead>
                <TableHead className="text-[#737373]">Category</TableHead>
                <TableHead className="text-[#737373]">Display order</TableHead>
                <TableHead className="text-[#737373]">Updated</TableHead>
                <TableHead className="text-right text-[#737373]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTools.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-[#737373]">
                    No live tools found.
                  </TableCell>
                </TableRow>
              ) : filteredTools.map((tool) => (
                <TableRow key={tool.slug} className="border-[#f0f0f0]">
                  <TableCell className="font-medium text-[#0f172a]">{tool.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-[6px] border-[#e0e0e0] font-normal">
                      {tool.slug}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <a
                      href={tool.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex max-w-[260px] items-center gap-2 truncate text-[#2563eb] hover:underline"
                    >
                      <ExternalLink className="h-4 w-4 shrink-0" />
                      <span className="truncate">{tool.websiteUrl}</span>
                    </a>
                  </TableCell>
                  <TableCell>{resolveCategoryInfo(tool.category).displayName}</TableCell>
                  <TableCell>{tool.displayOrder}</TableCell>
                  <TableCell>{new Date(tool.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => openToolEditor(tool)}
                      variant="outline"
                      size="sm"
                      className="rounded-[8px] border-[#e0e0e0]"
                    >
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
        <DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto rounded-[8px] border-[#e0e0e0]">
          {selectedTool && toolEditor && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-[#0f172a]">Edit live tool</DialogTitle>
                <DialogDescription className="text-[#737373]">
                  Saves apply to the live directory immediately.
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tool-name" className="text-[#1f1f1f]">Name</Label>
                  <Input
                    id="tool-name"
                    value={toolEditor.name}
                    onChange={(event) => setToolEditor({ ...toolEditor, name: event.target.value })}
                    className={adminInputClass}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tool-slug" className="text-[#1f1f1f]">Slug</Label>
                  <Input
                    id="tool-slug"
                    value={toolEditor.slug}
                    onChange={(event) => setToolEditor({ ...toolEditor, slug: event.target.value })}
                    className={adminInputClass}
                  />
                  {toolSlugValidationError && (
                    <p className="text-sm text-red-600">{toolSlugValidationError}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="tool-website" className="text-[#1f1f1f]">Website</Label>
                  <Input
                    id="tool-website"
                    type="url"
                    value={toolEditor.websiteUrl}
                    onChange={(event) => setToolEditor({ ...toolEditor, websiteUrl: event.target.value })}
                    className={adminInputClass}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tool-category" className="text-[#1f1f1f]">Category</Label>
                  <Select
                    value={toolEditor.category}
                    onValueChange={(value) => setToolEditor({ ...toolEditor, category: value })}
                  >
                    <SelectTrigger id="tool-category" className={adminSelectTriggerClass}>
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
                  <Label htmlFor="tool-display-order" className="text-[#1f1f1f]">Display order</Label>
                  <Input
                    id="tool-display-order"
                    inputMode="numeric"
                    value={toolEditor.displayOrder}
                    onChange={(event) => setToolEditor({ ...toolEditor, displayOrder: event.target.value })}
                    className={adminInputClass}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="tool-tagline" className="text-[#1f1f1f]">Tagline</Label>
                  <Input
                    id="tool-tagline"
                    value={toolEditor.oneLiner}
                    onChange={(event) => setToolEditor({ ...toolEditor, oneLiner: event.target.value })}
                    className={adminInputClass}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="tool-features" className="text-[#1f1f1f]">Features</Label>
                  <Textarea
                    id="tool-features"
                    rows={5}
                    value={toolEditor.featuresText}
                    onChange={(event) => setToolEditor({ ...toolEditor, featuresText: event.target.value })}
                    placeholder="One feature per line"
                    className={adminTextareaClass}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="tool-description" className="text-[#1f1f1f]">Description</Label>
                  <Textarea
                    id="tool-description"
                    rows={8}
                    value={toolEditor.description}
                    onChange={(event) => setToolEditor({ ...toolEditor, description: event.target.value })}
                    className={adminTextareaClass}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tool-country" className="text-[#1f1f1f]">Country</Label>
                  <Input
                    id="tool-country"
                    value={toolEditor.country}
                    onChange={(event) => setToolEditor({ ...toolEditor, country: event.target.value })}
                    className={adminInputClass}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tool-city" className="text-[#1f1f1f]">City</Label>
                  <Input
                    id="tool-city"
                    value={toolEditor.city}
                    onChange={(event) => setToolEditor({ ...toolEditor, city: event.target.value })}
                    className={adminInputClass}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="tool-icon" className="text-[#1f1f1f]">Icon URL</Label>
                  <Input
                    id="tool-icon"
                    type="url"
                    value={toolEditor.iconUrl}
                    onChange={(event) => setToolEditor({ ...toolEditor, iconUrl: event.target.value })}
                    className={adminInputClass}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  className="rounded-[8px] border-[#e0e0e0]"
                  onClick={() => {
                  setSelectedTool(null);
                  setToolEditor(null);
                }}
                >
                  Close
                </Button>
                <Button onClick={handleSaveTool} disabled={savingTool} className="rounded-[8px]">
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
      </AdminContent>
    </>
  );
}
