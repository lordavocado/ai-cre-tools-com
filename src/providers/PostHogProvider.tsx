'use client';

import { Suspense, useEffect, useState, type ComponentType, type ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import type { PostHog } from 'posthog-js';

type PostHogReactProvider = ComponentType<{
  client: PostHog;
  children: ReactNode;
}>;

function PostHogPageView({ posthog }: { posthog: PostHog }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    let url = window.origin + pathname;
    const search = searchParams.toString();
    if (search) {
      url += `?${search}`;
    }

    posthog.capture('$pageview', { $current_url: url });
  }, [pathname, searchParams, posthog]);

  return null;
}

function SuspendedPostHogPageView({ posthog }: { posthog: PostHog }) {
  return (
    <Suspense fallback={null}>
      <PostHogPageView posthog={posthog} />
    </Suspense>
  );
}

export function PostHogProvider({ children }: { children: ReactNode }) {
  const [analytics, setAnalytics] = useState<{
    client: PostHog;
    Provider: PostHogReactProvider;
  } | null>(null);

  useEffect(() => {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!posthogKey) {
      return;
    }

    let cancelled = false;

    Promise.all([import('posthog-js'), import('posthog-js/react')])
      .then(([{ default: posthog }, { PostHogProvider: PHProvider }]) => {
        if (cancelled) return;

        posthog.init(posthogKey, {
          api_host: '/ingest',
          ui_host: 'https://eu.posthog.com',
          capture_pageview: false,
          capture_pageleave: true,
          capture_exceptions: true,
          debug: process.env.NODE_ENV === 'development',
        });

        setAnalytics({ client: posthog, Provider: PHProvider });
      })
      .catch((error) => {
        console.error('[PostHog] Failed to initialize:', error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!analytics) {
    return <>{children}</>;
  }

  const { client, Provider } = analytics;

  return (
    <Provider client={client}>
      <SuspendedPostHogPageView posthog={client} />
      {children}
    </Provider>
  );
}
