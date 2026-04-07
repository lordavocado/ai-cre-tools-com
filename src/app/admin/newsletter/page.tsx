import { getListStats, getListTags, getListInterests } from "@/lib/mailchimp";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, UserMinus, UserX, Tags, Target } from "lucide-react";
import Link from "next/link";
import { requireAdminPageAuth } from "@/lib/admin-auth";

export default async function NewsletterAdminPage() {
  await requireAdminPageAuth('/admin/newsletter');

  // Gracefully handle missing Mailchimp env vars to avoid build failures
  if (!process.env.MAILCHIMP_API_KEY || !process.env.MAILCHIMP_LIST_ID) {
    return (
      <div className="container py-12 md:py-16 max-w-4xl mx-auto">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <h1 className="text-3xl md:text-4xl font-bold">Newsletter Administration</h1>
          <form action="/api/admin/logout" method="post">
            <Button type="submit" variant="outline">Sign Out</Button>
          </form>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Mailchimp Not Configured</CardTitle>
            <CardDescription>
              This environment does not have Mailchimp credentials set. Add <code>MAILCHIMP_API_KEY</code> and <code>MAILCHIMP_LIST_ID</code> to enable this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">The rest of the site will continue to work normally.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  let stats = null;
  let tags = null;
  let interests = null;
  let error = null;

  try {
    const [statsResult, tagsResult, interestsResult] = await Promise.all([
      getListStats(),
      getListTags(),
      getListInterests()
    ]);
    
    if (statsResult.success) {
      stats = statsResult.stats;
    } else {
      error = statsResult.error;
    }
    
    if (tagsResult.success) {
      tags = tagsResult.tags;
    }
    
    if (interestsResult.success) {
      interests = interestsResult.categories;
    }
  } catch (e) {
    error = "Failed to load newsletter statistics";
  }

  if (error) {
    return (
      <div className="container py-12 md:py-16 max-w-4xl mx-auto">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <h1 className="text-3xl md:text-4xl font-bold">Newsletter Administration</h1>
          <form action="/api/admin/logout" method="post">
            <Button type="submit" variant="outline">Sign Out</Button>
          </form>
        </div>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Make sure your Mailchimp API key and List ID are correctly configured in your environment variables.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-16 max-w-4xl mx-auto">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Newsletter Administration</h1>
          <p className="text-muted-foreground">
            Monitor your Mailchimp newsletter subscription statistics.
          </p>
        </div>
        <form action="/api/admin/logout" method="post">
          <Button type="submit" variant="outline">Sign Out</Button>
        </form>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.memberCount?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">
                Active newsletter subscribers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unsubscribed</CardTitle>
              <UserMinus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.unsubscribeCount?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">
                Users who unsubscribed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cleaned</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.cleanedCount?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">
                Invalid/bounced emails removed
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
          <CardDescription>
            Mailchimp newsletter integration is active and working.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Mailchimp API connection established</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Email validation enabled</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Duplicate subscription handling active</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Server-side security measures in place</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tags Section */}
      {tags && tags.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tags className="h-5 w-5" />
              Active Tags
            </CardTitle>
            <CardDescription>
              Tags used to categorize and segment your subscribers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: any) => (
                <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
                  {tag.name}
                  <span className="text-xs opacity-75">({tag.memberCount})</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interests Section */}
      {interests && interests.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Interest Categories
            </CardTitle>
            <CardDescription>
              Interest groups for targeted content delivery.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {interests.map((category) => (
                <div key={category.id}>
                  <h4 className="font-medium mb-2">{category.title}</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.interests.map((interest) => (
                      <Badge key={interest.id} variant="outline" className="flex items-center gap-1">
                        {interest.name}
                        <span className="text-xs opacity-75">({interest.subscriberCount})</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Manage your newsletter integration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Mailchimp Dashboard</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Access your full Mailchimp dashboard for advanced management, campaign creation, and detailed analytics.
              </p>
              <a 
                href="https://mailchimp.com/login/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Open Mailchimp Dashboard
              </a>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Newsletter Examples</h4>
              <p className="text-sm text-muted-foreground mb-3">
                See different newsletter forms and their tagging configurations in action.
              </p>
              <Link
                href="/newsletter-examples"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                View Newsletter Examples
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
