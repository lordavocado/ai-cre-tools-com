"use client";

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ToolSubmission } from '@/lib/supabase';
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
} from 'lucide-react';

export default function SubmissionsDashboard() {
  const [submissions, setSubmissions] = useState<ToolSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<ToolSubmission | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { toast } = useToast();

  const redirectToLogin = useCallback(() => {
    window.location.href = '/admin-login?next=/admin/submissions';
  }, []);

  const fetchSubmissions = useCallback(async (status?: 'pending' | 'approved' | 'rejected') => {
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/submissions${status ? `?status=${status}` : ''}`);
      const data = await response.json().catch(() => null);

      if (response.ok) {
        setSubmissions(Array.isArray(data) ? data : []);
        setErrorMessage(null);
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
      setLoading(false);
    }
  }, [redirectToLogin, toast]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleStatusUpdate = async (submissionId: string, status: 'approved' | 'rejected') => {
    setActionLoading(true);

    try {
      const response = await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ submissionId, status }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Submission ${status} successfully`,
        });
        fetchSubmissions();
        setSelectedSubmission(null);
        return;
      }

      if (response.status === 401) {
        redirectToLogin();
        return;
      }

      toast({
        title: 'Error',
        description: `Failed to ${status} submission`,
        variant: 'destructive',
      });
    } catch (error) {
      console.error('Error updating submission:', error);
      toast({
        title: 'Error',
        description: `Failed to ${status} submission`,
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

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
          <p className="text-gray-600">Review and manage tool submissions from users</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/admin">Back to Admin</Link>
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

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" onClick={() => fetchSubmissions('pending')}>
            Pending ({submissions.filter((submission) => submission.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="approved" onClick={() => fetchSubmissions('approved')}>
            Approved ({submissions.filter((submission) => submission.status === 'approved').length})
          </TabsTrigger>
          <TabsTrigger value="rejected" onClick={() => fetchSubmissions('rejected')}>
            Rejected ({submissions.filter((submission) => submission.status === 'rejected').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Pending Submissions</h2>
            <Button onClick={() => fetchSubmissions('pending')} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
          <SubmissionsList
            submissions={submissions.filter((submission) => submission.status === 'pending')}
            onViewDetails={setSelectedSubmission}
          />
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Approved Submissions</h2>
            <Button onClick={() => fetchSubmissions('approved')} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
          <SubmissionsList
            submissions={submissions.filter((submission) => submission.status === 'approved')}
            onViewDetails={setSelectedSubmission}
          />
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Rejected Submissions</h2>
            <Button onClick={() => fetchSubmissions('rejected')} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
          <SubmissionsList
            submissions={submissions.filter((submission) => submission.status === 'rejected')}
            onViewDetails={setSelectedSubmission}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
          {selectedSubmission && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Submission Details
                </DialogTitle>
                <DialogDescription>Review the tool submission and take action</DialogDescription>
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
                        {selectedSubmission.website && (
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
                        )}
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
                      <div className="flex gap-2">
                        {getStatusBadge(selectedSubmission.status)}
                        {getResearchStatusBadge(selectedSubmission.researchStatus)}
                      </div>
                    </div>

                    {(selectedSubmission.name || selectedSubmission.category) && (
                      <div>
                        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                          Research Results
                        </h3>
                        <div className="space-y-2">
                          {selectedSubmission.name && (
                            <p className="text-sm"><strong>Name:</strong> {selectedSubmission.name}</p>
                          )}
                          {selectedSubmission.category && (
                            <p className="text-sm"><strong>Category:</strong> {selectedSubmission.category}</p>
                          )}
                          {selectedSubmission.oneLiner && (
                            <p className="text-sm"><strong>Tagline:</strong> {selectedSubmission.oneLiner}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedSubmission.description && (
                      <div>
                        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                          Description
                        </h3>
                        <div className="max-h-32 overflow-y-auto rounded-lg bg-gray-50 p-3 text-sm">
                          {selectedSubmission.description}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter className="flex gap-2">
                {selectedSubmission.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => handleStatusUpdate(selectedSubmission.submissionId, 'rejected')}
                      disabled={actionLoading}
                      variant="destructive"
                    >
                      {actionLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="mr-2 h-4 w-4" />
                      )}
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(selectedSubmission.submissionId, 'approved')}
                      disabled={actionLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {actionLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      )}
                      Approve
                    </Button>
                  </>
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
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{submission.name || 'Research in Progress'}</h3>
                  <div className="flex gap-2">
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
                  <div className="mt-3 flex gap-4 text-sm">
                    {submission.category && (
                      <span><strong>Category:</strong> {submission.category}</span>
                    )}
                    {submission.oneLiner && (
                      <span><strong>Tagline:</strong> {submission.oneLiner}</span>
                    )}
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
