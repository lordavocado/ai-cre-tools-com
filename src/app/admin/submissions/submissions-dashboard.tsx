"use client";

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { TOOL_SUBMISSION_CATEGORIES } from '@/lib/tool-submission-categories';
import type { ToolSubmission, ToolSubmissionStatus } from '@/lib/supabase';
import { getCategoryDisplayName } from '@/lib/utils';
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  ExternalLink,
  Mail,
  MessageSquare,
  Globe,
  Calendar,
  Loader2,
  RefreshCw,
  Save,
  Sparkles,
} from 'lucide-react';

type SubmissionFormState = {
  website: string;
  slug: string;
  name: string;
  category: string;
  features: string;
  oneLiner: string;
  description: string;
  country: string;
  city: string;
  iconLink: string;
  researchStatus: 'pending' | 'completed' | 'failed';
};

type PendingAction = 'approve' | 'reject' | 'retry' | 'save' | null;

const STATUS_TABS: ToolSubmissionStatus[] = ['pending', 'approved', 'rejected'];

function getFormStateFromSubmission(submission: ToolSubmission): SubmissionFormState {
  return {
    website: submission.website || '',
    slug: submission.slug || '',
    name: submission.name || '',
    category: submission.category || '',
    features: submission.features || '',
    oneLiner: submission.oneLiner || '',
    description: submission.description || '',
    country: submission.country || '',
    city: submission.city || '',
    iconLink: submission.iconLink || '',
    researchStatus: normalizeResearchStatus(submission.researchStatus),
  };
}

function normalizeResearchStatus(status: string): SubmissionFormState['researchStatus'] {
  if (status === 'completed' || status === 'failed') {
    return status;
  }

  return 'pending';
}

function formatSubmissionCategory(category: string) {
  if (!category) {
    return '';
  }

  return getCategoryDisplayName(category);
}

export default function SubmissionsDashboard() {
  const [submissions, setSubmissions] = useState<ToolSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<ToolSubmission | null>(null);
  const [formState, setFormState] = useState<SubmissionFormState | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [activeTab, setActiveTab] = useState<ToolSubmissionStatus>('pending');
  const { toast } = useToast();

  const redirectToLogin = useCallback(() => {
    window.location.href = '/admin-login?next=/admin/submissions';
  }, []);

  const fetchSubmissions = useCallback(async (options?: { background?: boolean }) => {
    const background = options?.background ?? false;

    if (background) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await fetch('/api/admin/submissions');
      const data = await response.json().catch(() => null);

      if (response.ok) {
        const nextSubmissions = Array.isArray(data) ? data : [];
        setSubmissions(nextSubmissions);
        setErrorMessage(null);
        setSelectedSubmission((currentSelection) => {
          if (!currentSelection) {
            return null;
          }

          return nextSubmissions.find(
            (submission) => submission.submissionId === currentSelection.submissionId
          ) || null;
        });

        return;
      }

      if (response.status === 401) {
        redirectToLogin();
        return;
      }

      const message = data?.error || 'Failed to fetch submissions';
      setSubmissions([]);
      setErrorMessage(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setSubmissions([]);
      setErrorMessage('Failed to fetch submissions');
      toast({
        title: 'Error',
        description: 'Failed to fetch submissions',
        variant: 'destructive',
      });
    } finally {
      if (background) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, [redirectToLogin, toast]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  useEffect(() => {
    if (!selectedSubmission) {
      setFormState(null);
      return;
    }

    setFormState(getFormStateFromSubmission(selectedSubmission));
  }, [selectedSubmission]);

  const replaceSubmissionInState = useCallback((updatedSubmission: ToolSubmission) => {
    setSubmissions((currentSubmissions) => currentSubmissions.map((submission) => (
      submission.submissionId === updatedSubmission.submissionId ? updatedSubmission : submission
    )));
    setSelectedSubmission(updatedSubmission);
    setFormState(getFormStateFromSubmission(updatedSubmission));
  }, []);

  const persistSubmissionUpdates = useCallback(async (options?: { silent?: boolean }) => {
    if (!selectedSubmission || !formState) {
      return { success: false as const };
    }

    try {
      const response = await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateDetails',
          submissionId: selectedSubmission.submissionId,
          updates: formState,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.submission) {
        replaceSubmissionInState(data.submission);

        if (!options?.silent) {
          toast({
            title: 'Saved',
            description: 'Submission details were updated.',
          });
        }

        return { success: true as const };
      }

      if (response.status === 401) {
        redirectToLogin();
        return { success: false as const };
      }

      toast({
        title: 'Error',
        description: data?.error || 'Failed to save submission details',
        variant: 'destructive',
      });
      return { success: false as const };
    } catch (error) {
      console.error('Error saving submission details:', error);
      toast({
        title: 'Error',
        description: 'Failed to save submission details',
        variant: 'destructive',
      });
      return { success: false as const };
    }
  }, [formState, redirectToLogin, replaceSubmissionInState, selectedSubmission, toast]);

  const handleStatusUpdate = async (status: 'approved' | 'rejected') => {
    if (!selectedSubmission || (status === 'approved' && !formState)) {
      return;
    }

    setPendingAction(status === 'approved' ? 'approve' : 'reject');

    try {
      let response: Response;

      if (status === 'approved') {
        response = await fetch('/api/admin/submissions', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'publishSubmission',
            submissionId: selectedSubmission.submissionId,
            updates: formState,
          }),
        });
      } else {
        const saveResult = await persistSubmissionUpdates({ silent: true });

        if (!saveResult.success) {
          return;
        }

        response = await fetch('/api/admin/submissions', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'updateStatus',
            submissionId: selectedSubmission.submissionId,
            status,
          }),
        });
      }

      const data = await response.json().catch(() => null);

      if (response.ok) {
        toast({
          title: status === 'approved' ? 'Published' : 'Rejected',
          description: data?.message || (status === 'approved'
            ? 'Submission accepted and published to the live directory.'
            : 'Submission rejected successfully.'),
        });
        setSelectedSubmission(null);
        await fetchSubmissions({ background: true });
        return;
      }

      if (response.status === 401) {
        redirectToLogin();
        return;
      }

      toast({
        title: 'Error',
        description: data?.error || (status === 'approved'
          ? 'Failed to accept and publish submission'
          : 'Failed to reject submission'),
        variant: 'destructive',
      });
    } catch (error) {
      console.error('Error updating submission status:', error);
      toast({
        title: 'Error',
        description: status === 'approved'
          ? 'Failed to accept and publish submission'
          : 'Failed to reject submission',
        variant: 'destructive',
      });
    } finally {
      setPendingAction(null);
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedSubmission || !formState) {
      return;
    }

    setPendingAction('save');

    try {
      await persistSubmissionUpdates();
    } finally {
      setPendingAction(null);
    }
  };

  const handleRetryResearch = async () => {
    if (!selectedSubmission) {
      return;
    }

    setPendingAction('retry');

    try {
      const response = await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'retryResearch',
          submissionId: selectedSubmission.submissionId,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.submission) {
        replaceSubmissionInState(data.submission);
        toast({
          title: 'Research updated',
          description: data?.message || 'Automated research finished.',
        });
        return;
      }

      if (response.status === 401) {
        redirectToLogin();
        return;
      }

      toast({
        title: 'Error',
        description: data?.error || 'Failed to retry automated research',
        variant: 'destructive',
      });
    } catch (error) {
      console.error('Error retrying automated research:', error);
      toast({
        title: 'Error',
        description: 'Failed to retry automated research',
        variant: 'destructive',
      });
    } finally {
      setPendingAction(null);
    }
  };

  const submissionCounts = {
    pending: submissions.filter((submission) => submission.status === 'pending').length,
    approved: submissions.filter((submission) => submission.status === 'approved').length,
    rejected: submissions.filter((submission) => submission.status === 'rejected').length,
  };

  const activeSubmissions = submissions.filter((submission) => submission.status === activeTab);

  if (loading) {
    return (
      <div className="container mx-auto flex items-center justify-center px-4 py-8">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
          <p>Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Tool Submissions Dashboard</h1>
          <p className="text-gray-600">Review pending submissions, accept them into the live directory, and open the published record for edits afterward.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/admin">Back to Admin</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/tools">Open Live Tools</Link>
          </Button>
          <form action="/api/admin/logout" method="post">
            <Button type="submit" variant="outline">Sign Out</Button>
          </form>
        </div>
      </div>

      {errorMessage && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-900">Admin queue unavailable</CardTitle>
            <CardDescription className="text-amber-800">{errorMessage}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={() => fetchSubmissions()} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin">Back to Admin Overview</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ToolSubmissionStatus)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {STATUS_TABS.map((status) => (
            <TabsTrigger key={status} value={status}>
              {formatTabLabel(status)} ({submissionCounts[status]})
            </TabsTrigger>
          ))}
        </TabsList>

        {STATUS_TABS.map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{formatSectionHeading(status)}</h2>
              <Button onClick={() => fetchSubmissions({ background: true })} variant="outline" size="sm" disabled={refreshing}>
                {refreshing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Refresh
              </Button>
            </div>
            <SubmissionsList
              submissions={status === activeTab ? activeSubmissions : submissions.filter((submission) => submission.status === status)}
              onViewDetails={setSelectedSubmission}
            />
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
        <DialogContent className="max-h-[85vh] max-w-5xl overflow-y-auto">
          {selectedSubmission && formState && (
            <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Submission Details
                  </DialogTitle>
                <DialogDescription>
                  Review the queued submission, then accept it to run the full scrape and publish flow.
                </DialogDescription>
                </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                        Submission Info
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            Submitted: {new Date(selectedSubmission.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{selectedSubmission.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <a
                            href={selectedSubmission.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-blue-600 hover:underline"
                          >
                            {selectedSubmission.website}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                        User Comment
                      </h3>
                      <div className="flex items-start gap-2">
                        <MessageSquare className="mt-1 h-4 w-4 flex-shrink-0 text-gray-400" />
                        <p className="rounded-lg bg-gray-50 p-3 text-sm">{selectedSubmission.comment}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                        Status
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {getStatusBadge(selectedSubmission.status)}
                        {getResearchStatusBadge(selectedSubmission.researchStatus)}
                      </div>
                    </div>

                    {(selectedSubmission.name || selectedSubmission.category || selectedSubmission.oneLiner) && (
                      <div>
                        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                          Current Tool Snapshot
                        </h3>
                        <div className="space-y-2 rounded-lg bg-gray-50 p-3 text-sm">
                          {selectedSubmission.name && <p><strong>Name:</strong> {selectedSubmission.name}</p>}
                          {selectedSubmission.category && <p><strong>Category:</strong> {formatSubmissionCategory(selectedSubmission.category)}</p>}
                          {selectedSubmission.oneLiner && <p><strong>Tagline:</strong> {selectedSubmission.oneLiner}</p>}
                        </div>
                      </div>
                    )}

                    {selectedSubmission.description && (
                      <div>
                        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                          Current Description
                        </h3>
                        <div className="max-h-32 overflow-y-auto rounded-lg bg-gray-50 p-3 text-sm">
                          {selectedSubmission.description}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 rounded-xl border border-gray-200 p-4">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                      Manual Review Fields
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Anything you set here is saved first, then used as the preferred value when the accept-and-publish flow runs.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="submission-name">Name</Label>
                      <Input
                        id="submission-name"
                        value={formState.name}
                        onChange={(event) => setFormState({ ...formState, name: event.target.value })}
                        placeholder="Tool name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="submission-slug">Slug</Label>
                      <Input
                        id="submission-slug"
                        value={formState.slug}
                        onChange={(event) => setFormState({ ...formState, slug: event.target.value })}
                        placeholder="tool-slug"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="submission-website">Website</Label>
                      <Input
                        id="submission-website"
                        type="url"
                        value={formState.website}
                        onChange={(event) => setFormState({ ...formState, website: event.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="submission-category">Category</Label>
                      <Select
                        value={formState.category || undefined}
                        onValueChange={(value) => setFormState({ ...formState, category: value })}
                      >
                        <SelectTrigger id="submission-category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {formState.category && !TOOL_SUBMISSION_CATEGORIES.includes(formState.category as (typeof TOOL_SUBMISSION_CATEGORIES)[number]) && (
                            <SelectItem value={formState.category}>{formState.category}</SelectItem>
                          )}
                          {TOOL_SUBMISSION_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="submission-research-status">Research Status</Label>
                      <Select
                        value={formState.researchStatus}
                        onValueChange={(value) => setFormState({
                          ...formState,
                          researchStatus: value as SubmissionFormState['researchStatus'],
                        })}
                      >
                        <SelectTrigger id="submission-research-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="submission-tagline">Tagline</Label>
                      <Input
                        id="submission-tagline"
                        value={formState.oneLiner}
                        onChange={(event) => setFormState({ ...formState, oneLiner: event.target.value })}
                        placeholder="Short one-line summary"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="submission-features">Features</Label>
                      <Textarea
                        id="submission-features"
                        value={formState.features}
                        onChange={(event) => setFormState({ ...formState, features: event.target.value })}
                        placeholder="Comma-separated features"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="submission-description">Description</Label>
                      <Textarea
                        id="submission-description"
                        value={formState.description}
                        onChange={(event) => setFormState({ ...formState, description: event.target.value })}
                        placeholder="Longer product description"
                        rows={6}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="submission-country">Country</Label>
                      <Input
                        id="submission-country"
                        value={formState.country}
                        onChange={(event) => setFormState({ ...formState, country: event.target.value })}
                        placeholder="Country"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="submission-city">City</Label>
                      <Input
                        id="submission-city"
                        value={formState.city}
                        onChange={(event) => setFormState({ ...formState, city: event.target.value })}
                        placeholder="City"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="submission-icon-link">Icon Link</Label>
                      <Input
                        id="submission-icon-link"
                        type="url"
                        value={formState.iconLink}
                        onChange={(event) => setFormState({ ...formState, iconLink: event.target.value })}
                        placeholder="https://example.com/logo.svg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={handleRetryResearch}
                    disabled={pendingAction !== null}
                    variant="outline"
                  >
                    {pendingAction === 'retry' ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    {selectedSubmission.researchStatus === 'pending' ? 'Run Research Preview' : 'Refresh Research Preview'}
                  </Button>

                  <Button
                    onClick={handleSaveChanges}
                    disabled={pendingAction !== null}
                    variant="outline"
                  >
                    {pendingAction === 'save' ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                </div>

                {selectedSubmission.status === 'pending' && (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => handleStatusUpdate('rejected')}
                      disabled={pendingAction !== null}
                      variant="destructive"
                    >
                      {pendingAction === 'reject' ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="mr-2 h-4 w-4" />
                      )}
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate('approved')}
                      disabled={pendingAction !== null}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {pendingAction === 'approve' ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      )}
                      Accept & Publish
                    </Button>
                  </div>
                )}

                {selectedSubmission.status === 'approved' && selectedSubmission.slug && (
                  <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline">
                      <Link href={`/admin/tools?slug=${encodeURIComponent(selectedSubmission.slug)}`}>
                        Edit Live Tool
                      </Link>
                    </Button>
                  </div>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface SubmissionsListProps {
  submissions: ToolSubmission[];
  onViewDetails: (submission: ToolSubmission) => void;
}

function SubmissionsList({ submissions, onViewDetails }: SubmissionsListProps) {
  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-gray-500">No submissions found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <Card key={submission.submissionId} className="transition-shadow hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold">{submission.name || 'Research in Progress'}</h3>
                  <div className="flex flex-wrap gap-2">
                    {getStatusBadge(submission.status)}
                    {getResearchStatusBadge(submission.researchStatus)}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <a
                      href={submission.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-blue-600 hover:underline"
                    >
                      {submission.website}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{submission.email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {submission.comment && (
                  <div className="mt-3">
                    <p className="line-clamp-2 text-sm text-gray-600">
                      <strong>Comment:</strong> {submission.comment}
                    </p>
                  </div>
                )}

                {(submission.category || submission.oneLiner) && (
                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    {submission.category && <span><strong>Category:</strong> {formatSubmissionCategory(submission.category)}</span>}
                    {submission.oneLiner && <span><strong>Tagline:</strong> {submission.oneLiner}</span>}
                  </div>
                )}
              </div>

              <Button onClick={() => onViewDetails(submission)} variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function formatTabLabel(status: ToolSubmissionStatus) {
  switch (status) {
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    default:
      return 'Pending';
  }
}

function formatSectionHeading(status: ToolSubmissionStatus) {
  switch (status) {
    case 'approved':
      return 'Approved Submissions';
    case 'rejected':
      return 'Rejected Submissions';
    default:
      return 'Pending Submissions';
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'pending':
      return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
    case 'approved':
      return <Badge variant="default" className="bg-green-500"><CheckCircle className="mr-1 h-3 w-3" />Approved</Badge>;
    case 'rejected':
      return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function getResearchStatusBadge(status: string) {
  switch (status) {
    case 'completed':
      return <Badge variant="default" className="bg-green-500">Research Complete</Badge>;
    case 'failed':
      return <Badge variant="destructive">Research Failed</Badge>;
    default:
      return <Badge variant="secondary">Research Pending</Badge>;
  }
}
