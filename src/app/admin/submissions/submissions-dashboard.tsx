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
import {
  AdminContent,
  AdminHero,
  AdminSignOutButton,
  adminCardClass,
  adminInputClass,
  adminSelectTriggerClass,
  adminTextareaClass,
} from '@/components/admin/AdminChrome';
import { cn, getCategoryDisplayName } from '@/lib/utils';
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
  AlertCircle,
  Rocket,
  Trash2,
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

type PendingAction = 'approveAuto' | 'approveManual' | 'reject' | 'retry' | 'save' | 'delete' | null;

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

type SubmissionSystemStatus = {
  adminBasicAuthConfigured: boolean;
  supabaseStorageConfigured: boolean;
  supabaseAdminConfigured: boolean;
  researchProviderConfigured: boolean;
  researchProvider: 'openai' | null;
  openAIConfigured: boolean;
  researchModel: string;
};

export default function SubmissionsDashboard() {
  const [submissions, setSubmissions] = useState<ToolSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState<SubmissionSystemStatus | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<ToolSubmission | null>(null);
  const [formState, setFormState] = useState<SubmissionFormState | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [autoPublishingId, setAutoPublishingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ToolSubmissionStatus>('pending');
  const [submissionToDelete, setSubmissionToDelete] = useState<ToolSubmission | null>(null);
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
    let cancelled = false;

    void (async () => {
      try {
        const response = await fetch('/api/admin/submission-system-status');
        const data = (await response.json().catch(() => null)) as SubmissionSystemStatus | null;
        if (!cancelled && response.ok && data && typeof data.supabaseStorageConfigured === 'boolean') {
          setSystemStatus(data);
        }
      } catch {
        /* non-blocking */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

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

  const handleAcceptAutoPublish = useCallback(async (submissionOverride?: ToolSubmission) => {
    const target = submissionOverride ?? selectedSubmission;
    if (!target) {
      return;
    }

    setPendingAction('approveAuto');
    setAutoPublishingId(target.submissionId);

    try {
      const response = await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'acceptAutoPublish',
          submissionId: target.submissionId,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        toast({
          title: 'Published',
          description: data?.message || 'Researched, verified, and pushed live.',
        });
        setSelectedSubmission(null);
        await fetchSubmissions({ background: true });
        return;
      }

      if (response.status === 401) {
        redirectToLogin();
        return;
      }

      if ((response.status === 422 || response.status === 500) && data?.submission) {
        replaceSubmissionInState(data.submission);
      }

      toast({
        title: 'Could not auto-publish',
        description: data?.error || 'Automatic accept failed.',
        variant: 'destructive',
      });
    } catch (error) {
      console.error('Error in acceptAutoPublish:', error);
      toast({
        title: 'Error',
        description: 'Automatic accept failed.',
        variant: 'destructive',
      });
    } finally {
      setPendingAction(null);
      setAutoPublishingId(null);
    }
  }, [fetchSubmissions, redirectToLogin, replaceSubmissionInState, selectedSubmission, toast]);

  const handlePublishFromForm = useCallback(async () => {
    if (!selectedSubmission || !formState) {
      return;
    }

    setPendingAction('approveManual');

    try {
      const response = await fetch('/api/admin/submissions', {
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

      const data = await response.json().catch(() => null);

      if (response.ok) {
        toast({
          title: 'Published',
          description: data?.message || 'Submission published using the form fields.',
        });
        setSelectedSubmission(null);
        await fetchSubmissions({ background: true });
        return;
      }

      if (response.status === 401) {
        redirectToLogin();
        return;
      }

      if (response.status === 422 && data?.submission) {
        replaceSubmissionInState(data.submission);
      }

      toast({
        title: 'Error',
        description: data?.error || 'Failed to publish from form',
        variant: 'destructive',
      });
    } catch (error) {
      console.error('Error publishing from form:', error);
      toast({
        title: 'Error',
        description: 'Failed to publish from form',
        variant: 'destructive',
      });
    } finally {
      setPendingAction(null);
    }
  }, [fetchSubmissions, formState, redirectToLogin, replaceSubmissionInState, selectedSubmission, toast]);

  const handleReject = useCallback(async () => {
    if (!selectedSubmission) {
      return;
    }

    setPendingAction('reject');

    try {
      const saveResult = await persistSubmissionUpdates({ silent: true });

      if (!saveResult.success) {
        return;
      }

      const response = await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateStatus',
          submissionId: selectedSubmission.submissionId,
          status: 'rejected',
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        toast({
          title: 'Rejected',
          description: data?.message || 'Submission rejected successfully.',
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
        description: data?.error || 'Failed to reject submission',
        variant: 'destructive',
      });
    } catch (error) {
      console.error('Error rejecting submission:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject submission',
        variant: 'destructive',
      });
    } finally {
      setPendingAction(null);
    }
  }, [fetchSubmissions, persistSubmissionUpdates, redirectToLogin, selectedSubmission, toast]);

  const handleDelete = useCallback(async () => {
    if (!submissionToDelete) {
      return;
    }

    setPendingAction('delete');

    try {
      const response = await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'deleteSubmission',
          submissionId: submissionToDelete.submissionId,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        toast({
          title: 'Deleted',
          description: data?.message || 'Submission permanently removed.',
        });

        if (selectedSubmission?.submissionId === submissionToDelete.submissionId) {
          setSelectedSubmission(null);
        }

        setSubmissionToDelete(null);
        await fetchSubmissions({ background: true });
        return;
      }

      if (response.status === 401) {
        redirectToLogin();
        return;
      }

      toast({
        title: 'Error',
        description: data?.error || 'Failed to delete submission',
        variant: 'destructive',
      });
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete submission',
        variant: 'destructive',
      });
    } finally {
      setPendingAction(null);
    }
  }, [fetchSubmissions, redirectToLogin, selectedSubmission, submissionToDelete, toast]);

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
      <div className="flex min-h-[40vh] flex-col items-center justify-center border-b border-[#e0e0e0] bg-[#fafafa] px-6 py-16">
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-[#629649]" aria-hidden />
        <p className="text-sm text-[#737373]">Loading submissions…</p>
      </div>
    );
  }

  return (
    <>
      <AdminHero
        kicker="Review queue"
        title="Tool submissions"
        description={
          <>
            Use <span className="font-semibold text-[#1f1f1f]">Run evaluator</span> for one-step relevance review, duplicate checking, copy generation, and an automatic accept or reject decision (OpenAI Responses API + Supabase service role). Open a row to edit copy, or use{' '}
            <span className="font-semibold text-[#1f1f1f]">Publish using form fields</span> for full manual control.
          </>
        }
        actions={
          <>
            <Button asChild variant="outline" className="rounded-[8px] border-[#e0e0e0]">
              <Link href="/admin">Admin home</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-[8px] border-[#e0e0e0]">
              <Link href="/admin/tools">Live tools</Link>
            </Button>
            <AdminSignOutButton />
          </>
        }
      />
      <AdminContent>
      {systemStatus && (
        <Card className={cn(adminCardClass, 'mb-6')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-[#0f172a]">Submission pipeline status</CardTitle>
            <CardDescription className="text-[#737373]">
              What must be configured for the queue, automated research, and live publishing.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm text-[#737373] sm:grid-cols-2">
            <StatusLine ok={systemStatus.supabaseStorageConfigured} label="Supabase URL + anon key (queue storage)" />
            <StatusLine ok={systemStatus.supabaseAdminConfigured} label="Service role key (evaluate & publish to live directory)" />
            <StatusLine ok={systemStatus.researchProviderConfigured} label="OpenAI Responses API (required for the evaluator)" />
            {systemStatus.researchProviderConfigured && (
              <p className="sm:col-span-2 text-xs text-[#737373]">
                Active setup: <span className="font-medium text-[#0f172a]">OpenAI Responses API · {systemStatus.researchModel}</span>
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {errorMessage && (
        <Card className="mb-6 rounded-[8px] border border-amber-200 bg-amber-50 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <CardHeader>
            <CardTitle className="text-amber-900">Admin queue unavailable</CardTitle>
            <CardDescription className="text-amber-800">{errorMessage}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={() => fetchSubmissions()} variant="outline" size="sm" className="rounded-[8px] border-[#e0e0e0]">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-[#1f1f1f] hover:bg-[#fafafa] hover:text-[#629649]">
              <Link href="/admin">Admin overview</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ToolSubmissionStatus)} className="w-full">
        <TabsList className="grid h-auto w-full grid-cols-3 rounded-[8px] border border-[#e0e0e0] bg-[#fafafa] p-1">
          {STATUS_TABS.map((status) => (
            <TabsTrigger
              key={status}
              value={status}
              className="rounded-[6px] data-[state=active]:bg-white data-[state=active]:text-[#0f172a] data-[state=active]:shadow-sm"
            >
              {formatTabLabel(status)} ({submissionCounts[status]})
            </TabsTrigger>
          ))}
        </TabsList>

        {STATUS_TABS.map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight text-[#0f172a]">{formatSectionHeading(status)}</h2>
              <Button
                onClick={() => fetchSubmissions({ background: true })}
                variant="outline"
                size="sm"
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
            </div>
            <SubmissionsList
              submissions={status === activeTab ? activeSubmissions : submissions.filter((submission) => submission.status === status)}
              onViewDetails={setSelectedSubmission}
              onDelete={setSubmissionToDelete}
              onAcceptAuto={
                systemStatus?.researchProviderConfigured && systemStatus?.supabaseAdminConfigured
                  ? handleAcceptAutoPublish
                  : undefined
              }
              autoPublishingId={autoPublishingId}
              acceptAutoUnavailableReason={
                !systemStatus?.supabaseAdminConfigured
                  ? 'Configure SUPABASE_SERVICE_ROLE_KEY'
                  : !systemStatus?.researchProviderConfigured
                    ? 'Configure OPENAI_API_KEY'
                    : undefined
              }
            />
          </TabsContent>
        ))}
      </Tabs>
      </AdminContent>

      <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
        <DialogContent className="max-h-[85vh] max-w-5xl overflow-y-auto rounded-[8px] border-[#e0e0e0] shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          {selectedSubmission && formState && (
            <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-[#0f172a]">
                    <Eye className="h-5 w-5 text-[#629649]" aria-hidden />
                    Submission Details
                  </DialogTitle>
                <DialogDescription className="text-[#737373]">
                  <span className="font-semibold text-[#1f1f1f]">Accept</span> runs OpenAI web research, normalizes the listing, checks required fields, and publishes live — no manual pass required. Use the fields below only if you want to tweak copy first, then choose &quot;Publish using form fields&quot;. One-click Accept needs the OpenAI and Supabase server keys.
                </DialogDescription>
                </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#999999]">
                        Submission Info
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#999999]" />
                          <span className="text-sm">
                            Submitted: {new Date(selectedSubmission.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-[#999999]" />
                          <span className="text-sm">{selectedSubmission.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-[#999999]" />
                          <a
                            href={selectedSubmission.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-[#2563eb] hover:underline"
                          >
                            {selectedSubmission.website}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#999999]">
                        User Comment
                      </h3>
                      <div className="flex items-start gap-2">
                        <MessageSquare className="mt-1 h-4 w-4 shrink-0 text-[#999999]" />
                        <p className="rounded-[8px] border border-[#e0e0e0] bg-[#fafafa] p-3 text-sm text-[#1f1f1f]">{selectedSubmission.comment}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#999999]">
                        Status
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {getStatusBadge(selectedSubmission.status)}
                        {getResearchStatusBadge(selectedSubmission.researchStatus)}
                      </div>
                    </div>

                    {(selectedSubmission.name || selectedSubmission.category || selectedSubmission.oneLiner) && (
                      <div>
                        <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#999999]">
                          Current Tool Snapshot
                        </h3>
                        <div className="space-y-2 rounded-[8px] border border-[#e0e0e0] bg-[#fafafa] p-3 text-sm text-[#1f1f1f]">
                          {selectedSubmission.name && <p><strong>Name:</strong> {selectedSubmission.name}</p>}
                          {selectedSubmission.category && <p><strong>Category:</strong> {formatSubmissionCategory(selectedSubmission.category)}</p>}
                          {selectedSubmission.oneLiner && <p><strong>Tagline:</strong> {selectedSubmission.oneLiner}</p>}
                        </div>
                      </div>
                    )}

                    {selectedSubmission.description && (
                      <div>
                        <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#999999]">
                          Current Description
                        </h3>
                        <div className="max-h-32 overflow-y-auto rounded-[8px] border border-[#e0e0e0] bg-[#fafafa] p-3 text-sm text-[#1f1f1f]">
                          {selectedSubmission.description}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 rounded-[8px] border border-[#e0e0e0] bg-[#fafafa]/40 p-4 md:p-5">
                  <div>
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#999999]">
                      Manual Review Fields
                    </h3>
                    <p className="mt-1 text-sm text-[#737373]">
                      For manual publish only: values here override research output. The primary Accept button does not require editing this form.
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
                        className={adminInputClass}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="submission-slug">Slug</Label>
                      <Input
                        id="submission-slug"
                        value={formState.slug}
                        onChange={(event) => setFormState({ ...formState, slug: event.target.value })}
                        placeholder="tool-slug"
                        className={adminInputClass}
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
                        className={adminInputClass}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="submission-category">Category</Label>
                      <Select
                        value={formState.category || undefined}
                        onValueChange={(value) => setFormState({ ...formState, category: value })}
                      >
                        <SelectTrigger id="submission-category" className={adminSelectTriggerClass}>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-[8px] border-[#e0e0e0]">
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
                        <SelectTrigger id="submission-research-status" className={adminSelectTriggerClass}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-[8px] border-[#e0e0e0]">
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
                        className={adminInputClass}
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
                        className={adminTextareaClass}
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
                        className={adminTextareaClass}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="submission-country">Country</Label>
                      <Input
                        id="submission-country"
                        value={formState.country}
                        onChange={(event) => setFormState({ ...formState, country: event.target.value })}
                        placeholder="Country"
                        className={adminInputClass}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="submission-city">City</Label>
                      <Input
                        id="submission-city"
                        value={formState.city}
                        onChange={(event) => setFormState({ ...formState, city: event.target.value })}
                        placeholder="City"
                        className={adminInputClass}
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
                        className={adminInputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => setSubmissionToDelete(selectedSubmission)}
                    disabled={pendingAction !== null}
                    variant="outline"
                    className="rounded-[8px] border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>

                  <Button
                    onClick={handleRetryResearch}
                    disabled={
                      pendingAction !== null
                      || (systemStatus !== null && !systemStatus.researchProviderConfigured)
                    }
                    variant="outline"
                    className="rounded-[8px] border-[#e0e0e0]"
                    title={
                      systemStatus && !systemStatus.researchProviderConfigured
                        ? 'Set OPENAI_API_KEY to run automated research'
                        : undefined
                    }
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
                    className="rounded-[8px] border-[#e0e0e0]"
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
                      onClick={handleReject}
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
                      onClick={handlePublishFromForm}
                      disabled={pendingAction !== null}
                      variant="outline"
                      className="rounded-[8px] border-[#e0e0e0]"
                    >
                      {pendingAction === 'approveManual' ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      )}
                      Publish using form fields
                    </Button>
                    <Button
                      onClick={() => void handleAcceptAutoPublish()}
                      disabled={
                        pendingAction !== null
                        || !systemStatus?.researchProviderConfigured
                        || !systemStatus?.supabaseAdminConfigured
                      }
                      className="rounded-[8px] bg-[#629649] hover:bg-[#548040]"
                      title={
                        !systemStatus?.supabaseAdminConfigured
                          ? 'Set SUPABASE_SERVICE_ROLE_KEY'
                          : !systemStatus?.researchProviderConfigured
                            ? 'Set OPENAI_API_KEY for one-click accept'
                            : undefined
                      }
                    >
                      {pendingAction === 'approveAuto' ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Rocket className="mr-2 h-4 w-4" />
                      )}
                      Run evaluator
                    </Button>
                  </div>
                )}

                {selectedSubmission.status === 'approved' && selectedSubmission.slug && (
                  <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline" className="rounded-[8px] border-[#e0e0e0]">
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

      <Dialog open={!!submissionToDelete} onOpenChange={(open) => !open && setSubmissionToDelete(null)}>
        <DialogContent className="max-w-md rounded-[8px] border-[#e0e0e0]">
          <DialogHeader>
            <DialogTitle className="text-[#0f172a]">Delete submission?</DialogTitle>
            <DialogDescription className="text-[#737373]">
              This permanently removes the submission from the queue. It cannot be undone.
              {submissionToDelete && (
                <span className="mt-2 block font-medium text-[#1f1f1f]">
                  {submissionToDelete.name || submissionToDelete.website}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setSubmissionToDelete(null)}
              disabled={pendingAction === 'delete'}
              className="rounded-[8px] border-[#e0e0e0]"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => void handleDelete()}
              disabled={pendingAction === 'delete'}
            >
              {pendingAction === 'delete' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function StatusLine({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-[#0f172a]">
      {ok ? (
        <CheckCircle className="h-4 w-4 shrink-0 text-[#629649]" aria-hidden />
      ) : (
        <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" aria-hidden />
      )}
      <span>{label}</span>
    </div>
  );
}

interface SubmissionsListProps {
  submissions: ToolSubmission[];
  onViewDetails: (submission: ToolSubmission) => void;
  onDelete: (submission: ToolSubmission) => void;
  onAcceptAuto?: (submission: ToolSubmission) => void;
  autoPublishingId: string | null;
  acceptAutoUnavailableReason?: string;
}

function SubmissionsList({
  submissions,
  onViewDetails,
  onDelete,
  onAcceptAuto,
  autoPublishingId,
  acceptAutoUnavailableReason,
}: SubmissionsListProps) {
  if (submissions.length === 0) {
    return (
      <Card className={adminCardClass}>
        <CardContent className="flex items-center justify-center py-10">
          <p className="text-sm text-[#737373]">No submissions in this tab.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <Card
          key={submission.submissionId}
          className={cn(
            adminCardClass,
            'transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]',
          )}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold tracking-tight text-[#0f172a]">{submission.name || 'Research in Progress'}</h3>
                  <div className="flex flex-wrap gap-2">
                    {getStatusBadge(submission.status)}
                    {getResearchStatusBadge(submission.researchStatus)}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 text-sm text-[#737373] md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 shrink-0 text-[#999999]" aria-hidden />
                    <a
                      href={submission.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-[#2563eb] hover:underline"
                    >
                      {submission.website}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 shrink-0 text-[#999999]" aria-hidden />
                    <span className="truncate">{submission.email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0 text-[#999999]" aria-hidden />
                    <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {submission.comment && (
                  <div className="mt-3">
                    <p className="line-clamp-2 text-sm text-[#737373]">
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

              <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-start">
                {submission.status === 'pending' && onAcceptAuto && (
                  <Button
                    type="button"
                    onClick={() => onAcceptAuto(submission)}
                    disabled={Boolean(autoPublishingId)}
                    size="sm"
                    className="rounded-[8px] bg-[#629649] hover:bg-[#548040]"
                    title={acceptAutoUnavailableReason}
                  >
                    {autoPublishingId === submission.submissionId ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Rocket className="mr-2 h-4 w-4" />
                    )}
                    Accept
                  </Button>
                )}
                <Button
                  onClick={() => onViewDetails(submission)}
                  variant="outline"
                  size="sm"
                  className="rounded-[8px] border-[#e0e0e0]"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
                <Button
                  onClick={() => onDelete(submission)}
                  variant="outline"
                  size="sm"
                  className="rounded-[8px] border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  title="Permanently delete this submission"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
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
