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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import {
  TOOL_ASSET_CLASS_OPTIONS,
  TOOL_DEPLOYMENT_OPTIONS,
  TOOL_EDITORIAL_STATUSES,
  TOOL_PERSONA_OPTIONS,
  TOOL_PRICING_MODELS,
  TOOL_PRICING_PERIODS,
  TOOL_WORKFLOW_OPTIONS,
} from '@/config/tool-taxonomy';

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
  workflows: AdminTool['workflows'];
  personas: AdminTool['personas'];
  assetClasses: AdminTool['assetClasses'];
  deploymentOptions: AdminTool['deploymentOptions'];
  integrationsText: string;
  geographicCoverageText: string;
  securityCertificationsText: string;
  inputTypesText: string;
  outputTypesText: string;
  limitationsText: string;
  pricingModel: AdminTool['pricingModel'];
  startingPriceAmount: string;
  startingPriceCurrency: string;
  pricingPeriod: AdminTool['pricingPeriod'] | '';
  hasFreeTrial: boolean | null;
  hasFreePlan: boolean | null;
  bestFor: string;
  sourceUrlsText: string;
  lastVerifiedAt: string;
  editorialStatus: AdminTool['editorialStatus'];
  pseoEligible: boolean;
  normalizedDataAvailable: boolean;
};

function splitLines(value: string): string[] {
  return value.split('\n').map((entry) => entry.trim()).filter(Boolean);
}

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
    workflows: tool.workflows,
    personas: tool.personas,
    assetClasses: tool.assetClasses,
    deploymentOptions: tool.deploymentOptions,
    integrationsText: tool.integrations.join('\n'),
    geographicCoverageText: tool.geographicCoverage.join('\n'),
    securityCertificationsText: tool.securityCertifications.join('\n'),
    inputTypesText: tool.inputTypes.join('\n'),
    outputTypesText: tool.outputTypes.join('\n'),
    limitationsText: tool.limitations.join('\n'),
    pricingModel: tool.pricingModel,
    startingPriceAmount: tool.startingPriceAmount == null ? '' : String(tool.startingPriceAmount),
    startingPriceCurrency: tool.startingPriceCurrency,
    pricingPeriod: tool.pricingPeriod ?? '',
    hasFreeTrial: tool.hasFreeTrial,
    hasFreePlan: tool.hasFreePlan,
    bestFor: tool.bestFor,
    sourceUrlsText: tool.sourceUrls.join('\n'),
    lastVerifiedAt: tool.lastVerifiedAt ? tool.lastVerifiedAt.slice(0, 16) : '',
    editorialStatus: tool.editorialStatus,
    pseoEligible: tool.pseoEligible,
    normalizedDataAvailable: tool.normalizedDataAvailable,
  };
}

function ToggleOptionGrid<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T[];
  onChange: (value: T[]) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-[#1f1f1f]">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(selected
                ? value.filter((entry) => entry !== option.value)
                : [...value, option.value])}
              className={cn(
                'rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#629649]',
                selected
                  ? 'border-[#629649] bg-[#eef6ea] text-[#365c27]'
                  : 'border-[#e0e0e0] bg-white text-[#525252] hover:border-[#bdbdbd]'
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
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

    const startingPriceAmount = toolEditor.startingPriceAmount === ''
      ? null
      : Number(toolEditor.startingPriceAmount);

    if (startingPriceAmount !== null && (!Number.isFinite(startingPriceAmount) || startingPriceAmount < 0)) {
      toast({
        title: 'Invalid starting price',
        description: 'Starting price must be a positive number or left blank.',
        variant: 'destructive',
      });
      return;
    }

    const sourceUrls = splitLines(toolEditor.sourceUrlsText);
    if (toolEditor.editorialStatus === 'verified' && (!toolEditor.lastVerifiedAt || sourceUrls.length === 0)) {
      toast({
        title: 'Verification incomplete',
        description: 'Verified tools need a verification date and at least one source URL.',
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
          workflows: toolEditor.workflows,
          personas: toolEditor.personas,
          assetClasses: toolEditor.assetClasses,
          deploymentOptions: toolEditor.deploymentOptions,
          integrations: splitLines(toolEditor.integrationsText),
          geographicCoverage: splitLines(toolEditor.geographicCoverageText),
          securityCertifications: splitLines(toolEditor.securityCertificationsText),
          inputTypes: splitLines(toolEditor.inputTypesText),
          outputTypes: splitLines(toolEditor.outputTypesText),
          limitations: splitLines(toolEditor.limitationsText),
          pricingModel: toolEditor.pricingModel,
          startingPriceAmount,
          startingPriceCurrency: toolEditor.startingPriceCurrency,
          pricingPeriod: toolEditor.pricingPeriod || null,
          hasFreeTrial: toolEditor.hasFreeTrial,
          hasFreePlan: toolEditor.hasFreePlan,
          bestFor: toolEditor.bestFor,
          sourceUrls,
          lastVerifiedAt: toolEditor.lastVerifiedAt
            ? new Date(toolEditor.lastVerifiedAt).toISOString()
            : '',
          editorialStatus: toolEditor.editorialStatus,
          pseoEligible: toolEditor.pseoEligible,
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
          <CardContent className="overflow-x-auto p-0">
            <Table>
            <TableHeader>
              <TableRow className="border-[#e0e0e0] bg-[#fafafa] hover:bg-[#fafafa]">
                <TableHead className="text-[#737373]">Name</TableHead>
                <TableHead className="text-[#737373]">Slug</TableHead>
                <TableHead className="text-[#737373]">Website</TableHead>
                <TableHead className="text-[#737373]">Category</TableHead>
                <TableHead className="text-[#737373]">Editorial</TableHead>
                <TableHead className="text-[#737373]">pSEO</TableHead>
                <TableHead className="text-[#737373]">Display order</TableHead>
                <TableHead className="text-[#737373]">Updated</TableHead>
                <TableHead className="text-right text-[#737373]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTools.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-8 text-center text-[#737373]">
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
                  <TableCell>
                    <Badge variant="outline" className="rounded-[6px] border-[#e0e0e0] font-normal">
                      {TOOL_EDITORIAL_STATUSES.find((status) => status.value === tool.editorialStatus)?.label ?? tool.editorialStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={tool.pseoEligible ? 'text-[#527c3e]' : 'text-[#999999]'}>
                      {tool.pseoEligible ? 'Included' : 'Excluded'}
                    </span>
                  </TableCell>
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

              <Tabs defaultValue="basics" className="mt-2">
                <TabsList className="grid w-full grid-cols-3 rounded-[8px]">
                  <TabsTrigger value="basics">Basics</TabsTrigger>
                  <TabsTrigger value="discovery">Discovery</TabsTrigger>
                  <TabsTrigger value="editorial">Editorial</TabsTrigger>
                </TabsList>

                <TabsContent value="basics" className="mt-5">
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
                </TabsContent>

                <TabsContent value="discovery" className="mt-5 space-y-6">
                  {!toolEditor.normalizedDataAvailable && (
                    <Alert className="border-amber-200 bg-amber-50 text-amber-900">
                      <AlertTitle>Database migration required</AlertTitle>
                      <AlertDescription>
                        Apply the normalized tool-data migration before editing discovery fields. Basic edits remain safe.
                      </AlertDescription>
                    </Alert>
                  )}
                  <fieldset disabled={!toolEditor.normalizedDataAvailable} className="space-y-6 disabled:opacity-55">
                    <ToggleOptionGrid
                      label="Workflows"
                      options={TOOL_WORKFLOW_OPTIONS}
                      value={toolEditor.workflows}
                      onChange={(workflows) => setToolEditor({ ...toolEditor, workflows })}
                    />
                    <ToggleOptionGrid
                      label="Personas"
                      options={TOOL_PERSONA_OPTIONS}
                      value={toolEditor.personas}
                      onChange={(personas) => setToolEditor({ ...toolEditor, personas })}
                    />
                    <ToggleOptionGrid
                      label="Asset classes"
                      options={TOOL_ASSET_CLASS_OPTIONS}
                      value={toolEditor.assetClasses}
                      onChange={(assetClasses) => setToolEditor({ ...toolEditor, assetClasses })}
                    />
                    <ToggleOptionGrid
                      label="Deployment"
                      options={TOOL_DEPLOYMENT_OPTIONS}
                      value={toolEditor.deploymentOptions}
                      onChange={(deploymentOptions) => setToolEditor({ ...toolEditor, deploymentOptions })}
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      {([
                        ['tool-integrations', 'Integrations', 'integrationsText'],
                        ['tool-geography', 'Geographic coverage', 'geographicCoverageText'],
                        ['tool-security', 'Security certifications', 'securityCertificationsText'],
                        ['tool-inputs', 'Input types', 'inputTypesText'],
                        ['tool-outputs', 'Output types', 'outputTypesText'],
                        ['tool-limitations', 'Known limitations', 'limitationsText'],
                      ] as const).map(([id, label, field]) => (
                        <div key={id} className="space-y-2">
                          <Label htmlFor={id}>{label}</Label>
                          <Textarea
                            id={id}
                            rows={4}
                            value={toolEditor[field]}
                            onChange={(event) => setToolEditor({ ...toolEditor, [field]: event.target.value })}
                            placeholder="One value per line"
                            className={adminTextareaClass}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-[#e0e0e0] pt-6">
                      <h3 className="mb-4 text-sm font-semibold text-[#1f1f1f]">Buying information</h3>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>Pricing model</Label>
                          <Select
                            value={toolEditor.pricingModel}
                            onValueChange={(pricingModel: AdminTool['pricingModel']) => setToolEditor({ ...toolEditor, pricingModel })}
                          >
                            <SelectTrigger className={adminSelectTriggerClass}><SelectValue /></SelectTrigger>
                            <SelectContent>{TOOL_PRICING_MODELS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}</SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tool-starting-price">Starting price</Label>
                          <Input
                            id="tool-starting-price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={toolEditor.startingPriceAmount}
                            onChange={(event) => setToolEditor({ ...toolEditor, startingPriceAmount: event.target.value })}
                            className={adminInputClass}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tool-currency">Currency</Label>
                          <Input
                            id="tool-currency"
                            maxLength={3}
                            value={toolEditor.startingPriceCurrency}
                            onChange={(event) => setToolEditor({ ...toolEditor, startingPriceCurrency: event.target.value.toUpperCase() })}
                            placeholder="USD"
                            className={adminInputClass}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Pricing period</Label>
                          <Select
                            value={toolEditor.pricingPeriod || 'none'}
                            onValueChange={(value) => setToolEditor({
                              ...toolEditor,
                              pricingPeriod: value === 'none' ? '' : value as AdminTool['pricingPeriod'],
                            })}
                          >
                            <SelectTrigger className={adminSelectTriggerClass}><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Not specified</SelectItem>
                              {TOOL_PRICING_PERIODS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {([
                          ['Free trial', 'hasFreeTrial'],
                          ['Free plan', 'hasFreePlan'],
                        ] as const).map(([label, field]) => (
                          <div key={field} className="space-y-2">
                            <Label>{label}</Label>
                            <Select
                              value={toolEditor[field] == null ? 'unknown' : toolEditor[field] ? 'yes' : 'no'}
                              onValueChange={(value) => setToolEditor({
                                ...toolEditor,
                                [field]: value === 'unknown' ? null : value === 'yes',
                              })}
                            >
                              <SelectTrigger className={adminSelectTriggerClass}><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="unknown">Unknown</SelectItem>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                        <div className="space-y-2 md:col-span-3">
                          <Label htmlFor="tool-best-for">Best for</Label>
                          <Textarea
                            id="tool-best-for"
                            rows={3}
                            value={toolEditor.bestFor}
                            onChange={(event) => setToolEditor({ ...toolEditor, bestFor: event.target.value })}
                            placeholder="Specific team size, role, workflow, or asset class"
                            className={adminTextareaClass}
                          />
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </TabsContent>

                <TabsContent value="editorial" className="mt-5 space-y-5">
                  {!toolEditor.normalizedDataAvailable && (
                    <Alert className="border-amber-200 bg-amber-50 text-amber-900">
                      <AlertTitle>Editorial workflow unavailable</AlertTitle>
                      <AlertDescription>
                        Apply the Supabase migration first. Until then, current records keep legacy pSEO eligibility.
                      </AlertDescription>
                    </Alert>
                  )}
                  <fieldset disabled={!toolEditor.normalizedDataAvailable} className="space-y-5 disabled:opacity-55">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Editorial status</Label>
                        <Select
                          value={toolEditor.editorialStatus}
                          onValueChange={(editorialStatus: AdminTool['editorialStatus']) => setToolEditor({
                            ...toolEditor,
                            editorialStatus,
                            pseoEligible: editorialStatus === 'legacy' || editorialStatus === 'verified'
                              ? toolEditor.pseoEligible
                              : false,
                          })}
                        >
                          <SelectTrigger className={adminSelectTriggerClass}><SelectValue /></SelectTrigger>
                          <SelectContent>{TOOL_EDITORIAL_STATUSES.map((option) => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tool-verified-at">Last verified</Label>
                        <Input
                          id="tool-verified-at"
                          type="datetime-local"
                          value={toolEditor.lastVerifiedAt}
                          onChange={(event) => setToolEditor({ ...toolEditor, lastVerifiedAt: event.target.value })}
                          className={adminInputClass}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tool-sources">Source URLs</Label>
                      <Textarea
                        id="tool-sources"
                        rows={5}
                        value={toolEditor.sourceUrlsText}
                        onChange={(event) => setToolEditor({ ...toolEditor, sourceUrlsText: event.target.value })}
                        placeholder="One first-party or authoritative URL per line"
                        className={adminTextareaClass}
                      />
                    </div>
                    <label className="flex items-start gap-3 rounded-[8px] border border-[#e0e0e0] p-4">
                      <input
                        type="checkbox"
                        checked={toolEditor.pseoEligible}
                        disabled={toolEditor.editorialStatus !== 'legacy' && toolEditor.editorialStatus !== 'verified'}
                        onChange={(event) => setToolEditor({ ...toolEditor, pseoEligible: event.target.checked })}
                        className="mt-1 h-4 w-4 accent-[#629649]"
                      />
                      <span>
                        <span className="block text-sm font-medium text-[#1f1f1f]">Include in derived pSEO pages</span>
                        <span className="mt-1 block text-sm leading-6 text-[#737373]">
                          Controls alternatives, capability, persona, and comparison cohorts. The main tool profile stays public.
                        </span>
                      </span>
                    </label>
                  </fieldset>
                </TabsContent>
              </Tabs>

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
