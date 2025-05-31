import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `Terms of Service | ${siteConfig.name}`,
  description: `Terms of Service for ${siteConfig.name} - The leading directory for ${siteConfig.categoryName.toLowerCase()}.`,
};

export default function TermsOfServicePage() {
  return (
    <div className="container py-12 md:py-16 max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Terms of Service</h1>
      <div className="prose prose-lg dark:prose-invert">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the {siteConfig.name} website (the "Service") operated by {siteConfig.name} ("us", "we", or "our").</p>
        <p>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.</p>
        <p>By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.</p>

        <h2>1. Service Description</h2>
        <p>{siteConfig.name} provides a directory and comparison platform for {siteConfig.categoryName.toLowerCase()}. The information provided through our Service is for general informational purposes only. We strive to keep the information up to date and accurate, but we make no representations or warranties of any kind about the completeness, accuracy, reliability, or availability of the information.</p>

        <h2>2. User Contributions</h2>
        <p>Users may have the opportunity to submit reviews, comments, and other content. By submitting content, you grant us the right to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through the Service.</p>

        <h2>3. Intellectual Property</h2>
        <p>The Service and its original content, features, and functionality are and will remain the exclusive property of {siteConfig.name} and its licensors. The Service is protected by copyright, trademark, and other laws.</p>

        <h2>4. Third-Party Links</h2>
        <p>Our Service may contain links to third-party websites or services that are not owned or controlled by {siteConfig.name}. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.</p>

        <h2>5. Limitation of Liability</h2>
        <p>To the maximum extent permitted by law, {siteConfig.name} shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

        <h2>6. Changes to Terms</h2>
        <p>We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page with a notice that the Terms have been updated.</p>

        <h2>7. Contact Information</h2>
        <p>If you have any questions about these Terms, please contact us at hi@findbesthq.com || 'our support team through the website'{'}'}.</p>
      </div>
    </div>
  );
}
