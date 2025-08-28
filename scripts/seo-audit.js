#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

class SEOAuditor {
  constructor() {
    this.siteUrl = 'http://localhost:3000';
    this.issues = [];
    this.warnings = [];
    this.passes = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const formatted = `[${timestamp}] ${message}`;
    console.log(formatted);

    switch (type) {
      case 'error':
        this.issues.push(formatted);
        break;
      case 'warning':
        this.warnings.push(formatted);
        break;
      case 'success':
        this.passes.push(formatted);
        break;
    }
  }

  async checkFileExists(filePath, description) {
    if (fs.existsSync(filePath)) {
      this.log(`✅ ${description} found: ${filePath}`, 'success');
      return true;
    } else {
      this.log(`❌ ${description} missing: ${filePath}`, 'error');
      return false;
    }
  }

  async checkRobotsTxt() {
    this.log('🔍 Checking robots.txt...');
    const robotsPath = path.join(__dirname, '..', 'public', 'robots.txt');

    if (!await this.checkFileExists(robotsPath, 'robots.txt file')) {
      return;
    }

    const robotsContent = fs.readFileSync(robotsPath, 'utf8');

    // Check for essential directives
    if (!robotsContent.includes('User-agent:')) {
      this.log('⚠️  robots.txt missing User-agent directive', 'warning');
    }

    if (!robotsContent.includes('Allow:') && !robotsContent.includes('Disallow:')) {
      this.log('⚠️  robots.txt missing Allow/Disallow directives', 'warning');
    }

    if (!robotsContent.includes('Sitemap:')) {
      this.log('⚠️  robots.txt missing Sitemap directive', 'warning');
    }

    this.log('✅ robots.txt basic structure verified', 'success');
  }

  async checkSitemap() {
    this.log('🔍 Checking sitemap.xml...');
    const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');

    if (!await this.checkFileExists(sitemapPath, 'sitemap.xml file')) {
      return;
    }

    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

    // Check for essential elements
    if (!sitemapContent.includes('<urlset')) {
      this.log('❌ sitemap.xml missing urlset element', 'error');
    }

    if (!sitemapContent.includes('<url>')) {
      this.log('❌ sitemap.xml missing url elements', 'error');
    }

    if (!sitemapContent.includes('<loc>')) {
      this.log('❌ sitemap.xml missing loc elements', 'error');
    }

    // Count URLs
    const urlCount = (sitemapContent.match(/<url>/g) || []).length;
    this.log(`📊 sitemap.xml contains ${urlCount} URLs`, 'success');
  }

  async checkSocialMediaImages() {
    this.log('🔍 Checking social media images...');

    const requiredImages = [
      { path: 'public/og-image.png', description: 'Open Graph image (1200x630)' },
      { path: 'public/twitter-image.png', description: 'Twitter/X card image (1200x630)' },
      { path: 'public/linkedin-image.png', description: 'LinkedIn image (1200x630)' },
      { path: 'public/instagram-post.png', description: 'Instagram post image (1080x1080)' },
      { path: 'public/instagram-story.png', description: 'Instagram story image (1080x1920)' }
    ];

    for (const image of requiredImages) {
      const exists = await this.checkFileExists(path.join(__dirname, '..', image.path), image.description);
      if (exists) {
        // Check file size
        const stats = fs.statSync(path.join(__dirname, '..', image.path));
        const sizeKB = (stats.size / 1024).toFixed(1);
        this.log(`📏 ${image.description}: ${sizeKB} KB`, sizeKB > 200 ? 'warning' : 'success');
      }
    }
  }

  async checkMetaTags() {
    this.log('🔍 Checking meta tags and SEO elements...');

    // Check layout.tsx for meta tags
    const layoutPath = path.join(__dirname, '..', 'src', 'app', 'layout.tsx');
    if (await this.checkFileExists(layoutPath, 'layout.tsx')) {
      const layoutContent = fs.readFileSync(layoutPath, 'utf8');

      const checks = [
        { pattern: 'export const metadata', description: 'Next.js metadata export' },
        { pattern: 'title:', description: 'Page title configuration' },
        { pattern: 'description:', description: 'Meta description' },
        { pattern: 'openGraph:', description: 'Open Graph meta tags' },
        { pattern: 'twitter:', description: 'Twitter card meta tags' },
        { pattern: 'robots:', description: 'Robots meta directive' },
        { pattern: 'canonical', description: 'Canonical URL' },
        { pattern: 'alternates:', description: 'Alternate URLs' }
      ];

      checks.forEach(check => {
        if (layoutContent.includes(check.pattern)) {
          this.log(`✅ ${check.description} found`, 'success');
        } else {
          this.log(`❌ ${check.description} missing`, 'error');
        }
      });
    }
  }

  async checkStructuredData() {
    this.log('🔍 Checking structured data implementation...');

    // Check layout.tsx for structured data
    const layoutPath = path.join(__dirname, '..', 'src', 'app', 'layout.tsx');
    if (await this.checkFileExists(layoutPath, 'layout.tsx')) {
      const layoutContent = fs.readFileSync(layoutPath, 'utf8');

      const structuredDataChecks = [
        { pattern: 'application/ld+json', description: 'JSON-LD structured data' },
        { pattern: '@context', description: 'Schema.org context' },
        { pattern: '@type', description: 'Schema.org type definition' },
        { pattern: 'WebSite', description: 'WebSite schema type' },
        { pattern: 'Organization', description: 'Organization schema type' }
      ];

      structuredDataChecks.forEach(check => {
        if (layoutContent.includes(check.pattern)) {
          this.log(`✅ ${check.description} found`, 'success');
        } else {
          this.log(`⚠️  ${check.description} not found in layout`, 'warning');
        }
      });
    }

    // Check homepage for structured data
    const homePagePath = path.join(__dirname, '..', 'src', 'app', 'page.tsx');
    if (await this.checkFileExists(homePagePath, 'homepage')) {
      const homeContent = fs.readFileSync(homePagePath, 'utf8');

      const homeStructuredDataChecks = [
        { pattern: 'FAQPage', description: 'FAQ structured data' },
        { pattern: 'SearchAction', description: 'Search action structured data' },
        { pattern: 'ItemList', description: 'Directory listing structured data' }
      ];

      homeStructuredDataChecks.forEach(check => {
        if (homeContent.includes(check.pattern)) {
          this.log(`✅ ${check.description} found on homepage`, 'success');
        } else {
          this.log(`⚠️  ${check.description} not found on homepage`, 'warning');
        }
      });
    }
  }

  async checkPerformanceOptimizations() {
    this.log('🔍 Checking performance optimizations...');

    const nextConfigPath = path.join(__dirname, '..', 'next.config.mjs');
    if (await this.checkFileExists(nextConfigPath, 'next.config.mjs')) {
      const configContent = fs.readFileSync(nextConfigPath, 'utf8');

      const perfChecks = [
        { pattern: 'compress:', description: 'Response compression' },
        { pattern: 'optimizePackageImports', description: 'Package import optimization' },
        { pattern: 'optimizeServerReact', description: 'Server-side React optimization' },
        { pattern: 'Cache-Control', description: 'Cache headers configuration' },
        { pattern: 'Content-Security-Policy', description: 'CSP security headers' },
        { pattern: 'images:', description: 'Next.js image optimization' },
        { pattern: 'formats:', description: 'Modern image formats' }
      ];

      perfChecks.forEach(check => {
        if (configContent.includes(check.pattern)) {
          this.log(`✅ ${check.description} configured`, 'success');
        } else {
          this.log(`⚠️  ${check.description} not found`, 'warning');
        }
      });
    }
  }

  async checkAccessibility() {
    this.log('🔍 Checking accessibility considerations...');

    // Check for common accessibility issues in key files
    const layoutPath = path.join(__dirname, '..', 'src', 'app', 'layout.tsx');
    if (await this.checkFileExists(layoutPath, 'layout.tsx')) {
      const layoutContent = fs.readFileSync(layoutPath, 'utf8');

      const accessibilityChecks = [
        { pattern: 'lang=', description: 'HTML language attribute' },
        { pattern: 'alt=', description: 'Image alt attributes' },
        { pattern: 'role=', description: 'ARIA roles' },
        { pattern: 'aria-', description: 'ARIA attributes' }
      ];

      accessibilityChecks.forEach(check => {
        if (layoutContent.includes(check.pattern)) {
          this.log(`✅ ${check.description} found`, 'success');
        } else {
          this.log(`⚠️  ${check.description} not found`, 'warning');
        }
      });
    }
  }

  async checkSEOIssues() {
    this.log('🔍 Checking for common SEO issues...');

    // Check for common SEO problems
    const issues = [
      { type: 'redirects', description: 'Check for redirect chains or loops' },
      { type: 'duplicate_content', description: 'Check for duplicate content issues' },
      { type: 'broken_links', description: 'Check for broken internal/external links' },
      { type: 'missing_alt', description: 'Check for images missing alt attributes' },
      { type: 'slow_pages', description: 'Check for pages with slow load times' },
      { type: 'mobile_friendly', description: 'Check mobile-friendliness' }
    ];

    issues.forEach(issue => {
      this.log(`📝 ${issue.description} - Manual review recommended`, 'warning');
    });

    // Check for environment variables that might affect SEO
    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      this.log('⚠️  NEXT_PUBLIC_SITE_URL environment variable not set', 'warning');
    }
  }

  async generateReport() {
    const reportPath = path.join(__dirname, '..', 'SEO-AUDIT-REPORT.md');

    const report = `# SEO Audit Report
Generated on: ${new Date().toISOString()}

## Summary
- ✅ Passed: ${this.passes.length}
- ⚠️  Warnings: ${this.warnings.length}
- ❌ Issues: ${this.issues.length}

## Passed Checks
${this.passes.map(item => `- ${item}`).join('\n')}

## Warnings
${this.warnings.map(item => `- ${item}`).join('\n') || 'No warnings found'}

## Issues Found
${this.issues.map(item => `- ${item}`).join('\n') || 'No issues found'}

## Recommendations

### High Priority
${this.issues.length > 0 ? this.issues.map(issue => `- Fix: ${issue}`).join('\n') : '- All high-priority items are addressed'}

### Medium Priority
${this.warnings.map(warning => `- Review: ${warning}`).join('\n') || '- No medium-priority items identified'}

### Low Priority
- Monitor Core Web Vitals regularly
- Review and update content periodically
- Keep dependencies updated
- Monitor for new SEO best practices

## Next Steps
1. Fix any critical issues identified
2. Address warnings where possible
3. Set up monitoring for Core Web Vitals
4. Regular SEO audits (monthly/quarterly recommended)
5. Monitor Google Search Console for indexing issues
`;

    fs.writeFileSync(reportPath, report);
    this.log(`📄 SEO audit report saved to: ${reportPath}`, 'success');
  }

  async runAudit() {
    this.log('🚀 Starting comprehensive SEO audit...');

    try {
      await this.checkRobotsTxt();
      await this.checkSitemap();
      await this.checkSocialMediaImages();
      await this.checkMetaTags();
      await this.checkStructuredData();
      await this.checkPerformanceOptimizations();
      await this.checkAccessibility();
      await this.checkSEOIssues();

      await this.generateReport();

      this.log('✅ SEO audit completed successfully!');
      this.log(`📊 Summary: ${this.passes.length} passed, ${this.warnings.length} warnings, ${this.issues.length} issues`);

    } catch (error) {
      this.log(`❌ SEO audit failed: ${error.message}`, 'error');
    }
  }
}

// Run the audit
const auditor = new SEOAuditor();
auditor.runAudit().catch(console.error);
