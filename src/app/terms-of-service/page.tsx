import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `Terms of Service | ${siteConfig.name} - User Agreement & Legal Terms`,
  description: `Comprehensive terms of service for ${siteConfig.name}. Learn about user rights, responsibilities, and legal terms for using our ${siteConfig.categoryName.toLowerCase()} directory platform.`,
  keywords: [
    'terms of service',
    'user agreement',
    'terms and conditions',
    'legal terms',
    'website terms',
    'commercial real estate directory terms',
    ...siteConfig.seo.primaryKeywords.slice(0, 3)
  ],
  openGraph: {
    title: `Terms of Service - ${siteConfig.name}`,
    description: `User agreement and terms for using ${siteConfig.name}, the leading ${siteConfig.categoryName.toLowerCase()} directory.`,
    url: `${siteConfig.url}/terms-of-service`,
    siteName: siteConfig.seo.openGraph.siteName,
    type: 'website',
  },
  alternates: {
    canonical: `${siteConfig.url}/terms-of-service`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfServicePage() {
  return (
    <>
      {/* Structured Data for Terms of Service */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Terms of Service",
            description: "Terms of Service for " + siteConfig.name,
            url: `${siteConfig.url}/terms-of-service`,
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
                  name: "Terms of Service",
                  item: `${siteConfig.url}/terms-of-service`
                }
              ]
            }
          }),
        }}
      />

      <div className="container py-12 md:py-16 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-4">Terms of Service</h1>
          <p className="text-lg text-muted-foreground">
            Your rights and responsibilities when using {siteConfig.name}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg border border-green-200 dark:border-green-800 mb-8">
            <p className="text-green-900 dark:text-green-100 font-semibold mb-2">Quick Overview</p>
            <p className="text-green-800 dark:text-green-200 text-sm">
              By using {siteConfig.name}, you agree to use our AI tools directory responsibly, respect intellectual property rights,
              and understand that we provide information for reference purposes. We're committed to maintaining a helpful,
              accurate directory of {siteConfig.categoryName.toLowerCase()} while protecting user privacy and data rights.
            </p>
          </div>

          <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the {siteConfig.name} website (the "Service") operated by {siteConfig.name} ("us", "we", or "our").</p>
          <p>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.</p>
          <p>By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.</p>

          <h2>1. SERVICE DESCRIPTION</h2>

          <p>{siteConfig.name} provides a comprehensive directory and comparison platform for {siteConfig.categoryName.toLowerCase()}.
          Our mission is to help commercial real estate professionals discover, evaluate, and choose the best AI tools for their specific needs.
          Our service includes:</p>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-blue-900 dark:text-blue-100">Core Services</h4>
              <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-2">
                <li><strong>Directory Listings:</strong> Curated information about AI tools and software for CRE</li>
                <li><strong>Comparison Features:</strong> Side-by-side tool comparisons and analysis</li>
                <li><strong>Reviews and Ratings:</strong> User-generated and editorial reviews</li>
                <li><strong>Category Organization:</strong> Tools organized by CRE function and use case</li>
                <li><strong>Search and Filtering:</strong> Advanced discovery and filtering capabilities</li>
              </ul>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-green-900 dark:text-green-100">Additional Features</h4>
              <ul className="text-green-800 dark:text-green-200 text-sm space-y-2">
                <li><strong>Newsletter Service:</strong> Industry updates and tool recommendations</li>
                <li><strong>Favorites System:</strong> Save and organize preferred tools</li>
                <li><strong>Blog Content:</strong> Educational articles about AI in commercial real estate</li>
                <li><strong>Tool Submission:</strong> Community-driven tool discovery</li>
                <li><strong>Privacy-Focused Analytics:</strong> Usage insights without compromising privacy</li>
              </ul>
            </div>
          </div>

          <h3>Service Availability</h3>
          <p>While we strive for 99.9% uptime, our service is provided "as is" and we do not guarantee uninterrupted access.
          We may perform maintenance or updates that temporarily affect service availability.</p>

          <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 my-4">
            <p className="text-yellow-900 dark:text-yellow-100 font-semibold mb-2">Important Disclaimer</p>
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              The information provided is for general informational purposes only. While we strive for accuracy,
              we make no warranties about completeness, reliability, or suitability for any particular purpose.
              AI tools evolve rapidly, and information may become outdated.
            </p>
          </div>

          <h2>2. ACCEPTABLE USE</h2>
          
          <h3>You May:</h3>
          <ul>
            <li>Browse and search our directory for business purposes</li>
            <li>Subscribe to our newsletter and updates</li>
            <li>Submit honest reviews and feedback</li>
            <li>Share links to our content with proper attribution</li>
            <li>Use our comparison tools for decision-making</li>
          </ul>

          <h3>You May Not:</h3>
          <ul>
            <li>Scrape, crawl, or automatically extract our data</li>
            <li>Submit false, misleading, or defamatory content</li>
            <li>Interfere with the proper functioning of the service</li>
            <li>Use the service for illegal or unauthorized purposes</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Impersonate another person or entity</li>
          </ul>

          <h2>3. AI CONTENT AND MACHINE LEARNING</h2>

          <h3>AI-Generated Content</h3>
          <p>Our service may include AI-generated content, summaries, or recommendations. This content is provided for informational purposes and should not be considered professional advice.</p>

          <h3>Your Data and AI Training</h3>
          <ul>
            <li><strong>Opt-in AI features:</strong> We only use your data for AI personalization if you explicitly opt in</li>
            <li><strong>Anonymized processing:</strong> Any data used for AI improvement is fully anonymized</li>
            <li><strong>No personal data in training:</strong> We do not use personal information to train AI models</li>
            <li><strong>Transparency:</strong> We disclose when AI is used to generate content or recommendations</li>
          </ul>

          <h3>AI Accuracy Disclaimer</h3>
          <p>AI tools and recommendations provided on our platform are based on available data and algorithms. While we strive for accuracy, AI systems can make errors or provide outdated information. Always verify information independently before making business decisions.</p>

          <h2>4. USER CONTRIBUTIONS</h2>
          
          <p>Users may submit reviews, comments, feedback, and other content. By submitting content, you represent that:</p>
          
          <ul>
            <li>You own or have necessary rights to the content</li>
            <li>The content is accurate and not misleading</li>
            <li>The content doesn't violate any laws or third-party rights</li>
            <li>You have the authority to grant the rights described below</li>
          </ul>

          <h3>License Grant</h3>
          <p>By submitting content, you grant us a non-exclusive, worldwide, royalty-free license to use, modify, 
          publicly perform, publicly display, reproduce, and distribute such content in connection with our service.</p>

          <h3>Content Standards</h3>
          <p>All user content must be:</p>
          <ul>
            <li>Relevant to commercial real estate AI tools</li>
            <li>Based on actual experience or knowledge</li>
            <li>Respectful and professional in tone</li>
            <li>Free from spam, promotional content, or conflicts of interest</li>
          </ul>

          <h2>5. INTELLECTUAL PROPERTY</h2>

          <p>The Service and its original content, features, and functionality are owned by {siteConfig.name} and protected by:</p>

          <div className="grid md:grid-cols-2 gap-4 my-4">
            <div>
              <h4 className="font-semibold mb-2">Our Rights Include:</h4>
              <ul className="text-sm space-y-1">
                <li>• Website design and layout</li>
                <li>• Original written content and blog articles</li>
                <li>• Compilation and organization of tool data</li>
                <li>• Software and algorithms</li>
                <li>• Trademarks and branding</li>
                <li>• Database rights and data structures</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Third-Party Rights:</h4>
              <ul className="text-sm space-y-1">
                <li>• AI tool logos and names belong to respective owners</li>
                <li>• Screenshots used under fair use principles</li>
                <li>• Company information from public sources</li>
                <li>• User-submitted content owned by users</li>
                <li>• Third-party APIs and integrations</li>
              </ul>
            </div>
          </div>

          <h3>Fair Use Policy</h3>
          <p>We respect intellectual property rights and comply with fair use principles when referencing or displaying third-party content. If you believe your intellectual property rights have been infringed, please contact us immediately.</p>

          <h2>6. THIRD-PARTY SERVICES AND LINKS</h2>
          
          <p>Our Service integrates with and links to third-party websites and services:</p>
          
          <h3>Tool Websites</h3>
          <p>We provide links to AI tool websites for your convenience. We are not responsible for:</p>
          <ul>
            <li>The content, accuracy, or availability of linked sites</li>
            <li>Privacy practices of external websites</li>
            <li>Terms of service of linked platforms</li>
            <li>Transactions between you and third parties</li>
          </ul>

          <h3>Service Providers</h3>
          <p>We use third-party services for website functionality:</p>
          <ul>
            <li><strong>Mailchimp:</strong> Newsletter delivery</li>
            <li><strong>PostHog:</strong> Analytics and insights</li>
            <li><strong>Vercel:</strong> Website hosting</li>
            <li><strong>Google Sheets:</strong> Data management</li>
          </ul>

          <h2>7. DISCLAIMERS AND LIMITATIONS</h2>

          <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border border-red-200 dark:border-red-800 my-4">
            <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">Service Provided "AS IS"</h4>
            <p className="text-red-800 dark:text-red-200 text-sm">
              {siteConfig.name} is provided without warranties of any kind. We don't guarantee
              uninterrupted service, accuracy of information, or fitness for any particular purpose.
              AI tools and information may become outdated rapidly.
            </p>
          </div>

          <h3>No Professional Advice</h3>
          <p>Our service provides information about AI tools, not professional advice. You should:</p>
          <ul>
            <li>Conduct your own due diligence before purchasing or implementing AI tools</li>
            <li>Consult with IT professionals for technical implementation decisions</li>
            <li>Verify tool capabilities and compatibility with your systems</li>
            <li>Consider your organization's specific security and compliance requirements</li>
            <li>Review vendor terms of service and privacy policies</li>
          </ul>

          <h3>Limitation of Liability</h3>
          <p>To the maximum extent permitted by law, {siteConfig.name} shall not be liable for:</p>
          <ul>
            <li>Indirect, incidental, or consequential damages</li>
            <li>Loss of profits, data, or business opportunities</li>
            <li>Decisions made based on information from our directory</li>
            <li>Issues with third-party AI tools or services</li>
            <li>Inaccuracies in tool descriptions or specifications</li>
            <li>Changes in tool features or availability</li>
          </ul>

          <h2>8. PRIVACY AND DATA PROTECTION</h2>

          <p>Your privacy is important to us. Please review our <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link> to understand:</p>
          <ul>
            <li>What information we collect and why</li>
            <li>How we use and protect your data</li>
            <li>Your rights and choices regarding privacy</li>
            <li>Our compliance with privacy regulations (GDPR, CCPA, etc.)</li>
            <li>How to exercise your data protection rights</li>
          </ul>

          <h2>9. ACCOUNT TERMINATION</h2>

          <p>We may terminate or suspend access to our service immediately, without notice, for conduct that:</p>
          <ul>
            <li>Violates these Terms of Service</li>
            <li>Infringes on intellectual property rights</li>
            <li>Is harmful to other users or our business</li>
            <li>Violates applicable laws or regulations</li>
            <li>Submits fraudulent or misleading information</li>
            <li>Attempts to circumvent security measures</li>
          </ul>

          <p>Upon termination, your right to use the service will cease immediately. We may delete your account and associated data at our discretion.</p>

          <h2>10. CHANGES TO TERMS</h2>

          <p>We reserve the right to modify these Terms at any time. We will:</p>
          <ul>
            <li>Post updated Terms on this page with a new "Last Updated" date</li>
            <li>Notify newsletter subscribers of material changes via email</li>
            <li>Provide a reasonable notice period for significant changes</li>
            <li>Consider your continued use as acceptance of new terms</li>
          </ul>

          <p>For non-material changes, your continued use constitutes acceptance. For material changes, we will provide additional notice and may require explicit acceptance.</p>

          <h2>11. GOVERNING LAW AND DISPUTE RESOLUTION</h2>

          <h3>Governing Law</h3>
          <p>These Terms shall be governed by and construed in accordance with the laws of the United States, specifically the state of Delaware,
          without regard to its conflict of law provisions.</p>

          <h3>Dispute Resolution</h3>
          <p>Any disputes arising out of or relating to these Terms shall be resolved through:</p>
          <ul>
            <li><strong>Good faith negotiation:</strong> We encourage direct communication first</li>
            <li><strong>Mediation:</strong> Non-binding mediation before pursuing other remedies</li>
            <li><strong>Binding arbitration:</strong> For disputes over $10,000, conducted in Delaware</li>
            <li><strong>Court proceedings:</strong> As a last resort in the courts of Delaware</li>
          </ul>

          <p>You waive any right to participate in class action lawsuits or class-wide arbitration.</p>

          <h2>12. SEVERABILITY AND WAIVER</h2>

          <p>If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
          Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.</p>

          <h2>13. ENTIRE AGREEMENT</h2>

          <p>These Terms, together with our Privacy Policy and any other legal notices published by us on the Service,
          constitute the entire agreement between you and us regarding the use of the Service.</p>

          {/* Contact information section removed due to lack of support email addresses */}
        </div>
      </div>
    </>
  );
}
