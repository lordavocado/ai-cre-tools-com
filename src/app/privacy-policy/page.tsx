import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.name} - Data Protection & Privacy Rights`,
  description: `Comprehensive privacy policy for ${siteConfig.name}. Learn how we collect, use, and protect your data when using our ${siteConfig.categoryName.toLowerCase()} directory. GDPR & CCPA compliant.`,
  keywords: [
    'privacy policy',
    'data protection',
    'GDPR compliance',
    'privacy rights',
    'data collection',
    'commercial real estate directory privacy',
    ...siteConfig.seo.primaryKeywords.slice(0, 3)
  ],
  openGraph: {
    title: `Privacy Policy - ${siteConfig.name}`,
    description: `Learn about our data protection practices and privacy commitments for ${siteConfig.categoryName.toLowerCase()} directory users.`,
    url: `${siteConfig.url}/privacy-policy`,
    siteName: siteConfig.seo.openGraph.siteName,
    type: 'website',
  },
  alternates: {
    canonical: `${siteConfig.url}/privacy-policy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Structured Data for Privacy Policy */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Privacy Policy",
            description: "Privacy Policy for " + siteConfig.name,
            url: `${siteConfig.url}/privacy-policy`,
            isPartOf: {
              "@type": "WebSite",
              name: siteConfig.name,
              url: siteConfig.url
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: siteConfig.url
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Privacy Policy",
                  item: `${siteConfig.url}/privacy-policy`
                }
              ]
            }
          }),
        }}
      />

      <div className="container py-12 md:py-16 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif mb-4">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground">
            Learn how {siteConfig.name} protects your privacy and handles your data
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-8">
            <p className="text-blue-900 dark:text-blue-100 font-semibold mb-2">Quick Summary</p>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              We collect minimal data to provide our {siteConfig.categoryName.toLowerCase()} directory service.
              We use privacy-focused analytics, store newsletter emails securely, and never sell your personal information.
              You have full control over your data and can request deletion at any time.
            </p>
          </div>

          <p>Welcome to {siteConfig.name} ("us", "we", or "our"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us.</p>

          <h2>1. INFORMATION WE COLLECT</h2>
          
          <h3>Personal Information You Provide</h3>
          <p>We collect personal information that you voluntarily provide when you:</p>
          <ul>
            <li><strong>Subscribe to our newsletter:</strong> Email address, optional name, and communication preferences</li>
            <li><strong>Submit tool reviews or feedback:</strong> Any information you choose to share, including your role in CRE</li>
            <li><strong>Contact us:</strong> Name, email, company (optional), and message content</li>
            <li><strong>Use interactive features:</strong> Favourites, comparisons, saved searches, and tool ratings</li>
            <li><strong>Submit a tool:</strong> Contact information and details about the AI tool you're submitting</li>
            <li><strong>Create an account:</strong> Username, email, and profile information (if we add this feature)</li>
          </ul>

          <h3>Automatically Collected Information</h3>
          <p>When you visit our website, we automatically collect certain information:</p>
          <ul>
            <li><strong>Usage data:</strong> Pages visited, time spent, click patterns, search queries</li>
            <li><strong>Device information:</strong> Browser type, operating system, screen resolution, device type</li>
            <li><strong>Location data:</strong> General geographic location (country/region level) based on IP address</li>
            <li><strong>Referral data:</strong> How you found our website (search engines, social media, direct links)</li>
            <li><strong>Performance data:</strong> Website load times, error logs, and user interactions</li>
          </ul>

          <h3>AI and Machine Learning Data</h3>
          <p>As an AI tools directory, we may use anonymized usage data to:</p>
          <ul>
            <li><strong>Improve search relevance:</strong> Analyze popular search terms and tool categories</li>
            <li><strong>Personalize recommendations:</strong> Suggest relevant tools based on browsing patterns</li>
            <li><strong>Optimize user experience:</strong> Improve website performance and navigation</li>
            <li><strong>Content improvement:</strong> Understand which types of content are most valuable</li>
          </ul>
          <p className="text-sm text-gray-600 mt-2">All AI/ML processing uses anonymized, aggregated data only.</p>

          <h2>2. HOW WE USE YOUR INFORMATION</h2>
          
          <p>We process your personal information for legitimate business purposes:</p>
          
          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Service Provision</h4>
              <ul className="text-sm space-y-1">
                <li>• Provide access to our directory</li>
                <li>• Send requested newsletters</li>
                <li>• Respond to inquiries</li>
                <li>• Improve user experience</li>
              </ul>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Analytics & Optimization</h4>
              <ul className="text-sm space-y-1">
                <li>• Understand usage patterns</li>
                <li>• Improve directory quality</li>
                <li>• Optimize website performance</li>
                <li>• Develop new features</li>
              </ul>
            </div>
          </div>

          <h2>3. INFORMATION SHARING</h2>
          
          <p><strong>We do not sell your personal information.</strong> We only share information in these limited circumstances:</p>
          
          <h3>Service Providers</h3>
          <ul>
            <li><strong>Mailchimp:</strong> Newsletter email delivery (GDPR and CCPA compliant)</li>
            <li><strong>PostHog:</strong> Privacy-focused analytics (data anonymized, no personal tracking)</li>
            <li><strong>Vercel:</strong> Website hosting and performance monitoring</li>
            <li><strong>Google Sheets:</strong> Secure data storage for tool submissions (encrypted)</li>
            <li><strong>Cloudflare:</strong> CDN and security services (privacy-compliant)</li>
          </ul>

          <h3>Legal Requirements</h3>
          <p>We may disclose information if required by law or to protect our rights and users' safety.</p>

          <h2>4. COOKIES AND TRACKING</h2>
          
          <p>We use cookies and similar technologies to enhance your experience:</p>
          
          <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800 my-4">
            <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">Cookie Types</h4>
            <ul className="text-amber-800 dark:text-amber-200 text-sm space-y-1">
              <li><strong>Essential:</strong> Required for website functionality</li>
              <li><strong>Analytics:</strong> Help us understand user behavior</li>
              <li><strong>Preferences:</strong> Remember your settings and favorites</li>
            </ul>
          </div>

          <p>You can control cookies through your browser settings, but this may limit some functionality.</p>

          <h2>5. DATA MINIMIZATION AND PRIVACY BY DESIGN</h2>

          <p>We follow privacy by design principles and collect only the minimum data necessary:</p>

          <h3>Our Privacy Principles</h3>
          <div className="grid md:grid-cols-2 gap-4 my-4">
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-green-900 dark:text-green-100">Data Minimization</h4>
              <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <li>• Collect only necessary information</li>
                <li>• Delete data when no longer needed</li>
                <li>• Use anonymized data where possible</li>
                <li>• Regular data audits and cleanup</li>
              </ul>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">Privacy by Design</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Privacy considerations in all features</li>
                <li>• Default privacy settings protect users</li>
                <li>• Regular privacy impact assessments</li>
                <li>• User control over personal data</li>
              </ul>
            </div>
          </div>

          <h2>6. DATA RETENTION</h2>
          
          <p>We retain information only as long as necessary:</p>
          <ul>
            <li><strong>Newsletter subscriptions:</strong> Until you unsubscribe</li>
            <li><strong>Analytics data:</strong> 24 months maximum</li>
            <li><strong>Contact inquiries:</strong> 2 years for support purposes</li>
            <li><strong>User preferences:</strong> While you actively use the service</li>
          </ul>

          <h2>8. DATA SECURITY</h2>

          <p>We implement industry-standard security measures to protect your personal information:</p>
          <ul>
            <li><strong>Encryption:</strong> HTTPS encryption for all data transmission</li>
            <li><strong>Secure APIs:</strong> Encrypted connections with third-party services</li>
            <li><strong>Regular updates:</strong> Security patches and software updates</li>
            <li><strong>Access controls:</strong> Limited access to personal information on a need-to-know basis</li>
            <li><strong>Data backups:</strong> Encrypted backup and recovery procedures</li>
            <li><strong>Security monitoring:</strong> Continuous monitoring for unusual activity</li>
          </ul>

          <h2>9. YOUR PRIVACY RIGHTS</h2>
          
          <p>Depending on your location, you may have the following rights:</p>
          
          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div>
              <h4 className="font-semibold mb-2">GDPR Rights (EU/UK)</h4>
              <ul className="text-sm space-y-1">
                <li>• Access your personal data</li>
                <li>• Rectify incorrect information</li>
                <li>• Erase your data ("right to be forgotten")</li>
                <li>• Restrict processing</li>
                <li>• Data portability</li>
                <li>• Object to processing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">CCPA Rights (California)</h4>
              <ul className="text-sm space-y-1">
                <li>• Know what data we collect</li>
                <li>• Delete personal information</li>
                <li>• Opt-out of data sales (we don't sell)</li>
                <li>• Non-discrimination for exercising rights</li>
              </ul>
            </div>
          </div>

          <p>To exercise any of these rights, please contact us using the information below.</p>

          <h2>10. INTERNATIONAL DATA TRANSFERS</h2>

          <p>Our services are hosted in the United States. If you're accessing our service from outside the US,
          your information may be transferred to, stored, and processed in the US. We ensure appropriate
          safeguards are in place for international transfers, including:</p>
          <ul>
            <li><strong>Standard Contractual Clauses:</strong> EU-approved data transfer mechanisms</li>
            <li><strong>Adequacy decisions:</strong> Where applicable for certain countries</li>
            <li><strong>Encryption:</strong> All data transmitted using industry-standard encryption</li>
            <li><strong>Privacy Shield:</strong> For transfers from EU to US (where applicable)</li>
          </ul>

          <h2>11. CHILDREN'S PRIVACY</h2>

          <p>Our service is not intended for children under 16 (or the minimum age in your jurisdiction). We do not knowingly collect personal
          information from children under 16. If you believe we have collected information from a child under 16,
          please contact us immediately and we will delete such information.</p>

          <h2>12. AI ETHICS AND TRANSPARENCY</h2>

          <p>As an AI tools directory, we are committed to ethical AI practices and transparency:</p>

          <h3>Our AI Commitments</h3>
          <ul>
            <li><strong>No discriminatory AI:</strong> We do not use AI systems that discriminate based on protected characteristics</li>
            <li><strong>Transparency:</strong> We disclose when AI is used to process personal data</li>
            <li><strong>Human oversight:</strong> AI recommendations are reviewed by humans before implementation</li>
            <li><strong>Data protection:</strong> All AI processing complies with privacy regulations</li>
            <li><strong>Opt-out rights:</strong> You can request exclusion from AI-based personalization</li>
          </ul>

          <h2>13. CHANGES TO THIS PRIVACY POLICY</h2>

          <p>We may update this privacy policy periodically to reflect changes in our practices, technology, legal requirements, or other factors.
          Material changes will be communicated through:</p>
          <ul>
            <li><strong>Email notification:</strong> To newsletter subscribers for significant changes</li>
            <li><strong>Website notice:</strong> Updated "Last modified" date and change log</li>
            <li><strong>Direct communication:</strong> For changes affecting your rights or our data practices</li>
          </ul>
          <p className="text-sm text-gray-600 mt-2">We encourage you to review this privacy policy periodically.</p>

          <h2>14. CONTACT INFORMATION</h2>
          
          <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-lg border border-blue-200 dark:border-blue-800 my-6">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Contact Our Privacy Team</h4>
            <p className="text-blue-800 dark:text-blue-200 mb-3">
              We are here to help with any privacy-related questions or requests:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">General Privacy Inquiries</h5>
                <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
                  <li><strong>Email:</strong> privacy@{siteConfig.url.replace('https://', '').replace('http://', '')}</li>
                  <li><strong>Response time:</strong> Within 72 hours</li>
                  <li><strong>Data Protection Officer:</strong> Available upon request</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Data Rights Requests</h5>
                <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
                  <li><strong>Access requests:</strong> data-access@{siteConfig.url.replace('https://', '').replace('http://', '')}</li>
                  <li><strong>Deletion requests:</strong> data-delete@{siteConfig.url.replace('https://', '').replace('http://', '')}</li>
                  <li><strong>Verification:</strong> We'll verify your identity before processing</li>
                  <li><strong>Processing time:</strong> Up to 30 days (may be extended by 60 days)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
