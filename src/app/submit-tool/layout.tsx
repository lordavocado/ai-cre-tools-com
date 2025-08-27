import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Submit New Tool - AI CRE Tools",
  description: "Submit a new AI tool for commercial real estate professionals to be reviewed and added to our directory.",
  keywords: "submit ai tool, cre tool submission, ai cre tools directory",
};

export default function SubmitToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
