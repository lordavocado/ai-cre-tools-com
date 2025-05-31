import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
  description: `Privacy Policy for ${siteConfig.name} - The leading directory for ${siteConfig.categoryName.toLowerCase()}.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-12 md:py-16 max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose prose-lg dark:prose-invert">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <p>Welcome to {siteConfig.name} ("us", "we", or "our"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us.</p>

        <h2>1. INFORMATION WE COLLECT</h2>
        <p>We may collect personal information that you voluntarily provide to us when you express an interest in obtaining information about {siteConfig.categoryName.toLowerCase()}, when you participate in activities on the Website or otherwise when you contact us.</p>
        <p>The personal information that we collect depends on the context of your interactions with us and the Website, the choices you make and the products and features you use. The personal information we collect may include the following: email address for newsletter subscriptions and any information you provide when submitting feedback or reviews.</p>
        
        <h2>2. HOW WE USE YOUR INFORMATION</h2>
        <p>We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
        <ul>
          <li>To send you marketing and promotional communications about {siteConfig.categoryName.toLowerCase()}.</li>
          <li>To respond to user inquiries/offer support to users.</li>
          <li>To improve our directory and recommendations.</li>
        </ul>

        <h2>3. WILL YOUR INFORMATION BE SHARED WITH ANYONE?</h2>
        <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. Newsletter email addresses are securely transmitted to Mailchimp, our email service provider, for the purpose of sending newsletters and managing subscriptions. We also use PostHog for analytics to improve our service.</p>

        <h2>4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</h2>
        <p>We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information and improve your experience. We use PostHog to understand how users interact with our directory and improve our service.</p>
        
        <h2>5. HOW LONG DO WE KEEP YOUR INFORMATION?</h2>
        <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements).</p>

        <h2>6. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2>
        <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.</p>

        <h2>7. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
        <p>In some regions (like the EEA and UK), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability.</p>

        <h2>8. UPDATES TO THIS NOTICE</h2>
        <p>We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible.</p>

        <h2>9. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2>
        <p>If you have questions or comments about this notice, you may email us at hi@findbesthq.com.</p>
      </div>
    </div>
  );
}
