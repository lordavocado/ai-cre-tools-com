import Link from 'next/link';
import { ArrowRight, Database, Lock, Search, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { requireAdminPageAuth } from '@/lib/admin-auth';
import { getToolSubmissionSystemStatus } from '@/lib/tool-submissions-config';

function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <Badge variant={ok ? 'default' : 'secondary'} className={ok ? 'bg-green-600 hover:bg-green-600' : ''}>
      {label}
    </Badge>
  );
}

export default async function AdminHomePage() {
  await requireAdminPageAuth('/admin');
  const status = getToolSubmissionSystemStatus();

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">
              Review submitted tools, inspect integration health, and understand where research happens in the flow.
            </p>
          </div>
          <form action="/api/admin/logout" method="post">
            <Button type="submit" variant="outline">Sign Out</Button>
          </form>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Submit Tool Flow
            </CardTitle>
            <CardDescription>
              Tool research starts during submission. There is no separate manual &quot;start scraping&quot; action in admin yet.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-2">
              <li>The public form posts to <code>/api/submit-tool</code>.</li>
              <li>The API tries to research the tool with Perplexity immediately.</li>
              <li>The submission is then saved for review in the admin queue.</li>
              <li>Admin can approve or reject the saved submission from the submissions dashboard.</li>
            </ol>
            <Button asChild>
              <Link href="/admin/submissions">
                Open Submissions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              These checks explain whether submit-tool and admin review can work end-to-end in this environment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Lock className="h-4 w-4 text-gray-500" />
                Admin basic auth configured
              </div>
              <StatusBadge ok={status.adminBasicAuthConfigured} label={status.adminBasicAuthConfigured ? 'Configured' : 'Missing'} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Database className="h-4 w-4 text-gray-500" />
                Submission storage (Supabase)
              </div>
              <StatusBadge ok={status.supabaseStorageConfigured} label={status.supabaseStorageConfigured ? 'Configured' : 'Missing'} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Search className="h-4 w-4 text-gray-500" />
                Automated research (Perplexity)
              </div>
              <StatusBadge ok={status.perplexityConfigured} label={status.perplexityConfigured ? 'Configured' : 'Missing'} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Submissions Review</CardTitle>
            <CardDescription>
              Review pending tools, inspect research results, and approve or reject entries.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/admin/submissions">
                Go to Review Queue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Newsletter Admin</CardTitle>
            <CardDescription>
              Separate Mailchimp administration page for newsletter stats and tags.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/admin/newsletter">
                Open Newsletter Admin
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
