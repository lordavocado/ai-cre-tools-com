'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

interface SEOIssue {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  recommendation?: string;
  priority: 'high' | 'medium' | 'low';
}

interface SEOAuditProps {
  enableConsoleLogging?: boolean;
  showInUI?: boolean;
}

export function SEOAudit({ enableConsoleLogging = true, showInUI = false }: SEOAuditProps) {
  const [issues, setIssues] = useState<SEOIssue[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);

  const runSEOAudit = useCallback(async () => {
    setIsAuditing(true);
    const auditIssues: SEOIssue[] = [];

    try {
      // Check meta tags
      const title = document.title;
      if (!title || title.length < 30) {
        auditIssues.push({
          id: 'title-length',
          type: 'warning',
          message: 'Page title is too short',
          recommendation: 'Ensure title is between 30-60 characters for optimal SEO',
          priority: 'medium'
        });
      } else if (title.length > 60) {
        auditIssues.push({
          id: 'title-length',
          type: 'warning',
          message: 'Page title is too long',
          recommendation: 'Keep title under 60 characters to avoid truncation in search results',
          priority: 'medium'
        });
      } else {
        auditIssues.push({
          id: 'title-length',
          type: 'success',
          message: 'Page title length is optimal',
          priority: 'low'
        });
      }

      // Check meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        auditIssues.push({
          id: 'meta-description',
          type: 'error',
          message: 'Missing meta description',
          recommendation: 'Add a meta description tag with 150-160 characters',
          priority: 'high'
        });
      } else {
        const descContent = metaDescription.getAttribute('content') || '';
        if (descContent.length < 120) {
          auditIssues.push({
            id: 'meta-description',
            type: 'warning',
            message: 'Meta description is too short',
            recommendation: 'Expand description to 150-160 characters for better click-through rates',
            priority: 'medium'
          });
        } else if (descContent.length > 160) {
          auditIssues.push({
            id: 'meta-description',
            type: 'warning',
            message: 'Meta description is too long',
            recommendation: 'Keep description under 160 characters to avoid truncation',
            priority: 'medium'
          });
        } else {
          auditIssues.push({
            id: 'meta-description',
            type: 'success',
            message: 'Meta description length is optimal',
            priority: 'low'
          });
        }
      }

      // Check Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      const ogImage = document.querySelector('meta[property="og:image"]');

      if (!ogTitle || !ogDescription || !ogImage) {
        auditIssues.push({
          id: 'open-graph',
          type: 'warning',
          message: 'Missing Open Graph tags',
          recommendation: 'Add og:title, og:description, and og:image for better social media sharing',
          priority: 'medium'
        });
      } else {
        auditIssues.push({
          id: 'open-graph',
          type: 'success',
          message: 'Open Graph tags are properly configured',
          priority: 'low'
        });
      }

      // Check Twitter Card tags
      const twitterCard = document.querySelector('meta[name="twitter:card"]');
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');

      if (!twitterCard || !twitterTitle || !twitterDescription) {
        auditIssues.push({
          id: 'twitter-cards',
          type: 'warning',
          message: 'Missing Twitter Card tags',
          recommendation: 'Add twitter:card, twitter:title, and twitter:description for better Twitter sharing',
          priority: 'medium'
        });
      } else {
        auditIssues.push({
          id: 'twitter-cards',
          type: 'success',
          message: 'Twitter Card tags are properly configured',
          priority: 'low'
        });
      }

      // Check canonical URL
      const canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        auditIssues.push({
          id: 'canonical',
          type: 'warning',
          message: 'Missing canonical URL',
          recommendation: 'Add a canonical link to prevent duplicate content issues',
          priority: 'medium'
        });
      } else {
        auditIssues.push({
          id: 'canonical',
          type: 'success',
          message: 'Canonical URL is properly set',
          priority: 'low'
        });
      }

      // Check heading structure
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const h1Count = document.querySelectorAll('h1').length;
      
      if (h1Count === 0) {
        auditIssues.push({
          id: 'heading-structure',
          type: 'error',
          message: 'Missing H1 heading',
          recommendation: 'Add a single H1 heading to establish page hierarchy',
          priority: 'high'
        });
      } else if (h1Count > 1) {
        auditIssues.push({
          id: 'heading-structure',
          type: 'warning',
          message: 'Multiple H1 headings detected',
          recommendation: 'Use only one H1 heading per page for better SEO',
          priority: 'medium'
        });
      } else {
        auditIssues.push({
          id: 'heading-structure',
          type: 'success',
          message: 'Heading structure is properly organized',
          priority: 'low'
        });
      }

      // Check for images without alt text
      const images = document.querySelectorAll('img');
      const imagesWithoutAlt = Array.from(images).filter(img => !img.alt);
      
      if (imagesWithoutAlt.length > 0) {
        auditIssues.push({
          id: 'image-alt-text',
          type: 'warning',
          message: `${imagesWithoutAlt.length} images missing alt text`,
          recommendation: 'Add descriptive alt text to all images for accessibility and SEO',
          priority: 'medium'
        });
      } else {
        auditIssues.push({
          id: 'image-alt-text',
          type: 'success',
          message: 'All images have alt text',
          priority: 'low'
        });
      }

      // Check for internal links
      const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="' + window.location.origin + '"]');
      if (internalLinks.length === 0) {
        auditIssues.push({
          id: 'internal-linking',
          type: 'info',
          message: 'No internal links detected',
          recommendation: 'Consider adding internal links to improve site navigation and SEO',
          priority: 'low'
        });
      } else {
        auditIssues.push({
          id: 'internal-linking',
          type: 'success',
          message: `${internalLinks.length} internal links found`,
          priority: 'low'
        });
      }

      // Check page load performance
      if (window.performance) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          const loadTime = navigation.loadEventEnd - navigation.fetchStart;
          
          if (loadTime > 3000) {
            auditIssues.push({
              id: 'page-speed',
              type: 'warning',
              message: `Page load time is ${Math.round(loadTime)}ms`,
              recommendation: 'Optimize page load time to improve user experience and SEO',
              priority: 'medium'
            });
          } else {
            auditIssues.push({
              id: 'page-speed',
              type: 'success',
              message: `Page load time is ${Math.round(loadTime)}ms (good)`,
              priority: 'low'
            });
          }
        }
      }

      // Check for structured data
      const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
      if (structuredData.length === 0) {
        auditIssues.push({
          id: 'structured-data',
          type: 'warning',
          message: 'No structured data found',
          recommendation: 'Add structured data (JSON-LD) to help search engines understand your content',
          priority: 'medium'
        });
      } else {
        auditIssues.push({
          id: 'structured-data',
          type: 'success',
          message: `${structuredData.length} structured data blocks found`,
          priority: 'low'
        });
      }

    } catch (error) {
      auditIssues.push({
        id: 'audit-error',
        type: 'error',
        message: 'Error during SEO audit',
        recommendation: 'Check console for detailed error information',
        priority: 'high'
      });
    }

    setIssues(auditIssues);
    setIsAuditing(false);

    // Log results to console if enabled
    if (enableConsoleLogging) {
      console.group('🔍 SEO Audit Results');
      console.table(auditIssues.map(issue => ({
        Type: issue.type,
        Priority: issue.priority,
        Message: issue.message,
        Recommendation: issue.recommendation || 'N/A'
      })));
      console.groupEnd();
    }
  }, [enableConsoleLogging]);

  useEffect(() => {
    // Run audit when component mounts
    runSEOAudit();
  }, [runSEOAudit]);

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (!showInUI) {
    return null; // Don't render UI unless explicitly requested
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔍 SEO Audit Results
          <button
            onClick={runSEOAudit}
            disabled={isAuditing}
            className="ml-auto px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {isAuditing ? 'Auditing...' : 'Re-run Audit'}
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {issues.map((issue) => (
            <div key={issue.id} className="flex items-start gap-3 p-3 border rounded-lg">
              {getIssueIcon(issue.type)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{issue.message}</span>
                  <Badge className={getPriorityColor(issue.priority)}>
                    {issue.priority}
                  </Badge>
                </div>
                {issue.recommendation && (
                  <p className="text-sm text-muted-foreground">{issue.recommendation}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {issues.length === 0 && !isAuditing && (
          <div className="text-center py-8 text-muted-foreground">
            No SEO issues found. Your page is well-optimized! 🎉
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Hook for accessing SEO audit results
export function useSEOAudit() {
  const [issues, setIssues] = useState<SEOIssue[]>([]);
  
  const runAudit = async () => {
    // Implementation would be similar to the component
    // This allows components to access audit results programmatically
  };

  return { issues, runAudit };
}
