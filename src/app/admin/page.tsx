import Link from 'next/link';
import { ArrowRight, Database, Lock, Search, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminContent, AdminHero, AdminSignOutButton, adminCardClass } from '@/components/admin/AdminChrome';
import { requireAdminPageAuth } from '@/lib/admin-auth';
import { getToolSubmissionSystemStatus } from '@/lib/tool-submissions-config';
import { cn } from '@/lib/utils';

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        ok
          ? 'border-[#c8e6d0] bg-[#e8f5ec] text-[#2f7448]'
          : 'border-[#e0e0e0] bg-[#fafafa] text-[#737373]'
      )}
    >
      {label}
    </span>
  );
}

export default async function AdminHomePage() {
  await requireAdminPageAuth('/admin');
  const status = getToolSubmissionSystemStatus();
  const researchStatusLabel = status.researchProvider
    ? `${status.researchProvider.charAt(0).toUpperCase()}${status.researchProvider.slice(1)}`
    : 'Missing';

  return (
    <>
      <AdminHero
        kicker="Admin"
        title="Dashboard"
        description="Review submissions, edit live directory records, and monitor integration health — aligned with the same editorial UI as the public site."
        actions={<AdminSignOutButton />}
      />

      <AdminContent>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className={cn(adminCardClass)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#0f172a]">
                <Send className="h-5 w-5 text-[#629649]" aria-hidden />
                Submit tool flow
              </CardTitle>
              <CardDescription className="text-[#737373]">
                New submissions queue for review. One-click Accept runs research and publishes to production.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-[#1f1f1f]">
                <li>The public form posts to <code className="rounded bg-[#f4f4f5] px-1.5 py-0.5 text-xs">/api/submit-tool</code>.</li>
                <li>Each row is stored in Supabase for admin review.</li>
                <li>Optional: open a row to tweak fields before publishing.</li>
                <li>
                  <strong className="font-semibold text-[#0f172a]">Accept</strong> runs AI research, auto-fill, verification, and live publish.
                </li>
              </ol>
              <Button asChild className="rounded-[8px]">
                <Link href="/admin/submissions">
                  Open submissions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className={cn(adminCardClass)}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#0f172a]">System status</CardTitle>
              <CardDescription className="text-[#737373]">
                Environment checks for the submission pipeline and directory publishing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-4 border-b border-[#f0f0f0] pb-3">
                <div className="flex items-center gap-2 text-sm text-[#1f1f1f]">
                  <Lock className="h-4 w-4 text-[#737373]" aria-hidden />
                  Admin basic auth
                </div>
                <StatusPill ok={status.adminBasicAuthConfigured} label={status.adminBasicAuthConfigured ? 'OK' : 'Missing'} />
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-[#f0f0f0] pb-3">
                <div className="flex items-center gap-2 text-sm text-[#1f1f1f]">
                  <Database className="h-4 w-4 text-[#737373]" aria-hidden />
                  Submission storage (Supabase)
                </div>
                <StatusPill ok={status.supabaseStorageConfigured} label={status.supabaseStorageConfigured ? 'OK' : 'Missing'} />
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-[#f0f0f0] pb-3">
                <div className="flex items-center gap-2 text-sm text-[#1f1f1f]">
                  <Database className="h-4 w-4 text-[#737373]" aria-hidden />
                  Live publishing (service role)
                </div>
                <StatusPill ok={status.supabaseAdminConfigured} label={status.supabaseAdminConfigured ? 'OK' : 'Missing'} />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-[#1f1f1f]">
                  <Search className="h-4 w-4 text-[#737373]" aria-hidden />
                  Automated research
                </div>
                <StatusPill ok={status.researchProviderConfigured} label={researchStatusLabel} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Card className={cn(adminCardClass)}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#0f172a]">Submissions</CardTitle>
              <CardDescription className="text-[#737373]">Pending queue, Accept, and manual overrides.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full rounded-[8px] border-[#e0e0e0]">
                <Link href="/admin/submissions">
                  Review queue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className={cn(adminCardClass)}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#0f172a]">Live tools</CardTitle>
              <CardDescription className="text-[#737373]">Edit published directory rows in Supabase.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full rounded-[8px] border-[#e0e0e0]">
                <Link href="/admin/tools">
                  Open directory editor
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className={cn(adminCardClass)}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#0f172a]">Newsletter</CardTitle>
              <CardDescription className="text-[#737373]">Mailchimp stats and list configuration.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full rounded-[8px] border-[#e0e0e0]">
                <Link href="/admin/newsletter">
                  Newsletter admin
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </AdminContent>
    </>
  );
}
