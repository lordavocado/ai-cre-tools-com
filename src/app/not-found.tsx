import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFoundSimple() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Page Not Found - 404 Error | AI CRE Tools',
  robots: {
    index: false,
    follow: true,
  },
};