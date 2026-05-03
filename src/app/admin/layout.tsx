import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Admin | AI CRE Tools',
    template: '%s | AI CRE Tools Admin',
  },
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-white text-foreground antialiased">{children}</div>;
}
