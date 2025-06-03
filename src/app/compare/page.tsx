'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamically import the heavy comparison component
const AnalyticsComparison = dynamic(
  () => import('@/components/compare/analytics-comparison'),
  {
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Product Analytics Tools Comparison
            </h1>
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
              <p className="text-xl text-slate-600">Loading comparison tool...</p>
            </div>
          </div>
        </div>
      </div>
    ),
  }
);

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Product Analytics Tools Comparison
            </h1>
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
              <p className="text-xl text-slate-600">Preparing comparison...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <AnalyticsComparison />
    </Suspense>
  );
}
