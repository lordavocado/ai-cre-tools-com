'use client';

import { PostHogProvider } from './PostHogProvider';
import type { ReactNode } from 'react';

export function LazyPostHogProvider({ children }: { children: ReactNode }) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>;
  }

  return <PostHogProvider>{children}</PostHogProvider>;
}
