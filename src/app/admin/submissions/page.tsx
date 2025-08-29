"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ToolSubmission } from '@/lib/sheets';
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
  RefreshCw
} from 'lucide-react';

export default function SubmissionsDashboard() {
  const [submissions, setSubmissions] = useState<ToolSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ToolSubmission | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { toast } = useToast();

  const fetchSubmissions = async (status?: 'pending' | 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/admin/submissions${status ? `?status=${status}` : ''}`);
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch submissions",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch submissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

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
          title: "Success",
          description: `Submission ${status} successfully`,
        });
        fetchSubmissions(); // Refresh the list
        setSelectedSubmission(null);
      } else {
        toast({
          title: "Error",
          description: `Failed to ${status} submission`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating submission:', error);
      toast({
        title: "Error",
        description: `Failed to ${status} submission`,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getResearchStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Research Complete</Badge>;
      case 'failed':
        return <Badge variant="destructive">Research Failed</Badge>;
      default:
        return <Badge variant="secondary">Research Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tool Submissions Dashboard
        </h1>
        <p className="text-gray-600">
          Review and manage tool submissions from users
        </p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" onClick={() => fetchSubmissions('pending')}>
            Pending ({submissions.filter(s => s.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="approved" onClick={() => fetchSubmissions('approved')}>
            Approved ({submissions.filter(s => s.status === 'approved').length})
          </TabsTrigger>
          <TabsTrigger value="rejected" onClick={() => fetchSubmissions('rejected')}>
            Rejected ({submissions.filter(s => s.status === 'rejected').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Pending Submissions</h2>
            <Button onClick={() => fetchSubmissions('pending')} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
          <SubmissionsList
            submissions={submissions.filter(s => s.status === 'pending')}
            onViewDetails={setSelectedSubmission}
          />
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Approved Submissions</h2>
            <Button onClick={() => fetchSubmissions('approved')} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
          <SubmissionsList
            submissions={submissions.filter(s => s.status === 'approved')}
            onViewDetails={setSelectedSubmission}
          />
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Rejected Submissions</h2>
            <Button onClick={() => fetchSubmissions('rejected')} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
          <SubmissionsList
            submissions={submissions.filter(s => s.status === 'rejected')}
            onViewDetails={setSelectedSubmission}
          />
        </TabsContent>
      </Tabs>

      {/* Submission Details Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedSubmission && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Submission Details
                </DialogTitle>
                <DialogDescription>
                  Review the tool submission and take action
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-2">
                        Submission Info
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            Submitted: {new Date(selectedSubmission.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{selectedSubmission.email}</span>
                        </div>
                        {selectedSubmission.website && (
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <a
                              href={selectedSubmission.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline flex items-center"
                            >
                              {selectedSubmission.website}
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-2">
                        User Comment
                      </h3>
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                        <p className="text-sm bg-gray-50 p-3 rounded-lg">
                          {selectedSubmission.comment}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-2">
                        Status
                      </h3>
                      <div className="flex gap-2">
                        {getStatusBadge(selectedSubmission.status)}
                        {getResearchStatusBadge(selectedSubmission.researchStatus)}
                      </div>
                    </div>

                    {(selectedSubmission.name || selectedSubmission.category) && (
                      <div>
                        <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-2">
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
                        <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-2">
                          Description
                        </h3>
                        <div className="text-sm bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto">
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
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-2" />
                      )}
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(selectedSubmission.submissionId, 'approved')}
                      disabled={actionLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {actionLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
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
        <Card key={submission.submissionId} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">
                    {submission.name || 'Research in Progress'}
                  </h3>
                  <div className="flex gap-2">
                    {getStatusBadge(submission.status)}
                    {getResearchStatusBadge(submission.researchStatus)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <a
                      href={submission.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate"
                    >
                      {submission.website}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{submission.email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {submission.comment && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 line-clamp-2">
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

              <Button
                onClick={() => onViewDetails(submission)}
                variant="outline"
                size="sm"
              >
                <Eye className="w-4 h-4 mr-2" />
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
      return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    case 'approved':
      return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
    case 'rejected':
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
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

