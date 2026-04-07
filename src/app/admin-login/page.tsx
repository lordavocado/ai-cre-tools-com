import { redirect } from 'next/navigation';
import { AlertCircle, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isAdminCredentialsConfigured, isAuthenticatedAdminRequest, normalizeAdminNextPath } from '@/lib/admin-auth';

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

  if (isAdminCredentialsConfigured() && await isAuthenticatedAdminRequest()) {
    redirect(nextPath);
  }

  const errorMessage = getErrorMessage(params.error);

  return (
    <div className="container mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-10">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LockKeyhole className="h-5 w-5" />
            Admin Sign In
          </CardTitle>
          <CardDescription>
            Sign in to review submitted tools and manage the admin area.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          <form action="/api/admin/login" method="post" className="space-y-4">
            <input type="hidden" name="next" value={nextPath} />

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                autoComplete="username"
                defaultValue="admin"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
