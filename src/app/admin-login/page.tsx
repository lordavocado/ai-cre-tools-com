import { redirect } from 'next/navigation';
import { AlertCircle, LockKeyhole } from 'lucide-react';
import { AdminContent, adminCardClass, adminInputClass } from '@/components/admin/AdminChrome';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isAdminCredentialsConfigured, isAuthenticatedAdminRequest, normalizeAdminNextPath } from '@/lib/admin-auth';
import { cn } from '@/lib/utils';

type AdminLoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

function getErrorMessage(error: string | undefined) {
  switch (error) {
    case 'invalid':
      return 'The username or password was not correct.';
    case 'unavailable':
      return 'Admin access is unavailable because ADMIN_PASSWORD is not configured.';
    default:
      return null;
  }
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams;
  const nextPath = normalizeAdminNextPath(params.next);
  /** Shown as default in the username field; must match `ADMIN_USERNAME` when set. */
  const defaultUsername = process.env.ADMIN_USERNAME?.trim() || 'admin';

  if (isAdminCredentialsConfigured() && await isAuthenticatedAdminRequest()) {
    redirect(nextPath);
  }

  const errorMessage = getErrorMessage(params.error);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="border-b border-[#e0e0e0] bg-[#fafafa] py-10 md:py-12">
        <div className="container px-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#999999]">Admin</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-[#0f172a] sm:text-3xl">Sign in</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#737373]">Access the review queue and directory tools.</p>
        </div>
      </div>

      <AdminContent className="flex max-w-md flex-col justify-center py-10 md:py-14">
        <Card className={cn(adminCardClass, 'w-full')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#0f172a]">
              <LockKeyhole className="h-5 w-5 text-[#629649]" aria-hidden />
              Admin credentials
            </CardTitle>
            <CardDescription className="text-[#737373]">
              Use the username and password configured for this environment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {errorMessage && (
              <div className="rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            <form action="/api/admin/login" method="post" className="space-y-4">
              <input type="hidden" name="next" value={nextPath} />

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-[#1f1f1f]">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  autoComplete="username"
                  defaultValue={defaultUsername}
                  required
                  className={adminInputClass}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-[#1f1f1f]">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={adminInputClass}
                />
              </div>

              <Button type="submit" className="h-11 w-full rounded-[8px] font-semibold">
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>
      </AdminContent>
    </div>
  );
}
