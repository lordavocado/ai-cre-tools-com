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
              We use cookies for analytics, store newsletter emails securely, and never sell your personal information. 
              You have full control over your data.
            </p>
          </div>

          <p>Welcome to {siteConfig.name} ("us", "we", or "our"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us.</p>

          <h2>1. INFORMATION WE COLLECT</h2>
          
          <h3>Personal Information You Provide</h3>
          <p>We collect personal information that you voluntarily provide when you:</p>
          <ul>
            <li><strong>Subscribe to our newsletter:</strong> Email address and optional preferences</li>
            <li><strong>Submit feedback or reviews:</strong> Any information you choose to share</li>
            <li><strong>Contact us:</strong> Name, email, and message content</li>
            <li><strong>Use interactive features:</strong> Favourites, comparisons, and saved searches</li>
          </ul>

          <h3>Automatically Collected Information</h3>
          <p>When you visit our website, we automatically collect certain information:</p>
          <ul>
            <li><strong>Usage data:</strong> Pages visited, time spent, click patterns</li>
            <li><strong>Device information:</strong> Browser type, operating system, screen resolution</li>
            <li><strong>Location data:</strong> General geographic location (country/region level)</li>
          </ul>

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
            <li><strong>Mailchimp:</strong> Newsletter email delivery (GDPR compliant)</li>
            <li><strong>PostHog:</strong> Privacy-focused analytics (data anonymized)</li>
            <li><strong>Vercel:</strong> Website hosting and performance</li>
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

          <h2>5. DATA RETENTION</h2>
          
          <p>We retain information only as long as necessary:</p>
          <ul>
            <li><strong>Newsletter subscriptions:</strong> Until you unsubscribe</li>
            <li><strong>Analytics data:</strong> 24 months maximum</li>
            <li><strong>Contact inquiries:</strong> 2 years for support purposes</li>
            <li><strong>User preferences:</strong> While you actively use the service</li>
          </ul>

          <h2>6. DATA SECURITY</h2>
          
          <p>We implement industry-standard security measures:</p>
          <ul>
            <li>HTTPS encryption for all data transmission</li>
            <li>Secure API connections with third-party services</li>
            <li>Regular security updates and monitoring</li>
            <li>Limited access to personal information</li>
            <li>Data backup and recovery procedures</li>
          </ul>

          <h2>7. YOUR PRIVACY RIGHTS</h2>
          
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

          <h2>8. INTERNATIONAL DATA TRANSFERS</h2>
          
          <p>Our services are hosted in the United States. If you're accessing our service from outside the US, 
          your information may be transferred to, stored, and processed in the US. We ensure appropriate 
          safeguards are in place for international transfers.</p>

          <h2>9. CHILDREN'S PRIVACY</h2>
          
          <p>Our service is not intended for children under 16. We do not knowingly collect personal 
          information from children. If you believe we have collected information from a child, 
          please contact us immediately.</p>

          <h2>10. UPDATES TO THIS POLICY</h2>
          
          <p>We may update this privacy policy periodically to reflect changes in our practices or legal requirements. 
          Material changes will be communicated through:</p>
          <ul>
            <li>Email notification to newsletter subscribers</li>
            <li>Notice on our website</li>
            <li>Updated "Last modified" date</li>
          </ul>

          <h2>11. CONTACT US</h2>
          
          <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-lg border border-blue-200 dark:border-blue-800 my-6">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Privacy Questions?</h4>
            <p className="text-blue-800 dark:text-blue-200 mb-3">
              If you have questions about this privacy policy or our data practices, please contact us:
            </p>
            <ul className="text-blue-800 dark:text-blue-200 text-sm">
              <li><strong>Email:</strong> privacy@{siteConfig.url.replace('https://', '').replace('http://', '')}</li>
              <li><strong>Response time:</strong> Within 72 hours</li>
              <li><strong>Data Protection Officer:</strong> Available upon request</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
