import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: "Submit New Tool - AI CRE Tools",
  description: "Submit a new AI tool for commercial real estate professionals to be reviewed and added to our directory.",
  keywords: "submit ai tool, cre tool submission, ai cre tools directory",
  alternates: {
    canonical: `${siteConfig.url}/submit-tool`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SubmitToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
