import { getListStats, getListTags, getListInterests } from '@/lib/mailchimp';
import { AdminContent, AdminHero, AdminSignOutButton, adminCardClass } from '@/components/admin/AdminChrome';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserMinus, UserX, Tags, Target } from 'lucide-react';
import Link from 'next/link';
import { requireAdminPageAuth } from '@/lib/admin-auth';
import { cn } from '@/lib/utils';

export default async function NewsletterAdminPage() {
  await requireAdminPageAuth('/admin/newsletter');

  const heroActions = (
    <>
      <Button asChild variant="outline" className="rounded-[8px] border-[#e0e0e0]">
        <Link href="/admin">Back to admin</Link>
      </Button>
      <AdminSignOutButton />
    </>
  );

  if (!process.env.MAILCHIMP_API_KEY || !process.env.MAILCHIMP_LIST_ID) {
    return (
      <>
        <AdminHero
          kicker="Mailchimp"
          title="Newsletter administration"
          description="Subscriber stats and list configuration require Mailchimp credentials in this environment."
          actions={heroActions}
        />
        <AdminContent className="max-w-4xl">
          <Card className={cn(adminCardClass)}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#0f172a]">Not configured</CardTitle>
              <CardDescription className="text-[#737373]">
                Add <code className="rounded bg-[#f4f4f5] px-1.5 py-0.5 text-xs">MAILCHIMP_API_KEY</code> and{' '}
                <code className="rounded bg-[#f4f4f5] px-1.5 py-0.5 text-xs">MAILCHIMP_LIST_ID</code> to enable this page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#737373]">The public site and submissions admin continue to work without Mailchimp.</p>
            </CardContent>
          </Card>
        </AdminContent>
      </>
    );
  }

  let stats = null;
  let tags:
    | Array<{ id: number; name: string; memberCount: number }>
    | null = null;
  let interests = null;
  let error: string | null = null;

  try {
    const [statsResult, tagsResult, interestsResult] = await Promise.all([
      getListStats(),
      getListTags(),
      getListInterests(),
    ]);

    if (statsResult.success) {
      stats = statsResult.stats;
    } else {
      error = statsResult.error ?? null;
    }

    if (tagsResult.success) {
      tags = tagsResult.tags as Array<{ id: number; name: string; memberCount: number }>;
    }

    if (interestsResult.success) {
      interests = interestsResult.categories;
    }
  } catch {
    error = 'Failed to load newsletter statistics';
  }

  if (error) {
    return (
      <>
        <AdminHero
          kicker="Mailchimp"
          title="Newsletter administration"
          description="Monitor Mailchimp list health and segments."
          actions={heroActions}
        />
        <AdminContent className="max-w-4xl">
          <Card className={cn(adminCardClass, 'border-red-200')}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-red-800">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#1f1f1f]">{error}</p>
              <p className="mt-2 text-sm text-[#737373]">
                Confirm Mailchimp API key and List ID in environment variables.
              </p>
            </CardContent>
          </Card>
        </AdminContent>
      </>
    );
  }

  return (
    <>
      <AdminHero
        kicker="Mailchimp"
        title="Newsletter administration"
        description="Subscriber counts, tags, and interest groups for your AI CRE Tools audience."
        actions={heroActions}
      />

      <AdminContent className="max-w-4xl">
        {stats && (
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className={cn(adminCardClass)}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#1f1f1f]">Total subscribers</CardTitle>
                <Users className="h-4 w-4 text-[#737373]" aria-hidden />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold tabular-nums text-[#0f172a]">
                  {stats.memberCount?.toLocaleString() ?? 0}
                </div>
                <p className="text-xs text-[#737373]">Active on this list</p>
              </CardContent>
            </Card>

            <Card className={cn(adminCardClass)}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#1f1f1f]">Unsubscribed</CardTitle>
                <UserMinus className="h-4 w-4 text-[#737373]" aria-hidden />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold tabular-nums text-[#0f172a]">
                  {stats.unsubscribeCount?.toLocaleString() ?? 0}
                </div>
                <p className="text-xs text-[#737373]">Opt-outs</p>
              </CardContent>
            </Card>

            <Card className={cn(adminCardClass)}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#1f1f1f]">Cleaned</CardTitle>
                <UserX className="h-4 w-4 text-[#737373]" aria-hidden />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold tabular-nums text-[#0f172a]">
                  {stats.cleanedCount?.toLocaleString() ?? 0}
                </div>
                <p className="text-xs text-[#737373]">Invalid / bounced removed</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className={cn(adminCardClass)}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#0f172a]">Integration status</CardTitle>
            <CardDescription className="text-[#737373]">Mailchimp API is configured for this deployment.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-[#1f1f1f]">
              {[
                'Mailchimp API connection',
                'Email validation on signup',
                'Duplicate handling',
                'Server-side subscription routes',
              ].map((line) => (
                <li key={line} className="flex items-center gap-2">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[#629649]" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {tags && tags.length > 0 && (
          <Card className={cn(adminCardClass, 'mt-6')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#0f172a]">
                <Tags className="h-5 w-5 text-[#629649]" aria-hidden />
                Tags
              </CardTitle>
              <CardDescription className="text-[#737373]">Segments applied to subscribers.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="rounded-[6px] border border-[#e8e8e8] bg-[#fafafa] font-normal text-[#1f1f1f]"
                  >
                    {tag.name}
                    <span className="ml-1 text-xs text-[#737373]">({tag.memberCount})</span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {interests && interests.length > 0 && (
          <Card className={cn(adminCardClass, 'mt-6')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#0f172a]">
                <Target className="h-5 w-5 text-[#629649]" aria-hidden />
                Interest categories
              </CardTitle>
              <CardDescription className="text-[#737373]">Groups configured in Mailchimp.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {interests.map((category) => (
                  <div key={category.id}>
                    <h4 className="mb-2 font-medium text-[#0f172a]">{category.title}</h4>
                    <div className="flex flex-wrap gap-2">
                      {category.interests.map((interest) => (
                        <Badge
                          key={interest.id}
                          variant="outline"
                          className="rounded-[6px] border-[#e0e0e0] font-normal text-[#1f1f1f]"
                        >
                          {interest.name}
                          <span className="ml-1 text-xs text-[#737373]">({interest.subscriberCount})</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className={cn(adminCardClass, 'mt-6')}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#0f172a]">Quick actions</CardTitle>
            <CardDescription className="text-[#737373]">External tools and examples.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="mb-2 font-medium text-[#0f172a]">Mailchimp dashboard</h4>
              <p className="mb-3 text-sm text-[#737373]">Campaigns, automations, and detailed analytics.</p>
              <Button asChild className="rounded-[8px]">
                <a href="https://mailchimp.com/login/" target="_blank" rel="noopener noreferrer">
                  Open Mailchimp
                </a>
              </Button>
            </div>
            <div>
              <h4 className="mb-2 font-medium text-[#0f172a]">Newsletter examples</h4>
              <p className="mb-3 text-sm text-[#737373]">Forms and tagging patterns on the marketing site.</p>
              <Button asChild variant="outline" className="rounded-[8px] border-[#e0e0e0]">
                <Link href="/newsletter-examples">View examples</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </AdminContent>
    </>
  );
}
